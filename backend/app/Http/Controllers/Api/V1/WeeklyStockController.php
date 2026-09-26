<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\DayOfWeek;
use App\Http\Controllers\Controller;
use App\Http\Requests\WeeklyStock\UpdateWeeklyStockRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\WeeklyStockTemplateResource;
use App\Models\Farmer;
use App\Models\Product;
use App\Models\WeeklyStockTemplate;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WeeklyStockController extends Controller
{
    use ApiResponse;

    /**
     * Get weekly stock templates for a specific product (Farmer).
     */
    public function getTemplates(int $id, Request $request): JsonResponse
    {
        $farmer = $request->user()?->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer stall profile not found.', 404);
        }

        $product = Product::find($id);

        if (! $product) {
            return $this->errorResponse('Product not found.', 404);
        }

        if ($product->farmer_id !== $farmer->id) {
            return $this->errorResponse('You do not have permission to view stock templates for this product.', 403);
        }

        $templates = $product->weeklyStockTemplates()
            ->orderBy('day_of_week', 'asc')
            ->get();

        return $this->successResponse(
            WeeklyStockTemplateResource::collection($templates),
            'Weekly stock templates retrieved successfully.'
        );
    }

    /**
     * Configure recurring weekly stock templates for a product (Farmer).
     */
    public function updateTemplates(UpdateWeeklyStockRequest $request, int $id): JsonResponse
    {
        $farmer = $request->user()?->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer stall profile not found.', 404);
        }

        $product = Product::find($id);

        if (! $product) {
            return $this->errorResponse('Product not found.', 404);
        }

        if ($product->farmer_id !== $farmer->id) {
            return $this->errorResponse('You do not have permission to update stock templates for this product.', 403);
        }

        $templatesData = $request->validated('templates');

        $updatedTemplates = DB::transaction(function () use ($product, $templatesData): array {
            $results = [];

            foreach ($templatesData as $item) {
                $template = WeeklyStockTemplate::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'day_of_week' => (int) $item['day_of_week'],
                    ],
                    [
                        'default_quantity' => (float) $item['default_quantity'],
                        'is_active' => $item['is_active'] ?? true,
                    ]
                );

                $results[] = $template;
            }

            return $results;
        });

        return $this->successResponse(
            WeeklyStockTemplateResource::collection(collect($updatedTemplates)),
            'Weekly stock templates updated successfully.'
        );
    }

    /**
     * 1-Click apply weekly stock templates for the upcoming market session (Farmer).
     */
    public function applyWeeklyTemplates(Request $request): JsonResponse
    {
        $farmer = $request->user()?->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer stall profile not found.', 404);
        }

        if ($request->filled('target_day')) {
            $targetDay = (int) $request->target_day;
        } elseif ($request->filled('target_date')) {
            $targetDay = Carbon::parse((string) $request->target_date)->dayOfWeek;
        } else {
            $targetDay = $this->determineUpcomingMarketDay($farmer);
        }

        $dayName = DayOfWeek::nameOf($targetDay);

        $updatedCount = DB::transaction(function () use ($farmer, $targetDay): int {
            $products = Product::where('farmer_id', $farmer->id)->get();
            $count = 0;

            foreach ($products as $product) {
                $template = WeeklyStockTemplate::where('product_id', $product->id)
                    ->where('day_of_week', $targetDay)
                    ->where('is_active', true)
                    ->first();

                if ($template) {
                    $qty = (float) $template->default_quantity;
                    $product->stock_quantity = $qty;
                    $product->availability = $qty > 0
                        ? Product::AVAILABILITY_AVAILABLE
                        : Product::AVAILABILITY_SOLD_OUT;
                    $product->save();
                    $count++;
                }
            }

            return $count;
        });

        $updatedProducts = Product::with(['category'])
            ->where('farmer_id', $farmer->id)
            ->get();

        return $this->successResponse([
            'target_day_of_week' => $targetDay,
            'day_name' => $dayName,
            'updated_products_count' => $updatedCount,
            'products' => ProductResource::collection($updatedProducts),
        ], "Weekly stock templates applied successfully for {$dayName}.");
    }

    /**
     * Determine the closest upcoming market session day of the week for the given farmer.
     */
    private function determineUpcomingMarketDay(Farmer $farmer): int
    {
        $activeMarkets = $farmer->farmerMarkets()
            ->where('is_active', true)
            ->get();

        $allPickupDays = [];

        foreach ($activeMarkets as $fm) {
            if (is_array($fm->pickup_days)) {
                foreach ($fm->pickup_days as $day) {
                    $allPickupDays[] = (int) $day;
                }
            }
        }

        $uniqueDays = array_values(array_unique($allPickupDays));

        if (empty($uniqueDays)) {
            // Default to Saturday if no active market days registered
            return DayOfWeek::Saturday->value;
        }

        $today = Carbon::now()->dayOfWeek;

        // Sort unique days by proximity to today: ($day - $today + 7) % 7
        usort($uniqueDays, static function (int $a, int $b) use ($today): int {
            $diffA = ($a - $today + 7) % 7;
            $diffB = ($b - $today + 7) % 7;

            return $diffA <=> $diffB;
        });

        return $uniqueDays[0];
    }
}
