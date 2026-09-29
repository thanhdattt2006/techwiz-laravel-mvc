<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Cart;
use App\Models\Farmer;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_customer_can_register_successfully_and_gets_empty_cart(): void
    {
        $payload = [
            'fullname' => 'John Doe',
            'username' => 'johndoe',
            'email' => 'john.doe@example.com',
            'phone' => '+13125550101',
            'address' => '123 Market Street, Chicago, IL',
            'password' => 'SecurePass123!',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.role', User::ROLE_CUSTOMER)
            ->assertJsonPath('data.user.status', User::STATUS_ACTIVE)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'token',
                    'user' => [
                        'id',
                        'fullname',
                        'username',
                        'email',
                        'phone',
                        'address',
                        'role',
                        'status',
                    ],
                ],
                'errors',
            ]);

        $this->assertDatabaseHas('users', [
            'username' => 'johndoe',
            'email' => 'john.doe@example.com',
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $user = User::where('username', 'johndoe')->firstOrFail();
        $this->assertDatabaseHas('carts', [
            'user_id' => $user->id,
        ]);
    }

    public function test_customer_registration_fails_with_duplicate_email(): void
    {
        User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $payload = [
            'fullname' => 'Another User',
            'username' => 'anotheruser',
            'email' => 'existing@example.com',
            'phone' => '+13125550102',
            'address' => '456 Farm Road, Chicago, IL',
            'password' => 'SecurePass123!',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'errors' => ['email'],
            ]);
    }

    public function test_farmer_can_register_with_pending_status(): void
    {
        $payload = [
            'fullname' => 'Green Valley Farms',
            'username' => 'greenvalley',
            'email' => 'farmer@greenvalley.com',
            'phone' => '+13125550199',
            'password' => 'FarmerSecure123!',
            'stall_name' => 'Green Valley Organics',
            'contact_person' => 'Tom Greenfield',
            'contact_phone' => '+13125550199',
            'address' => 'Farm Plot #12, Naperville, IL',
            'description' => 'Locally grown organic vegetables and heirloom tomatoes.',
            'latitude' => 41.7508,
            'longitude' => -88.1535,
        ];

        $response = $this->postJson('/api/v1/auth/register-farmer', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.role', User::ROLE_FARMER)
            ->assertJsonPath('data.user.status', User::STATUS_PENDING)
            ->assertJsonPath('data.user.farmer.stall_name', 'Green Valley Organics');

        $this->assertDatabaseHas('users', [
            'username' => 'greenvalley',
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_PENDING,
        ]);

        $this->assertDatabaseHas('farmers', [
            'stall_name' => 'Green Valley Organics',
            'contact_person' => 'Tom Greenfield',
        ]);
    }

    public function test_active_user_can_login_with_email(): void
    {
        $user = User::factory()->create([
            'email' => 'customer@example.com',
            'password' => Hash::make('Password123!'),
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'login' => 'customer@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.id', $user->id);

        $this->assertNotEmpty($response->json('data.token'));
    }

    public function test_active_user_can_login_with_username(): void
    {
        $user = User::factory()->create([
            'username' => 'coolcustomer',
            'password' => Hash::make('Password123!'),
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'login' => 'coolcustomer',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.id', $user->id);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create([
            'username' => 'validuser',
            'password' => Hash::make('CorrectPassword123!'),
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'login' => 'validuser',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'errors' => ['login'],
            ]);
    }

    public function test_pending_farmer_cannot_login(): void
    {
        User::factory()->create([
            'username' => 'pendingfarmer',
            'password' => Hash::make('Password123!'),
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_PENDING,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'login' => 'pendingfarmer',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('errors.status', User::STATUS_PENDING);
    }

    public function test_banned_user_cannot_login(): void
    {
        User::factory()->create([
            'username' => 'banneduser',
            'password' => Hash::make('Password123!'),
            'status' => User::STATUS_BANNED,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'login' => 'banneduser',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('errors.status', User::STATUS_BANNED);
    }

    public function test_banned_user_token_is_rejected_on_protected_endpoints(): void
    {
        $user = User::factory()->create([
            'status' => User::STATUS_BANNED,
        ]);
        $token = $user->createToken('banned-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('errors.status', User::STATUS_BANNED);

        $this->assertCount(0, $user->fresh()->tokens);
    }

    public function test_authenticated_user_can_fetch_me_profile(): void
    {
        $user = User::factory()->create([
            'fullname' => 'Alice Walker',
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonPath('data.user.fullname', 'Alice Walker');
    }

    public function test_authenticated_farmer_fetches_me_with_farmer_details(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        Farmer::create([
            'user_id' => $user->id,
            'stall_name' => 'Sunny Hill Berry Farm',
            'contact_person' => 'Sam Hill',
            'contact_phone' => '+13125550222',
            'address' => 'Berry Patch Ln, IL',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('data.user.farmer.stall_name', 'Sunny Hill Berry Farm')
            ->assertJsonPath('data.user.farmer.contact_person', 'Sam Hill');
    }

    public function test_authenticated_user_can_update_profile(): void
    {
        $user = User::factory()->create([
            'fullname' => 'Old Name',
            'phone' => '+1000000000',
            'address' => 'Old Address',
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/v1/auth/profile', [
            'fullname' => 'Updated Name',
            'phone' => '+1999999999',
            'address' => 'New Chicagoland Address',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.fullname', 'Updated Name');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'fullname' => 'Updated Name',
            'phone' => '+1999999999',
            'address' => 'New Chicagoland Address',
        ]);
    }

    public function test_authenticated_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('CurrentPass123!'),
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/v1/auth/change-password', [
            'current_password' => 'CurrentPass123!',
            'new_password' => 'BrandNewPass456!',
            'new_password_confirmation' => 'BrandNewPass456!',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        // Verify new password is valid
        $this->assertTrue(Hash::check('BrandNewPass456!', $user->fresh()->password));
    }

    public function test_change_password_fails_if_current_password_is_incorrect(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('CorrectPass123!'),
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/v1/auth/change-password', [
            'current_password' => 'WrongPass123!',
            'new_password' => 'BrandNewPass456!',
            'new_password_confirmation' => 'BrandNewPass456!',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure([
                'success',
                'message',
                'data',
                'errors' => ['current_password'],
            ]);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create([
            'status' => User::STATUS_ACTIVE,
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_unauthenticated_request_to_protected_me_returns_401(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Unauthenticated.');
    }
}
