<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\FarmerMarket
 */
class FarmerMarketResource extends JsonResource
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
            'market_id' => $this->market_id,
            'market_name' => $this->market?->name,
            'stall_location' => $this->stall_location,
            'pickup_days' => $this->pickup_days ?? [],
            'pickup_start_time' => $this->pickup_start_time ? substr((string) $this->pickup_start_time, 0, 5) : null,
            'pickup_end_time' => $this->pickup_end_time ? substr((string) $this->pickup_end_time, 0, 5) : null,
            'slot_minutes' => $this->slot_minutes,
            'cutoff_hours' => $this->cutoff_hours,
            'is_active' => (bool) $this->is_active,
            'market' => new MarketResource($this->whenLoaded('market')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
