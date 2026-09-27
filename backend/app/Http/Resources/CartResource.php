<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Cart
 */
class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $items = $this->items ?? collect();

        $totalQuantity = 0.0;
        $subtotal = 0.0;

        foreach ($items as $item) {
            $price = $item->product ? (float) $item->product->price : 0.0;
            $qty = (float) $item->quantity;
            $totalQuantity += $qty;
            $subtotal += round($price * $qty, 2);
        }

        // Group items by farmer stall
        $stalls = $items->groupBy(static function ($item) {
            return $item->product?->farmer_id ?? 0;
        })->map(function ($farmerItems, $farmerId) {
            $firstItem = $farmerItems->first();
            $farmer = $firstItem?->product?->farmer;

            $stallSubtotal = $farmerItems->sum(static function ($item): float {
                $p = $item->product ? (float) $item->product->price : 0.0;

                return round($p * (float) $item->quantity, 2);
            });

            return [
                'farmer_id' => (int) $farmerId,
                'stall_name' => $farmer?->stall_name ?? 'Farm Stall',
                'contact_person' => $farmer?->contact_person,
                'contact_phone' => $farmer?->contact_phone,
                'address' => $farmer?->address,
                'logo' => $farmer?->logo,
                'stall_subtotal' => round($stallSubtotal, 2),
                'markets' => $farmer && $farmer->relationLoaded('markets')
                    ? $farmer->markets->map(static function ($market): array {
                        return [
                            'id' => $market->id,
                            'name' => $market->name,
                            'address' => $market->address,
                            'stall_location' => $market->pivot?->stall_location,
                            'pickup_days' => $market->pivot?->pickup_days ?? [],
                            'pickup_start_time' => $market->pivot?->pickup_start_time ? substr((string) $market->pivot->pickup_start_time, 0, 5) : null,
                            'pickup_end_time' => $market->pivot?->pickup_end_time ? substr((string) $market->pivot->pickup_end_time, 0, 5) : null,
                            'slot_minutes' => $market->pivot?->slot_minutes,
                            'cutoff_hours' => $market->pivot?->cutoff_hours,
                        ];
                    })
                    : [],
                'items' => CartItemResource::collection($farmerItems),
            ];
        })->values();

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'total_items_count' => $items->count(),
            'total_quantity' => round($totalQuantity, 2),
            'subtotal' => round($subtotal, 2),
            'stalls' => $stalls,
            'items' => CartItemResource::collection($items),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
