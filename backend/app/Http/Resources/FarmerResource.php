<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Farmer
 */
class FarmerResource extends JsonResource
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
            'user_id' => $this->user_id,
            'stall_name' => $this->stall_name,
            'contact_person' => $this->contact_person,
            'contact_phone' => $this->contact_phone,
            'address' => $this->address,
            'latitude' => $this->latitude !== null ? (float) $this->latitude : null,
            'longitude' => $this->longitude !== null ? (float) $this->longitude : null,
            'description' => $this->description,
            'logo' => $this->logo,
            'avg_rating' => (float) $this->avg_rating,
            'review_count' => (int) $this->review_count,
            'markets' => $this->when($this->relationLoaded('markets'), function () {
                return $this->markets->map(function ($market) {
                    return [
                        'id' => $market->id,
                        'name' => $market->name,
                        'address' => $market->address,
                        'latitude' => (float) $market->latitude,
                        'longitude' => (float) $market->longitude,
                        'map_provider' => $market->map_provider,
                        'stall_location' => $market->pivot?->stall_location,
                        'pickup_days' => $market->pivot?->pickup_days ?? [],
                        'pickup_start_time' => $market->pivot?->pickup_start_time ? substr((string) $market->pivot->pickup_start_time, 0, 5) : null,
                        'pickup_end_time' => $market->pivot?->pickup_end_time ? substr((string) $market->pivot->pickup_end_time, 0, 5) : null,
                        'slot_minutes' => $market->pivot?->slot_minutes,
                        'cutoff_hours' => $market->pivot?->cutoff_hours,
                        'is_active' => (bool) $market->pivot?->is_active,
                    ];
                });
            }),
            'products' => $this->when($this->relationLoaded('products'), function () {
                return $this->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'category_id' => $product->category_id,
                        'price' => (float) $product->price,
                        'unit' => $product->unit,
                        'stock_quantity' => (float) $product->stock_quantity,
                        'availability' => $product->availability,
                        'image' => $product->image,
                    ];
                });
            }),
            'reviews' => $this->when($this->relationLoaded('reviews'), function () {
                return $this->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'rating' => (int) $review->rating,
                        'comment' => $review->comment,
                        'created_at' => $review->created_at?->toISOString(),
                    ];
                });
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
