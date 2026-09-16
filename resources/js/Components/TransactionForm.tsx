import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { TransactionType } from '@/types';

export default function TransactionForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data, setData, post, processing, errors, reset } = useForm<{
    type: TransactionType;
    amount: string;
    transaction_date: string;
    notes: string;
  }>({
    type: 'cash_in',
    amount: '',
    transaction_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  const [previewFee, setPreviewFee] = useState<number | null>(null);

  // Live fee preview as the amount changes
  useEffect(() => {
    console.log(data.type);
    const amount = parseFloat(data.amount);
    if (!amount || amount <= 0) {
      setPreviewFee(null);
      return;
    }
    console.log('Fetching fee preview for amount:', amount);

    const timeout = setTimeout(() => {
      axios
        .get('/transactions/preview-fee', { params: { amount, type: data.type } })
        .then((res) => setPreviewFee(res.data.fee))
        .catch(() => setPreviewFee(null));
    }, 250);
    return () => clearTimeout(timeout);
  }, [data.amount]);

  function submit(e: FormEvent) {
    e.preventDefault();
    post('/transactions', {
      preserveScroll: true,
      onSuccess: () => {
        reset('amount', 'notes');
        setPreviewFee(null);
        onSuccess?.();
      },
    });
  }

  return (
    <form onSubmit={submit} className="clay flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Record a transaction</h3>
        {previewFee !== null && (
          <span className="clay-chip bg-clay-successSoft px-4 py-1.5 text-sm font-bold text-clay-success">
            Fee: ₱{previewFee.toFixed(2)}
          </span>
        )}
      </div>

      {/* Signature element: puffy segmented pill toggle for Cash In / Cash Out */}
      <div className="clay-inset grid gap-1 p-1.5">
        {(['cash_in', 'cash_out', 'k-load', 'load'] as TransactionType[]).map((type) => {
          const active = data.type === type;
          return (
            <button
              type="button"
              key={type}
              onClick={() => setData('type', type)}
              className={`flex-1 rounded-2xl py-2.5 text-sm font-bold transition-all ${
                active
                  ? type === 'cash_in' || type === 'cash_out'
                    ? 'clay-btn bg-clay-primary text-white'
                    : 'clay-btn bg-clay-secondary text-white'
                  : 'text-clay-textSoft'
              }`}
            >
              {type === 'cash_in' ? '↓ Cash In' : type === 'cash_out' ? '↑ Cash Out' : type === 'k-load' ? 'K-Load' : 'Load'}
            </button>
          );
        })}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-clay-textSoft">
          Amount (₱)
        </label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={data.amount}
          onChange={(e) => setData('amount', e.target.value)}
          placeholder="e.g. 500"
          className="clay-inset w-full border-0 bg-transparent px-4 py-3 text-lg font-semibold text-clay-text outline-none placeholder:text-clay-textFaint focus:ring-2 focus:ring-clay-primary"
        />
        {errors.amount && <p className="mt-1 text-xs font-medium text-clay-danger">{errors.amount}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-clay-textSoft">
            Date
          </label>
          <input
            type="date"
            value={data.transaction_date}
            onChange={(e) => setData('transaction_date', e.target.value)}
            className="clay-inset w-full border-0 bg-transparent px-4 py-3 text-sm font-semibold text-clay-text outline-none focus:ring-2 focus:ring-clay-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-clay-textSoft">
            Notes
          </label>
          <input
            type="text"
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
            placeholder="e.g. Juan Dela Cruz"
            className="clay-inset w-full border-0 bg-transparent px-4 py-3 text-sm font-semibold text-clay-text outline-none placeholder:text-clay-textFaint focus:ring-2 focus:ring-clay-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="clay-btn mt-1 bg-clay-primary py-3.5 text-base font-bold text-white disabled:opacity-60"
      >
        {processing ? 'Saving…' : 'Save transaction'}
      </button>
    </form>
  );
}
