<?php

namespace Database\Seeders;

use App\Models\FeeTier;
use Illuminate\Database\Seeder;

class FeeTierSeeder extends Seeder
{
    public function run(): void
    {
        $tiers = [
            ['min_amount' => 1,   'max_amount' => 299, 'fee' => 3,  'sort_order' => 1],
            ['min_amount' => 300, 'max_amount' => 599, 'fee' => 5,  'sort_order' => 2],
            ['min_amount' => 600, 'max_amount' => null, 'fee' => 10, 'sort_order' => 3],
        ];

        foreach ($tiers as $tier) {
            FeeTier::updateOrCreate(
                ['min_amount' => $tier['min_amount'], 'max_amount' => $tier['max_amount']],
                $tier
            );
        }
    }
}
