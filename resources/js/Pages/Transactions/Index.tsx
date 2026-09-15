import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import TransactionForm from '@/Components/TransactionForm';
import { Transaction, TransactionsIndexProps, TransactionType } from '@/types';

const peso = (n: number) =>
  `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function TransactionsIndex({ transactions, filters, summary }: TransactionsIndexProps) {
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  function applyFilters(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    router.get('/transactions', {
      from: form.get('from') || undefined,
      to: form.get('to') || undefined,
      type: form.get('type') || undefined,
    }, { preserveState: true });
  }

  function clearFilters() {
    router.get('/transactions');
  }

  function destroy(t: Transaction) {
    if (confirm(`Delete this ₱${t.amount} ${t.type === 'cash_in' ? 'cash in' : 'cash out'} entry?`)) {
      router.delete(`/transactions/${t.id}`, { preserveScroll: true });
    }
  }

  return (
    <AppLayout>
      <Head title="Transactions" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Transactions</h1>
          <p className="text-sm text-clay-textSoft">
            {summary.count} transaction{summary.count === 1 ? '' : 's'} · {peso(summary.profit)} profit · {peso(summary.volume)} moved
          </p>
        </div>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="clay-btn bg-clay-primary px-5 py-2.5 text-sm font-bold text-white"
        >
          {showAdd ? 'Close' : '+ Add transaction'}
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 max-w-xl">
          <TransactionForm onSuccess={() => { setShowAdd(false); router.reload(); }} />
        </div>
      )}

      {/* Filters */}
      <form onSubmit={applyFilters} className="clay-sm mb-6 flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">From</label>
          <input name="from" type="date" defaultValue={filters.from} className="clay-inset border-0 bg-transparent px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">To</label>
          <input name="to" type="date" defaultValue={filters.to} className="clay-inset border-0 bg-transparent px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">Type</label>
          <select name="type" defaultValue={filters.type ?? ''} className="clay-inset border-0 bg-transparent px-3 py-2 text-sm outline-none">
            <option value="">All</option>
            <option value="cash_in">Cash In</option>
            <option value="cash_out">Cash Out</option>
          </select>
        </div>
        <button type="submit" className="clay-btn bg-clay-primary px-4 py-2 text-sm font-bold text-white">
          Filter
        </button>
        <button type="button" onClick={clearFilters} className="clay-btn bg-clay-surface px-4 py-2 text-sm font-bold text-clay-textSoft">
          Clear
        </button>
      </form>

      {/* Table */}
      <div className="clay overflow-hidden p-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-1 text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-clay-textSoft">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Fee (Profit)</th>
                <th className="px-4 py-2">Notes</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.data.map((t) => (
                <TransactionRow key={t.id} transaction={t} onEdit={() => setEditing(t)} onDelete={() => destroy(t)} />
              ))}
              {transactions.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-clay-textFaint">
                    No transactions match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {transactions.links.map((link, i) => (
          <button
            key={i}
            disabled={!link.url}
            onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
            className={`clay-sm px-3 py-1.5 text-xs font-bold ${
              link.active ? 'bg-clay-primary text-white' : 'text-clay-textSoft disabled:opacity-40'
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>

      {editing && <EditModal transaction={editing} onClose={() => setEditing(null)} />}
    </AppLayout>
  );
}

function TransactionRow({
  transaction: t,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="clay-sm">
      <td className="px-4 py-3 font-medium">
        {new Date(t.transaction_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="px-4 py-3">
        <span
          className={`clay-chip px-3 py-1 text-xs font-bold text-white ${
            t.type === 'cash_in' ? 'bg-clay-primary' : 'bg-clay-secondary'
          }`}
        >
          {t.type === 'cash_in' ? 'Cash In' : 'Cash Out'}
        </span>
      </td>
      <td className="px-4 py-3 font-semibold">{peso(parseFloat(t.amount))}</td>
      <td className="px-4 py-3 font-bold text-clay-success">{peso(parseFloat(t.fee))}</td>
      <td className="px-4 py-3 text-clay-textSoft">{t.notes || '—'}</td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="clay-sm px-3 py-1.5 text-xs font-bold text-clay-primary">
            Edit
          </button>
          <button onClick={onDelete} className="clay-sm px-3 py-1.5 text-xs font-bold text-clay-danger">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function EditModal({ transaction, onClose }: { transaction: Transaction; onClose: () => void }) {
  const { data, setData, put, processing, errors } = useForm({
    type: transaction.type as TransactionType,
    amount: transaction.amount,
    transaction_date: transaction.transaction_date,
    notes: transaction.notes ?? '',
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    put(`/transactions/${transaction.id}`, {
      preserveScroll: true,
      onSuccess: onClose,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-clay-text/30 p-4" onClick={onClose}>
      <div className="clay w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 font-display text-lg font-bold">Edit transaction</h3>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="clay-inset flex gap-1 p-1.5">
            {(['cash_in', 'cash_out'] as TransactionType[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setData('type', type)}
                className={`flex-1 rounded-2xl py-2 text-sm font-bold ${
                  data.type === type
                    ? type === 'cash_in'
                      ? 'clay-btn bg-clay-primary text-white'
                      : 'clay-btn bg-clay-secondary text-white'
                    : 'text-clay-textSoft'
                }`}
              >
                {type === 'cash_in' ? '↓ Cash In' : '↑ Cash Out'}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">Amount</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={data.amount}
              onChange={(e) => setData('amount', e.target.value)}
              className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm font-semibold outline-none"
            />
            {errors.amount && <p className="mt-1 text-xs font-medium text-clay-danger">{errors.amount}</p>}
            <p className="mt-1 text-xs text-clay-textFaint">Fee will be recalculated automatically based on the amount.</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">Date</label>
            <input
              type="date"
              value={data.transaction_date}
              onChange={(e) => setData('transaction_date', e.target.value)}
              className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm font-semibold outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">Notes</label>
            <input
              type="text"
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
              className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm font-semibold outline-none"
            />
          </div>

          <div className="mt-2 flex gap-3">
            <button type="button" onClick={onClose} className="clay-btn flex-1 bg-clay-surface py-2.5 text-sm font-bold text-clay-textSoft">
              Cancel
            </button>
            <button type="submit" disabled={processing} className="clay-btn flex-1 bg-clay-primary py-2.5 text-sm font-bold text-white">
              {processing ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
