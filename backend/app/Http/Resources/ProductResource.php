<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Product
 */
class ProductResource extends JsonResource
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
            'farmer_id' => $this->farmer_id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'unit' => $this->unit,
            'stock_quantity' => (float) $this->stock_quantity,
            'availability' => $this->availability,
            'image' => $this->image,
            'is_hidden' => (bool) $this->is_hidden,
            'avg_rating' => (float) $this->avg_rating,
            'review_count' => (int) $this->review_count,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'slug' => $this->category->slug,
                    'description' => $this->category->description,
                ];
            }),
            'farmer' => $this->whenLoaded('farmer', function () {
                return [
                    'id' => $this->farmer->id,
                    'stall_name' => $this->farmer->stall_name,
                    'contact_person' => $this->farmer->contact_person,
                    'contact_phone' => $this->farmer->contact_phone,
                    'address' => $this->farmer->address,
                    'logo' => $this->farmer->logo,
                    'avg_rating' => (float) $this->farmer->avg_rating,
                    'review_count' => (int) $this->farmer->review_count,
                    'markets' => $this->when($this->farmer->relationLoaded('markets'), function () {
                        return $this->farmer->markets->map(function ($market) {
                            return [
                                'id' => $market->id,
                                'name' => $market->name,
                                'address' => $market->address,
                                'stall_location' => $market->pivot?->stall_location,
                            ];
                        });
                    }),
                ];
            }),
            'reviews' => $this->whenLoaded('reviews', function () {
                return $this->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => (int) $review->rating,
                        'comment' => $review->comment,
                        'farmer_reply' => $review->farmer_reply,
                        'customer_name' => $review->customer?->fullname,
                        'created_at' => $review->created_at?->toISOString(),
                    ];
                });
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
