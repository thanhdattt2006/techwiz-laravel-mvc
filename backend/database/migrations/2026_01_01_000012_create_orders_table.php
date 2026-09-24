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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 20)->unique();
            $table->foreignId('customer_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('farmer_id')->constrained('farmers')->restrictOnDelete();
            $table->foreignId('market_id')->constrained('markets')->restrictOnDelete();
            $table->date('pickup_date');
            $table->time('pickup_start_time');
            $table->time('pickup_end_time');
            $table->enum('status', ['placed', 'accepted', 'declined', 'ready_for_pickup', 'completed', 'cancelled'])->default('placed');
            $table->decimal('total_amount', 10, 2);
            $table->text('note')->nullable();
            $table->string('cancel_reason', 255)->nullable();
            $table->dateTime('cutoff_at');
            $table->dateTime('accepted_at')->nullable();
            $table->dateTime('ready_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->timestamps();

            $table->check('total_amount >= 0');
            $table->index(['customer_id', 'status']);
            $table->index(['farmer_id', 'status']);
            $table->index('pickup_date');
            $table->index('market_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
