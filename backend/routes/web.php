<?php

declare(strict_types=1);

use App\Http\Controllers\DatabaseMaintenanceController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/demo', [DemoController::class, 'index'])->name('demo');

// Health check endpoint for Uptime / Cron Ping (keeps Render awake every 13 minutes)
Route::get('/health', [HealthController::class, 'index'])->name('health');

// Database maintenance console (migrate, migrate:fresh, migrate:rollback)
Route::prefix('db-maintenance')->name('db.maintenance.')->group(function (): void {
    Route::get('/', [DatabaseMaintenanceController::class, 'index'])->name('index');
    Route::post('/migrate', [DatabaseMaintenanceController::class, 'migrate'])
        ->middleware('throttle:5,1')
        ->name('migrate');
    Route::post('/fresh', [DatabaseMaintenanceController::class, 'fresh'])
        ->middleware('throttle:5,1')
        ->name('fresh');
    Route::post('/rollback', [DatabaseMaintenanceController::class, 'rollback'])
        ->middleware('throttle:5,1')
        ->name('rollback');
});
