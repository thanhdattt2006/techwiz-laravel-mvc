<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Send a standardized success JSON response.
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successResponse(mixed $data = null, string $message = '', int $statusCode = 200): JsonResponse
    {
        return new JsonResponse([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'errors' => null,
        ], $statusCode);
    }

    /**
     * Send a standardized error JSON response.
     *
     * @param string $message
     * @param int $statusCode
     * @param mixed $errors
     * @return JsonResponse
     */
    protected function errorResponse(string $message = '', int $statusCode = 400, mixed $errors = null): JsonResponse
    {
        return new JsonResponse([
            'success' => false,
            'message' => $message,
            'data' => null,
            'errors' => $errors,
        ], $statusCode);
    }
}
