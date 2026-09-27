<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CancelOrderRequest;
use App\Http\Requests\Order\CheckoutPreOrderRequest;
use App\Http\Requests\Order\DeclineOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\FarmerMarket;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\PreOrderCheckoutService;
use App\Services\TimeSlotGeneratorService;
use App\Traits\ApiResponse;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    use ApiResponse;

    /**
     * Checkout shopping cart into stall-separated pre-orders (Customer).
     */
    public function checkout(CheckoutPreOrderRequest $request, PreOrderCheckoutService $checkoutService): JsonResponse
    {
        try {
            $createdOrders = $checkoutService->checkout($request->user(), $request->validated());

            return $this->successResponse(
                OrderResource::collection(collect($createdOrders)),
                'Pre-order placed successfully.',
                201
            );
        } catch (DomainException $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * List authenticated customer's pre-orders (Customer).
     */
    public function myOrders(Request $request): JsonResponse
    {
        $query = Order::with(['items.product', 'farmer.markets', 'market'])
            ->where('customer_id', $request->user()->id);

        if ($request->filled('status')) {
            $query->where('status', (string) $request->query('status'));
        }

        $orders = $query->latest('created_at')->get();

        return $this->successResponse(
            OrderResource::collection($orders),
            'My pre-orders retrieved successfully.'
        );
    }

    /**
     * View specific order details for authenticated customer (Customer).
     */
    public function showMyOrder(Request $request, int $id): JsonResponse
    {
        $query = Order::with(['items.product', 'farmer.markets', 'market', 'customer']);

        if ($request->user()->role !== User::ROLE_ADMIN) {
            $query->where('customer_id', $request->user()->id);
        }

        $order = $query->find($id);

        if (! $order) {
            return $this->errorResponse('Order not found.', 404);
        }

        return $this->successResponse(
            new OrderResource($order),
            'Order details retrieved successfully.'
        );
    }

    /**
     * Publicly track pre-order status at stall via unique order code (Public).
     */
    public function track(string $orderCode): JsonResponse
    {
        $order = Order::with(['items.product', 'farmer.markets', 'market'])
            ->where('order_code', $orderCode)
            ->first();

        if (! $order) {
            return $this->errorResponse('Order not found with the provided code.', 404);
        }

        return $this->successResponse(
            new OrderResource($order),
            'Order tracking details retrieved successfully.'
        );
    }

    /**
     * Cancel an active pre-order prior to cutoff deadline (Customer).
     */
    public function cancel(CancelOrderRequest $request, int $id): JsonResponse
    {
        $query = Order::with(['items', 'farmer', 'market']);
        if ($request->user()->role !== User::ROLE_ADMIN) {
            $query->where('customer_id', $request->user()->id);
        }

        $order = $query->find($id);
        if (! $order) {
            return $this->errorResponse('Order not found.', 404);
        }

        if (! $order->canBeCancelled()) {
            if (Carbon::now()->gte($order->cutoff_at)) {
                return $this->errorResponse(
                    "Order cannot be cancelled after the cutoff time ({$order->cutoff_at->format('Y-m-d H:i')}).",
                    422
                );
            }

            return $this->errorResponse(
                "Order with status '{$order->status}' cannot be cancelled.",
                422
            );
        }

        DB::transaction(function () use ($order, $request): void {
            $order->status = Order::STATUS_CANCELLED;
            $order->cancelled_at = Carbon::now();
            $order->cancel_reason = $request->cancel_reason ?? 'Cancelled by customer';
            $order->save();

            // Restock produce quantities with row locking
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

            // Send In-app Notification to Farmer
            if ($order->farmer && $order->farmer->user_id) {
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

        $order->load(['items.product', 'farmer.markets', 'market', 'customer']);

        return $this->successResponse(
            new OrderResource($order),
            'Order cancelled successfully and produce returned to stall stock.'
        );
    }

    /**
     * List incoming pre-orders for the authenticated farmer stall (Farmer).
     */
    public function farmerOrders(Request $request): JsonResponse
    {
        $farmer = $request->user()->farmer;
        if (! $farmer) {
            return $this->errorResponse('Farmer stall profile not found.', 404);
        }

        $query = Order::with(['items.product', 'farmer.markets', 'market', 'customer'])
            ->where('farmer_id', $farmer->id);

        if ($request->filled('status')) {
            $query->where('status', (string) $request->query('status'));
        }

        if ($request->filled('market_id')) {
            $query->where('market_id', (int) $request->query('market_id'));
        }

        if ($request->filled('pickup_date')) {
            $query->whereDate('pickup_date', (string) $request->query('pickup_date'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(static function ($q) use ($search): void {
                $q->where('order_code', 'like', "%{$search}%")
                    ->orWhereHas('customer', static function ($userQ) use ($search): void {
                        $userQ->where('fullname', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->latest('created_at')->get();

        return $this->successResponse(
            OrderResource::collection($orders),
            'Farmer incoming pre-orders retrieved successfully.'
        );
    }

    /**
     * Accept a pending placed pre-order (Farmer).
     */
    public function accept(Request $request, int $id): JsonResponse
    {
        $farmer = $request->user()->farmer;
        $order = Order::with(['items.product', 'market', 'customer'])
            ->where('farmer_id', $farmer->id)
            ->find($id);

        if (! $order) {
            return $this->errorResponse('Order not found.', 404);
        }

        if ($order->status !== Order::STATUS_PLACED) {
            return $this->errorResponse(
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

        return $this->successResponse(
            new OrderResource($order),
            'Order accepted successfully.'
        );
    }

    /**
     * Decline a pre-order with mandatory reason and restock inventory (Farmer).
     */
    public function decline(DeclineOrderRequest $request, int $id): JsonResponse
    {
        $farmer = $request->user()->farmer;
        $order = Order::with(['items.product', 'market', 'customer'])
            ->where('farmer_id', $farmer->id)
            ->find($id);

        if (! $order) {
            return $this->errorResponse('Order not found.', 404);
        }

        if (! in_array($order->status, [Order::STATUS_PLACED, Order::STATUS_ACCEPTED], true)) {
            return $this->errorResponse(
                "Cannot decline an order with status '{$order->status}'.",
                422
            );
        }

        DB::transaction(function () use ($order, $request): void {
            $order->status = Order::STATUS_DECLINED;
            $order->cancelled_at = Carbon::now();
            $order->cancel_reason = $request->cancel_reason;
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
                'message' => "Your pre-order #{$order->order_code} was declined by the stall. Reason: {$request->cancel_reason}.",
                'order_id' => $order->id,
                'is_read' => false,
            ]);
        });

        $order->load(['items.product', 'market', 'customer']);

        return $this->successResponse(
            new OrderResource($order),
            'Order declined and produce restocked successfully.'
        );
    }

    /**
     * Mark pre-order as packaged and ready for stall pickup (Farmer).
     */
    public function ready(Request $request, int $id): JsonResponse
    {
        $farmer = $request->user()->farmer;
        $order = Order::with(['items.product', 'market', 'customer'])
            ->where('farmer_id', $farmer->id)
            ->find($id);

        if (! $order) {
            return $this->errorResponse('Order not found.', 404);
        }

        if (! in_array($order->status, [Order::STATUS_PLACED, Order::STATUS_ACCEPTED], true)) {
            return $this->errorResponse(
                "Cannot mark order as ready from status '{$order->status}'.",
                422
            );
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

        return $this->successResponse(
            new OrderResource($order),
            'Order marked as ready for pickup.'
        );
    }

    /**
     * Complete order when customer collects produce and settles cash at stall (Farmer).
     */
    public function complete(Request $request, int $id): JsonResponse
    {
        $farmer = $request->user()->farmer;
        $order = Order::with(['items.product', 'market', 'customer'])
            ->where('farmer_id', $farmer->id)
            ->find($id);

        if (! $order) {
            return $this->errorResponse('Order not found.', 404);
        }

        if (! in_array($order->status, [Order::STATUS_READY, Order::STATUS_ACCEPTED], true)) {
            return $this->errorResponse(
                "Only orders that are ready or accepted can be completed. Current status: '{$order->status}'.",
                422
            );
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

        return $this->successResponse(
            new OrderResource($order),
            'Order completed successfully. Payment settled in cash at stall.'
        );
    }

    /**
     * Generate available pickup slots for stall pickup (Public/Customer helper).
     */
    public function getPickupSlots(Request $request, TimeSlotGeneratorService $slotService): JsonResponse
    {
        $validated = $request->validate([
            'farmer_id' => ['required', 'integer', 'exists:farmers,id'],
            'market_id' => ['required', 'integer', 'exists:markets,id'],
            'pickup_date' => ['required', 'date_format:Y-m-d'],
        ]);

        $farmerMarket = FarmerMarket::where('farmer_id', (int) $validated['farmer_id'])
            ->where('market_id', (int) $validated['market_id'])
            ->where('is_active', true)
            ->first();

        if (! $farmerMarket) {
            return $this->successResponse(
                ['slots' => []],
                'No active operating schedule found for this stall at the selected market.'
            );
        }

        $slots = $slotService->generateSlots($farmerMarket, (string) $validated['pickup_date']);

        return $this->successResponse(
            ['slots' => $slots],
            'Pickup time slots generated successfully.'
        );
    }
}
