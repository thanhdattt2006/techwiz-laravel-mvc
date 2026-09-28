<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Market;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Market>
 */
class MarketFactory extends Factory
{
    protected $model = Market::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company().' Farmers Market',
            'address' => fake()->streetAddress().', Chicago, IL',
            'latitude' => fake()->latitude(41.7, 42.0),
            'longitude' => fake()->longitude(-87.8, -87.6),
            'map_provider' => 'osm',
            'map_embed_url' => 'https://www.openstreetmap.org/export/embed.html',
            'description' => fake()->sentence(),
            'image' => '/images/markets/market-lincoln-park.webp',
            'status' => Market::STATUS_ACTIVE,
        ];
    }
}
