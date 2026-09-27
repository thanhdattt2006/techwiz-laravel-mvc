<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\CartItem
 */
class CartItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = $this->product;
        $price = $product ? (float) $product->price : 0.0;
        $qty = (float) $this->quantity;
        $subtotal = round($price * $qty, 2);
        $stock = $product ? (float) $product->stock_quantity : 0.0;

        return [
            'id' => $this->id,
            'cart_id' => $this->cart_id,
            'product_id' => $this->product_id,
            'product_name' => $product?->name ?? 'Unavailable Product',
            'product_image' => $product?->image,
            'unit_price' => $price,
            'unit' => $product?->unit ?? 'unit',
            'quantity' => $qty,
            'subtotal' => $subtotal,
            'stock_quantity' => $stock,
            'is_in_stock' => $product !== null && $stock >= $qty && ! $product->is_hidden && $product->availability !== 'unavailable',
            'farmer_id' => $product?->farmer_id,
            'stall_name' => $product?->farmer?->stall_name ?? 'Farm Stall',
            'category_name' => $product?->category?->name ?? 'Produce',
        ];
    }
}
