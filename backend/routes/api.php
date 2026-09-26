<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
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
