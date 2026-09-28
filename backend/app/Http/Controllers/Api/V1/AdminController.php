<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectFarmerRequest;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use App\Http\Resources\ContactMessageResource;
use App\Http\Resources\FarmerResource;
use App\Http\Resources\UserResource;
use App\Models\ContactMessage;
use App\Models\Farmer;
use App\Models\Notification;
use App\Models\User;
use App\Services\AdminAnalyticsService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    use ApiResponse;

    /**
     * Get platform overview statistics (Admin).
     * Delegated to AdminAnalyticsService for SRP compliance.
     */
    public function overviewStats(AdminAnalyticsService $analyticsService): JsonResponse
    {
        return $this->successResponse(
            $analyticsService->getOverviewStats(),
            'Platform overview statistics retrieved successfully.'
        );
    }

    /**
     * List all platform users with filtering and search (Admin).
     */
    public function users(Request $request): JsonResponse
    {
        $query = User::with('farmer');

        if ($request->filled('role')) {
            $query->where('role', (string) $request->query('role'));
        }

        if ($request->filled('status')) {
            $query->where('status', (string) $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(static function ($q) use ($search): void {
                $q->where('fullname', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->latest('created_at')->get();

        return $this->successResponse(
            UserResource::collection($users),
            'Users retrieved successfully.'
        );
    }

    /**
     * Update account status of a user (Admin).
     */
    public function updateUserStatus(UpdateUserStatusRequest $request, int $id): JsonResponse
    {
        if ($id === $request->user()->id) {
            return $this->errorResponse('You cannot modify your own account status.', 422);
        }

        $user = User::with('farmer')->find($id);

        if (! $user) {
            return $this->errorResponse('User not found.', 404);
        }

        $user->status = (string) $request->status;
        $user->save();

        return $this->successResponse(
            new UserResource($user),
            'User status updated successfully.'
        );
    }

    /**
     * List pending farmer applications awaiting approval (Admin).
     */
    public function pendingFarmers(): JsonResponse
    {
        $farmers = Farmer::with('user')
            ->whereHas('user', static function ($q): void {
                $q->where('status', User::STATUS_PENDING);
            })
            ->latest('created_at')
            ->get();

        return $this->successResponse(
            FarmerResource::collection($farmers),
            'Pending farmer applications retrieved successfully.'
        );
    }

    /**
     * Approve a pending farmer stall application (Admin).
     */
    public function approveFarmer(int $id): JsonResponse
    {
        $farmer = Farmer::with('user')->find($id);

        if (! $farmer || ! $farmer->user) {
            return $this->errorResponse('Farmer stall application not found.', 404);
        }

        $farmer->user->status = User::STATUS_ACTIVE;
        $farmer->user->save();

        Notification::create([
            'user_id' => $farmer->user_id,
            'type' => 'farmer_approved',
            'title' => 'Stall Registration Approved',
            'message' => 'Congratulations! Your farm stall registration has been approved. You can now link markets and sell produce.',
            'is_read' => false,
        ]);

        return $this->successResponse(
            new FarmerResource($farmer),
            'Farmer stall approved successfully.'
        );
    }

    /**
     * Reject a pending farmer stall application (Admin).
     */
    public function rejectFarmer(RejectFarmerRequest $request, int $id): JsonResponse
    {
        $farmer = Farmer::with('user')->find($id);

        if (! $farmer || ! $farmer->user) {
            return $this->errorResponse('Farmer stall application not found.', 404);
        }

        $farmer->user->status = User::STATUS_INACTIVE;
        $farmer->user->save();

        Notification::create([
            'user_id' => $farmer->user_id,
            'type' => 'farmer_rejected',
            'title' => 'Stall Registration Declined',
            'message' => "Your farm stall registration was not approved. Reason: {$request->reason}",
            'is_read' => false,
        ]);

        return $this->successResponse(
            new FarmerResource($farmer),
            'Farmer stall application rejected.'
        );
    }

    /**
     * List contact inquiries sent by visitors (Admin).
     */
    public function inquiries(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(static function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->latest('created_at')->get();

        return $this->successResponse(
            ContactMessageResource::collection($inquiries),
            'Inquiries retrieved successfully.'
        );
    }

    /**
     * Mark an inquiry as handled / read (Admin).
     */
    public function markInquiryRead(int $id): JsonResponse
    {
        $message = ContactMessage::find($id);

        if (! $message) {
            return $this->errorResponse('Inquiry not found.', 404);
        }

        $message->is_read = true;
        $message->save();

        return $this->successResponse(
            new ContactMessageResource($message),
            'Inquiry marked as read.'
        );
    }
}
