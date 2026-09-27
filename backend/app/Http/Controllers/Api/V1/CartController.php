<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;

    /**
     * Get the authenticated customer's shopping cart grouped by stall (Customer).
     */
    public function index(Request $request): JsonResponse
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $this->loadCartRelations($cart);

        return $this->successResponse(
            new CartResource($cart),
            'Shopping cart retrieved successfully.'
        );
    }

    /**
     * Add an item to the shopping cart with stock validation (Customer).
     */
    public function addItem(AddCartItemRequest $request): JsonResponse
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $product = Product::find($request->product_id);

        if (! $product) {
            return $this->errorResponse('Product not found.', 404);
        }

        if ($product->is_hidden || $product->availability === Product::AVAILABILITY_UNAVAILABLE) {
            return $this->errorResponse('This produce item is currently unavailable for purchase.', 422);
        }

        if ($product->availability === Product::AVAILABILITY_SOLD_OUT || (float) $product->stock_quantity <= 0) {
            return $this->errorResponse('This produce item is currently sold out.', 422);
        }

        $requestedQty = (float) $request->quantity;

        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        $totalRequestedQty = $existingItem ? ((float) $existingItem->quantity + $requestedQty) : $requestedQty;

        if ($totalRequestedQty > (float) $product->stock_quantity) {
            return $this->errorResponse(
                "Requested quantity ({$totalRequestedQty}) exceeds available stock ({$product->stock_quantity}).",
                422
            );
        }

        if ($existingItem) {
            $existingItem->quantity = $totalRequestedQty;
            $existingItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $totalRequestedQty,
            ]);
        }

        $this->loadCartRelations($cart);

        return $this->successResponse(
            new CartResource($cart),
            'Item added to cart successfully.',
            201
        );
    }

    /**
     * Update the quantity of a specific cart item (Customer).
     */
    public function updateItem(UpdateCartItemRequest $request, int $id): JsonResponse
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $cartItem = CartItem::where('id', $id)->where('cart_id', $cart->id)->first();

        if (! $cartItem) {
            return $this->errorResponse('Cart item not found.', 404);
        }

        $product = $cartItem->product;
        $newQty = (float) $request->quantity;

        if (! $product || $product->is_hidden || $product->availability === Product::AVAILABILITY_UNAVAILABLE) {
            return $this->errorResponse('This produce item is no longer available.', 422);
        }

        if ($newQty > (float) $product->stock_quantity) {
            return $this->errorResponse(
                "Requested quantity ({$newQty}) exceeds available stock ({$product->stock_quantity}).",
                422
            );
        }

        $cartItem->quantity = $newQty;
        $cartItem->save();

        $this->loadCartRelations($cart);

        return $this->successResponse(
            new CartResource($cart),
            'Cart item updated successfully.'
        );
    }

    /**
     * Remove a single item from the cart (Customer).
     */
    public function removeItem(Request $request, int $id): JsonResponse
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $cartItem = CartItem::where('id', $id)->where('cart_id', $cart->id)->first();

        if (! $cartItem) {
            return $this->errorResponse('Cart item not found.', 404);
        }

        $cartItem->delete();
        $this->loadCartRelations($cart);

        return $this->successResponse(
            new CartResource($cart),
            'Item removed from cart successfully.'
        );
    }

    /**
     * Clear all items from the shopping cart (Customer).
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $cart->items()->delete();
        $this->loadCartRelations($cart);

        return $this->successResponse(
            new CartResource($cart),
            'Cart cleared successfully.'
        );
    }

    /**
     * Eager load necessary relationships for stall grouping and zero N+1 queries.
     */
    private function loadCartRelations(Cart $cart): void
    {
        $cart->load([
            'items.product.farmer.markets',
            'items.product.category',
        ]);
    }
}
