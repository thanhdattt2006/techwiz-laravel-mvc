<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Category;
use App\Models\Farmer;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'farmer_id' => Farmer::factory(),
            'category_id' => Category::factory(),
            'name' => ucfirst(fake()->words(2, true)),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 2, 50),
            'unit' => fake()->randomElement(['kg', 'bunch', 'box', 'jar', 'pack']),
            'stock_quantity' => fake()->randomFloat(2, 5, 100),
            'availability' => Product::AVAILABILITY_AVAILABLE,
            'image' => null,
            'is_hidden' => false,
            'avg_rating' => 0.00,
            'review_count' => 0,
        ];
    }
}
