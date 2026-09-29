<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\Farmer;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class AdminAndContactApiTest extends TestCase
{
    use DatabaseTransactions;

    private function createAdmin(): User
    {
        return User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);
    }

    private function createCustomer(): User
    {
        return User::factory()->create([
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);
    }

    public function test_admin_can_retrieve_platform_overview_statistics(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/stats/overview');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'revenue' => ['gross_completed', 'currency'],
                    'orders' => ['total', 'by_status'],
                    'users' => ['total', 'customers', 'farmers', 'pending_farmers', 'active_farmers', 'banned'],
                    'markets' => ['total', 'active'],
                    'products' => ['total', 'available', 'sold_out'],
                    'reviews' => ['total_visible', 'platform_average'],
                    'inquiries' => ['total', 'unread'],
                    'top_farmers',
                ],
            ]);
    }

    public function test_non_admin_cannot_access_admin_stats(): void
    {
        $customer = $this->createCustomer();

        $this->actingAs($customer)
            ->getJson('/api/v1/admin/stats/overview')
            ->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_stats(): void
    {
        $this->getJson('/api/v1/admin/stats/overview')
            ->assertStatus(401);
    }

    public function test_admin_can_list_and_filter_users(): void
    {
        $admin = $this->createAdmin();
        $uniqueName = 'SpecificTargetUser_'.uniqid();
        $targetUser = User::factory()->create([
            'fullname' => $uniqueName,
            'role' => User::ROLE_CUSTOMER,
            'status' => User::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/users?search='.$uniqueName);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertTrue(collect($data)->contains('id', $targetUser->id));
    }

    public function test_admin_can_update_user_status(): void
    {
        $admin = $this->createAdmin();
        $targetUser = $this->createCustomer();
        $token = $targetUser->createToken('auth-token')->plainTextToken;

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/users/{$targetUser->id}/status", [
                'status' => User::STATUS_BANNED,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', User::STATUS_BANNED);

        $targetUser->refresh();
        $this->assertSame(User::STATUS_BANNED, $targetUser->status);
        $this->assertCount(0, $targetUser->tokens);

        $this->app['auth']->forgetGuards();

        $meResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me');
        $meResponse->assertStatus(401);
    }

    public function test_admin_cannot_modify_own_status(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/users/{$admin->id}/status", [
                'status' => User::STATUS_BANNED,
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'You cannot modify your own account status.');
    }

    public function test_admin_can_list_pending_farmer_applications(): void
    {
        $admin = $this->createAdmin();

        $farmerUser = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_PENDING,
        ]);
        $farmer = Farmer::factory()->create([
            'user_id' => $farmerUser->id,
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/farmers/pending');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertTrue(collect($data)->contains('id', $farmer->id));
    }

    public function test_admin_can_approve_pending_farmer(): void
    {
        $admin = $this->createAdmin();

        $farmerUser = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_PENDING,
        ]);
        $farmer = Farmer::factory()->create([
            'user_id' => $farmerUser->id,
        ]);

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/farmers/{$farmer->id}/approve");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Farmer stall approved successfully.');

        $farmerUser->refresh();
        $this->assertSame(User::STATUS_ACTIVE, $farmerUser->status);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $farmerUser->id,
            'type' => 'farmer_approved',
        ]);
    }

    public function test_admin_can_reject_pending_farmer_with_reason(): void
    {
        $admin = $this->createAdmin();

        $farmerUser = User::factory()->create([
            'role' => User::ROLE_FARMER,
            'status' => User::STATUS_PENDING,
        ]);
        $farmer = Farmer::factory()->create([
            'user_id' => $farmerUser->id,
        ]);

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/farmers/{$farmer->id}/reject", [
                'reason' => 'Invalid agricultural credentials provided.',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Farmer stall application rejected.');

        $farmerUser->refresh();
        $this->assertSame(User::STATUS_INACTIVE, $farmerUser->status);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $farmerUser->id,
            'type' => 'farmer_rejected',
        ]);
    }

    public function test_admin_reject_farmer_requires_reason(): void
    {
        $admin = $this->createAdmin();

        $farmer = Farmer::factory()->create();

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/farmers/{$farmer->id}/reject", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['reason']);
    }

    public function test_public_user_can_submit_contact_inquiry(): void
    {
        $payload = [
            'name' => 'Alice Green',
            'email' => 'alice@example.com',
            'subject' => 'Partnership Inquiry',
            'message' => 'We would love to supply organic compost to the marketplace.',
        ];

        $response = $this->postJson('/api/v1/contact', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Alice Green')
            ->assertJsonPath('data.email', 'alice@example.com')
            ->assertJsonPath('data.is_read', false);

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'alice@example.com',
            'subject' => 'Partnership Inquiry',
            'is_read' => false,
        ]);
    }

    public function test_contact_submission_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/contact', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);
    }

    public function test_admin_can_view_and_filter_contact_inquiries(): void
    {
        $admin = $this->createAdmin();

        $inquiry = ContactMessage::factory()->create([
            'is_read' => false,
            'subject' => 'Unread Inquiry Test '.uniqid(),
        ]);

        $response = $this->actingAs($admin)
            ->getJson('/api/v1/admin/inquiries?is_read=0');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertTrue(collect($data)->contains('id', $inquiry->id));
    }

    public function test_admin_can_mark_contact_inquiry_as_read(): void
    {
        $admin = $this->createAdmin();

        $inquiry = ContactMessage::factory()->create([
            'is_read' => false,
        ]);

        $response = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/inquiries/{$inquiry->id}/read");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_read', true);

        $inquiry->refresh();
        $this->assertTrue($inquiry->is_read);
    }
}
