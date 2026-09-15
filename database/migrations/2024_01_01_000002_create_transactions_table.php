<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['cash_in', 'cash_out']);
            $table->decimal('amount', 10, 2); // the amount the customer cashed in/out
            $table->decimal('fee', 8, 2); // fee charged to customer (this is the profit)
            $table->date('transaction_date'); // allows backdating / correcting entries
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->index('transaction_date');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
