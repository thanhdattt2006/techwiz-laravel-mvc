<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Farmer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Farmer>
 */
class FarmerFactory extends Factory
{
    protected $model = Farmer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->state([
                'role' => User::ROLE_FARMER,
                'status' => User::STATUS_ACTIVE,
            ]),
            'stall_name' => fake()->company().' Organics',
            'contact_person' => fake()->name(),
            'contact_phone' => fake()->numerify('+1##########'),
            'address' => fake()->address(),
            'latitude' => fake()->latitude(41.7, 42.0),
            'longitude' => fake()->longitude(-88.3, -87.6),
            'description' => fake()->paragraph(),
            'logo' => null,
            'avg_rating' => 0.00,
            'review_count' => 0,
        ];
    }
}
