<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KloadFeeController;
use App\Http\Controllers\LoadFeeController;
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

// Transfer Fee Routes
Route::get('/fee/transfer', [TransferFeeController::class, 'index'])->name('transfer.index');
Route::post('/fee/transfer', [TransferFeeController::class, 'store'])->name('transfer.store');
Route::put('/fee/transfer/{transferFee}', [TransferFeeController::class, 'update'])->name('transfer.update');
Route::delete('/fee/transfer/{transferFee}', [TransferFeeController::class, 'destroy'])->name('transfer.destroy');

// KLoad Fee Routes
Route::get('/fee/kload', [KloadFeeController::class, 'index'])->name('kload.index');
Route::post('/fee/kload', [KloadFeeController::class, 'store'])->name('kload.store');
Route::put('/fee/kload/{kloadFee}', [KloadFeeController::class, 'update'])->name('kload.update');
Route::delete('/fee/kload/{kloadFee}', [KloadFeeController::class, 'destroy'])->name('kload.destroy');

// Load Fee Routes
Route::get('/fee/load', [LoadFeeController::class, 'index'])->name('load.index');
Route::post('/fee/load', [LoadFeeController::class, 'store'])->name('load.store');
Route::put('/fee/load/{loadFee}', [LoadFeeController::class, 'update'])->name('load.update');
Route::delete('/fee/load/{loadFee}', [LoadFeeController::class, 'destroy'])->name('load.destroy');
