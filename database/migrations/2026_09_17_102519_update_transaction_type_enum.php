<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create a temporary table with the updated transaction types
        Schema::create('transactions_new', function (Blueprint $table) {
            $table->id();

            $table->enum('type', [
                'cash_in',
                'cash_out',
                'debt',
                'load',
                'k_load',
            ]);

            $table->decimal('amount', 10, 2);
            $table->decimal('fee', 8, 2);
            $table->date('transaction_date');
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->index('transaction_date');
            $table->index('type');
        });

        // Copy existing transactions
        DB::statement('
            INSERT INTO transactions_new
                (id, type, amount, fee, transaction_date, notes, created_at, updated_at)
            SELECT
                id, type, amount, fee, transaction_date, notes, created_at, updated_at
            FROM transactions
        ');

        // Remove old table
        Schema::drop('transactions');

        // Rename temporary table
        Schema::rename('transactions_new', 'transactions');
    }

    public function down(): void
    {
        Schema::create('transactions_old', function (Blueprint $table) {
            $table->id();

            $table->enum('type', [
                'cash_in',
                'cash_out',
            ]);

            $table->decimal('amount', 10, 2);
            $table->decimal('fee', 8, 2);
            $table->date('transaction_date');
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->index('transaction_date');
            $table->index('type');
        });

        // Only copy records that are valid for the old schema
        DB::statement('
            INSERT INTO transactions_old
                (id, type, amount, fee, transaction_date, notes, created_at, updated_at)
            SELECT
                id, type, amount, fee, transaction_date, notes, created_at, updated_at
            FROM transactions
            WHERE type IN ("cash_in", "cash_out")
        ');

        Schema::drop('transactions');

        Schema::rename('transactions_old', 'transactions');
    }
};
