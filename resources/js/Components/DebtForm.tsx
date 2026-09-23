import { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';

type DebtFormProps = {
  onSuccess?: () => void;
};

export default function DebtForm({ onSuccess }: DebtFormProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    person_name: '',
    amount: '',
    fee: '',
    due_date: '',
    notes: '',
  });

  function submit(e: FormEvent) {
    e.preventDefault();

    post('/debt', {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  }

  return (
    <div className="clay p-6">
      <h2 className="mb-1 font-display text-xl font-bold">
        Add Debt
      </h2>

      <p className="mb-5 text-sm text-clay-textSoft">
        Track money owed and the fee you will earn.
      </p>

      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* Person */}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">
            Person
          </label>

          <input
            type="text"
            value={data.person_name}
            onChange={(e) => setData('person_name', e.target.value)}
            placeholder="Juan Dela Cruz"
            className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm outline-none"
          />

          {errors.person_name && (
            <p className="mt-1 text-xs text-clay-danger">
              {errors.person_name}
            </p>
          )}
        </div>

        {/* Amount + Fee */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">
              Debt Amount
            </label>

            <input
              type="number"
              min="1"
              step="0.01"
              value={data.amount}
              onChange={(e) => setData('amount', e.target.value)}
              placeholder="1000"
              className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm font-semibold outline-none"
            />

            {errors.amount && (
              <p className="mt-1 text-xs text-clay-danger">
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">
              Fee / Profit
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={data.fee}
              onChange={(e) => setData('fee', e.target.value)}
              placeholder="100"
              className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm font-semibold outline-none"
            />

            {errors.fee && (
              <p className="mt-1 text-xs text-clay-danger">
                {errors.fee}
              </p>
            )}
          </div>
        </div>

        {/* Preview */}
        {data.amount && data.fee && (
          <div className="clay-inset p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-clay-textSoft">
                Amount to receive
              </span>

              <span className="font-bold text-clay-primary">
                ₱
                {(
                  Number(data.amount) + Number(data.fee)
                ).toLocaleString('en-PH', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-clay-textSoft">
                Your profit
              </span>

              <span className="font-bold text-clay-success">
                +₱
                {Number(data.fee).toLocaleString('en-PH', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        )}

        {/* Due date */}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">
            Due Date
          </label>

          <input
            type="date"
            value={data.due_date}
            onChange={(e) => setData('due_date', e.target.value)}
            className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-clay-textSoft">
            Notes
          </label>

          <input
            type="text"
            value={data.notes}
            onChange={(e) => setData('notes', e.target.value)}
            placeholder="Optional notes"
            className="clay-inset w-full border-0 bg-transparent px-4 py-2.5 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="clay-btn bg-clay-primary py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {processing ? 'Saving…' : 'Add Debt'}
        </button>
      </form>
    </div>
  );
}
