<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Market;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use DatabaseTransactions;

    private function createCustomer(): User
    {
        return User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);
    }

    private function createFarmerWithMarket(array $pickupDays = [0, 1, 2, 3, 4, 5, 6], int $cutoffHours = 12): array
    {
        $farmerUser = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $farmer = Farmer::factory()->create([
            'user_id' => $farmerUser->id,
            'stall_name' => 'Green Valley Farm',
        ]);

        $market = Market::factory()->create(['name' => 'Downtown Green Market']);

        $farmerMarket = FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'stall_location' => 'Booth #12',
            'pickup_days' => $pickupDays,
            'pickup_start_time' => '08:00:00',
            'pickup_end_time' => '13:00:00',
            'slot_minutes' => 30,
            'cutoff_hours' => $cutoffHours,
            'is_active' => true,
        ]);

        return [$farmerUser, $farmer, $market, $farmerMarket];
    }

    public function test_customer_cannot_checkout_empty_cart(): void
    {
        $customer = $this->createCustomer();
        [,, $market] = $this->createFarmerWithMarket();

        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/orders/checkout', [
                'market_id' => $market->id,
                'pickup_date' => $pickupDate,
                'pickup_start_time' => '08:00',
                'pickup_end_time' => '08:30',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Your shopping cart is empty.');
    }

    public function test_customer_can_checkout_single_stall_order(): void
    {
        $customer = $this->createCustomer();
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        [$farmerUser, $farmer, $market] = $this->createFarmerWithMarket();

        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'name' => 'Organic Honeycrisp Apples',
            'price' => 4.50,
            'stock_quantity' => 20.00,
            'availability' => Product::AVAILABILITY_AVAILABLE,
            'is_hidden' => false,
        ]);

        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 4.00,
        ]);

        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/orders/checkout', [
                'market_id' => $market->id,
                'pickup_date' => $pickupDate,
                'pickup_start_time' => '09:00',
                'pickup_end_time' => '09:30',
                'note' => 'Please choose ripe apples.',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Pre-order placed successfully.');

        $ordersData = $response->json('data');
        $this->assertCount(1, $ordersData);
        $order = $ordersData[0];

        $this->assertEquals(18.0, (float) $order['total_amount']);
        $this->assertEquals('placed', $order['status']);
        $this->assertEquals('Booth #12', $order['stall_location']);
        $this->assertEquals(1, $order['items_count']);
        $this->assertEquals(4.0, (float) $order['total_quantity']);
        $this->assertTrue($order['can_be_cancelled']);

        // Stock decreased from 20 to 16
        $product->refresh();
        $this->assertEquals(16.00, (float) $product->stock_quantity);

        // Cart should be empty
        $this->assertDatabaseMissing('cart_items', [
            'cart_id' => $cart->id,
            'product_id' => $product->id,
        ]);

        // In-app notification created for Farmer
        $this->assertDatabaseHas('notifications', [
            'user_id' => $farmerUser->id,
            'type' => 'order_placed',
        ]);
    }

    public function test_customer_can_checkout_multi_stall_order_auto_split(): void
    {
        $customer = $this->createCustomer();
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $market = Market::factory()->create(['name' => 'City Central Market']);

        // Stall 1
        $farmer1 = Farmer::factory()->create(['stall_name' => 'Stall One']);
        FarmerMarket::create([
            'farmer_id' => $farmer1->id,
            'market_id' => $market->id,
            'stall_location' => 'Stall #1',
            'pickup_days' => [0, 1, 2, 3, 4, 5, 6],
            'pickup_start_time' => '08:00:00',
            'pickup_end_time' => '13:00:00',
            'cutoff_hours' => 12,
            'is_active' => true,
        ]);
        $product1 = Product::factory()->create([
            'farmer_id' => $farmer1->id,
            'price' => 10.00,
            'stock_quantity' => 15.00,
            'is_hidden' => false,
        ]);

        // Stall 2
        $farmer2 = Farmer::factory()->create(['stall_name' => 'Stall Two']);
        FarmerMarket::create([
            'farmer_id' => $farmer2->id,
            'market_id' => $market->id,
            'stall_location' => 'Stall #2',
            'pickup_days' => [0, 1, 2, 3, 4, 5, 6],
            'pickup_start_time' => '08:00:00',
            'pickup_end_time' => '13:00:00',
            'cutoff_hours' => 12,
            'is_active' => true,
        ]);
        $product2 = Product::factory()->create([
            'farmer_id' => $farmer2->id,
            'price' => 5.00,
            'stock_quantity' => 10.00,
            'is_hidden' => false,
        ]);

        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product1->id, 'quantity' => 2.00]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product2->id, 'quantity' => 3.00]);

        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/orders/checkout', [
                'market_id' => $market->id,
                'pickup_date' => $pickupDate,
                'pickup_start_time' => '10:00',
                'pickup_end_time' => '10:30',
            ]);

        $response->assertStatus(201);
        $orders = $response->json('data');

        // Automatically split into 2 distinct orders
        $this->assertCount(2, $orders);

        $farmerIds = collect($orders)->pluck('farmer_id')->all();
        $this->assertContains($farmer1->id, $farmerIds);
        $this->assertContains($farmer2->id, $farmerIds);

        // Verify distinct order codes
        $this->assertNotEquals($orders[0]['order_code'], $orders[1]['order_code']);

        // Both products stock decreased
        $product1->refresh();
        $product2->refresh();
        $this->assertEquals(13.00, (float) $product1->stock_quantity);
        $this->assertEquals(7.00, (float) $product2->stock_quantity);
    }

    public function test_checkout_fails_if_stall_not_at_selected_market(): void
    {
        $customer = $this->createCustomer();
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        [,, $market] = $this->createFarmerWithMarket();
        $otherMarket = Market::factory()->create();

        $farmer = Farmer::factory()->create();
        $product = Product::factory()->create(['farmer_id' => $farmer->id, 'stock_quantity' => 10]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/orders/checkout', [
                'market_id' => $market->id, // Farmer is not registered at this market
                'pickup_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'pickup_start_time' => '09:00',
                'pickup_end_time' => '09:30',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_checkout_fails_if_stall_not_open_on_selected_day(): void
    {
        $customer = $this->createCustomer();
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $targetDate = Carbon::now()->addDays(2);
        $targetDayOfWeek = $targetDate->dayOfWeek;
        $otherDay = ($targetDayOfWeek + 1) % 7;

        // Farmer only sells on $otherDay
        [,, $market] = $this->createFarmerWithMarket(pickupDays: [$otherDay]);
        $farmer = Farmer::first();

        $product = Product::factory()->create(['farmer_id' => $farmer->id, 'stock_quantity' => 10]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/orders/checkout', [
                'market_id' => $market->id,
                'pickup_date' => $targetDate->format('Y-m-d'),
                'pickup_start_time' => '09:00',
                'pickup_end_time' => '09:30',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_checkout_fails_if_cutoff_time_passed(): void
    {
        $customer = $this->createCustomer();
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        // Stall requires 72 hours cutoff notice
        [,, $market] = $this->createFarmerWithMarket(cutoffHours: 72);
        $farmer = Farmer::first();

        $product = Product::factory()->create(['farmer_id' => $farmer->id, 'stock_quantity' => 10]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

        // Pickup is tomorrow (approx 24h away < 72h cutoff)
        $pickupDate = Carbon::now()->addDay()->format('Y-m-d');

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/orders/checkout', [
                'market_id' => $market->id,
                'pickup_date' => $pickupDate,
                'pickup_start_time' => '09:00',
                'pickup_end_time' => '09:30',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_checkout_fails_if_stock_is_insufficient(): void
    {
        $customer = $this->createCustomer();
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        [,, $market] = $this->createFarmerWithMarket();
        $farmer = Farmer::first();

        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'stock_quantity' => 2.00,
        ]);

        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 5.00]);

        $response = $this->actingAs($customer)
            ->postJson('/api/v1/orders/checkout', [
                'market_id' => $market->id,
                'pickup_date' => Carbon::now()->addDays(2)->format('Y-m-d'),
                'pickup_start_time' => '09:00',
                'pickup_end_time' => '09:30',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_customer_can_view_my_orders_and_order_details(): void
    {
        $customer = $this->createCustomer();
        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'status' => Order::STATUS_PLACED,
        ]);
        OrderItem::factory()->create(['order_id' => $order->id, 'quantity' => 2, 'unit_price' => 5, 'subtotal' => 10]);

        $listResponse = $this->actingAs($customer)
            ->getJson('/api/v1/orders/my-orders');

        $listResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data');

        $detailResponse = $this->actingAs($customer)
            ->getJson("/api/v1/orders/my-orders/{$order->id}");

        $detailResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $order->id)
            ->assertJsonPath('data.order_code', $order->order_code);
    }

    public function test_public_can_track_order_via_order_code(): void
    {
        $order = Order::factory()->create(['status' => Order::STATUS_READY]);
        OrderItem::factory()->create(['order_id' => $order->id]);

        $response = $this->getJson("/api/v1/orders/track/{$order->order_code}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.order_code', $order->order_code)
            ->assertJsonPath('data.status', 'ready_for_pickup');
    }

    public function test_customer_can_cancel_order_before_cutoff_and_restock(): void
    {
        $customer = $this->createCustomer();
        $farmer = Farmer::factory()->create();
        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'stock_quantity' => 10.00,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        // Order placed with 12h cutoff in the future
        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'farmer_id' => $farmer->id,
            'status' => Order::STATUS_PLACED,
            'cutoff_at' => Carbon::now()->addHours(24),
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'unit' => 'kg',
            'unit_price' => 5.00,
            'quantity' => 3.00,
            'subtotal' => 15.00,
        ]);

        $response = $this->actingAs($customer)
            ->patchJson("/api/v1/orders/{$order->id}/cancel", [
                'cancel_reason' => 'Schedule changed, unable to visit market.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'cancelled');

        $order->refresh();
        $this->assertEquals('cancelled', $order->status);
        $this->assertEquals('Schedule changed, unable to visit market.', $order->cancel_reason);
        $this->assertNotNull($order->cancelled_at);

        // Inventory restocked (10 + 3 = 13)
        $product->refresh();
        $this->assertEquals(13.00, (float) $product->stock_quantity);

        // Notification sent to farmer
        $this->assertDatabaseHas('notifications', [
            'user_id' => $farmer->user_id,
            'type' => 'order_cancelled',
        ]);
    }

    public function test_customer_cannot_cancel_order_after_cutoff(): void
    {
        $customer = $this->createCustomer();

        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'status' => Order::STATUS_PLACED,
            'cutoff_at' => Carbon::now()->subHour(), // Cutoff passed 1 hour ago
        ]);

        $response = $this->actingAs($customer)
            ->patchJson("/api/v1/orders/{$order->id}/cancel");

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_farmer_can_view_incoming_pre_orders(): void
    {
        [$farmerUser, $farmer] = $this->createFarmerWithMarket();

        Order::factory()->count(3)->create(['farmer_id' => $farmer->id]);

        $response = $this->actingAs($farmerUser)
            ->getJson('/api/v1/farmer/orders');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data');
    }

    public function test_farmer_can_accept_placed_order(): void
    {
        [$farmerUser, $farmer] = $this->createFarmerWithMarket();
        $order = Order::factory()->create([
            'farmer_id' => $farmer->id,
            'status' => Order::STATUS_PLACED,
        ]);

        $response = $this->actingAs($farmerUser)
            ->patchJson("/api/v1/farmer/orders/{$order->id}/accept");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'accepted');

        $order->refresh();
        $this->assertEquals('accepted', $order->status);
        $this->assertNotNull($order->accepted_at);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $order->customer_id,
            'type' => 'order_accepted',
        ]);
    }

    public function test_farmer_can_decline_order_with_reason_and_restock(): void
    {
        [$farmerUser, $farmer] = $this->createFarmerWithMarket();
        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'stock_quantity' => 5.00,
        ]);

        $order = Order::factory()->create([
            'farmer_id' => $farmer->id,
            'status' => Order::STATUS_PLACED,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'unit' => 'kg',
            'unit_price' => 5.00,
            'quantity' => 4.00,
            'subtotal' => 20.00,
        ]);

        $response = $this->actingAs($farmerUser)
            ->patchJson("/api/v1/farmer/orders/{$order->id}/decline", [
                'cancel_reason' => 'Sudden frost damaged crop harvest.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'declined');

        $order->refresh();
        $this->assertEquals('declined', $order->status);
        $this->assertEquals('Sudden frost damaged crop harvest.', $order->cancel_reason);
        $this->assertNotNull($order->cancelled_at);

        // Product restocked from 5 to 9
        $product->refresh();
        $this->assertEquals(9.00, (float) $product->stock_quantity);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $order->customer_id,
            'type' => 'order_declined',
        ]);
    }

    public function test_farmer_can_mark_order_ready_for_pickup(): void
    {
        [$farmerUser, $farmer] = $this->createFarmerWithMarket();
        $order = Order::factory()->create([
            'farmer_id' => $farmer->id,
            'status' => Order::STATUS_ACCEPTED,
        ]);

        $response = $this->actingAs($farmerUser)
            ->patchJson("/api/v1/farmer/orders/{$order->id}/ready");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'ready_for_pickup');

        $order->refresh();
        $this->assertEquals('ready_for_pickup', $order->status);
        $this->assertNotNull($order->ready_at);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $order->customer_id,
            'type' => 'order_ready',
        ]);
    }

    public function test_farmer_can_complete_order_when_customer_picks_up(): void
    {
        [$farmerUser, $farmer] = $this->createFarmerWithMarket();
        $order = Order::factory()->create([
            'farmer_id' => $farmer->id,
            'status' => Order::STATUS_READY,
        ]);

        $response = $this->actingAs($farmerUser)
            ->patchJson("/api/v1/farmer/orders/{$order->id}/complete");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'completed');

        $order->refresh();
        $this->assertEquals('completed', $order->status);
        $this->assertNotNull($order->completed_at);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $order->customer_id,
            'type' => 'order_completed',
        ]);
    }

    public function test_pickup_slots_generator_endpoint(): void
    {
        [,, $market, $farmerMarket] = $this->createFarmerWithMarket(pickupDays: [0, 1, 2, 3, 4, 5, 6]);

        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');

        $response = $this->getJson("/api/v1/orders/slots?farmer_id={$farmerMarket->farmer_id}&market_id={$market->id}&pickup_date={$pickupDate}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'slots' => [
                        '*' => [
                            'start_time',
                            'end_time',
                            'label',
                            'cutoff_at',
                            'is_available',
                            'cutoff_passed',
                        ],
                    ],
                ],
            ]);
    }
}
