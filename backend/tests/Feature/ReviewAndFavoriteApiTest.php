<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Farmer;
use App\Models\Favorite;
use App\Models\Market;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ReviewAndFavoriteApiTest extends TestCase
{
    use DatabaseTransactions;

    private function createCustomer(): User
    {
        return User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);
    }

    private function createFarmer(): array
    {
        $user = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $farmer = Farmer::factory()->create([
            'user_id' => $user->id,
            'avg_rating' => 0.00,
            'review_count' => 0,
        ]);

        return [$user, $farmer];
    }

    private function createCompletedOrderWithItem(User $customer, Farmer $farmer, Product $product): Order
    {
        $market = Market::factory()->create();

        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'status' => Order::STATUS_COMPLETED,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'unit' => $product->unit,
            'unit_price' => $product->price,
            'quantity' => 2.00,
            'subtotal' => round((float) $product->price * 2, 2),
        ]);

        return $order;
    }

    public function test_customer_can_review_farmer_stall_from_completed_order(): void
    {
        $customer = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'farmer_id' => $farmer->id,
                'rating' => 5,
                'comment' => 'Fantastic organic quality and super friendly farmer!',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.rating', 5)
            ->assertJsonPath('data.farmer_id', $farmer->id)
            ->assertJsonPath('data.product_id', null);

        // Average rating recalculated on farmer
        $farmer->refresh();
        $this->assertEquals(1, $farmer->review_count);
        $this->assertEquals(5.00, (float) $farmer->avg_rating);
    }

    public function test_customer_can_review_product_from_completed_order(): void
    {
        $customer = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'avg_rating' => 0.00,
            'review_count' => 0,
        ]);
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'product_id' => $product->id,
                'rating' => 4,
                'comment' => 'Crisp, sweet, and perfectly fresh.',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.rating', 4)
            ->assertJsonPath('data.product_id', $product->id)
            ->assertJsonPath('data.farmer_id', null);

        // Average rating recalculated on product
        $product->refresh();
        $this->assertEquals(1, $product->review_count);
        $this->assertEquals(4.00, (float) $product->avg_rating);
    }

    public function test_cannot_review_both_farmer_and_product_xor_violation(): void
    {
        $customer = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        // Sending both farmer_id and product_id
        $response = $this->actingAs($customer)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'farmer_id' => $farmer->id,
                'product_id' => $product->id,
                'rating' => 5,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['target']);

        // Sending neither farmer_id nor product_id
        $responseNeither = $this->actingAs($customer)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'rating' => 5,
            ]);

        $responseNeither->assertStatus(422)
            ->assertJsonValidationErrors(['target']);
    }

    public function test_cannot_review_order_not_completed(): void
    {
        $customer = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);

        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'farmer_id' => $farmer->id,
            'status' => Order::STATUS_PLACED,
        ]);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'farmer_id' => $farmer->id,
                'rating' => 5,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['order_id']);
    }

    public function test_cannot_review_order_belonging_to_another_user(): void
    {
        $customer1 = $this->createCustomer();
        $customer2 = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);
        $order = $this->createCompletedOrderWithItem($customer1, $farmer, $product);

        // Customer 2 attempts to review customer 1's order
        $response = $this->actingAs($customer2)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'farmer_id' => $farmer->id,
                'rating' => 5,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['order_id']);
    }

    public function test_cannot_review_product_not_in_order(): void
    {
        $customer = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $productPurchased = Product::factory()->create(['farmer_id' => $farmer->id]);
        $productNotPurchased = Product::factory()->create(['farmer_id' => $farmer->id]);
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $productPurchased);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'product_id' => $productNotPurchased->id,
                'rating' => 4,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['product_id']);
    }

    public function test_cannot_submit_duplicate_review_for_same_order_target(): void
    {
        $customer = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        // First review succeeds
        $this->actingAs($customer)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'farmer_id' => $farmer->id,
                'rating' => 5,
            ])
            ->assertStatus(201);

        // Second review for the same farmer in the same order fails
        $duplicateResponse = $this->actingAs($customer)
            ->postJson('/api/v1/reviews', [
                'order_id' => $order->id,
                'farmer_id' => $farmer->id,
                'rating' => 4,
            ]);

        $duplicateResponse->assertStatus(422)
            ->assertJsonValidationErrors(['order_id']);
    }

    public function test_public_can_view_product_reviews(): void
    {
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);
        $customer = $this->createCustomer();
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        Review::factory()->create([
            'customer_id' => $customer->id,
            'order_id' => $order->id,
            'product_id' => $product->id,
            'rating' => 5,
            'is_hidden' => false,
        ]);

        // Hidden review
        Review::factory()->create([
            'customer_id' => $customer->id,
            'order_id' => $order->id,
            'product_id' => $product->id,
            'rating' => 1,
            'is_hidden' => true,
        ]);

        $response = $this->getJson("/api/v1/reviews/product/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.rating', 5);
    }

    public function test_public_can_view_farmer_reviews(): void
    {
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);
        $customer = $this->createCustomer();
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        Review::factory()->create([
            'customer_id' => $customer->id,
            'order_id' => $order->id,
            'farmer_id' => $farmer->id,
            'rating' => 5,
            'is_hidden' => false,
        ]);

        $response = $this->getJson("/api/v1/reviews/farmer/{$farmer->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.rating', 5);
    }

    public function test_farmer_can_reply_to_product_review(): void
    {
        [$farmerUser, $farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);
        $customer = $this->createCustomer();
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        $review = Review::factory()->create([
            'customer_id' => $customer->id,
            'order_id' => $order->id,
            'product_id' => $product->id,
            'rating' => 5,
        ]);

        $response = $this->actingAs($farmerUser)
            ->postJson("/api/v1/farmer/reviews/{$review->id}/reply", [
                'farmer_reply' => 'Thank you for supporting our family farm! Hope to see you next Saturday.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.farmer_reply', 'Thank you for supporting our family farm! Hope to see you next Saturday.');

        $review->refresh();
        $this->assertEquals('Thank you for supporting our family farm! Hope to see you next Saturday.', $review->farmer_reply);
        $this->assertNotNull($review->farmer_replied_at);

        // Notification created for customer
        $this->assertDatabaseHas('notifications', [
            'user_id' => $customer->id,
            'type' => 'review_reply',
        ]);
    }

    public function test_farmer_cannot_reply_to_other_farmer_product_review(): void
    {
        [$farmerUser1, $farmer1] = $this->createFarmer();
        [$farmerUser2, $farmer2] = $this->createFarmer();

        $product1 = Product::factory()->create(['farmer_id' => $farmer1->id]);
        $customer = $this->createCustomer();
        $order = $this->createCompletedOrderWithItem($customer, $farmer1, $product1);

        $review = Review::factory()->create([
            'customer_id' => $customer->id,
            'order_id' => $order->id,
            'product_id' => $product1->id,
        ]);

        // Farmer 2 attempts to reply to Farmer 1's product review
        $response = $this->actingAs($farmerUser2)
            ->postJson("/api/v1/farmer/reviews/{$review->id}/reply", [
                'farmer_reply' => 'Unauthorized reply attempt.',
            ]);

        $response->assertStatus(403);
    }

    public function test_farmer_cannot_reply_to_stall_review(): void
    {
        [$farmerUser, $farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);
        $customer = $this->createCustomer();
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        $stallReview = Review::factory()->create([
            'customer_id' => $customer->id,
            'order_id' => $order->id,
            'farmer_id' => $farmer->id,
            'product_id' => null,
        ]);

        $response = $this->actingAs($farmerUser)
            ->postJson("/api/v1/farmer/reviews/{$stallReview->id}/reply", [
                'farmer_reply' => 'Reply to stall review.',
            ]);

        $response->assertStatus(422);
    }

    public function test_admin_can_toggle_hide_review_and_recalculates_rating(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'status' => User::STATUS_ACTIVE]);
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create(['farmer_id' => $farmer->id, 'avg_rating' => 0.00, 'review_count' => 0]);
        $customer = $this->createCustomer();
        $order = $this->createCompletedOrderWithItem($customer, $farmer, $product);

        // Submit a 1-star spam review
        $review = Review::factory()->create([
            'customer_id' => $customer->id,
            'order_id' => $order->id,
            'product_id' => $product->id,
            'rating' => 1,
            'is_hidden' => false,
        ]);

        $product->update(['avg_rating' => 1.00, 'review_count' => 1]);

        // Admin toggles hide
        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/reviews/{$review->id}/toggle-hide");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_hidden', true);

        // Recalculates product rating without the hidden review (0 reviews, 0 avg)
        $product->refresh();
        $this->assertEquals(0, $product->review_count);
        $this->assertEquals(0.00, (float) $product->avg_rating);
    }

    public function test_customer_can_toggle_favorite_on_product(): void
    {
        $customer = $this->createCustomer();
        $product = Product::factory()->create();

        // 1. Add to favorites
        $addResponse = $this->actingAs($customer)
            ->postJson('/api/v1/favorites/toggle', [
                'favoritable_type' => 'product',
                'favoritable_id' => $product->id,
            ]);

        $addResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_favorited', true);

        $this->assertDatabaseHas('favorites', [
            'user_id' => $customer->id,
            'favoritable_type' => 'product',
            'favoritable_id' => $product->id,
        ]);

        // 2. Remove from favorites
        $removeResponse = $this->actingAs($customer)
            ->postJson('/api/v1/favorites/toggle', [
                'favoritable_type' => 'product',
                'favoritable_id' => $product->id,
            ]);

        $removeResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_favorited', false);

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $customer->id,
            'favoritable_type' => 'product',
            'favoritable_id' => $product->id,
        ]);
    }

    public function test_customer_can_toggle_favorite_on_farmer_and_market(): void
    {
        $customer = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $market = Market::factory()->create();

        // Favorite Farmer
        $this->actingAs($customer)
            ->postJson('/api/v1/favorites/toggle', [
                'favoritable_type' => 'farmer',
                'favoritable_id' => $farmer->id,
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.is_favorited', true);

        // Favorite Market
        $this->actingAs($customer)
            ->postJson('/api/v1/favorites/toggle', [
                'favoritable_type' => 'market',
                'favoritable_id' => $market->id,
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.is_favorited', true);

        $this->assertDatabaseCount('favorites', 2);
    }

    public function test_customer_can_view_favorites_list_and_filter_by_type(): void
    {
        $customer = $this->createCustomer();
        [,$farmer] = $this->createFarmer();
        $product = Product::factory()->create();

        Favorite::create(['user_id' => $customer->id, 'favoritable_type' => 'farmer', 'favoritable_id' => $farmer->id]);
        Favorite::create(['user_id' => $customer->id, 'favoritable_type' => 'product', 'favoritable_id' => $product->id]);

        // List all
        $allResponse = $this->actingAs($customer)->getJson('/api/v1/favorites');
        $allResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data');

        // Filter by type=product
        $productResponse = $this->actingAs($customer)->getJson('/api/v1/favorites?type=product');
        $productResponse->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.favoritable_type', 'product');
    }

    public function test_toggle_favorite_fails_for_non_existent_item(): void
    {
        $customer = $this->createCustomer();

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/favorites/toggle', [
                'favoritable_type' => 'farmer',
                'favoritable_id' => 999999,
            ]);

        $response->assertStatus(404)
            ->assertJsonPath('success', false);
    }
}
