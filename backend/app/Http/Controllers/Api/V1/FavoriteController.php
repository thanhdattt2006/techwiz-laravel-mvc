<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Favorite\ToggleFavoriteRequest;
use App\Http\Resources\FavoriteResource;
use App\Models\Farmer;
use App\Models\Favorite;
use App\Models\Market;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    use ApiResponse;

    /**
     * List authenticated customer's favorited items (Customer).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Favorite::with('favoritable')
            ->where('user_id', $request->user()->id);

        if ($request->filled('type')) {
            $query->where('favoritable_type', (string) $request->query('type'));
        }

        $favorites = $query->latest('created_at')->get();

        return $this->successResponse(
            FavoriteResource::collection($favorites),
            'Favorites retrieved successfully.'
        );
    }

    /**
     * Toggle favorite status on a farmer, product, or market (Customer).
     */
    public function toggle(ToggleFavoriteRequest $request): JsonResponse
    {
        $type = (string) $request->favoritable_type;
        $id = (int) $request->favoritable_id;

        // Verify target existence
        $targetExists = match ($type) {
            'farmer' => Farmer::where('id', $id)->exists(),
            'product' => Product::where('id', $id)->exists(),
            'market' => Market::where('id', $id)->exists(),
            default => false,
        };

        if (! $targetExists) {
            return $this->errorResponse('The item to favorite was not found.', 404);
        }

        $userId = $request->user()->id;
        $existing = Favorite::where('user_id', $userId)
            ->where('favoritable_type', $type)
            ->where('favoritable_id', $id)
            ->first();

        if ($existing) {
            $existing->delete();

            return $this->successResponse(
                [
                    'is_favorited' => false,
                    'favoritable_type' => $type,
                    'favoritable_id' => $id,
                ],
                'Removed from favorites successfully.'
            );
        }

        $favorite = Favorite::create([
            'user_id' => $userId,
            'favoritable_type' => $type,
            'favoritable_id' => $id,
        ]);

        $favorite->load('favoritable');

        return $this->successResponse(
            [
                'is_favorited' => true,
                'favorite' => new FavoriteResource($favorite),
            ],
            'Added to favorites successfully.',
            201
        );
    }
}
