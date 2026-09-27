<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => User::factory()->create(['role' => User::ROLE_CUSTOMER]),
            'order_id' => Order::factory()->create(['status' => Order::STATUS_COMPLETED]),
            'farmer_id' => null,
            'product_id' => null,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->paragraph(),
            'farmer_reply' => null,
            'farmer_replied_at' => null,
            'is_hidden' => false,
        ];
    }
}
