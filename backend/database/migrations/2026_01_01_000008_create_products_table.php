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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained('farmers')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('unit', 20); // kg, bunch, box, jar, etc.
            $table->decimal('stock_quantity', 10, 2)->default(0.00);
            $table->enum('availability', ['available', 'sold_out', 'unavailable'])->default('available');
            $table->string('image', 255)->nullable();
            $table->boolean('is_hidden')->default(false); // Admin moderation
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->unsignedInteger('review_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->check('price >= 0');
            $table->check('stock_quantity >= 0');
            $table->index('farmer_id');
            $table->index('category_id');
            $table->index('price');
            $table->fullText(['name', 'description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
