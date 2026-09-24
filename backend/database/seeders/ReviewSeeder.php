<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $order = Order::where('order_code', 'ML-2026-F01-7711')->first();
        $customer = User::where('username', 'customer')->first();

        if (! $order || ! $customer) {
            return;
        }

        $orderItem = $order->items()->first();
        if (! $orderItem) {
            return;
        }

        // Review on product with Farmer reply
        Review::updateOrCreate(
            [
                'customer_id' => $customer->id,
                'order_id' => $order->id,
                'product_id' => $orderItem->product_id,
            ],
            [
                'farmer_id' => null,
                'rating' => 5,
                'comment' => 'The heirloom tomatoes were bursting with garden-fresh flavor! Beautiful colors and perfectly ripe.',
                'farmer_reply' => 'Thank you so much David! We picked those early Saturday morning just for our pre-order baskets.',
                'farmer_replied_at' => Carbon::now()->subDays(6),
                'is_hidden' => false,
            ]
        );

        // Review on Farmer stall
        Review::updateOrCreate(
            [
                'customer_id' => $customer->id,
                'order_id' => $order->id,
                'farmer_id' => $order->farmer_id,
            ],
            [
                'product_id' => null,
                'rating' => 5,
                'comment' => 'Green Valley Organics always has the cleanest stall and the friendliest family staff at Lincoln Park market!',
                'farmer_reply' => null,
                'farmer_replied_at' => null,
                'is_hidden' => false,
            ]
        );
    }
}
