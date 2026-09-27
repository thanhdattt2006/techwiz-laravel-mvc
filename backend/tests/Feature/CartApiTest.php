<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CartApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_customer_can_view_empty_cart(): void
    {
        $customer = User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($customer)
            ->getJson('/api/v1/cart');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'user_id',
                    'total_items_count',
                    'total_quantity',
                    'subtotal',
                    'stalls',
                    'items',
                ],
                'errors',
            ])
            ->assertJsonPath('data.total_items_count', 0);

        $this->assertEquals(0.0, (float) $response->json('data.total_quantity'));
        $this->assertEquals(0.0, (float) $response->json('data.subtotal'));
    }

    public function test_customer_can_add_item_to_cart(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $product = Product::factory()->create([
            'price' => 5.50,
            'stock_quantity' => 20.00,
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/cart/items', [
                'product_id' => $product->id,
                'quantity' => 3,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_items_count', 1);

        $this->assertEquals(3.0, (float) $response->json('data.total_quantity'));
        $this->assertEquals(16.5, (float) $response->json('data.subtotal'));

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 3.00,
        ]);
    }

    public function test_adding_existing_item_increments_quantity(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $product = Product::factory()->create([
            'price' => 4.00,
            'stock_quantity' => 25.00,
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2.00,
        ]);

        // Add 3 more of the same product
        $response = $this->actingAs($customer)
            ->postJson('/api/v1/cart/items', [
                'product_id' => $product->id,
                'quantity' => 3,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.total_items_count', 1);

        $this->assertEquals(5.0, (float) $response->json('data.total_quantity'));
        $this->assertEquals(20.0, (float) $response->json('data.subtotal'));

        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 5.00,
        ]);
    }

    public function test_cannot_add_item_exceeding_stock_quantity(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $product = Product::factory()->create([
            'stock_quantity' => 5.00,
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/cart/items', [
                'product_id' => $product->id,
                'quantity' => 6,
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_cannot_add_cumulative_quantity_exceeding_stock(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $product = Product::factory()->create([
            'stock_quantity' => 5.00,
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 4.00,
        ]);

        // Trying to add 2 more -> total 6 > 5
        $response = $this->actingAs($customer)
            ->postJson('/api/v1/cart/items', [
                'product_id' => $product->id,
                'quantity' => 2,
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_cannot_add_hidden_or_unavailable_product(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);

        $hiddenProduct = Product::factory()->create([
            'is_hidden' => true,
            'stock_quantity' => 10.00,
        ]);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/cart/items', [
                'product_id' => $hiddenProduct->id,
                'quantity' => 1,
            ]);

        $response->assertStatus(422);

        $unavailableProduct = Product::factory()->create([
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_UNAVAILABLE,
            'stock_quantity' => 10.00,
        ]);

        $responseUnavailable = $this->actingAs($customer)
            ->postJson('/api/v1/cart/items', [
                'product_id' => $unavailableProduct->id,
                'quantity' => 1,
            ]);

        $responseUnavailable->assertStatus(422);
    }

    public function test_customer_can_update_cart_item_quantity(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $product = Product::factory()->create([
            'price' => 10.00,
            'stock_quantity' => 15.00,
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2.00,
        ]);

        $response = $this->actingAs($customer)
            ->putJson("/api/v1/cart/items/{$cartItem->id}", [
                'quantity' => 5,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertEquals(5.0, (float) $response->json('data.total_quantity'));
        $this->assertEquals(50.0, (float) $response->json('data.subtotal'));

        $cartItem->refresh();
        $this->assertEquals(5.00, (float) $cartItem->quantity);
    }

    public function test_cannot_update_cart_item_exceeding_stock(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $product = Product::factory()->create([
            'stock_quantity' => 8.00,
            'is_hidden' => false,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2.00,
        ]);

        $response = $this->actingAs($customer)
            ->putJson("/api/v1/cart/items/{$cartItem->id}", [
                'quantity' => 10,
            ]);

        $response->assertStatus(422);
    }

    public function test_customer_can_remove_item_from_cart(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);
        $product = Product::factory()->create();

        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2.00,
        ]);

        $response = $this->actingAs($customer)
            ->deleteJson("/api/v1/cart/items/{$cartItem->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_items_count', 0);

        $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);
    }

    public function test_customer_can_clear_entire_cart(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $p1 = Product::factory()->create();
        $p2 = Product::factory()->create();

        CartItem::create(['cart_id' => $cart->id, 'product_id' => $p1->id, 'quantity' => 1]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $p2->id, 'quantity' => 2]);

        $response = $this->actingAs($customer)
            ->deleteJson('/api/v1/cart/clear');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_items_count', 0);

        $this->assertEquals(0.0, (float) $response->json('data.subtotal'));

        $this->assertEquals(0, CartItem::where('cart_id', $cart->id)->count());
    }

    public function test_cart_groups_items_by_farmer_stall(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $farmer1 = Farmer::factory()->create(['stall_name' => 'Orchard Stalls']);
        $farmer2 = Farmer::factory()->create(['stall_name' => 'Berry Patch']);

        $p1 = Product::factory()->create(['farmer_id' => $farmer1->id, 'price' => 10.00]);
        $p2 = Product::factory()->create(['farmer_id' => $farmer1->id, 'price' => 5.00]);
        $p3 = Product::factory()->create(['farmer_id' => $farmer2->id, 'price' => 12.00]);

        CartItem::create(['cart_id' => $cart->id, 'product_id' => $p1->id, 'quantity' => 1]); // 10
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $p2->id, 'quantity' => 2]); // 10
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $p3->id, 'quantity' => 1]); // 12

        $response = $this->actingAs($customer)
            ->getJson('/api/v1/cart');

        $response->assertStatus(200);

        $stalls = $response->json('data.stalls');
        $this->assertCount(2, $stalls);

        $stall1 = collect($stalls)->firstWhere('farmer_id', $farmer1->id);
        $this->assertNotNull($stall1);
        $this->assertEquals('Orchard Stalls', $stall1['stall_name']);
        $this->assertEquals(20.00, $stall1['stall_subtotal']);
        $this->assertCount(2, $stall1['items']);

        $stall2 = collect($stalls)->firstWhere('farmer_id', $farmer2->id);
        $this->assertNotNull($stall2);
        $this->assertEquals('Berry Patch', $stall2['stall_name']);
        $this->assertEquals(12.00, $stall2['stall_subtotal']);
        $this->assertCount(1, $stall2['items']);
    }

    public function test_unauthenticated_user_cannot_access_cart(): void
    {
        $response = $this->getJson('/api/v1/cart');
        $response->assertStatus(401);
    }
}
