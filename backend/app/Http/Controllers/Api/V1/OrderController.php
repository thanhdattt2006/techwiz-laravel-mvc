<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CancelOrderRequest;
use App\Http\Requests\Order\CheckoutPreOrderRequest;
use App\Http\Requests\Order\DeclineOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\FarmerMarket;
use App\Models\Order;
use App\Services\CustomerOrderService;
use App\Services\FarmerOrderService;
use App\Services\PreOrderCheckoutService;
use App\Services\TimeSlotGeneratorService;
use App\Traits\ApiResponse;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected FarmerOrderService $farmerOrderService,
        protected CustomerOrderService $customerOrderService
    ) {}

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
        $status = $request->filled('status') ? (string) $request->query('status') : null;
        $orders = $this->customerOrderService->getCustomerOrders($request->user(), $status);

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
        $order = $this->customerOrderService->getCustomerOrder($request->user(), $id);

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
            return $this->errorResponse('Order not found with provided tracking code.', 404);
        }

        return $this->successResponse(
            new OrderResource($order),
            'Order tracking status retrieved successfully.'
        );
    }

    /**
     * Cancel an active pre-order before cutoff window (Customer).
     */
    public function cancel(CancelOrderRequest $request, int $id): JsonResponse
    {
        try {
            $order = $this->customerOrderService->cancelOrder(
                $request->user(),
                $id,
                $request->cancel_reason
            );

            return $this->successResponse(
                new OrderResource($order),
                'Order cancelled and produce stock restored successfully.'
            );
        } catch (DomainException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode() ?: 422);
        }
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

        $orders = $this->farmerOrderService->getFarmerOrders($farmer, $request->all());

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
        return $this->handleFarmerOrderAction($request, fn($farmer) => $this->farmerOrderService->accept($farmer, $id), 'Order accepted successfully.');
    }

    public function decline(DeclineOrderRequest $request, int $id): JsonResponse
    {
        return $this->handleFarmerOrderAction(
            $request,
            fn($farmer) => $this->farmerOrderService->decline($farmer, $id, (string) $request->cancel_reason),
            'Order declined and produce restocked successfully.'
        );
    }

    public function ready(Request $request, int $id): JsonResponse
    {
        return $this->handleFarmerOrderAction($request, fn($farmer) => $this->farmerOrderService->ready($farmer, $id), 'Order marked as ready for pickup.');
    }

    public function complete(Request $request, int $id): JsonResponse
    {
        return $this->handleFarmerOrderAction(
            $request,
            fn($farmer) => $this->farmerOrderService->complete($farmer, $id),
            'Order completed successfully. Payment settled in cash at stall.'
        );
    }

    private function handleFarmerOrderAction(Request $request, callable $callback, string $successMessage): JsonResponse
    {
        $farmer = $request->user()->farmer;
        if (! $farmer) {
            return $this->errorResponse('Farmer stall profile not found.', 404);
        }

        try {
            $order = $callback($farmer);
            return $this->successResponse(new OrderResource($order), $successMessage);
        } catch (DomainException $e) {
            return $this->errorResponse($e->getMessage(), $e->getCode() ?: 422);
        }
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
            return $this->successResponse(['slots' => []], 'No active operating schedule found for this stall at the selected market.');
        }

        return $this->successResponse(
            ['slots' => $slotService->generateSlots($farmerMarket, (string) $validated['pickup_date'])],
            'Pickup time slots generated successfully.'
        );
    }
}
