<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\FarmerMarket;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Order
 */
class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $startTime = substr((string) $this->pickup_start_time, 0, 5);
        $endTime = substr((string) $this->pickup_end_time, 0, 5);

        // Calculate stall location at this market
        $stallLocation = null;
        if ($this->relationLoaded('farmer') && $this->farmer && $this->farmer->relationLoaded('markets')) {
            $marketPivot = $this->farmer->markets->firstWhere('id', $this->market_id);
            $stallLocation = $marketPivot?->pivot?->stall_location;
        }

        if ($stallLocation === null && $this->farmer_id && $this->market_id) {
            $stallLocation = FarmerMarket::where('farmer_id', $this->farmer_id)
                ->where('market_id', $this->market_id)
                ->value('stall_location');
        }

        $items = $this->relationLoaded('items') ? $this->items : collect();
        $totalQuantity = $items->sum(static fn ($item): float => (float) $item->quantity);

        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'customer_id' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', function () {
                return [
                    'id' => $this->customer->id,
                    'fullname' => $this->customer->fullname,
                    'email' => $this->customer->email,
                    'phone' => $this->customer->phone,
                ];
            }),
            'farmer_id' => $this->farmer_id,
            'farmer' => $this->whenLoaded('farmer', function () {
                return [
                    'id' => $this->farmer->id,
                    'stall_name' => $this->farmer->stall_name,
                    'contact_person' => $this->farmer->contact_person,
                    'contact_phone' => $this->farmer->contact_phone,
                    'address' => $this->farmer->address,
                    'logo' => $this->farmer->logo,
                ];
            }),
            'market_id' => $this->market_id,
            'market' => $this->whenLoaded('market', function () {
                return [
                    'id' => $this->market->id,
                    'name' => $this->market->name,
                    'address' => $this->market->address,
                    'latitude' => (float) $this->market->latitude,
                    'longitude' => (float) $this->market->longitude,
                ];
            }),
            'stall_location' => $stallLocation,
            'pickup_date' => $this->pickup_date ? $this->pickup_date->format('Y-m-d') : null,
            'pickup_start_time' => $startTime,
            'pickup_end_time' => $endTime,
            'pickup_time_slot' => "{$startTime} - {$endTime}",
            'status' => $this->status,
            'total_amount' => (float) $this->total_amount,
            'items_count' => $items->count(),
            'total_quantity' => round($totalQuantity, 2),
            'note' => $this->note,
            'cancel_reason' => $this->cancel_reason,
            'cutoff_at' => $this->cutoff_at?->toISOString(),
            'accepted_at' => $this->accepted_at?->toISOString(),
            'ready_at' => $this->ready_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'can_be_cancelled' => $this->canBeCancelled(),
            'items' => OrderItemResource::collection($items),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
