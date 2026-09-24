<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Market;
use App\Models\MarketSchedule;
use Illuminate\Database\Seeder;

class MarketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $marketsData = [
            [
                'name' => 'Lincoln Park Farmers Market',
                'address' => '2001 N Orchard St & Armitage Ave, Chicago, IL 60614',
                'latitude' => 41.9182,
                'longitude' => -87.6473,
                'map_provider' => 'osm',
                'map_embed_url' => 'https://www.openstreetmap.org/export/embed.html?bbox=-87.6523%2C41.9152%2C-87.6423%2C41.9212&layer=mapnik',
                'description' => 'Premier open-air neighborhood market serving Lincoln Park with certified organic produce, bakery, and farm goods.',
                'image' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
                'status' => 'active',
                'schedules' => [
                    ['day_of_week' => 6, 'open_time' => '07:00:00', 'close_time' => '13:00:00'], // Sat
                ],
            ],
            [
                'name' => 'Green City Market Lincoln Park',
                'address' => '1817 N Clark St (Lincoln Park Zoo South), Chicago, IL 60614',
                'latitude' => 41.9214,
                'longitude' => -87.6348,
                'map_provider' => 'osm',
                'map_embed_url' => 'https://www.openstreetmap.org/export/embed.html?bbox=-87.6398%2C41.9184%2C-87.6298%2C41.9244&layer=mapnik',
                'description' => "Chicago's largest sustainable farmers market connecting top local chefs and mindful shoppers with sustainable growers.",
                'image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
                'status' => 'active',
                'schedules' => [
                    ['day_of_week' => 3, 'open_time' => '07:00:00', 'close_time' => '13:00:00'], // Wed
                    ['day_of_week' => 6, 'open_time' => '07:00:00', 'close_time' => '13:00:00'], // Sat
                ],
            ],
            [
                'name' => 'Logan Square Farmers Market',
                'address' => '3107 W Logan Blvd, Chicago, IL 60647',
                'latitude' => 41.9298,
                'longitude' => -87.7083,
                'map_provider' => 'osm',
                'map_embed_url' => 'https://www.openstreetmap.org/export/embed.html?bbox=-87.7133%2C41.9268%2C-87.7033%2C41.9328&layer=mapnik',
                'description' => 'Vibrant cultural hub market showcasing organic farming, artisan bakeries, and live folk music every Sunday.',
                'image' => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
                'status' => 'active',
                'schedules' => [
                    ['day_of_week' => 0, 'open_time' => '08:30:00', 'close_time' => '15:00:00'], // Sun
                ],
            ],
            [
                'name' => 'Wicker Park Farmers Market',
                'address' => '1425 N Damen Ave, Chicago, IL 60622',
                'latitude' => 41.9088,
                'longitude' => -87.6774,
                'map_provider' => 'osm',
                'map_embed_url' => 'https://www.openstreetmap.org/export/embed.html?bbox=-87.6824%2C41.9058%2C-87.6724%2C41.9118&layer=mapnik',
                'description' => 'Bustling park market featuring local microgreens, organic mushrooms, and eco-friendly artisanal provisions.',
                'image' => 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80',
                'status' => 'active',
                'schedules' => [
                    ['day_of_week' => 0, 'open_time' => '08:00:00', 'close_time' => '14:00:00'], // Sun
                ],
            ],
        ];

        foreach ($marketsData as $mData) {
            $schedules = $mData['schedules'];
            unset($mData['schedules']);

            $market = Market::updateOrCreate(['name' => $mData['name']], $mData);

            foreach ($schedules as $sched) {
                MarketSchedule::updateOrCreate(
                    ['market_id' => $market->id, 'day_of_week' => $sched['day_of_week']],
                    ['open_time' => $sched['open_time'], 'close_time' => $sched['close_time']]
                );
            }
        }
    }
}
