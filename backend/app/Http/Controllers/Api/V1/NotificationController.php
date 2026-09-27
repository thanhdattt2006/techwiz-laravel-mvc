<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    /**
     * Get authenticated user's in-app notifications with unread count (Protected).
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $unreadCount = Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        $totalCount = Notification::where('user_id', $userId)->count();

        $query = Notification::with('order')
            ->where('user_id', $userId);

        if ($request->boolean('unread_only')) {
            $query->where('is_read', false);
        }

        $notifications = $query->latest('created_at')->get();

        return $this->successResponse([
            'unread_count' => $unreadCount,
            'total_count' => $totalCount,
            'notifications' => NotificationResource::collection($notifications),
        ], 'In-app notifications retrieved successfully.');
    }

    /**
     * Mark a single notification as read (Protected).
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)->find($id);

        if (! $notification) {
            return $this->errorResponse('Notification not found.', 404);
        }

        $notification->is_read = true;
        $notification->save();

        return $this->successResponse(
            new NotificationResource($notification),
            'Notification marked as read.'
        );
    }

    /**
     * Mark all unread notifications as read (Protected).
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return $this->successResponse(
            null,
            'All notifications marked as read.'
        );
    }
}
