<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Farmer;
use App\Models\Market;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customer1 = User::where('username', 'customer')->first();
        $customer2 = User::where('username', 'emily_s')->first();
        $farmer1 = Farmer::where('stall_name', 'Green Valley Organics')->first();
        $market1 = Market::where('name', 'Lincoln Park Farmers Market')->first();

        if (! $customer1 || ! $customer2 || ! $farmer1 || ! $market1) {
            return;
        }

        $prod1 = Product::where('farmer_id', $farmer1->id)->first();
        $prod2 = Product::where('farmer_id', $farmer1->id)->skip(1)->first();

        if (! $prod1 || ! $prod2) {
            return;
        }

        $nextSaturday = Carbon::now()->next(Carbon::SATURDAY)->toDateString();

        // 1. Completed order (for review testing)
        $order1 = Order::updateOrCreate(
            ['order_code' => 'ML-2026-F01-7711'],
            [
                'customer_id' => $customer1->id,
                'farmer_id' => $farmer1->id,
                'market_id' => $market1->id,
                'pickup_date' => Carbon::now()->subDays(7)->toDateString(),
                'pickup_start_time' => '08:00:00',
                'pickup_end_time' => '08:30:00',
                'status' => Order::STATUS_COMPLETED,
                'total_amount' => round((float) $prod1->price * 2 + (float) $prod2->price, 2),
                'note' => 'Please pick ripe red tomatoes ready for salad.',
                'cutoff_at' => Carbon::now()->subDays(8)->setHour(20),
                'accepted_at' => Carbon::now()->subDays(7)->setHour(6),
                'ready_at' => Carbon::now()->subDays(7)->setHour(7),
                'completed_at' => Carbon::now()->subDays(7)->setHour(8)->setMinute(15),
            ]
        );

        OrderItem::updateOrCreate(
            ['order_id' => $order1->id, 'product_id' => $prod1->id],
            [
                'product_name' => $prod1->name,
                'unit' => $prod1->unit,
                'unit_price' => $prod1->price,
                'quantity' => 2.00,
                'subtotal' => round((float) $prod1->price * 2, 2),
            ]
        );

        OrderItem::updateOrCreate(
            ['order_id' => $order1->id, 'product_id' => $prod2->id],
            [
                'product_name' => $prod2->name,
                'unit' => $prod2->unit,
                'unit_price' => $prod2->price,
                'quantity' => 1.00,
                'subtotal' => round((float) $prod2->price * 1, 2),
            ]
        );

        // 2. Ready for pickup order
        $order2 = Order::updateOrCreate(
            ['order_code' => 'ML-2026-F01-8842'],
            [
                'customer_id' => $customer2->id,
                'farmer_id' => $farmer1->id,
                'market_id' => $market1->id,
                'pickup_date' => $nextSaturday,
                'pickup_start_time' => '09:00:00',
                'pickup_end_time' => '09:30:00',
                'status' => Order::STATUS_READY,
                'total_amount' => round((float) $prod1->price * 2, 2),
                'note' => 'Will bring own canvas tote bag.',
                'cutoff_at' => Carbon::parse($nextSaturday)->subHours(12),
                'accepted_at' => Carbon::now()->subHours(2),
                'ready_at' => Carbon::now()->subMinutes(15),
            ]
        );

        OrderItem::updateOrCreate(
            ['order_id' => $order2->id, 'product_id' => $prod1->id],
            [
                'product_name' => $prod1->name,
                'unit' => $prod1->unit,
                'unit_price' => $prod1->price,
                'quantity' => 2.00,
                'subtotal' => round((float) $prod1->price * 2, 2),
            ]
        );
    }
}
