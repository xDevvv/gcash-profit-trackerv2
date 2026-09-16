<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransferFee extends Model
{
    use HasFactory;

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
