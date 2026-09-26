<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Market;
use App\Models\Product;
use App\Models\User;
use App\Models\WeeklyStockTemplate;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class WeeklyStockApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_farmer_can_get_product_weekly_stock_templates(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);

        WeeklyStockTemplate::create([
            'product_id' => $product->id,
            'day_of_week' => 6, // Saturday
            'default_quantity' => 50.00,
            'is_active' => true,
        ]);

        WeeklyStockTemplate::create([
            'product_id' => $product->id,
            'day_of_week' => 0, // Sunday
            'default_quantity' => 30.00,
            'is_active' => true,
        ]);

        $response = $this->actingAs($farmerUser)
            ->getJson("/api/v1/farmer/products/{$product->id}/template");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'product_id',
                        'day_of_week',
                        'day_name',
                        'default_quantity',
                        'is_active',
                    ],
                ],
                'errors',
            ]);

        $data = $response->json('data');
        $this->assertCount(2, $data);
        $days = collect($data)->pluck('day_name')->toArray();
        $this->assertContains('Saturday', $days);
        $this->assertContains('Sunday', $days);
    }

    public function test_farmer_cannot_get_templates_for_another_farmers_product(): void
    {
        $farmerUser1 = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        Farmer::factory()->create(['user_id' => $farmerUser1->id]);

        $farmerUser2 = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer2 = Farmer::factory()->create(['user_id' => $farmerUser2->id]);

        $product = Product::factory()->create(['farmer_id' => $farmer2->id]);

        $response = $this->actingAs($farmerUser1)
            ->getJson("/api/v1/farmer/products/{$product->id}/template");

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_farmer_can_configure_weekly_stock_templates(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);

        $payload = [
            'templates' => [
                [
                    'day_of_week' => 6,
                    'default_quantity' => 75.00,
                    'is_active' => true,
                ],
                [
                    'day_of_week' => 0,
                    'default_quantity' => 45.00,
                    'is_active' => true,
                ],
            ],
        ];

        $response = $this->actingAs($farmerUser)
            ->putJson("/api/v1/farmer/products/{$product->id}/template", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('weekly_stock_templates', [
            'product_id' => $product->id,
            'day_of_week' => 6,
            'default_quantity' => 75.00,
        ]);

        $this->assertDatabaseHas('weekly_stock_templates', [
            'product_id' => $product->id,
            'day_of_week' => 0,
            'default_quantity' => 45.00,
        ]);
    }

    public function test_updating_templates_validates_day_of_week_and_quantities(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);
        $product = Product::factory()->create(['farmer_id' => $farmer->id]);

        // Invalid day_of_week = 7 and duplicate day
        $payload = [
            'templates' => [
                [
                    'day_of_week' => 7,
                    'default_quantity' => -5,
                ],
                [
                    'day_of_week' => 7,
                    'default_quantity' => 10,
                ],
            ],
        ];

        $response = $this->actingAs($farmerUser)
            ->putJson("/api/v1/farmer/products/{$product->id}/template", $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['templates.0.day_of_week', 'templates.0.default_quantity', 'templates.1.day_of_week']);
    }

    public function test_farmer_cannot_update_templates_for_another_farmers_product(): void
    {
        $farmerUser1 = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        Farmer::factory()->create(['user_id' => $farmerUser1->id]);

        $farmerUser2 = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer2 = Farmer::factory()->create(['user_id' => $farmerUser2->id]);

        $product = Product::factory()->create(['farmer_id' => $farmer2->id]);

        $payload = [
            'templates' => [
                [
                    'day_of_week' => 6,
                    'default_quantity' => 50,
                ],
            ],
        ];

        $response = $this->actingAs($farmerUser1)
            ->putJson("/api/v1/farmer/products/{$product->id}/template", $payload);

        $response->assertStatus(403);
    }

    public function test_farmer_can_apply_weekly_templates_with_target_day(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);

        $product1 = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'stock_quantity' => 0.00,
            'availability' => Product::AVAILABILITY_SOLD_OUT,
        ]);

        $product2 = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'stock_quantity' => 2.00,
            'availability' => Product::AVAILABILITY_AVAILABLE,
        ]);

        WeeklyStockTemplate::create([
            'product_id' => $product1->id,
            'day_of_week' => 6, // Saturday
            'default_quantity' => 60.00,
            'is_active' => true,
        ]);

        WeeklyStockTemplate::create([
            'product_id' => $product2->id,
            'day_of_week' => 6,
            'default_quantity' => 40.00,
            'is_active' => true,
        ]);

        $response = $this->actingAs($farmerUser)
            ->postJson('/api/v1/farmer/apply-weekly-templates', [
                'target_day' => 6,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.target_day_of_week', 6)
            ->assertJsonPath('data.day_name', 'Saturday')
            ->assertJsonPath('data.updated_products_count', 2);

        $product1->refresh();
        $this->assertEquals(60.00, (float) $product1->stock_quantity);
        $this->assertEquals(Product::AVAILABILITY_AVAILABLE, $product1->availability);

        $product2->refresh();
        $this->assertEquals(40.00, (float) $product2->stock_quantity);
        $this->assertEquals(Product::AVAILABILITY_AVAILABLE, $product2->availability);
    }

    public function test_farmer_can_apply_weekly_templates_with_target_date(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);

        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'stock_quantity' => 0.00,
        ]);

        WeeklyStockTemplate::create([
            'product_id' => $product->id,
            'day_of_week' => 0, // Sunday
            'default_quantity' => 25.00,
            'is_active' => true,
        ]);

        // 2026-09-27 is Sunday (day 0)
        $response = $this->actingAs($farmerUser)
            ->postJson('/api/v1/farmer/apply-weekly-templates', [
                'target_date' => '2026-09-27',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.target_day_of_week', 0)
            ->assertJsonPath('data.day_name', 'Sunday');

        $product->refresh();
        $this->assertEquals(25.00, (float) $product->stock_quantity);
    }

    public function test_farmer_1_click_apply_auto_detects_upcoming_market_day(): void
    {
        $farmerUser = User::factory()->create(['role' => User::ROLE_FARMER, 'status' => User::STATUS_ACTIVE]);
        $farmer = Farmer::factory()->create(['user_id' => $farmerUser->id]);
        $market = Market::factory()->create();

        FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'stall_location' => 'Pavilion #3',
            'pickup_days' => [6], // Only Saturday
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '12:00',
            'slot_minutes' => 30,
            'cutoff_hours' => 12,
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'farmer_id' => $farmer->id,
            'stock_quantity' => 0.00,
        ]);

        WeeklyStockTemplate::create([
            'product_id' => $product->id,
            'day_of_week' => 6,
            'default_quantity' => 88.00,
            'is_active' => true,
        ]);

        // Call without body -> auto detects Saturday (6)
        $response = $this->actingAs($farmerUser)
            ->postJson('/api/v1/farmer/apply-weekly-templates');

        $response->assertStatus(200)
            ->assertJsonPath('data.target_day_of_week', 6)
            ->assertJsonPath('data.day_name', 'Saturday')
            ->assertJsonPath('data.updated_products_count', 1);

        $product->refresh();
        $this->assertEquals(88.00, (float) $product->stock_quantity);
    }

    public function test_non_farmer_cannot_access_weekly_stock_endpoints(): void
    {
        $customer = User::factory()->create(['role' => User::ROLE_CUSTOMER, 'status' => User::STATUS_ACTIVE]);
        $product = Product::factory()->create();

        $response = $this->actingAs($customer)
            ->getJson("/api/v1/farmer/products/{$product->id}/template");

        $response->assertStatus(403);
    }
}
