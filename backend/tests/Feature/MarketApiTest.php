<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Market;
use App\Models\MarketSchedule;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MarketApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_public_user_can_list_active_markets(): void
    {
        $activeMarket = Market::factory()->create([
            'name' => 'Lincoln Park Green Market',
            'status' => Market::STATUS_ACTIVE,
        ]);

        $inactiveMarket = Market::factory()->create([
            'name' => 'Closed Winter Market',
            'status' => Market::STATUS_INACTIVE,
        ]);

        $response = $this->getJson('/api/v1/markets');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'address',
                        'latitude',
                        'longitude',
                        'map_provider',
                        'status',
                        'active_stalls_count',
                        'schedules',
                    ],
                ],
                'errors',
            ]);

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($activeMarket->id, $ids);
        $this->assertNotContains($inactiveMarket->id, $ids);
    }

    public function test_public_user_can_filter_markets_by_search_query(): void
    {
        $market1 = Market::factory()->create([
            'name' => 'Wicker Park Fresh Harvest',
            'address' => '1425 N Damen Ave, Chicago, IL',
            'status' => Market::STATUS_ACTIVE,
        ]);

        $market2 = Market::factory()->create([
            'name' => 'Hyde Park Bazaar',
            'address' => '5300 S Harper Ave, Chicago, IL',
            'status' => Market::STATUS_ACTIVE,
        ]);

        $response = $this->getJson('/api/v1/markets?search=Wicker');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($market1->id, $ids);
        $this->assertNotContains($market2->id, $ids);
    }

    public function test_public_user_can_filter_markets_by_day_of_week(): void
    {
        $saturdayMarket = Market::factory()->create(['status' => Market::STATUS_ACTIVE]);
        MarketSchedule::create([
            'market_id' => $saturdayMarket->id,
            'day_of_week' => 6, // Saturday
            'open_time' => '07:00:00',
            'close_time' => '13:00:00',
        ]);

        $sundayMarket = Market::factory()->create(['status' => Market::STATUS_ACTIVE]);
        MarketSchedule::create([
            'market_id' => $sundayMarket->id,
            'day_of_week' => 0, // Sunday
            'open_time' => '09:00:00',
            'close_time' => '14:00:00',
        ]);

        $response = $this->getJson('/api/v1/markets?day_of_week=6');

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($saturdayMarket->id, $ids);
        $this->assertNotContains($sundayMarket->id, $ids);
    }

    public function test_public_user_can_view_single_market_details(): void
    {
        $market = Market::factory()->create([
            'name' => 'Logan Square Farmers Market',
            'status' => Market::STATUS_ACTIVE,
        ]);

        MarketSchedule::create([
            'market_id' => $market->id,
            'day_of_week' => 0,
            'open_time' => '08:30:00',
            'close_time' => '15:00:00',
        ]);

        $response = $this->getJson('/api/v1/markets/'.$market->id);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $market->id)
            ->assertJsonPath('data.name', 'Logan Square Farmers Market')
            ->assertJsonCount(1, 'data.schedules')
            ->assertJsonPath('data.schedules.0.day_name', 'Sunday');
    }

    public function test_view_nonexistent_market_returns_404(): void
    {
        $response = $this->getJson('/api/v1/markets/999999');

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Market not found.');
    }

    public function test_admin_can_create_market_with_schedules(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $payload = [
            'name' => 'Pilsen Community Market',
            'address' => '1821 S Blue Island Ave, Chicago, IL',
            'latitude' => 41.8576,
            'longitude' => -87.6599,
            'map_provider' => 'osm',
            'description' => 'A lively neighborhood market featuring local Mexican produce and artisan goods.',
            'schedules' => [
                [
                    'day_of_week' => 0, // Sunday
                    'open_time' => '09:00',
                    'close_time' => '14:00',
                ],
            ],
        ];

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/markets', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Pilsen Community Market')
            ->assertJsonCount(1, 'data.schedules');

        $this->assertDatabaseHas('markets', [
            'name' => 'Pilsen Community Market',
            'latitude' => 41.8576,
        ]);

        $marketId = $response->json('data.id');
        $this->assertDatabaseHas('market_schedules', [
            'market_id' => $marketId,
            'day_of_week' => 0,
        ]);
    }

    public function test_non_admin_cannot_create_market(): void
    {
        $customer = User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $payload = [
            'name' => 'Unauthorized Market',
            'address' => '123 Fake St, Chicago, IL',
            'latitude' => 41.8818,
            'longitude' => -87.6231,
        ];

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/admin/markets', $payload);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_unauthenticated_user_cannot_create_market(): void
    {
        $response = $this->postJson('/api/v1/admin/markets', [
            'name' => 'Test Market',
            'address' => 'Test Address',
            'latitude' => 41.88,
            'longitude' => -87.62,
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('success', false);
    }

    public function test_admin_can_update_market_and_schedules(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $market = Market::factory()->create([
            'name' => 'Old Market Name',
            'address' => 'Old Address',
            'status' => Market::STATUS_ACTIVE,
        ]);

        MarketSchedule::create([
            'market_id' => $market->id,
            'day_of_week' => 3, // Wednesday
            'open_time' => '10:00:00',
            'close_time' => '14:00:00',
        ]);

        $payload = [
            'name' => 'Updated Downtown Market',
            'address' => '50 W Washington St, Chicago, IL',
            'latitude' => 41.8837,
            'longitude' => -87.6300,
            'schedules' => [
                [
                    'day_of_week' => 4, // Thursday
                    'open_time' => '07:00',
                    'close_time' => '14:30',
                ],
                [
                    'day_of_week' => 6, // Saturday
                    'open_time' => '08:00',
                    'close_time' => '13:00',
                ],
            ],
        ];

        $response = $this->actingAs($admin, 'sanctum')->putJson('/api/v1/admin/markets/'.$market->id, $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Updated Downtown Market')
            ->assertJsonCount(2, 'data.schedules');

        $this->assertDatabaseHas('markets', [
            'id' => $market->id,
            'name' => 'Updated Downtown Market',
        ]);

        // Old schedule for Wednesday should be gone, Thursday and Saturday present
        $this->assertDatabaseMissing('market_schedules', [
            'market_id' => $market->id,
            'day_of_week' => 3,
        ]);

        $this->assertDatabaseHas('market_schedules', [
            'market_id' => $market->id,
            'day_of_week' => 4,
        ]);
        $this->assertDatabaseHas('market_schedules', [
            'market_id' => $market->id,
            'day_of_week' => 6,
        ]);
    }

    public function test_admin_can_delete_market(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $market = Market::factory()->create(['status' => Market::STATUS_ACTIVE]);

        $response = $this->actingAs($admin, 'sanctum')->deleteJson('/api/v1/admin/markets/'.$market->id);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Market deleted successfully.');

        $this->assertSoftDeleted('markets', [
            'id' => $market->id,
        ]);
    }

    public function test_store_market_fails_validation_with_missing_required_fields(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/markets', []);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'errors' => ['name', 'address', 'latitude', 'longitude'],
            ]);
    }
}
