<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Market;
use App\Models\MarketSchedule;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class CustomerOrderLifecycleIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_complete_pre_order_and_review_lifecycle_e2e(): void
    {
        // 1. Setup Market & Schedule (Sunday market)
        $market = Market::factory()->create([
            'status' => Market::STATUS_ACTIVE,
        ]);
        MarketSchedule::create([
            'market_id' => $market->id,
            'day_of_week' => 0, // Sunday
            'open_time' => '07:00:00',
            'close_time' => '13:00:00',
        ]);

        // 2. Setup Farmer Stall and link to Market
        $farmerUser = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);
        $farmer = Farmer::factory()->create([
            'user_id' => $farmerUser->id,
            'stall_name' => 'Green Valley Heritage Farms',
        ]);

        FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'stall_location' => 'Stall C-12',
            'pickup_days' => [0], // Sunday
            'pickup_start_time' => '08:00:00',
            'pickup_end_time' => '12:00:00',
            'slot_minutes' => 30,
            'cutoff_hours' => 12,
            'is_active' => true,
        ]);

        // 3. Farmer creates a Product with initial stock of 20
        $category = Category::factory()->create(['name' => 'Fresh Berries']);
        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'category_id' => $category->id,
            'name' => 'Wild Forest Strawberries',
            'price' => 6.50,
            'stock_quantity' => 20,
            'unit' => 'box',
            'availability' => Product::AVAILABILITY_AVAILABLE,
            'is_hidden' => false,
        ]);

        // 4. Customer registers & logs in
        $customer = User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        // 5. Customer adds 4 boxes of strawberries to Cart
        $cartAddResponse = $this->actingAs($customer)->postJson('/api/v1/cart/items', [
            'product_id' => $product->id,
            'quantity' => 4,
        ]);
        $cartAddResponse->assertStatus(201);

        // Calculate next Sunday pickup date (at least 2 days in future to be before cutoff)
        $pickupDate = Carbon::now()->next(Carbon::SUNDAY);
        if (Carbon::now()->diffInHours($pickupDate->copy()->setTime(8, 0)) < 24) {
            $pickupDate = $pickupDate->addWeek();
        }
        $pickupDateStr = $pickupDate->toDateString();

        // 6. Customer fetches available pickup slots
        $slotsResponse = $this->actingAs($customer)->getJson(
            "/api/v1/orders/slots?farmer_id={$farmer->id}&market_id={$market->id}&pickup_date={$pickupDateStr}"
        );
        $slotsResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        // 7. Customer checks out pre-order
        $checkoutResponse = $this->actingAs($customer)->postJson('/api/v1/orders/checkout', [
            'market_id' => $market->id,
            'pickup_date' => $pickupDateStr,
            'pickup_start_time' => '08:30',
            'pickup_end_time' => '09:00',
            'note' => 'Please pack the ripest ones!',
        ]);

        $checkoutResponse->assertStatus(201)
            ->assertJsonPath('success', true);

        $createdOrderId = $checkoutResponse->json('data.0.id');
        $this->assertNotNull($createdOrderId);

        // Verify stock deducted in DB (20 - 4 = 16)
        $product->refresh();
        $this->assertEquals(16, $product->stock_quantity);

        // 8. Farmer views incoming orders and accepts
        $acceptResponse = $this->actingAs($farmerUser)->patchJson("/api/v1/farmer/orders/{$createdOrderId}/accept");
        $acceptResponse->assertStatus(200)
            ->assertJsonPath('data.status', Order::STATUS_ACCEPTED);

        // 9. Farmer marks order ready for pickup
        $readyResponse = $this->actingAs($farmerUser)->patchJson("/api/v1/farmer/orders/{$createdOrderId}/ready");
        $readyResponse->assertStatus(200)
            ->assertJsonPath('data.status', Order::STATUS_READY);

        // 10. Customer picks up order, Farmer marks complete
        $completeResponse = $this->actingAs($farmerUser)->patchJson("/api/v1/farmer/orders/{$createdOrderId}/complete");
        $completeResponse->assertStatus(200)
            ->assertJsonPath('data.status', Order::STATUS_COMPLETED);

        // 11. Customer leaves a 5-star review on the strawberries
        $reviewResponse = $this->actingAs($customer)->postJson('/api/v1/reviews', [
            'order_id' => $createdOrderId,
            'target_type' => 'product',
            'product_id' => $product->id,
            'rating' => 5,
            'comment' => 'Incredible fragrance and sweetness! Worth every penny.',
        ]);

        $reviewResponse->assertStatus(201)
            ->assertJsonPath('success', true);

        $reviewId = $reviewResponse->json('data.id');

        // Verify product rating recalculated
        $product->refresh();
        $this->assertEquals(5.00, $product->avg_rating);
        $this->assertEquals(1, $product->review_count);

        // 12. Farmer replies to customer review
        $replyResponse = $this->actingAs($farmerUser)->postJson("/api/v1/farmer/reviews/{$reviewId}/reply", [
            'farmer_reply' => 'Thank you for supporting our organic farm!',
        ]);
        $replyResponse->assertStatus(200)
            ->assertJsonPath('data.farmer_reply', 'Thank you for supporting our organic farm!');

        // 13. Admin checks overview stats - gross revenue includes $26.00
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'status' => User::STATUS_ACTIVE]);
        $statsResponse = $this->actingAs($admin)->getJson('/api/v1/admin/stats/overview');
        $statsResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $grossRevenue = (float) $statsResponse->json('data.revenue.gross_completed');
        $this->assertGreaterThanOrEqual(26.00, $grossRevenue);
    }
}
