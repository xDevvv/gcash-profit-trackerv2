<?php

namespace App\Services;

use App\Models\KLoadFee;
use App\Models\LoadFee;
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

            $fees = self::transferFees();

            foreach ($fees as $fee) {
                $min = (float) $fee['min_amount'];

                $max = $fee['max_amount'] === null
                    ? null
                    : (float) $fee['max_amount'];

                if ($amount >= $min && ($max === null || $amount <= $max)) {
                    return (float) $fee['fee'];
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

            if ($amount <= 0) {
                return 0;
            }

            $fees = self::kLoadFees();

            foreach ($fees as $fee) {
                $min = (float) $fee['amount'];

                if ($amount === $min) {
                    return (float) $fee['fee'];
                }
            }
        }

        if ($type === 'load') {
            if ($amount <= 0) {
                return 0;
            }

            $fees = self::LoadFees();

            foreach ($fees as $fee) {
                $min = (float) $fee['min_amount'];

                $max = $fee['max_amount'] === null
                    ? null
                    : (float) $fee['max_amount'];

                if ($amount >= $min && ($max === null || $amount <= $max)) {
                    return (float) $fee['fee'];
                }
            }
        }
    }

    protected static function transferFees(): array
    {
        return Cache::remember('transfer_fee_sorted', 60, function () {
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

    protected static function kLoadFees(): array
    {
        return Cache::remember('kload_fee_sorted', 60, function () {
            return KLoadFee::orderBy('sort_order')
                ->orderBy('amount')
                ->get()
                ->map(fn ($tier) => [
                    'amount' => $tier->amount,
                    'fee' => $tier->fee,
                ])
                ->toArray();
        });
    }

    protected static function LoadFees(): array
    {
        return Cache::remember('load_fee_sorted', 60, function () {
            return LoadFee::orderBy('sort_order')
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
        Cache::forget('transfer_fee_sorted');
        Cache::forget('kload_fee_sorted');
        Cache::forget('load_fee_sorted');
    }
}
