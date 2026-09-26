<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\LinkMarketRequest;
use App\Http\Requests\Farmer\UpdateFarmerMarketRequest;
use App\Http\Requests\Farmer\UpdateStallRequest;
use App\Http\Resources\FarmerMarketResource;
use App\Http\Resources\FarmerResource;
use App\Models\Farmer;
use App\Models\FarmerMarket;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FarmerController extends Controller
{
    use ApiResponse;

    /**
     * List all active farmer stalls with optional search, sorting and market filtering (Public).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Farmer::whereHas('user', function ($q): void {
            $q->where('status', User::STATUS_ACTIVE);
        })->with(['markets' => function ($q): void {
            $q->wherePivot('is_active', true);
        }]);

        // Search by stall name, contact person or address
        if ($request->filled('search')) {
            $search = trim((string) $request->search);
            $query->where(function ($q) use ($search): void {
                $q->where('stall_name', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Filter by market participation
        if ($request->filled('market_id')) {
            $marketId = (int) $request->market_id;
            $query->whereHas('markets', function ($q) use ($marketId): void {
                $q->where('markets.id', $marketId);
            });
        }

        // Sort results
        $sortBy = (string) $request->query('sort_by', 'avg_rating');
        if ($sortBy === 'stall_name') {
            $query->orderBy('stall_name', 'asc');
        } elseif ($sortBy === 'review_count') {
            $query->orderBy('review_count', 'desc');
        } else {
            $query->orderBy('avg_rating', 'desc');
        }

        $farmers = $query->get();

        return $this->successResponse(
            FarmerResource::collection($farmers),
            'Farmers retrieved successfully.'
        );
    }

    /**
     * Get detailed public information for a single farmer stall including markets and listed products.
     */
    public function show(int $id): JsonResponse
    {
        $farmer = Farmer::whereHas('user', function ($q): void {
            $q->where('status', User::STATUS_ACTIVE);
        })->with([
            'markets',
            'products' => function ($q): void {
                $q->where('is_hidden', false);
            },
            'reviews',
        ])->find($id);

        if (! $farmer) {
            return $this->errorResponse('Farmer stall not found.', 404);
        }

        return $this->successResponse(
            new FarmerResource($farmer),
            'Farmer details retrieved successfully.'
        );
    }

    /**
     * Get the authenticated farmer's own stall profile (Farmer only).
     */
    public function profile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $farmer = $user->farmer()->with(['markets'])->first();

        if (! $farmer) {
            return $this->errorResponse('Farmer profile not found for this account.', 404);
        }

        return $this->successResponse(
            new FarmerResource($farmer),
            'Farmer profile retrieved successfully.'
        );
    }

    /**
     * Update the authenticated farmer's stall profile (Farmer only).
     */
    public function updateProfile(UpdateStallRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $farmer = $user->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer profile not found for this account.', 404);
        }

        $farmer->update($request->validated());

        return $this->successResponse(
            new FarmerResource($farmer->fresh(['markets'])),
            'Farmer stall updated successfully.'
        );
    }

    /**
     * Get all markets where the authenticated farmer is registered to sell (Farmer only).
     */
    public function markets(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $farmer = $user->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer profile not found for this account.', 404);
        }

        $farmerMarkets = $farmer->farmerMarkets()->with('market.schedules')->get();

        return $this->successResponse(
            FarmerMarketResource::collection($farmerMarkets),
            'Farmer market stalls retrieved successfully.'
        );
    }

    /**
     * Register the stall to sell at a new farmers market (Farmer only).
     */
    public function linkMarket(LinkMarketRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $farmer = $user->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer profile not found for this account.', 404);
        }

        $validated = $request->validated();

        $alreadyLinked = FarmerMarket::where('farmer_id', $farmer->id)
            ->where('market_id', $validated['market_id'])
            ->exists();

        if ($alreadyLinked) {
            return $this->errorResponse('Your stall is already registered at this market.', 422, [
                'market_id' => ['Your stall is already registered at this market.'],
            ]);
        }

        $farmerMarket = FarmerMarket::create([
            'farmer_id' => $farmer->id,
            'market_id' => $validated['market_id'],
            'stall_location' => $validated['stall_location'] ?? null,
            'pickup_days' => $validated['pickup_days'],
            'pickup_start_time' => $validated['pickup_start_time'],
            'pickup_end_time' => $validated['pickup_end_time'],
            'slot_minutes' => $validated['slot_minutes'] ?? 30,
            'cutoff_hours' => $validated['cutoff_hours'] ?? 12,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return $this->successResponse(
            new FarmerMarketResource($farmerMarket->load('market')),
            'Stall linked to market successfully.',
            201
        );
    }

    /**
     * Update stall pickup schedule and slot configuration at a specific market (Farmer only).
     */
    public function updateMarket(UpdateFarmerMarketRequest $request, int $marketId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $farmer = $user->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer profile not found for this account.', 404);
        }

        $farmerMarket = FarmerMarket::where('farmer_id', $farmer->id)
            ->where('market_id', $marketId)
            ->first();

        if (! $farmerMarket) {
            return $this->errorResponse('Market link not found for your stall.', 404);
        }

        $farmerMarket->update($request->validated());

        return $this->successResponse(
            new FarmerMarketResource($farmerMarket->load('market')),
            'Stall market configuration updated successfully.'
        );
    }

    /**
     * Unlink/withdraw the stall from selling at a market (Farmer only).
     */
    public function unlinkMarket(Request $request, int $marketId): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $farmer = $user->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer profile not found for this account.', 404);
        }

        $farmerMarket = FarmerMarket::where('farmer_id', $farmer->id)
            ->where('market_id', $marketId)
            ->first();

        if (! $farmerMarket) {
            return $this->errorResponse('Market link not found for your stall.', 404);
        }

        $farmerMarket->delete();

        return $this->successResponse(
            null,
            'Stall unregistered from market successfully.'
        );
    }
}
