<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Notification;
use App\Models\Order;
use App\Models\User;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CustomerOrderService
{
    /**
     * List authenticated customer's pre-orders with optional status filter.
     *
     * @return Collection<int, Order>
     */
    public function getCustomerOrders(User $customer, ?string $status = null): Collection
    {
        $query = Order::with(['items.product', 'farmer.markets', 'market'])
            ->where('customer_id', $customer->id);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->latest('created_at')->get();
    }

    /**
     * Get single pre-order detail for customer or admin.
     */
    public function getCustomerOrder(User $user, int $orderId): ?Order
    {
        $query = Order::with(['items.product', 'farmer.markets', 'market', 'customer']);

        if ($user->role !== User::ROLE_ADMIN) {
            $query->where('customer_id', $user->id);
        }

        return $query->find($orderId);
    }

    /**
     * Cancel an active pre-order before cutoff window and restore produce stock.
     *
     * @throws DomainException
     */
    public function cancelOrder(User $customer, int $orderId, ?string $reason = null): Order
    {
        $order = Order::with(['items', 'farmer'])
            ->where('customer_id', $customer->id)
            ->find($orderId);

        if (! $order) {
            throw new DomainException('Order not found.', 404);
        }

        if (! in_array($order->status, [Order::STATUS_PLACED, Order::STATUS_ACCEPTED], true)) {
            throw new DomainException("Cannot cancel an order with status '{$order->status}'.", 422);
        }

        if ($order->cutoff_at && Carbon::now()->greaterThanOrEqualTo($order->cutoff_at)) {
            throw new DomainException('Cannot cancel order after the cutoff time has passed.', 422);
        }

        DB::transaction(function () use ($order, $reason): void {
            $order->status = Order::STATUS_CANCELLED;
            $order->cancelled_at = Carbon::now();
            $order->cancel_reason = $reason ?? 'Cancelled by customer before cutoff.';
            $order->save();

            foreach ($order->items as $item) {
                DB::table('products')->where('id', $item->product_id)->increment('stock_quantity', $item->quantity);
            }

            if ($order->farmer?->user_id) {
                Notification::create([
                    'user_id' => $order->farmer->user_id,
                    'type' => 'order_cancelled',
                    'title' => 'Pre-Order Cancelled',
                    'message' => "Order #{$order->order_code} was cancelled by customer.",
                    'order_id' => $order->id,
                    'is_read' => false,
                ]);
            }
        });

        $order->load(['items.product', 'farmer.markets', 'market']);

        return $order;
    }
}
