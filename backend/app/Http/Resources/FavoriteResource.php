<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Farmer;
use App\Models\Market;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Favorite
 */
class FavoriteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $favoritableData = null;
        if ($this->relationLoaded('favoritable') && $this->favoritable) {
            $item = $this->favoritable;

            if ($item instanceof Farmer) {
                $favoritableData = [
                    'id' => $item->id,
                    'stall_name' => $item->stall_name,
                    'contact_person' => $item->contact_person,
                    'address' => $item->address,
                    'avg_rating' => (float) $item->avg_rating,
                    'review_count' => (int) $item->review_count,
                    'logo' => $item->logo,
                ];
            } elseif ($item instanceof Product) {
                $favoritableData = [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => (float) $item->price,
                    'unit' => $item->unit,
                    'image' => $item->image,
                    'availability' => $item->availability,
                    'farmer_id' => $item->farmer_id,
                    'farmer_name' => $item->farmer?->stall_name,
                ];
            } elseif ($item instanceof Market) {
                $favoritableData = [
                    'id' => $item->id,
                    'name' => $item->name,
                    'address' => $item->address,
                    'city' => $item->city,
                    'latitude' => (float) $item->latitude,
                    'longitude' => (float) $item->longitude,
                    'image' => $item->image,
                ];
            }
        }

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'favoritable_type' => $this->favoritable_type,
            'favoritable_id' => $this->favoritable_id,
            'item' => $favoritableData,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
