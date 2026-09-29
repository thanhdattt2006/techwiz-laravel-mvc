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

    public function overviewStats(AdminAnalyticsService $analyticsService): JsonResponse
    {
        return $this->successResponse($analyticsService->getOverviewStats(), 'Platform overview statistics retrieved successfully.');
    }

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
            $s = (string) $request->query('search');
            $query->where(fn ($q) => $q->where('fullname', 'like', "%{$s}%")
                ->orWhere('username', 'like', "%{$s}%")
                ->orWhere('email', 'like', "%{$s}%")
                ->orWhere('phone', 'like', "%{$s}%"));
        }

        return $this->successResponse(UserResource::collection($query->latest('created_at')->get()), 'Users retrieved successfully.');
    }

    public function updateUserStatus(UpdateUserStatusRequest $request, int $id): JsonResponse
    {
        if ($id === $request->user()->id) {
            return $this->errorResponse('You cannot modify your own account status.', 422);
        }
        $user = User::with('farmer')->find($id);
        if (! $user) {
            return $this->errorResponse('User not found.', 404);
        }

        $newStatus = (string) $request->status;
        $user->status = $newStatus;
        $user->save();

        if ($newStatus === User::STATUS_BANNED || $newStatus === User::STATUS_INACTIVE) {
            $user->tokens()->delete();
        }

        return $this->successResponse(new UserResource($user), 'User status updated successfully.');
    }

    public function pendingFarmers(): JsonResponse
    {
        $farmers = Farmer::with('user')
            ->whereHas('user', fn ($q) => $q->where('status', User::STATUS_PENDING))
            ->latest('created_at')->get();

        return $this->successResponse(FarmerResource::collection($farmers), 'Pending farmer applications retrieved successfully.');
    }

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

        return $this->successResponse(new FarmerResource($farmer), 'Farmer stall approved successfully.');
    }

    public function rejectFarmer(RejectFarmerRequest $request, int $id): JsonResponse
    {
        $farmer = Farmer::with('user')->find($id);
        if (! $farmer || ! $farmer->user) {
            return $this->errorResponse('Farmer stall application not found.', 404);
        }

        $farmer->user->status = User::STATUS_INACTIVE;
        $farmer->user->save();
        $farmer->user->tokens()->delete();

        Notification::create([
            'user_id' => $farmer->user_id,
            'type' => 'farmer_rejected',
            'title' => 'Stall Registration Declined',
            'message' => "Your farm stall registration was not approved. Reason: {$request->reason}",
            'is_read' => false,
        ]);

        return $this->successResponse(new FarmerResource($farmer), 'Farmer stall application rejected.');
    }

    public function inquiries(Request $request): JsonResponse
    {
        $query = ContactMessage::query();
        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }
        if ($request->filled('search')) {
            $s = (string) $request->query('search');
            $query->where(fn ($q) => $q->where('name', 'like', "%{$s}%")
                ->orWhere('email', 'like', "%{$s}%")
                ->orWhere('subject', 'like', "%{$s}%"));
        }

        return $this->successResponse(ContactMessageResource::collection($query->latest('created_at')->get()), 'Inquiries retrieved successfully.');
    }

    public function markInquiryRead(int $id): JsonResponse
    {
        $message = ContactMessage::find($id);
        if (! $message) {
            return $this->errorResponse('Inquiry not found.', 404);
        }

        $message->is_read = true;
        $message->save();

        return $this->successResponse(new ContactMessageResource($message), 'Inquiry marked as read.');
    }
}
