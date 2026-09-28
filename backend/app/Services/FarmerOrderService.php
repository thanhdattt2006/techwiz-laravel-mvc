<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Farmer;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class FarmerOrderService
{
    /**
     * Get incoming pre-orders matching filter query parameters.
     */
    public function getFarmerOrders(Farmer $farmer, array $filters = []): Collection
    {
        $query = Order::with(['items.product', 'farmer.markets', 'market', 'customer'])
            ->where('farmer_id', $farmer->id);

        if (! empty($filters['status'])) {
            $query->where('status', (string) $filters['status']);
        }

        if (! empty($filters['market_id'])) {
            $query->where('market_id', (int) $filters['market_id']);
        }

        if (! empty($filters['pickup_date'])) {
            $query->whereDate('pickup_date', (string) $filters['pickup_date']);
        }

        if (! empty($filters['search'])) {
            $search = (string) $filters['search'];
            $query->where(static function ($q) use ($search): void {
                $q->where('order_code', 'like', "%{$search}%")
                    ->orWhereHas('customer', static function ($userQ) use ($search): void {
                        $userQ->where('fullname', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        return $query->latest('created_at')->get();
    }

    /**
     * Accept a pending placed pre-order.
     */
    public function accept(Farmer $farmer, int $id): Order
    {
        $order = Order::with(['items.product', 'market', 'customer'])
            ->where('farmer_id', $farmer->id)
            ->find($id);

        if (! $order) {
            throw new DomainException('Order not found.', 404);
        }

        if ($order->status !== Order::STATUS_PLACED) {
            throw new DomainException(
                "Only orders with 'placed' status can be accepted. Current status is '{$order->status}'.",
                422
            );
        }

        $order->status = Order::STATUS_ACCEPTED;
        $order->accepted_at = Carbon::now();
        $order->save();

        Notification::create([
            'user_id' => $order->customer_id,
            'type' => 'order_accepted',
            'title' => 'Pre-Order Accepted',
            'message' => "The stall confirmed your pre-order #{$order->order_code}. It will be prepared for pickup on {$order->pickup_date->format('Y-m-d')}.",
            'order_id' => $order->id,
            'is_read' => false,
        ]);

        return $order;
    }

    /**
     * Decline a pre-order with mandatory reason and restock inventory.
     */
    public function decline(Farmer $farmer, int $id, string $cancelReason): Order
    {
        $order = Order::with(['items.product', 'market', 'customer'])
            ->where('farmer_id', $farmer->id)
            ->find($id);

        if (! $order) {
            throw new DomainException('Order not found.', 404);
        }

        if (! in_array($order->status, [Order::STATUS_PLACED, Order::STATUS_ACCEPTED], true)) {
            throw new DomainException("Cannot decline an order with status '{$order->status}'.", 422);
        }

        DB::transaction(function () use ($order, $cancelReason): void {
            $order->status = Order::STATUS_DECLINED;
            $order->cancelled_at = Carbon::now();
            $order->cancel_reason = $cancelReason;
            $order->save();

            // Restock produce items with row locking
            foreach ($order->items as $item) {
                $product = Product::where('id', $item->product_id)->lockForUpdate()->first();
                if ($product) {
                    $newStock = (float) $product->stock_quantity + (float) $item->quantity;
                    $product->stock_quantity = $newStock;
                    if ($product->availability === Product::AVAILABILITY_SOLD_OUT && $newStock > 0.0) {
                        $product->availability = Product::AVAILABILITY_AVAILABLE;
                    }
                    $product->save();
                }
            }

            Notification::create([
                'user_id' => $order->customer_id,
                'type' => 'order_declined',
                'title' => 'Pre-Order Declined',
                'message' => "Your pre-order #{$order->order_code} was declined by the stall. Reason: {$cancelReason}.",
                'order_id' => $order->id,
                'is_read' => false,
            ]);
        });

        $order->load(['items.product', 'market', 'customer']);

        return $order;
    }

    /**
     * Mark pre-order as packaged and ready for stall pickup.
     */
    public function ready(Farmer $farmer, int $id): Order
    {
        $order = Order::with(['items.product', 'market', 'customer'])
            ->where('farmer_id', $farmer->id)
            ->find($id);

        if (! $order) {
            throw new DomainException('Order not found.', 404);
        }

        if (! in_array($order->status, [Order::STATUS_PLACED, Order::STATUS_ACCEPTED], true)) {
            throw new DomainException("Cannot mark order as ready from status '{$order->status}'.", 422);
        }

        $order->status = Order::STATUS_READY;
        $order->ready_at = Carbon::now();
        $order->save();

        Notification::create([
            'user_id' => $order->customer_id,
            'type' => 'order_ready',
            'title' => 'Produce Ready for Pickup',
            'message' => "Your produce for pre-order #{$order->order_code} is packed and ready for pickup at {$order->market->name}.",
            'order_id' => $order->id,
            'is_read' => false,
        ]);

        return $order;
    }

    /**
     * Complete order when customer collects produce and settles cash at stall.
     */
    public function complete(Farmer $farmer, int $id): Order
    {
        $order = Order::with(['items.product', 'market', 'customer'])
            ->where('farmer_id', $farmer->id)
            ->find($id);

        if (! $order) {
            throw new DomainException('Order not found.', 404);
        }

        if (! in_array($order->status, [Order::STATUS_READY, Order::STATUS_ACCEPTED], true)) {
            throw new DomainException("Only orders that are ready or accepted can be completed. Current status: '{$order->status}'.", 422);
        }

        $order->status = Order::STATUS_COMPLETED;
        $order->completed_at = Carbon::now();
        $order->save();

        Notification::create([
            'user_id' => $order->customer_id,
            'type' => 'order_completed',
            'title' => 'Pre-Order Completed',
            'message' => "Order #{$order->order_code} completed. Thank you for shopping local! Please consider leaving a review.",
            'order_id' => $order->id,
            'is_read' => false,
        ]);

        return $order;
    }
}
