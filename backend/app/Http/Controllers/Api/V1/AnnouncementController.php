<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Announcement\StoreAnnouncementRequest;
use App\Http\Requests\Announcement\UpdateAnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    use ApiResponse;

    /**
     * Get active announcements for users and guests (Public / Role-aware).
     */
    public function active(Request $request): JsonResponse
    {
        $query = Announcement::with('author')
            ->where('is_active', true);

        // Check if caller is authenticated with token
        $user = $request->user('sanctum');

        if ($user) {
            if ($user->role !== User::ROLE_ADMIN) {
                $query->whereIn('target_role', [Announcement::TARGET_ALL, $user->role]);
            }
        } else {
            $roleFilter = (string) $request->query('role', '');
            if ($roleFilter === User::ROLE_FARMER) {
                $query->whereIn('target_role', [Announcement::TARGET_ALL, Announcement::TARGET_FARMER]);
            } else {
                $query->whereIn('target_role', [Announcement::TARGET_ALL, Announcement::TARGET_CUSTOMER]);
            }
        }

        $announcements = $query->latest('created_at')->get();

        return $this->successResponse(
            AnnouncementResource::collection($announcements),
            'Active announcements retrieved successfully.'
        );
    }

    /**
     * List all platform announcements for management (Admin).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Announcement::with('author');

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('target_role')) {
            $query->where('target_role', (string) $request->query('target_role'));
        }

        $announcements = $query->latest('created_at')->get();

        return $this->successResponse(
            AnnouncementResource::collection($announcements),
            'Announcements retrieved successfully.'
        );
    }

    /**
     * Publish a new platform announcement (Admin).
     */
    public function store(StoreAnnouncementRequest $request): JsonResponse
    {
        $announcement = Announcement::create([
            'created_by' => $request->user()->id,
            'title' => (string) $request->title,
            'content' => (string) $request->content,
            'target_role' => (string) $request->target_role,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
        ]);

        $announcement->load('author');

        return $this->successResponse(
            new AnnouncementResource($announcement),
            'Announcement created successfully.',
            201
        );
    }

    /**
     * Update an existing platform announcement (Admin).
     */
    public function update(UpdateAnnouncementRequest $request, int $id): JsonResponse
    {
        $announcement = Announcement::find($id);

        if (! $announcement) {
            return $this->errorResponse('Announcement not found.', 404);
        }

        $announcement->update($request->validated());
        $announcement->load('author');

        return $this->successResponse(
            new AnnouncementResource($announcement),
            'Announcement updated successfully.'
        );
    }

    /**
     * Delete an announcement (Admin).
     */
    public function destroy(int $id): JsonResponse
    {
        $announcement = Announcement::find($id);

        if (! $announcement) {
            return $this->errorResponse('Announcement not found.', 404);
        }

        $announcement->delete();

        return $this->successResponse(
            null,
            'Announcement deleted successfully.'
        );
    }
}
