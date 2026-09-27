<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Farmer;
use App\Models\Market;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pickupDate = Carbon::now()->addDays(2)->format('Y-m-d');
        $pickupStart = '08:00';
        $pickupEnd = '08:30';
        $cutoffAt = Carbon::parse("{$pickupDate} {$pickupStart}")->subHours(12);

        return [
            'order_code' => 'ML-' . date('Y') . '-F' . $this->faker->numberBetween(10, 99) . '-' . strtoupper(Str::random(5)),
            'customer_id' => User::factory()->create(['role' => User::ROLE_CUSTOMER])->id,
            'farmer_id' => Farmer::factory()->create()->id,
            'market_id' => Market::factory()->create()->id,
            'pickup_date' => $pickupDate,
            'pickup_start_time' => $pickupStart,
            'pickup_end_time' => $pickupEnd,
            'status' => Order::STATUS_PLACED,
            'total_amount' => 25.00,
            'note' => $this->faker->sentence(),
            'cutoff_at' => $cutoffAt,
        ];
    }
}
