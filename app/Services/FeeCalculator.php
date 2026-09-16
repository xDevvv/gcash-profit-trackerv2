<?php

namespace App\Services;

use App\Models\TransferFee;
use Illuminate\Support\Facades\Cache;

class FeeCalculator
{
    /**
     * Work out the fee (profit) for a given transaction amount
     * by matching it against the configured fee tiers.
     */
    public static function calculate(float $amount, string $type): float
    {

        if ($type === 'cash_in' || $type === 'cash_out') {
            if ($amount <= 0) {
                return 0;
            }

            $tiers = self::tiers();

            foreach ($tiers as $tier) {
                $min = (float) $tier['min_amount'];

                $max = $tier['max_amount'] === null
                    ? null
                    : (float) $tier['max_amount'];

                if ($amount >= $min && ($max === null || $amount <= $max)) {
                    return (float) $tier['fee'];
                }
            }

            // Fallback: if amount is below the lowest configured tier,
            // or no tiers exist at all, use the sane defaults from the brief.

            if ($amount <= 299) {
                return 3;
            }

            if ($amount <= 599) {
                return 5;
            }

            return 10;
        }

        if ($type === 'k-load') {
            return 0;
        }

        if ($type === 'load') {
            return 0;
        }

        return 0;
    }

    protected static function tiers(): array
    {
        return Cache::remember('fee_tiers_sorted', 60, function () {
            return TransferFee::orderBy('sort_order')
                ->orderBy('min_amount')
                ->get()
                ->map(fn ($tier) => [
                    'min_amount' => $tier->min_amount,
                    'max_amount' => $tier->max_amount,
                    'fee' => $tier->fee,
                ])
                ->toArray();
        });
    }

    public static function forgetCache(): void
    {
        Cache::forget('fee_tiers_sorted');
    }
}
