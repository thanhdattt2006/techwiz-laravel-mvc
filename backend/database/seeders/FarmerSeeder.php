<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Market;
use App\Models\User;
use Illuminate\Database\Seeder;

class FarmerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $farmerUser1 = User::where('username', 'farmer')->first();
        $farmerUser2 = User::where('username', 'sarah_farms')->first();

        if (! $farmerUser1 || ! $farmerUser2) {
            return;
        }

        $farmer1 = Farmer::updateOrCreate(
            ['user_id' => $farmerUser1->id],
            [
                'stall_name' => 'Green Valley Organics',
                'contact_person' => 'John Miller',
                'contact_phone' => '(312) 555-0199',
                'address' => '1240 Farm Lane, Woodstock, IL 60098',
                'latitude' => 42.3147,
                'longitude' => -88.4487,
                'description' => 'Certified organic heirloom vegetables, crisp leafy greens, and seasonal fruits picked hours before market.',
                'logo' => 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80',
                'avg_rating' => 4.90,
                'review_count' => 14,
            ]
        );

        $farmer2 = Farmer::updateOrCreate(
            ['user_id' => $farmerUser2->id],
            [
                'stall_name' => 'Sunny Meadow Dairy & Apiary',
                'contact_person' => 'Sarah Jenkins',
                'contact_phone' => '(312) 555-0188',
                'address' => '880 Heritage Rd, Naperville, IL 60540',
                'latitude' => 41.7508,
                'longitude' => -88.1535,
                'description' => 'Pasture-raised poultry and eggs, artisanal cheese, raw wildflower honey, and fresh country churned butter.',
                'logo' => 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=400&q=80',
                'avg_rating' => 4.85,
                'review_count' => 9,
            ]
        );

        $lincolnMarket = Market::where('name', 'Lincoln Park Farmers Market')->first();
        $greenCityMarket = Market::where('name', 'Green City Market Lincoln Park')->first();
        $loganMarket = Market::where('name', 'Logan Square Farmers Market')->first();

        if ($lincolnMarket) {
            FarmerMarket::updateOrCreate(
                ['farmer_id' => $farmer1->id, 'market_id' => $lincolnMarket->id],
                [
                    'stall_location' => 'Stall A-12 (North Entrance Gate)',
                    'pickup_days' => [6], // Saturday
                    'pickup_start_time' => '07:30:00',
                    'pickup_end_time' => '12:30:00',
                    'slot_minutes' => 30,
                    'cutoff_hours' => 12,
                    'is_active' => true,
                ]
            );
        }

        if ($greenCityMarket) {
            FarmerMarket::updateOrCreate(
                ['farmer_id' => $farmer1->id, 'market_id' => $greenCityMarket->id],
                [
                    'stall_location' => 'Stall C-05 (Gazebo Lane)',
                    'pickup_days' => [3, 6], // Wed & Sat
                    'pickup_start_time' => '07:30:00',
                    'pickup_end_time' => '12:30:00',
                    'slot_minutes' => 30,
                    'cutoff_hours' => 12,
                    'is_active' => true,
                ]
            );
        }

        if ($loganMarket) {
            FarmerMarket::updateOrCreate(
                ['farmer_id' => $farmer2->id, 'market_id' => $loganMarket->id],
                [
                    'stall_location' => 'Stall B-08 (Center Fountain Area)',
                    'pickup_days' => [0], // Sunday
                    'pickup_start_time' => '09:00:00',
                    'pickup_end_time' => '14:30:00',
                    'slot_minutes' => 30,
                    'cutoff_hours' => 12,
                    'is_active' => true,
                ]
            );
        }
    }
}
