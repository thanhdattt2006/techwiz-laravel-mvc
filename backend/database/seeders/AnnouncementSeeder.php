<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('username', 'admin')->first();

        if (! $admin) {
            return;
        }

        Announcement::updateOrCreate(
            ['title' => 'Welcome to MarketLink Season 2026!'],
            [
                'created_by' => $admin->id,
                'content' => 'Explore fresh produce from local family farms across Chicago. Pre-order ahead and pick up directly at your neighborhood market stall.',
                'target_role' => Announcement::TARGET_ALL,
                'is_active' => true,
            ]
        );

        Announcement::updateOrCreate(
            ['title' => 'Farmer Stall Setup Reminder: 06:30 AM Access'],
            [
                'created_by' => $admin->id,
                'content' => 'All vendor vehicles must complete unloading and park in designated logistics lots by 06:45 AM before market gates open to pedestrians.',
                'target_role' => Announcement::TARGET_FARMER,
                'is_active' => true,
            ]
        );
    }
}
