<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    /**
     * Check application and database health status.
     */
    public function index(): JsonResponse
    {
        $dbStatus = 'disconnected';
        $dbError = null;

        try {
            DB::connection()->getPdo();
            $dbStatus = 'connected';
        } catch (Throwable $e) {
            $dbError = $e->getMessage();
        }

        return new JsonResponse([
            'status' => 'ok. Now you can go back to: {https://techwiz-laravel-mvc.vercel.app/}'
        ]);
    }
}
