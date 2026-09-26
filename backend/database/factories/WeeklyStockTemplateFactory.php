<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Product;
use App\Models\WeeklyStockTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WeeklyStockTemplate>
 */
class WeeklyStockTemplateFactory extends Factory
{
    protected $model = WeeklyStockTemplate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'day_of_week' => fake()->numberBetween(0, 6),
            'default_quantity' => fake()->randomFloat(2, 10, 100),
            'is_active' => true,
        ];
    }
}
