<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Debt extends Model
{
    protected $table = 'debt';

    protected $fillable = [
        'person_name',
        'amount',
        'fee',
        'due_date',
        'status',
        'paid_at',
        'notes',
        'transaction_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
        'due_date' => 'date',
        'paid_at' => 'datetime',
    ];

    /**
     * The transaction created when this Debt is paid.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Check if the Debt is still pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the Debt has been paid.
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Total amount the person needs to pay.
     */
    public function getTotalAttribute(): float
    {
        return (float) $this->amount + (float) $this->fee;
    }
}
