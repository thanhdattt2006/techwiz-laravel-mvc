<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\ReplyReviewRequest;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Farmer;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Review;
use App\Services\RatingCalculationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReviewController extends Controller
{
    use ApiResponse;

    /**
     * Submit a rating and review for a completed order item or farmer stall (Customer).
     */
    public function store(StoreReviewRequest $request, RatingCalculationService $ratingService): JsonResponse
    {
        $review = Review::create([
            'customer_id' => $request->user()->id,
            'order_id' => (int) $request->order_id,
            'farmer_id' => $request->filled('farmer_id') ? (int) $request->farmer_id : null,
            'product_id' => $request->filled('product_id') ? (int) $request->product_id : null,
            'rating' => (int) $request->rating,
            'comment' => $request->comment,
            'is_hidden' => false,
        ]);

        $ratingService->recalculateForReview($review);

        $review->load(['customer', 'farmer', 'product']);

        return $this->successResponse(
            new ReviewResource($review),
            'Review submitted successfully.',
            201
        );
    }

    /**
     * Get public customer reviews for a produce item (Public).
     */
    public function productReviews(int $productId): JsonResponse
    {
        $product = Product::find($productId);
        if (! $product) {
            return $this->errorResponse('Produce item not found.', 404);
        }

        $reviews = Review::with(['customer'])
            ->where('product_id', $productId)
            ->where('is_hidden', false)
            ->latest('created_at')
            ->get();

        return $this->successResponse(
            ReviewResource::collection($reviews),
            'Produce reviews retrieved successfully.'
        );
    }

    /**
     * Get public customer reviews for a farmer stall (Public).
     */
    public function farmerReviews(int $farmerId): JsonResponse
    {
        $farmer = Farmer::find($farmerId);
        if (! $farmer) {
            return $this->errorResponse('Farmer stall not found.', 404);
        }

        $reviews = Review::with(['customer'])
            ->where('farmer_id', $farmerId)
            ->where('is_hidden', false)
            ->latest('created_at')
            ->get();

        return $this->successResponse(
            ReviewResource::collection($reviews),
            'Farmer stall reviews retrieved successfully.'
        );
    }

    /**
     * Respond to a customer review on a produce item (Farmer).
     */
    public function reply(ReplyReviewRequest $request, int $id): JsonResponse
    {
        $farmer = $request->user()->farmer;
        if (! $farmer) {
            return $this->errorResponse('Farmer stall profile not found.', 404);
        }

        $review = Review::with('product')->find($id);
        if (! $review) {
            return $this->errorResponse('Review not found.', 404);
        }

        if ($review->product_id === null || ! $review->product) {
            return $this->errorResponse('Farmers can only reply to reviews left on specific produce items.', 422);
        }

        if ($review->product->farmer_id !== $farmer->id) {
            return $this->errorResponse('You do not have permission to reply to reviews on this produce item.', 403);
        }

        $review->farmer_reply = $request->farmer_reply;
        $review->farmer_replied_at = Carbon::now();
        $review->save();

        Notification::create([
            'user_id' => $review->customer_id,
            'type' => 'review_reply',
            'title' => 'Farmer Replied to Your Review',
            'message' => "The stall responded to your review on '{$review->product->name}'.",
            'order_id' => $review->order_id,
            'is_read' => false,
        ]);

        $review->load(['customer', 'product']);

        return $this->successResponse(
            new ReviewResource($review),
            'Response submitted successfully.'
        );
    }

    /**
     * Moderate a review by toggling visibility (Admin).
     */
    public function toggleHide(Request $request, int $id, RatingCalculationService $ratingService): JsonResponse
    {
        $review = Review::find($id);
        if (! $review) {
            return $this->errorResponse('Review not found.', 404);
        }

        $review->is_hidden = ! $review->is_hidden;
        $review->save();

        $ratingService->recalculateForReview($review);

        $statusMsg = $review->is_hidden
            ? 'Review has been hidden from public display.'
            : 'Review is now visible to the public.';

        return $this->successResponse(
            new ReviewResource($review),
            $statusMsg
        );
    }
}
