<?php

declare(strict_types=1);

namespace App\Http\Requests\Review;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'farmer_id' => ['nullable', 'integer', 'exists:farmers,id'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Configure the validator instance with business logic checks.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v): void {
            $hasFarmer = $this->filled('farmer_id');
            $hasProduct = $this->filled('product_id');

            // 1. Exclusive OR (XOR) constraint
            if (($hasFarmer && $hasProduct) || (! $hasFarmer && ! $hasProduct)) {
                $v->errors()->add('target', 'You must review either a farmer stall or a produce item, not both or neither.');

                return;
            }

            // 2. Order verification
            $order = Order::find($this->order_id);
            if (! $order) {
                return;
            }

            if ($order->customer_id !== $this->user()?->id) {
                $v->errors()->add('order_id', 'This order does not belong to you.');

                return;
            }

            if ($order->status !== Order::STATUS_COMPLETED) {
                $v->errors()->add('order_id', 'You can only review completed orders.');

                return;
            }

            // 3. Match target with order contents
            if ($hasFarmer && (int) $this->farmer_id !== (int) $order->farmer_id) {
                $v->errors()->add('farmer_id', 'The selected farmer does not match the stall in this order.');

                return;
            }

            if ($hasProduct && ! $order->items()->where('product_id', (int) $this->product_id)->exists()) {
                $v->errors()->add('product_id', 'The selected produce item was not purchased in this order.');

                return;
            }

            // 4. Duplicate review prevention
            $exists = Review::where('customer_id', $this->user()?->id)
                ->where('order_id', $this->order_id)
                ->when($hasFarmer, fn ($q) => $q->where('farmer_id', (int) $this->farmer_id))
                ->when($hasProduct, fn ($q) => $q->where('product_id', (int) $this->product_id))
                ->exists();

            if ($exists) {
                $v->errors()->add('order_id', 'You have already submitted a review for this target in this order.');
            }
        });
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'order_id.required' => 'Please provide the order ID associated with this review.',
            'order_id.exists' => 'The specified order does not exist.',
            'rating.required' => 'Please provide a rating between 1 and 5 stars.',
            'rating.min' => 'Rating must be at least 1 star.',
            'rating.max' => 'Rating cannot exceed 5 stars.',
        ];
    }
}
