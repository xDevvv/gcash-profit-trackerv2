<?php

namespace App\Services;

use App\Models\FeeTier;
use Illuminate\Support\Facades\Cache;

class FeeCalculator
{
    /**
     * Work out the fee (profit) for a given transaction amount
     * by matching it against the configured fee tiers.
     */
    public static function calculate(float $amount): float
    {
        if ($amount <= 0) {
            return 0;
        }

        $tiers = self::tiers();

        foreach ($tiers as $tier) {
            $min = (float) $tier->min_amount;
            $max = $tier->max_amount === null ? null : (float) $tier->max_amount;

            if ($amount >= $min && ($max === null || $amount <= $max)) {
                return (float) $tier->fee;
            }
        }

        // Fallback: if amount is below the lowest configured tier,
        // or no tiers exist at all, use the sane defaults from the brief.
        if ($amount <= 299) return 3;
        if ($amount <= 599) return 5;
        return 10;
    }

    protected static function tiers()
    {
        return Cache::remember('fee_tiers_sorted', 60, function () {
            return FeeTier::orderBy('sort_order')->orderBy('min_amount')->get();
        });
    }

    public static function forgetCache(): void
    {
        Cache::forget('fee_tiers_sorted');
    }
}
