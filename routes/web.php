<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransferFeeController;
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

Route::get('/settings/fee-tiers', [TransferFeeController::class, 'index'])->name('transfer-fee.index');
Route::post('/settings/fee-tiers', [TransferFeeController::class, 'store'])->name('transfer-fee.store');
Route::put('/settings/fee-tiers/{transferFee}', [TransferFeeController::class, 'update'])->name('transfer-fee.update');
Route::delete('/settings/fee-tiers/{transferFee}', [TransferFeeController::class, 'destroy'])->name('transfer-fee.destroy');
