<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use DomainException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PreOrderCheckoutService
{
    /**
     * Checkout pre-orders for stall pickup, splitting into multiple orders per farmer stall.
     *
     * @param  array<string, mixed>  $data
     * @return array<int, Order>
     *
     * @throws DomainException
     */
    public function checkout(User $customer, array $data): array
    {
        $marketId = (int) $data['market_id'];
        $pickupDate = (string) $data['pickup_date'];
        $pickupStartTime = substr((string) $data['pickup_start_time'], 0, 5);
        $pickupEndTime = substr((string) $data['pickup_end_time'], 0, 5);
        $note = isset($data['note']) && $data['note'] !== null ? (string) $data['note'] : null;
        $farmerIdFilter = isset($data['farmer_id']) && $data['farmer_id'] !== null ? (int) $data['farmer_id'] : null;

        $cart = Cart::with(['items.product.farmer'])->where('user_id', $customer->id)->first();
        if (! $cart || $cart->items->isEmpty()) {
            throw new DomainException('Your shopping cart is empty.');
        }

        $items = $cart->items;
        if ($farmerIdFilter !== null) {
            $items = $items->filter(static fn ($item): bool => $item->product && $item->product->farmer_id === $farmerIdFilter);
            if ($items->isEmpty()) {
                throw new DomainException('No items found in your shopping cart for the selected farmer stall.');
            }
        }

        // Group items by farmer stall
        $groupedByFarmer = $items->groupBy(static fn ($item): int => (int) ($item->product?->farmer_id ?? 0));

        // Pre-validate stall eligibility, market participation, pickup days and cutoff times
        $pickupDateCarbon = Carbon::parse($pickupDate);
        $dayOfWeek = $pickupDateCarbon->dayOfWeek; // 0 = Sunday, 6 = Saturday
        $slotStartCarbon = Carbon::parse("{$pickupDate} {$pickupStartTime}");
        $now = Carbon::now();

        foreach ($groupedByFarmer as $farmerId => $stallItems) {
            $farmer = Farmer::with('user')->find($farmerId);
            if (! $farmer || ! $farmer->user || $farmer->user->status !== User::STATUS_ACTIVE) {
                throw new DomainException("The farmer stall #{$farmerId} is currently not active.");
            }

            $farmerMarket = FarmerMarket::where('farmer_id', $farmerId)
                ->where('market_id', $marketId)
                ->where('is_active', true)
                ->first();

            if (! $farmerMarket) {
                throw new DomainException("Stall '{$farmer->stall_name}' does not operate at the selected market.");
            }

            $pickupDays = $farmerMarket->pickup_days ?? [];
            if (! in_array($dayOfWeek, $pickupDays, true)) {
                $dayName = $pickupDateCarbon->format('l');
                throw new DomainException("Stall '{$farmer->stall_name}' is not open for pickup on {$dayName}.");
            }

            $cutoffHours = (int) $farmerMarket->cutoff_hours;
            $cutoffAt = $slotStartCarbon->copy()->subHours($cutoffHours);

            if ($now->gte($cutoffAt)) {
                throw new DomainException(
                    "The cutoff time for pickup at stall '{$farmer->stall_name}' has passed ({$cutoffAt->format('Y-m-d H:i')}). Orders must be placed at least {$cutoffHours} hours in advance."
                );
            }
        }

        // Execute transaction with row locking on inventory
        return DB::transaction(function () use (
            $customer,
            $groupedByFarmer,
            $marketId,
            $pickupDate,
            $pickupStartTime,
            $pickupEndTime,
            $note,
            $slotStartCarbon
        ): array {
            $createdOrders = [];
            $processedItemIds = [];

            foreach ($groupedByFarmer as $farmerId => $stallItems) {
                $farmer = Farmer::find($farmerId);
                $farmerMarket = FarmerMarket::where('farmer_id', $farmerId)
                    ->where('market_id', $marketId)
                    ->first();

                $cutoffHours = (int) ($farmerMarket?->cutoff_hours ?? 12);
                $cutoffAt = $slotStartCarbon->copy()->subHours($cutoffHours);

                $orderTotal = 0.0;
                $lockedProducts = [];

                foreach ($stallItems as $cartItem) {
                    $product = Product::where('id', $cartItem->product_id)->lockForUpdate()->first();

                    if (! $product || $product->is_hidden || $product->availability === Product::AVAILABILITY_UNAVAILABLE) {
                        $produceName = $cartItem->product?->name ?? 'Produce';
                        throw new DomainException("Produce '{$produceName}' is currently unavailable for purchase.");
                    }

                    $requestedQty = (float) $cartItem->quantity;
                    $availableStock = (float) $product->stock_quantity;

                    if ($availableStock < $requestedQty) {
                        throw new DomainException(
                            "Insufficient stock for '{$product->name}'. Available: {$availableStock}, Requested: {$requestedQty}."
                        );
                    }

                    $subtotal = round((float) $product->price * $requestedQty, 2);
                    $lockedProducts[] = [
                        'cart_item' => $cartItem,
                        'product' => $product,
                        'quantity' => $requestedQty,
                        'unit_price' => (float) $product->price,
                        'subtotal' => $subtotal,
                    ];

                    $orderTotal += $subtotal;
                }

                // Generate unique order code
                $year = date('Y');
                $prefix = 'ML-' . $year . '-F' . str_pad((string) $farmerId, 2, '0', STR_PAD_LEFT);
                do {
                    $randomStr = strtoupper(Str::random(5));
                    $orderCode = "{$prefix}-{$randomStr}";
                } while (Order::where('order_code', $orderCode)->exists());

                // Create Order record
                $order = Order::create([
                    'order_code' => $orderCode,
                    'customer_id' => $customer->id,
                    'farmer_id' => $farmerId,
                    'market_id' => $marketId,
                    'pickup_date' => $pickupDate,
                    'pickup_start_time' => $pickupStartTime,
                    'pickup_end_time' => $pickupEndTime,
                    'status' => Order::STATUS_PLACED,
                    'total_amount' => round($orderTotal, 2),
                    'note' => $note,
                    'cutoff_at' => $cutoffAt,
                ]);

                // Create OrderItem snapshots & deduct inventory
                foreach ($lockedProducts as $itemData) {
                    $product = $itemData['product'];
                    $qty = $itemData['quantity'];

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'unit' => $product->unit,
                        'unit_price' => $itemData['unit_price'],
                        'quantity' => $qty,
                        'subtotal' => $itemData['subtotal'],
                    ]);

                    $newStock = max(0.0, (float) $product->stock_quantity - $qty);
                    $product->stock_quantity = $newStock;
                    if ($newStock <= 0.0) {
                        $product->availability = Product::AVAILABILITY_SOLD_OUT;
                    }
                    $product->save();

                    $processedItemIds[] = $itemData['cart_item']->id;
                }

                // Send In-app Notification to Farmer
                if ($farmer && $farmer->user_id) {
                    Notification::create([
                        'user_id' => $farmer->user_id,
                        'type' => 'order_placed',
                        'title' => 'New Pre-Order Received',
                        'message' => "Customer {$customer->fullname} placed pre-order #{$orderCode} for pickup on {$pickupDate}.",
                        'order_id' => $order->id,
                        'is_read' => false,
                    ]);
                }

                $order->load(['items.product', 'farmer', 'market', 'customer']);
                $createdOrders[] = $order;
            }

            // Remove processed items from cart
            if (! empty($processedItemIds)) {
                CartItem::whereIn('id', $processedItemIds)->delete();
            }

            return $createdOrders;
        });
    }
}
