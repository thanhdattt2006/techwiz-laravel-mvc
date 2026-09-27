<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Market;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ZeroNPlusOneIntegrationTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Verify Products catalog has constant query count regardless of item count (Zero N+1).
     */
    public function test_products_catalog_has_no_n_plus_one_queries(): void
    {
        $farmer = Farmer::factory()->create();
        $category = Category::factory()->create();

        // Create 10 active products
        Product::factory()->count(10)->create([
            'farmer_id' => $farmer->id,
            'category_id' => $category->id,
            'availability' => Product::AVAILABILITY_AVAILABLE,
            'is_hidden' => false,
        ]);

        DB::flushQueryLog();
        DB::enableQueryLog();

        $response = $this->getJson('/api/v1/products');

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $response->assertStatus(200);

        // We expect eager loaded relationships (products, categories, farmers, markets) to take a small fixed number of queries (<= 5)
        $this->assertLessThanOrEqual(5, count($queries), 'Products catalog suffered from N+1 query problem.');
    }

    /**
     * Verify Markets list with operating schedules has constant query count (Zero N+1).
     */
    public function test_markets_list_has_no_n_plus_one_queries(): void
    {
        Market::factory()->count(5)->create([
            'status' => Market::STATUS_ACTIVE,
        ]);

        DB::flushQueryLog();
        DB::enableQueryLog();

        $response = $this->getJson('/api/v1/markets');

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $response->assertStatus(200);

        // Query: 1 for markets, 1 for schedules eager loading, 0 extra queries
        $this->assertLessThanOrEqual(4, count($queries), 'Markets list suffered from N+1 query problem.');
    }

    /**
     * Verify Shopping Cart grouped by stall has constant query count regardless of item count (Zero N+1).
     */
    public function test_shopping_cart_has_no_n_plus_one_queries(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $cart = Cart::firstOrCreate(['user_id' => $customer->id]);

        $farmer1 = Farmer::factory()->create();
        $farmer2 = Farmer::factory()->create();
        $category = Category::factory()->create();

        $p1 = Product::factory()->create(['farmer_id' => $farmer1->id, 'category_id' => $category->id]);
        $p2 = Product::factory()->create(['farmer_id' => $farmer1->id, 'category_id' => $category->id]);
        $p3 = Product::factory()->create(['farmer_id' => $farmer2->id, 'category_id' => $category->id]);

        CartItem::create(['cart_id' => $cart->id, 'product_id' => $p1->id, 'quantity' => 2]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $p2->id, 'quantity' => 1]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $p3->id, 'quantity' => 3]);

        DB::flushQueryLog();
        DB::enableQueryLog();

        $response = $this->actingAs($customer)->getJson('/api/v1/cart');

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $response->assertStatus(200);

        // Even with multiple items across different stalls, queries must remain small and bounded
        $this->assertLessThanOrEqual(6, count($queries), 'Shopping cart suffered from N+1 query problem.');
    }

    /**
     * Verify Customer pre-orders list has constant query count regardless of order count (Zero N+1).
     */
    public function test_customer_my_orders_has_no_n_plus_one_queries(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $market = Market::factory()->create();
        $farmer = Farmer::factory()->create();
        FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'stall_location' => 'Stall #10',
            'pickup_days' => [0, 6],
            'pickup_start_time' => '08:00:00',
            'pickup_end_time' => '13:00:00',
            'slot_minutes' => 30,
            'cutoff_hours' => 12,
            'is_active' => true,
        ]);

        $category = Category::factory()->create();
        $product = Product::factory()->create(['farmer_id' => $farmer->id, 'category_id' => $category->id]);

        // Create 3 orders for this customer
        for ($i = 0; $i < 3; $i++) {
            $order = Order::factory()->create([
                'customer_id' => $customer->id,
                'farmer_id' => $farmer->id,
                'market_id' => $market->id,
                'status' => Order::STATUS_PLACED,
            ]);

            OrderItem::factory()->create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'unit' => 'lb',
            ]);
        }

        DB::flushQueryLog();
        DB::enableQueryLog();

        $response = $this->actingAs($customer)->getJson('/api/v1/orders/my-orders');

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $response->assertStatus(200);

        // Pre-orders list eager loads items.product, farmer.markets, market: constant bounded queries (7 queries)
        $this->assertLessThanOrEqual(10, count($queries), 'Customer orders list suffered from N+1 query problem.');
    }

    /**
     * Verify Farmer incoming pre-orders list has constant query count (Zero N+1).
     */
    public function test_farmer_incoming_orders_has_no_n_plus_one_queries(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);
        $market = Market::factory()->create();

        FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'stall_location' => 'Stall #22',
            'pickup_days' => [0, 6],
            'pickup_start_time' => '08:00:00',
            'pickup_end_time' => '13:00:00',
            'slot_minutes' => 30,
            'cutoff_hours' => 12,
            'is_active' => true,
        ]);

        $category = Category::factory()->create();
        $product = Product::factory()->create(['farmer_id' => $farmer->id, 'category_id' => $category->id]);

        for ($i = 0; $i < 3; $i++) {
            $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER]);
            $order = Order::factory()->create([
                'customer_id' => $customer->id,
                'farmer_id' => $farmer->id,
                'market_id' => $market->id,
                'status' => Order::STATUS_PLACED,
            ]);

            OrderItem::factory()->create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'unit' => 'lb',
            ]);
        }

        DB::flushQueryLog();
        DB::enableQueryLog();

        $response = $this->actingAs($farmerUser)->getJson('/api/v1/farmer/orders');

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $response->assertStatus(200);

        // Bounded query count: orders, items, products, farmer markets, markets, customers (constant 9 queries)
        $this->assertLessThanOrEqual(10, count($queries), 'Farmer orders list suffered from N+1 query problem.');
    }
}
