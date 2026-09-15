<?php

namespace App\Http\Controllers;

use App\Models\FeeTier;
use App\Services\FeeCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeeTierController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings/FeeTiers', [
            'tiers' => FeeTier::orderBy('sort_order')->orderBy('min_amount')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'min_amount' => 'required|integer|min:1',
            'max_amount' => 'nullable|integer|gt:min_amount',
            'fee' => 'required|numeric|min:0',
        ]);

        $maxSort = FeeTier::max('sort_order') ?? 0;

        FeeTier::create([
            ...$validated,
            'sort_order' => $maxSort + 1,
        ]);

        FeeCalculator::forgetCache();

        return back()->with('success', 'Fee tier added.');
    }

    public function update(Request $request, FeeTier $feeTier): RedirectResponse
    {
        $validated = $request->validate([
            'min_amount' => 'required|integer|min:1',
            'max_amount' => 'nullable|integer|gt:min_amount',
            'fee' => 'required|numeric|min:0',
        ]);

        $feeTier->update($validated);

        FeeCalculator::forgetCache();

        return back()->with('success', 'Fee tier updated.');
    }

    public function destroy(FeeTier $feeTier): RedirectResponse
    {
        $feeTier->delete();

        FeeCalculator::forgetCache();

        return back()->with('success', 'Fee tier removed.');
    }
}
