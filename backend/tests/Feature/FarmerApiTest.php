<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Market;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class FarmerApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_public_user_can_list_active_farmers(): void
    {
        $farmer = Farmer::factory()->create([
            'stall_name' => 'Whispering Pines Orchard',
            'avg_rating' => 4.85,
        ]);

        $response = $this->getJson('/api/v1/farmers');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'stall_name',
                        'contact_person',
                        'contact_phone',
                        'address',
                        'avg_rating',
                        'review_count',
                        'markets',
                    ],
                ],
                'errors',
            ]);

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($farmer->id, $ids);
    }

    public function test_public_user_can_filter_farmers_by_search(): void
    {
        $farmer1 = Farmer::factory()->create([
            'stall_name' => 'Heritage Apple Farm',
            'contact_person' => 'Arthur Dent',
        ]);

        $farmer2 = Farmer::factory()->create([
            'stall_name' => 'Blueberry Hill',
            'contact_person' => 'Ford Prefect',
        ]);

        $response = $this->getJson('/api/v1/farmers?search=Heritage');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($farmer1->id, $ids);
        $this->assertNotContains($farmer2->id, $ids);
    }

    public function test_public_user_can_filter_farmers_by_market_id(): void
    {
        $market = Market::factory()->create(['status' => Market::STATUS_ACTIVE]);
        $farmerInMarket = Farmer::factory()->create();
        $farmerNotInMarket = Farmer::factory()->create();

        FarmerMarket::create([
            'farmer_id' => $farmerInMarket->id,
            'market_id' => $market->id,
            'pickup_days' => [6],
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '13:00',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/farmers?market_id='.$market->id);

        $response->assertStatus(200);
        $ids = collect($response->json('data'))->pluck('id')->toArray();
        $this->assertContains($farmerInMarket->id, $ids);
        $this->assertNotContains($farmerNotInMarket->id, $ids);
    }

    public function test_public_user_can_view_single_farmer_details(): void
    {
        $farmer = Farmer::factory()->create([
            'stall_name' => 'Prairie Creek Organics',
            'description' => 'Heirloom carrots, kale, and microgreens.',
        ]);

        $response = $this->getJson('/api/v1/farmers/'.$farmer->id);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $farmer->id)
            ->assertJsonPath('data.stall_name', 'Prairie Creek Organics');
    }

    public function test_view_nonexistent_farmer_returns_404(): void
    {
        $response = $this->getJson('/api/v1/farmers/999999');

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Farmer stall not found.');
    }

    public function test_authenticated_farmer_can_view_own_profile(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $farmer = Farmer::factory()->create([
            'user_id' => $user->id,
            'stall_name' => 'My Personal Organic Farm',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/farmer/profile');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $farmer->id)
            ->assertJsonPath('data.stall_name', 'My Personal Organic Farm');
    }

    public function test_authenticated_farmer_can_update_own_stall_profile(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $farmer = Farmer::factory()->create([
            'user_id' => $user->id,
            'stall_name' => 'Old Stall Name',
        ]);

        $payload = [
            'stall_name' => 'Golden Harvest Stall',
            'contact_person' => 'Farmer Bob',
            'contact_phone' => '+13125550303',
            'address' => 'Updated Farm Road 9',
            'description' => 'Updated fresh farm description.',
        ];

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/v1/farmer/profile', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.stall_name', 'Golden Harvest Stall');

        $this->assertDatabaseHas('farmers', [
            'id' => $farmer->id,
            'stall_name' => 'Golden Harvest Stall',
            'contact_person' => 'Farmer Bob',
        ]);
    }

    public function test_authenticated_farmer_can_link_stall_to_new_market(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $farmer = Farmer::factory()->create(['user_id' => $user->id]);
        $market = Market::factory()->create(['status' => Market::STATUS_ACTIVE]);

        $payload = [
            'market_id' => $market->id,
            'stall_location' => 'Booth #C4 (East Wing)',
            'pickup_days' => [0, 6], // Sun, Sat
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '13:00',
            'slot_minutes' => 30,
            'cutoff_hours' => 12,
            'is_active' => true,
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/farmer/markets', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.market_id', $market->id)
            ->assertJsonPath('data.stall_location', 'Booth #C4 (East Wing)');

        $this->assertDatabaseHas('farmer_markets', [
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'stall_location' => 'Booth #C4 (East Wing)',
            'slot_minutes' => 30,
        ]);
    }

    public function test_cannot_link_same_market_twice(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $farmer = Farmer::factory()->create(['user_id' => $user->id]);
        $market = Market::factory()->create(['status' => Market::STATUS_ACTIVE]);

        FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'pickup_days' => [6],
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '13:00',
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/farmer/markets', [
            'market_id' => $market->id,
            'pickup_days' => [6],
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '13:00',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'errors' => ['market_id'],
            ]);
    }

    public function test_authenticated_farmer_can_update_market_configuration(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $farmer = Farmer::factory()->create(['user_id' => $user->id]);
        $market = Market::factory()->create(['status' => Market::STATUS_ACTIVE]);

        FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'stall_location' => 'Old Booth',
            'pickup_days' => [6],
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '12:00',
            'slot_minutes' => 30,
            'cutoff_hours' => 12,
        ]);

        $payload = [
            'stall_location' => 'New Premium Booth #A1',
            'pickup_days' => [0, 6],
            'pickup_start_time' => '07:30',
            'pickup_end_time' => '13:30',
            'slot_minutes' => 15,
            'cutoff_hours' => 24,
        ];

        $response = $this->actingAs($user, 'sanctum')
            ->putJson('/api/v1/farmer/markets/'.$market->id, $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.stall_location', 'New Premium Booth #A1')
            ->assertJsonPath('data.slot_minutes', 15);

        $this->assertDatabaseHas('farmer_markets', [
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'stall_location' => 'New Premium Booth #A1',
            'slot_minutes' => 15,
        ]);
    }

    public function test_authenticated_farmer_can_unlink_from_market(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $farmer = Farmer::factory()->create(['user_id' => $user->id]);
        $market = Market::factory()->create(['status' => Market::STATUS_ACTIVE]);

        FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
            'pickup_days' => [6],
            'pickup_start_time' => '08:00',
            'pickup_end_time' => '12:00',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/v1/farmer/markets/'.$market->id);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Stall unregistered from market successfully.');

        $this->assertDatabaseMissing('farmer_markets', [
            'farmer_id' => $farmer->id,
            'market_id' => $market->id,
        ]);
    }

    public function test_non_farmer_cannot_access_farmer_endpoints(): void
    {
        $customer = User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($customer, 'sanctum')->getJson('/api/v1/farmer/profile');

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }
}
