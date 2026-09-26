<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Filters\ProductFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    /**
     * List all public products with dynamic filters (Public).
     */
    public function index(ProductFilter $filter): JsonResponse
    {
        $products = Product::with(['category', 'farmer.markets'])
            ->publicCatalog()
            ->filter($filter)
            ->get();

        return $this->successResponse(
            ProductResource::collection($products),
            'Products retrieved successfully.'
        );
    }

    /**
     * Get single product details (Public).
     */
    public function show(int $id, Request $request): JsonResponse
    {
        $product = Product::with([
            'category',
            'farmer.markets',
            'reviews' => function ($q): void {
                $q->where('is_hidden', false)->with('customer');
            },
        ])->find($id);

        if (! $product) {
            return $this->errorResponse('Product not found.', 404);
        }

        // Check if product is hidden and user is not admin or owner farmer
        if ($product->is_hidden) {
            $user = $request->user();
            $isOwner = $user && $user->isFarmer() && $user->farmer?->id === $product->farmer_id;
            $isAdmin = $user && $user->isAdmin();

            if (! $isAdmin && ! $isOwner) {
                return $this->errorResponse('Product not found or has been hidden by moderators.', 404);
            }
        }

        return $this->successResponse(
            new ProductResource($product),
            'Product details retrieved successfully.'
        );
    }

    /**
     * List products owned by the authenticated farmer with dynamic filters (Farmer).
     */
    public function farmerProducts(Request $request, ProductFilter $filter): JsonResponse
    {
        $farmer = $request->user()?->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer stall profile not found.', 404);
        }

        $products = Product::with(['category'])
            ->where('farmer_id', $farmer->id)
            ->filter($filter)
            ->get();

        return $this->successResponse(
            ProductResource::collection($products),
            'Farmer products retrieved successfully.'
        );
    }

    /**
     * Store a new product for the authenticated farmer's stall (Farmer).
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $farmer = $request->user()?->farmer;

        if (! $farmer) {
            return $this->errorResponse('Farmer stall profile not found.', 404);
        }

        $data = $request->validated();
        $data['farmer_id'] = $farmer->id;
        $data['stock_quantity'] = $data['stock_quantity'] ?? 0;
        $data['availability'] = $data['availability'] ?? Product::AVAILABILITY_AVAILABLE;
        $data['is_hidden'] = false;

        $product = Product::create($data);
        $product->load(['category', 'farmer']);

        return $this->successResponse(
            new ProductResource($product),
            'Product created successfully.',
            201
        );
    }

    /**
     * Update an existing product (Farmer).
     */
    public function update(UpdateProductRequest $request, int $id): JsonResponse
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
            return $this->errorResponse('You do not have permission to modify this product.', 403);
        }

        $product->update($request->validated());
        $product->load(['category', 'farmer']);

        return $this->successResponse(
            new ProductResource($product),
            'Product updated successfully.'
        );
    }

    /**
     * Soft delete an existing product (Farmer).
     */
    public function destroy(int $id, Request $request): JsonResponse
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
            return $this->errorResponse('You do not have permission to delete this product.', 403);
        }

        $product->delete();

        return $this->successResponse(
            new ProductResource($product),
            'Product deleted successfully.'
        );
    }

    /**
     * Toggle visibility of a product for moderation (Admin).
     */
    public function toggleHide(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->errorResponse('Product not found.', 404);
        }

        $product->is_hidden = ! $product->is_hidden;
        $product->save();

        $message = $product->is_hidden
            ? 'Product has been hidden from the public catalog.'
            : 'Product is now visible in the public catalog.';

        return $this->successResponse(
            new ProductResource($product),
            $message
        );
    }
}
