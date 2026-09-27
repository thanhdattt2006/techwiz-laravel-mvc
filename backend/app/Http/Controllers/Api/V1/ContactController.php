<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    use ApiResponse;

    /**
     * Submit a contact inquiry (Public).
     */
    public function store(StoreContactRequest $request): JsonResponse
    {
        $message = ContactMessage::create([
            'name' => (string) $request->name,
            'email' => (string) $request->email,
            'subject' => (string) $request->subject,
            'message' => (string) $request->message,
            'is_read' => false,
        ]);

        return $this->successResponse(
            new ContactMessageResource($message),
            'Thank you for contacting us. Your message has been received.',
            201
        );
    }
}
