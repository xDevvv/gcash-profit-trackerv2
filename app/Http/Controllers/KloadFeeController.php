<?php

namespace App\Http\Controllers;

use App\Models\KLoadFee;
use App\Services\FeeCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KloadFeeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Fees/KLoadFees', [
            'fees' => KLoadFee::orderBy('sort_order')->orderBy('amount')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:100',
            'fee' => 'required|numeric|min:1',
        ]);

        $maxSort = KLoadFee::max('sort_order') ?? 0;

        KLoadFee::create([
            ...$validated,
            'sort_order' => $maxSort + 1,
        ]);

        FeeCalculator::forgetCache();

        return back()->with('success', 'KLoad Fee added.');
    }

    public function update(Request $request, KLoadFee $KLoadFee): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:100',
            'fee' => 'required|numeric|min:0',
        ]);

        $KLoadFee->update($validated);

        FeeCalculator::forgetCache();

        return back()->with('success', 'KLoad Fee updated.');
    }

    public function destroy(KLoadFee $kloadFee): RedirectResponse
    {

        $kloadFee->delete();

        FeeCalculator::forgetCache();

        return back()->with('success', 'KLoad Fee removed.');
    }
}
