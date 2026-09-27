<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\FarmerController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\MarketController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\WeeklyStockController;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/v1/health', function () {
    return response()->json([
        'success' => true,
        'status' => 'ok',
        'message' => 'TechWiz Web API is healthy and operational.',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Authentication & Profile routes under /api/v1/auth
Route::prefix('v1/auth')->group(function () {
    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register-farmer', [AuthController::class, 'registerFarmer']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes (requires Bearer token)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'profile']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Public Directory & Catalog routes (Markets, Farmers, Categories, Products)
Route::prefix('v1')->group(function () {
    Route::get('/markets', [MarketController::class, 'index']);
    Route::get('/markets/{id}', [MarketController::class, 'show']);
    Route::get('/farmers', [FarmerController::class, 'index']);
    Route::get('/farmers/{id}', [FarmerController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
});

// Farmer Protected routes (requires active farmer stall)
Route::prefix('v1/farmer')->middleware(['auth:sanctum', 'role:farmer', 'farmer.active'])->group(function () {
    Route::get('/profile', [FarmerController::class, 'profile']);
    Route::put('/profile', [FarmerController::class, 'updateProfile']);
    Route::get('/markets', [FarmerController::class, 'markets']);
    Route::post('/markets', [FarmerController::class, 'linkMarket']);
    Route::put('/markets/{marketId}', [FarmerController::class, 'updateMarket']);
    Route::delete('/markets/{marketId}', [FarmerController::class, 'unlinkMarket']);
    Route::get('/products', [ProductController::class, 'farmerProducts']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/products/{id}/template', [WeeklyStockController::class, 'getTemplates']);
    Route::put('/products/{id}/template', [WeeklyStockController::class, 'updateTemplates']);
    Route::post('/apply-weekly-templates', [WeeklyStockController::class, 'applyWeeklyTemplates']);
    Route::get('/orders', [OrderController::class, 'farmerOrders']);
    Route::patch('/orders/{id}/accept', [OrderController::class, 'accept']);
    Route::patch('/orders/{id}/decline', [OrderController::class, 'decline']);
    Route::patch('/orders/{id}/ready', [OrderController::class, 'ready']);
    Route::patch('/orders/{id}/complete', [OrderController::class, 'complete']);
    Route::post('/reviews/{id}/reply', [ReviewController::class, 'reply']);
});

// Customer Shopping Cart routes
Route::prefix('v1/cart')->middleware(['auth:sanctum', 'role:customer,admin'])->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/items', [CartController::class, 'addItem']);
    Route::put('/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/items/{id}', [CartController::class, 'removeItem']);
    Route::delete('/clear', [CartController::class, 'clear']);
});

// Customer Pre-Order routes & Public Tracking / Slots
Route::get('v1/orders/track/{orderCode}', [OrderController::class, 'track']);
Route::get('v1/orders/slots', [OrderController::class, 'getPickupSlots']);
Route::prefix('v1/orders')->middleware(['auth:sanctum', 'role:customer,admin'])->group(function () {
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::get('/my-orders/{id}', [OrderController::class, 'showMyOrder']);
    Route::patch('/{id}/cancel', [OrderController::class, 'cancel']);
});

// Admin Protected Management routes
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/markets', [MarketController::class, 'store']);
    Route::put('/markets/{id}', [MarketController::class, 'update']);
    Route::delete('/markets/{id}', [MarketController::class, 'destroy']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::patch('/products/{id}/toggle-hide', [ProductController::class, 'toggleHide']);
    Route::patch('/reviews/{id}/toggle-hide', [ReviewController::class, 'toggleHide']);
});

// Public Review routes
Route::get('v1/reviews/product/{productId}', [ReviewController::class, 'productReviews']);
Route::get('v1/reviews/farmer/{farmerId}', [ReviewController::class, 'farmerReviews']);

// Customer Protected Review routes
Route::prefix('v1/reviews')->middleware(['auth:sanctum', 'role:customer,admin'])->group(function () {
    Route::post('/', [ReviewController::class, 'store']);
});

// Customer Protected Favorite routes
Route::prefix('v1/favorites')->middleware(['auth:sanctum', 'role:customer,admin'])->group(function () {
    Route::get('/', [FavoriteController::class, 'index']);
    Route::post('/toggle', [FavoriteController::class, 'toggle']);
});
