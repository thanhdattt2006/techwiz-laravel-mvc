<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class NotificationAndAnnouncementApiTest extends TestCase
{
    use DatabaseTransactions;

    private function createUser(string $role = User::ROLE_CUSTOMER): User
    {
        return User::factory()->create([
            'role' => $role,
            'status' => User::STATUS_ACTIVE,
        ]);
    }

    public function test_user_can_view_in_app_notifications_with_unread_count(): void
    {
        $user = $this->createUser();

        // 2 unread, 1 read
        Notification::factory()->create(['user_id' => $user->id, 'is_read' => false]);
        Notification::factory()->create(['user_id' => $user->id, 'is_read' => false]);
        Notification::factory()->create(['user_id' => $user->id, 'is_read' => true]);

        // Notification for another user (should not appear)
        Notification::factory()->create(['user_id' => $this->createUser()->id, 'is_read' => false]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/notifications');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.unread_count', 2)
            ->assertJsonPath('data.total_count', 3)
            ->assertJsonCount(3, 'data.notifications');
    }

    public function test_user_can_filter_unread_notifications_only(): void
    {
        $user = $this->createUser();

        Notification::factory()->create(['user_id' => $user->id, 'is_read' => false]);
        Notification::factory()->create(['user_id' => $user->id, 'is_read' => true]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/notifications?unread_only=true');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.notifications')
            ->assertJsonPath('data.notifications.0.is_read', false);
    }

    public function test_user_can_mark_single_notification_as_read(): void
    {
        $user = $this->createUser();
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
            'is_read' => false,
        ]);

        $response = $this->actingAs($user)
            ->patchJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_read', true);

        $notification->refresh();
        $this->assertTrue($notification->is_read);
    }

    public function test_user_cannot_mark_other_users_notification_as_read(): void
    {
        $user1 = $this->createUser();
        $user2 = $this->createUser();
        $notification = Notification::factory()->create([
            'user_id' => $user1->id,
            'is_read' => false,
        ]);

        $response = $this->actingAs($user2)
            ->patchJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertStatus(404);
    }

    public function test_user_can_mark_all_notifications_as_read(): void
    {
        $user = $this->createUser();
        Notification::factory()->count(3)->create([
            'user_id' => $user->id,
            'is_read' => false,
        ]);

        $response = $this->actingAs($user)
            ->patchJson('/api/v1/notifications/read-all');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'All notifications marked as read.');

        $unreadCount = Notification::where('user_id', $user->id)->where('is_read', false)->count();
        $this->assertEquals(0, $unreadCount);
    }

    public function test_public_can_view_active_announcements_for_customer_or_all(): void
    {
        $admin = $this->createUser(User::ROLE_ADMIN);

        // Targeted for all
        Announcement::create([
            'created_by' => $admin->id,
            'title' => 'Harvest Festival This Weekend',
            'content' => 'Join us for local tastings and autumn celebrations.',
            'target_role' => Announcement::TARGET_ALL,
            'is_active' => true,
        ]);

        // Targeted for customer
        Announcement::create([
            'created_by' => $admin->id,
            'title' => 'New Organic Produce Available',
            'content' => 'Fresh apples and leafy greens just harvested.',
            'target_role' => Announcement::TARGET_CUSTOMER,
            'is_active' => true,
        ]);

        // Targeted for farmer only (should not show for general public/customer)
        Announcement::create([
            'created_by' => $admin->id,
            'title' => 'Stall Setup Guidelines for Sunday',
            'content' => 'Please arrive by 7:00 AM for vehicle unload.',
            'target_role' => Announcement::TARGET_FARMER,
            'is_active' => true,
        ]);

        // Inactive announcement
        Announcement::create([
            'created_by' => $admin->id,
            'title' => 'Past Weather Warning',
            'content' => 'Expired alert.',
            'target_role' => Announcement::TARGET_ALL,
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/announcements/active');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $titles = collect($response->json('data'))->pluck('title');
        $this->assertTrue($titles->contains('Harvest Festival This Weekend'));
        $this->assertTrue($titles->contains('New Organic Produce Available'));
        $this->assertFalse($titles->contains('Stall Setup Guidelines for Sunday'));
        $this->assertFalse($titles->contains('Past Weather Warning'));
    }

    public function test_farmer_views_announcements_targeted_for_farmer_and_all(): void
    {
        $admin = $this->createUser(User::ROLE_ADMIN);
        $farmer = $this->createUser(User::ROLE_FARMER);

        Announcement::create([
            'created_by' => $admin->id,
            'title' => 'Notice to All Visitors UniqueXYZ',
            'content' => 'General market announcement.',
            'target_role' => Announcement::TARGET_ALL,
            'is_active' => true,
        ]);

        Announcement::create([
            'created_by' => $admin->id,
            'title' => 'Important Farmer Stall Rule Update UniqueXYZ',
            'content' => 'Details on cold storage facilities.',
            'target_role' => Announcement::TARGET_FARMER,
            'is_active' => true,
        ]);

        Announcement::create([
            'created_by' => $admin->id,
            'title' => 'Shopper Special Offer UniqueXYZ',
            'content' => 'Shoppers only promo.',
            'target_role' => Announcement::TARGET_CUSTOMER,
            'is_active' => true,
        ]);

        $response = $this->actingAs($farmer)
            ->getJson('/api/v1/announcements/active');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $titles = collect($response->json('data'))->pluck('title');
        $this->assertTrue($titles->contains('Notice to All Visitors UniqueXYZ'));
        $this->assertTrue($titles->contains('Important Farmer Stall Rule Update UniqueXYZ'));
        $this->assertFalse($titles->contains('Shopper Special Offer UniqueXYZ'));
    }

    public function test_admin_can_manage_announcements(): void
    {
        $admin = $this->createUser(User::ROLE_ADMIN);

        // 1. Create announcement
        $createResponse = $this->actingAs($admin)
            ->postJson('/api/v1/admin/announcements', [
                'title' => 'Midwest Regional Market Opening',
                'content' => 'We are welcoming 20 new local farms this season.',
                'target_role' => 'all',
                'is_active' => true,
            ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Midwest Regional Market Opening');

        $announcementId = $createResponse->json('data.id');

        // 2. Update announcement
        $updateResponse = $this->actingAs($admin)
            ->putJson("/api/v1/admin/announcements/{$announcementId}", [
                'title' => 'Midwest Regional Market Opening - Updated',
                'is_active' => false,
            ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Midwest Regional Market Opening - Updated')
            ->assertJsonPath('data.is_active', false);

        // 3. List all announcements as admin
        $listResponse = $this->actingAs($admin)
            ->getJson('/api/v1/admin/announcements');

        $listResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        // 4. Delete announcement
        $deleteResponse = $this->actingAs($admin)
            ->deleteJson("/api/v1/admin/announcements/{$announcementId}");

        $deleteResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('message', 'Announcement deleted successfully.');

        $this->assertDatabaseMissing('announcements', ['id' => $announcementId]);
    }

    public function test_non_admin_cannot_manage_announcements(): void
    {
        $customer = $this->createUser(User::ROLE_CUSTOMER);
        $admin = $this->createUser(User::ROLE_ADMIN);

        $announcement = Announcement::create([
            'created_by' => $admin->id,
            'title' => 'Admin Only Post',
            'content' => 'Content...',
            'target_role' => 'all',
            'is_active' => true,
        ]);

        // Customer attempts to post
        $this->actingAs($customer)
            ->postJson('/api/v1/admin/announcements', [
                'title' => 'Unauthorized Post',
                'content' => 'Hacker test',
                'target_role' => 'all',
            ])
            ->assertStatus(403);

        // Customer attempts to delete
        $this->actingAs($customer)
            ->deleteJson("/api/v1/admin/announcements/{$announcement->id}")
            ->assertStatus(403);
    }
}
