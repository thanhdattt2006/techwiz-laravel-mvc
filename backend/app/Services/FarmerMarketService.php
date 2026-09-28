<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Farmer;
use App\Models\FarmerMarket;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class FarmerMarketService
{
    /**
     * Get all market links for a given farmer with market schedules.
     *
     * @return Collection<int, FarmerMarket>
     */
    public function getFarmerMarkets(Farmer $farmer): Collection
    {
        return $farmer->farmerMarkets()->with('market.schedules')->get();
    }

    /**
     * Link stall to a farmers market.
     */
    public function linkMarket(Farmer $farmer, array $data): FarmerMarket
    {
        $alreadyLinked = FarmerMarket::where('farmer_id', $farmer->id)
            ->where('market_id', $data['market_id'])
            ->exists();

        if ($alreadyLinked) {
            throw ValidationException::withMessages([
                'market_id' => ['Your stall is already registered at this market.'],
            ]);
        }

        return FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $data['market_id'],
            'stall_location' => $data['stall_location'] ?? null,
            'pickup_days' => $data['pickup_days'],
            'pickup_start_time' => $data['pickup_start_time'],
            'pickup_end_time' => $data['pickup_end_time'],
            'slot_minutes' => $data['slot_minutes'] ?? 30,
            'cutoff_hours' => $data['cutoff_hours'] ?? 12,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    /**
     * Update stall pickup schedule and slot configuration at a specific market.
     */
    public function updateMarket(Farmer $farmer, int $marketId, array $data): ?FarmerMarket
    {
        $farmerMarket = FarmerMarket::where('farmer_id', $farmer->id)
            ->where('market_id', $marketId)
            ->first();

        if (! $farmerMarket) {
            return null;
        }

        $farmerMarket->update($data);

        return $farmerMarket;
    }

    /**
     * Unlink stall from a market.
     */
    public function unlinkMarket(Farmer $farmer, int $marketId): bool
    {
        $farmerMarket = FarmerMarket::where('farmer_id', $farmer->id)
            ->where('market_id', $marketId)
            ->first();

        if (! $farmerMarket) {
            return false;
        }

        return (bool) $farmerMarket->delete();
    }
}
