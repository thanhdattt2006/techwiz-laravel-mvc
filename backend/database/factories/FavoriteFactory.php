<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Favorite;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Favorite>
 */
class FavoriteFactory extends Factory
{
    protected $model = Favorite::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->create(['role' => User::ROLE_CUSTOMER]),
            'favoritable_type' => 'product',
            'favoritable_id' => Product::factory(),
        ];
    }
}
