<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use ApiResponse;

    /**
     * List all categories with active product count (Public).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::withCount(['products' => function ($q): void {
            $q->where('is_hidden', false)
                ->where('availability', '!=', Product::AVAILABILITY_UNAVAILABLE);
        }]);

        // Admins can filter by status or view all
        if ($request->filled('status') && $request->user()?->isAdmin()) {
            if ($request->status !== 'all') {
                $query->where('is_active', (bool) $request->status);
            }
        } else {
            $query->where('is_active', true);
        }

        $categories = $query->orderBy('name', 'asc')->get();

        return $this->successResponse(
            CategoryResource::collection($categories),
            'Categories retrieved successfully.'
        );
    }

    /**
     * Get single category details (Public).
     */
    public function show(int $id): JsonResponse
    {
        $category = Category::withCount(['products' => function ($q): void {
            $q->where('is_hidden', false)
                ->where('availability', '!=', Product::AVAILABILITY_UNAVAILABLE);
        }])->find($id);

        if (! $category) {
            return $this->errorResponse('Category not found.', 404);
        }

        return $this->successResponse(
            new CategoryResource($category),
            'Category details retrieved successfully.'
        );
    }

    /**
     * Store a new category (Admin).
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $data['is_active'] = $data['is_active'] ?? true;

        $category = Category::create($data);
        $category->products_count = 0;

        return $this->successResponse(
            new CategoryResource($category),
            'Category created successfully.',
            201
        );
    }

    /**
     * Update an existing category (Admin).
     */
    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = Category::find($id);

        if (! $category) {
            return $this->errorResponse('Category not found.', 404);
        }

        $data = $request->validated();

        if (isset($data['name']) && empty($data['slug']) && ! array_key_exists('slug', $data)) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);
        $category->loadCount(['products' => function ($q): void {
            $q->where('is_hidden', false)
                ->where('availability', '!=', Product::AVAILABILITY_UNAVAILABLE);
        }]);

        return $this->successResponse(
            new CategoryResource($category),
            'Category updated successfully.'
        );
    }

    /**
     * Delete a category (Admin).
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::find($id);

        if (! $category) {
            return $this->errorResponse('Category not found.', 404);
        }

        if ($category->products()->count() > 0) {
            return $this->errorResponse(
                'Cannot delete category with associated products. Reassign or delete the products first.',
                422
            );
        }

        $category->delete();

        return $this->successResponse(
            null,
            'Category deleted successfully.'
        );
    }
}
