<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customer = User::where('username', 'customer')->first();
        $order = Order::where('order_code', 'ML-2026-F01-7711')->first();

        if (! $customer) {
            return;
        }

        Notification::updateOrCreate(
            ['user_id' => $customer->id, 'title' => 'Pre-Order Ready for Pickup!'],
            [
                'type' => 'order_ready',
                'message' => 'Your pre-order #ML-2026-F01-7711 was completed. Thank you for supporting local family farmers!',
                'order_id' => $order ? $order->id : null,
                'is_read' => true,
            ]
        );

        Notification::updateOrCreate(
            ['user_id' => $customer->id, 'title' => 'Market Day Tomorrow: Lincoln Park'],
            [
                'type' => 'market_reminder',
                'message' => 'Gates open tomorrow at 7:00 AM. Stop by Stall A-12 to explore fresh Saturday harvest picks.',
                'order_id' => null,
                'is_read' => false,
            ]
        );
    }
}
