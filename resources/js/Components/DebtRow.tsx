import { router } from '@inertiajs/react';

export type Debt = {
  id: number;
  person_name: string;
  amount: string | number;
  fee: string | number;
  due_date: string | null;
  notes: string | null;
  status: 'pending' | 'paid';
  paid_at: string | null;
};

type DebtRowProps = {
  debt: Debt;
  onEdit: () => void;
  onDelete: () => void;
};

const peso = (value: string | number) =>
  `₱${Number(value).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function DebtRow({
  debt,
  onEdit,
  onDelete,
}: DebtRowProps) {
  function markAsPaid() {
    if (debt.status === 'paid') return;

    const total = Number(debt.amount) + Number(debt.fee);

    if (
      !confirm(
        `Mark ${debt.person_name}'s Debt of ${peso(total)} as paid?`
      )
    ) {
      return;
    }

    router.post(`/debt/${debt.id}/pay`, {}, {
      preserveScroll: true,
    });
  }

  return (
    <tr className="clay-sm">
      <td className="px-4 py-3">
        <div>
          <p className="font-bold">{debt.person_name}</p>

          {debt.notes && (
            <p className="text-xs text-clay-textSoft">
              {debt.notes}
            </p>
          )}
        </div>
      </td>

      <td className="px-4 py-3 font-semibold">
        {peso(debt.amount)}
      </td>

      <td className="px-4 py-3 font-bold text-clay-success">
        +{peso(debt.fee)}
      </td>

      <td className="px-4 py-3">
        {debt.due_date
          ? new Date(debt.due_date).toLocaleDateString('en-PH', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '—'}
      </td>

      <td className="px-4 py-3">
        <span
          className={`clay-chip px-3 py-1 text-xs font-bold ${
            debt.status === 'paid'
              ? 'bg-clay-success text-white'
              : 'bg-clay-secondary text-white'
          }`}
        >
          {debt.status === 'paid' ? 'Paid' : 'Pending'}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {debt.status === 'pending' && (   
            <button
              onClick={markAsPaid}
              className="clay-btn bg-clay-success px-3 py-1.5 text-xs font-bold text-white"
            >
              Mark as Paid
            </button>
          )}

          <button
            onClick={onEdit}
            className="clay-sm px-3 py-1.5 text-xs font-bold text-clay-primary"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="clay-sm px-3 py-1.5 text-xs font-bold text-clay-danger"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
