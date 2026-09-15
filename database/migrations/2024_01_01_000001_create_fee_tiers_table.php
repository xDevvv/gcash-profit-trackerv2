<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fee_tiers', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('min_amount');
            // null max_amount means "and up" (open-ended top tier)
            $table->unsignedInteger('max_amount')->nullable();
            $table->decimal('fee', 8, 2);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_tiers');
    }
};
