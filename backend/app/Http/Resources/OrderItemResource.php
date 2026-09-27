<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\OrderItem
 */
class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'unit' => $this->unit,
            'unit_price' => (float) $this->unit_price,
            'quantity' => (float) $this->quantity,
            'subtotal' => (float) $this->subtotal,
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'image' => $this->product->image,
                    'category_id' => $this->product->category_id,
                    'category_name' => $this->product->category?->name,
                ];
            }),
        ];
    }
}
