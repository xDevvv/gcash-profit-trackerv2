<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\FeeCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Transaction::query()
            ->betweenDates($request->input('from'), $request->input('to'))
            ->when($request->input('type'), fn ($q, $type) => $q->where('type', $type))
            ->orderByDesc('transaction_date')
            ->orderByDesc('id');

        $transactions = $query->paginate(15)->withQueryString();

        // Recompute totals for the *filtered* set (not just the current page)
        $filtered = Transaction::query()
            ->betweenDates($request->input('from'), $request->input('to'))
            ->when($request->input('type'), fn ($q, $type) => $q->where('type', $type));

        $summary = [
            'count' => (clone $filtered)->count(),
            'profit' => (float) (clone $filtered)->sum('fee'),
            'volume' => (float) (clone $filtered)->sum('amount'),
        ];

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['from', 'to', 'type']),
            'summary' => $summary,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:cash_in,cash_out',
            'amount' => 'required|numeric|min:1',
            'transaction_date' => 'nullable|date',
            'notes' => 'nullable|string|max:255',
        ]);

        $fee = FeeCalculator::calculate((float) $validated['amount'], $validated['type']);

        Transaction::create([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'fee' => $fee,
            'transaction_date' => $validated['transaction_date'] ?? now()->toDateString(),
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Transaction recorded.');
    }

    public function update(Request $request, Transaction $transaction): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:cash_in,cash_out',
            'amount' => 'required|numeric|min:1',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string|max:255',
        ]);

        $fee = FeeCalculator::calculate((float) $validated['amount']);

        $transaction->update([
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'fee' => $fee,
            'transaction_date' => $validated['transaction_date'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Transaction updated.');
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $transaction->delete();

        return back()->with('success', 'Transaction deleted.');
    }

    /**
     * Lightweight endpoint the frontend can call to preview the s
     * for an amount before submitting the form.
     */
    public function previewFee(Request $request)
    {
        $amount = (float) $request->query('amount', 0);
        $transactionType = $request->query('type', 'cash_in');

        return response()->json([
            'fee' => FeeCalculator::calculate($amount, $transactionType),
        ]);
    }
}
