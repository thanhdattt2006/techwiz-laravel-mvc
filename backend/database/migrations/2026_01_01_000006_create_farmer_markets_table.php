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
        Schema::create('farmer_markets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained('farmers')->cascadeOnDelete();
            $table->foreignId('market_id')->constrained('markets')->cascadeOnDelete();
            $table->string('stall_location', 150)->nullable();
            $table->json('pickup_days'); // Example: [6, 0] (Saturday, Sunday)
            $table->time('pickup_start_time');
            $table->time('pickup_end_time');
            $table->unsignedSmallInteger('slot_minutes')->default(30);
            $table->unsignedSmallInteger('cutoff_hours')->default(12);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['farmer_id', 'market_id']);
            $table->check('pickup_start_time < pickup_end_time');
            $table->index('market_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farmer_markets');
    }
};
