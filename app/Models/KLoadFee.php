<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KLoadFee extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'fee',
        'sort_order',
    ];

    protected $casts = [
        'amount' => 'integer',
        'fee' => 'decimal:2',
        'sort_order' => 'integer',
    ];
}
