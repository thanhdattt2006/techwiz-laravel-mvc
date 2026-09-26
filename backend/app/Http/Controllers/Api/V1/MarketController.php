<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Market\StoreMarketRequest;
use App\Http\Requests\Market\UpdateMarketRequest;
use App\Http\Resources\MarketResource;
use App\Models\Market;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MarketController extends Controller
{
    use ApiResponse;

    /**
     * List all markets with optional filters (search, day_of_week, status).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Market::with(['schedules'])->withCount('farmers');

        // By default, public visitors only see active markets
        if ($request->filled('status') && $request->user()?->isAdmin()) {
            if ($request->status !== 'all') {
                $query->where('status', $request->status);
            }
        } else {
            $query->where('status', Market::STATUS_ACTIVE);
        }

        // Search by market name or address
        if ($request->filled('search')) {
            $search = trim((string) $request->search);
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Filter by schedule day of week (0 = Sunday ... 6 = Saturday)
        if ($request->filled('day_of_week')) {
            $dayOfWeek = (int) $request->day_of_week;
            $query->whereHas('schedules', function ($q) use ($dayOfWeek): void {
                $q->where('day_of_week', $dayOfWeek);
            });
        }

        $markets = $query->orderBy('name')->get();

        return $this->successResponse(
            MarketResource::collection($markets),
            'Markets retrieved successfully.'
        );
    }

    /**
     * Get detailed information of a specific market including schedules and registered farmer stalls.
     */
    public function show(int $id): JsonResponse
    {
        $market = Market::with([
            'schedules',
            'farmers' => function ($query): void {
                $query->whereNull('farmers.deleted_at');
            },
        ])->withCount('farmers')->find($id);

        if (! $market) {
            return $this->errorResponse('Market not found.', 404);
        }

        return $this->successResponse(
            new MarketResource($market),
            'Market details retrieved successfully.'
        );
    }

    /**
     * Create a new farmers market along with operating schedules (Admin only).
     */
    public function store(StoreMarketRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $market = DB::transaction(function () use ($validated): Market {
            $market = Market::create([
                'name' => $validated['name'],
                'address' => $validated['address'],
                'latitude' => $validated['latitude'],
                'longitude' => $validated['longitude'],
                'map_provider' => $validated['map_provider'] ?? 'osm',
                'map_embed_url' => $validated['map_embed_url'] ?? null,
                'description' => $validated['description'] ?? null,
                'image' => $validated['image'] ?? null,
                'status' => $validated['status'] ?? Market::STATUS_ACTIVE,
            ]);

            if (! empty($validated['schedules'])) {
                foreach ($validated['schedules'] as $schedule) {
                    $market->schedules()->create([
                        'day_of_week' => $schedule['day_of_week'],
                        'open_time' => $schedule['open_time'],
                        'close_time' => $schedule['close_time'],
                    ]);
                }
            }

            return $market->load('schedules')->loadCount('farmers');
        });

        return $this->successResponse(
            new MarketResource($market),
            'Market created successfully.',
            201
        );
    }

    /**
     * Update existing market details and operating schedules (Admin only).
     */
    public function update(UpdateMarketRequest $request, int $id): JsonResponse
    {
        $market = Market::find($id);

        if (! $market) {
            return $this->errorResponse('Market not found.', 404);
        }

        $validated = $request->validated();

        $market = DB::transaction(function () use ($market, $validated): Market {
            $market->update(collect($validated)->except('schedules')->toArray());

            if (array_key_exists('schedules', $validated)) {
                $market->schedules()->delete();

                if (! empty($validated['schedules'])) {
                    foreach ($validated['schedules'] as $schedule) {
                        $market->schedules()->create([
                            'day_of_week' => $schedule['day_of_week'],
                            'open_time' => $schedule['open_time'],
                            'close_time' => $schedule['close_time'],
                        ]);
                    }
                }
            }

            return $market->load('schedules')->loadCount('farmers');
        });

        return $this->successResponse(
            new MarketResource($market),
            'Market updated successfully.'
        );
    }

    /**
     * Soft delete a market (Admin only).
     */
    public function destroy(int $id): JsonResponse
    {
        $market = Market::find($id);

        if (! $market) {
            return $this->errorResponse('Market not found.', 404);
        }

        $market->delete();

        return $this->successResponse(
            null,
            'Market deleted successfully.'
        );
    }
}
