<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('farmer_id')->nullable()->constrained('farmers')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating'); // 1 to 5
            $table->text('comment')->nullable();
            $table->text('farmer_reply')->nullable(); // Response from farmer for product review
            $table->timestamp('farmer_replied_at')->nullable();
            $table->boolean('is_hidden')->default(false); // Admin moderation
            $table->timestamps();
            $table->softDeletes();

            $table->check('rating >= 1 AND rating <= 5');
            $table->check('(farmer_id IS NULL AND product_id IS NOT NULL) OR (farmer_id IS NOT NULL AND product_id IS NULL)');
            $table->unique(['customer_id', 'order_id', 'farmer_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
