<?php

namespace App\Http\Controllers;

use App\Models\TransferFee;
use App\Services\FeeCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransferFeeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/TransferFees', [
            'tiers' => TransferFee::orderBy('sort_order')->orderBy('min_amount')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'min_amount' => 'required|integer|min:1',
            'max_amount' => 'nullable|integer|gt:min_amount',
            'fee' => 'required|numeric|min:0',
        ]);

        $maxSort = TransferFee::max('sort_order') ?? 0;

        TransferFee::create([
            ...$validated,
            'sort_order' => $maxSort + 1,
        ]);

        FeeCalculator::forgetCache();

        return back()->with('success', 'Transfer Fee added.');
    }

    public function update(Request $request, TransferFee $TransferFee): RedirectResponse
    {
        $validated = $request->validate([
            'min_amount' => 'required|integer|min:1',
            'max_amount' => 'nullable|integer|gt:min_amount',
            'fee' => 'required|numeric|min:0',
        ]);

        $TransferFee->update($validated);

        FeeCalculator::forgetCache();

        return back()->with('success', 'Transfer Fee updated.');
    }

    public function destroy(TransferFee $TransferFee): RedirectResponse
    {
        $TransferFee->delete();

        FeeCalculator::forgetCache();

        return back()->with('success', 'Transfer Fee removed.');
    }
}
