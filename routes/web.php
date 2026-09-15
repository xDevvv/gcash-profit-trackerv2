<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeeTierController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

// If you install Laravel Breeze/auth scaffolding, wrap these in the
// 'auth' middleware group so only you can access your own ledger:
// Route::middleware(['auth'])->group(function () { ... });

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
Route::put('/transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
Route::get('/transactions/preview-fee', [TransactionController::class, 'previewFee'])->name('transactions.previewFee');

Route::get('/settings/fee-tiers', [FeeTierController::class, 'index'])->name('fee-tiers.index');
Route::post('/settings/fee-tiers', [FeeTierController::class, 'store'])->name('fee-tiers.store');
Route::put('/settings/fee-tiers/{feeTier}', [FeeTierController::class, 'update'])->name('fee-tiers.update');
Route::delete('/settings/fee-tiers/{feeTier}', [FeeTierController::class, 'destroy'])->name('fee-tiers.destroy');
