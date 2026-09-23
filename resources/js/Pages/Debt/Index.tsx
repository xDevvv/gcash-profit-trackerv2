import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import AppLayout from '@/Layouts/AppLayout';
import DebtForm from '@/Components/DebtForm';
import DebtRow, { Debt } from '@/Components/DebtRow';

type Props = {
  debts: {
    data: Debt[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };

  summary: {
    count: number;
    pending: number;
    paid: number;
    outstanding: number;
    profit: number;
  };
};

const peso = (value: string | number) =>
  `₱${Number(value).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Index({ debts, summary }: Props) {
  const [showAdd, setShowAdd] = useState(false);

  function destroy(debt: Debt) {
    if (
      confirm(
        `Delete ${debt.person_name}'s ₱${Number(
          debt.amount
        ).toLocaleString()} Debt?`
      )
    ) {
      router.delete(`/debt/${debt.id}`, {
        preserveScroll: true,
      });
    }
  }

  return (
    <AppLayout>
      <Head title="Debt" />

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            Debt
          </h1>

          <p className="text-sm text-clay-textSoft">
            {summary.count} record
            {summary.count === 1 ? '' : 's'} ·{' '}
            {peso(summary.outstanding)} outstanding ·{' '}
            {peso(summary.profit)} profit
          </p>
        </div>

        <button
          onClick={() => setShowAdd((value) => !value)}
          className="clay-btn bg-clay-primary px-5 py-2.5 text-sm font-bold text-white"
        >
          {showAdd ? 'Close' : '+ Add Debt'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="clay-sm p-4">
          <p className="text-xs font-bold uppercase text-clay-textSoft">
            Pending
          </p>

          <p className="mt-1 text-2xl font-bold">
            {summary.pending}
          </p>
        </div>

        <div className="clay-sm p-4">
          <p className="text-xs font-bold uppercase text-clay-textSoft">
            Paid
          </p>

          <p className="mt-1 text-2xl font-bold">
            {summary.paid}
          </p>
        </div>

        <div className="clay-sm p-4">
          <p className="text-xs font-bold uppercase text-clay-textSoft">
            Outstanding
          </p>

          <p className="mt-1 text-xl font-bold text-clay-secondary">
            {peso(summary.outstanding)}
          </p>
        </div>

        <div className="clay-sm p-4">
          <p className="text-xs font-bold uppercase text-clay-textSoft">
            Profit
          </p>

          <p className="mt-1 text-xl font-bold text-clay-success">
            {peso(summary.profit)}
          </p>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 max-w-xl">
          <DebtForm
            onSuccess={() => {
              setShowAdd(false);
              router.reload();
            }}
          />
        </div>
      )}

      {/* Table */}
      <div className="clay overflow-hidden p-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-y-1 text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-clay-textSoft">
                <th className="px-4 py-2">Person</th>
                <th className="px-4 py-2">Debt</th>
                <th className="px-4 py-2">Fee / Profit</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {debts.data.map((debt) => (
                <DebtRow
                  key={debt.id}
                  debt={debt}
                  onEdit={() => {
                    // Open your edit modal here
                  }}
                  onDelete={() => destroy(debt)}
                />
              ))}

              {debts.data.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-clay-textFaint"
                  >
                    No Debt records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {debts.links.map((link, index) => (
          <button
            key={index}
            disabled={!link.url}
            onClick={() =>
              link.url &&
              router.visit(link.url, {
                preserveScroll: true,
              })
            }
            className={`clay-sm px-3 py-1.5 text-xs font-bold ${
              link.active
                ? 'bg-clay-primary text-white'
                : 'text-clay-textSoft disabled:opacity-40'
            }`}
            dangerouslySetInnerHTML={{
              __html: link.label,
            }}
          />
        ))}
      </div>
    </AppLayout>
  );
}