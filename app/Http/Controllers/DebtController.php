<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DebtController extends Controller
{
    public function index(): Response
    {
        $debts = Debt::query()->latest()->paginate(10)->withQueryString();
        $summary = [
            'count' => Debt::count(),
            'pending' => Debt::where('status', 'pending')->count(),
            'paid' => Debt::where('status', 'paid')->count(),
            'outstanding' => Debt::where('status', 'pending')->sum('amount'),
            'profit' => Debt::where('status', 'paid')->sum('fee'),
        ];

        return Inertia::render('Debt/Index', [
            'debts' => $debts,
            'summary' => $summary,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'person_name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'fee' => ['required', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'], 'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        Debt::create([
            'person_name' => $validated['person_name'],
            'amount' => $validated['amount'],
            'fee' => $validated['fee'],
            'due_date' => $validated['due_date'] ?? null,
            'status' => 'pending',
            'paid_at' => null,
            'notes' => $validated['notes'] ?? null,
            'transaction_id' => null,
            'sort_order' => 0,
        ]);

        return back()->with('success', 'Debt added successfully.');
    }

    public function update(Request $request, Debt $debt): RedirectResponse
    {
        $validated = $request->validate([
            'person_name' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'fee' => ['required', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
        $debt->update([
            'person_name' => $validated['person_name'],
            'amount' => $validated['amount'],
            'fee' => $validated['fee'],
            'due_date' => $validated['due_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'sort_order' => $validated['sort_order'] ?? $debt->sort_order,
        ]);

        return back()->with('success', 'Debt updated successfully.');
    }

    public function pay(Debt $debt): RedirectResponse
    { // Prevent paying an already-paid debt
        if ($debt->status === 'paid') {
            return back()->with('error', 'This debt has already been paid.');
        }

        DB::transaction(function () use ($debt) {

            $totalAmount = (float) $debt->amount + (float) $debt->fee;

            $transaction = Transaction::create([
                'type' => 'debt',
                'amount' => $totalAmount,
                'fee' => $debt->fee, 'transaction_date' => now()->toDateString(),
                'notes' => 'Debt payment - '.$debt->person_name,
            ]);

            $debt->update([
                'status' => 'paid',
                'paid_at' => now(),
                'transaction_id' => $transaction->id,
            ]);
        });

        return back()->with('success', 'Debt payment recorded successfully.');
    }

    public function destroy(Debt $debt): RedirectResponse
    {
        $debt->delete();

        return back()->with('success', 'Debt deleted successfully.');
    }
}
