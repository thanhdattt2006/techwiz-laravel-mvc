<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Farmer;
use App\Models\Product;
use App\Models\Review;

class RatingCalculationService
{
    /**
     * Recalculate average rating and review count for a product.
     */
    public function recalculateProductRating(int $productId): void
    {
        $stats = Review::where('product_id', $productId)
            ->where('is_hidden', false)
            ->selectRaw('COUNT(*) as total_count, AVG(rating) as avg_score')
            ->first();

        $product = Product::find($productId);
        if ($product) {
            $product->review_count = (int) ($stats->total_count ?? 0);
            $product->avg_rating = $stats->avg_score !== null ? round((float) $stats->avg_score, 2) : 0.00;
            $product->save();
        }
    }

    /**
     * Recalculate average rating and review count for a farmer stall.
     */
    public function recalculateFarmerRating(int $farmerId): void
    {
        $stats = Review::where('farmer_id', $farmerId)
            ->where('is_hidden', false)
            ->selectRaw('COUNT(*) as total_count, AVG(rating) as avg_score')
            ->first();

        $farmer = Farmer::find($farmerId);
        if ($farmer) {
            $farmer->review_count = (int) ($stats->total_count ?? 0);
            $farmer->avg_rating = $stats->avg_score !== null ? round((float) $stats->avg_score, 2) : 0.00;
            $farmer->save();
        }
    }

    /**
     * Trigger recalculation based on a review instance.
     */
    public function recalculateForReview(Review $review): void
    {
        if ($review->product_id !== null) {
            $this->recalculateProductRating((int) $review->product_id);
        }

        if ($review->farmer_id !== null) {
            $this->recalculateFarmerRating((int) $review->farmer_id);
        }
    }
}
