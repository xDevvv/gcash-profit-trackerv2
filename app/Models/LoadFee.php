<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoadFee extends Model
{
    protected $fillable = [
        'min_amount',
        'max_amount',
        'fee',
        'sort_order',
    ];

    protected $casts = [
        'min_amount' => 'integer',
        'max_amount' => 'integer',
        'fee' => 'decimal:2',
        'sort_order' => 'integer',
    ];
}
