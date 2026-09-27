<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Review
 */
class ReviewResource extends JsonResource
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
            'customer_id' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', function () {
                return [
                    'id' => $this->customer->id,
                    'fullname' => $this->customer->fullname,
                ];
            }),
            'order_id' => $this->order_id,
            'farmer_id' => $this->farmer_id,
            'farmer' => $this->whenLoaded('farmer', function () {
                return [
                    'id' => $this->farmer->id,
                    'stall_name' => $this->farmer->stall_name,
                    'logo' => $this->farmer->logo,
                ];
            }),
            'product_id' => $this->product_id,
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'image' => $this->product->image,
                    'price' => (float) $this->product->price,
                    'unit' => $this->product->unit,
                ];
            }),
            'rating' => (int) $this->rating,
            'comment' => $this->comment,
            'farmer_reply' => $this->farmer_reply,
            'farmer_replied_at' => $this->farmer_replied_at?->toISOString(),
            'is_hidden' => (bool) $this->is_hidden,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
