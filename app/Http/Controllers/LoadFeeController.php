<?php

namespace App\Http\Controllers;

use App\Models\LoadFee;
use App\Services\FeeCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoadFeeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Fees/LoadFees', [
            'fees' => LoadFee::orderBy('sort_order')->orderBy('min_amount')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'min_amount' => 'required|integer|min:1',
            'max_amount' => 'nullable|integer|gt:min_amount',
            'fee' => 'required|numeric|min:0',
        ]);

        $maxSort = LoadFee::max('sort_order') ?? 0;

        LoadFee::create([
            ...$validated,
            'sort_order' => $maxSort + 1,
        ]);

        FeeCalculator::forgetCache();

        return back()->with('success', 'Load Fee added.');
    }

    public function update(Request $request, LoadFee $LoadFee): RedirectResponse
    {
        $validated = $request->validate([
            'min_amount' => 'required|integer|min:1',
            'max_amount' => 'nullable|integer|gt:min_amount',
            'fee' => 'required|numeric|min:0',
        ]);

        $LoadFee->update($validated);

        FeeCalculator::forgetCache();

        return back()->with('success', 'Load Fee updated.');
    }

    public function destroy(LoadFee $loadFee): RedirectResponse
    {

        $loadFee->delete();

        FeeCalculator::forgetCache();

        return back()->with('success', 'Load Fee removed.');
    }
}
