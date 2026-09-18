<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
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

// Authentication routes under /api/v1/auth
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});
