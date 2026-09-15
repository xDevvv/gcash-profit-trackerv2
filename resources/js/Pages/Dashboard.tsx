import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StatCard from '@/Components/StatCard';
import TransactionForm from '@/Components/TransactionForm';
import ClayBarChart from '@/Components/ClayBarChart';
import { DashboardProps } from '@/types';

const peso = (n: number) =>
  `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Dashboard({ today, month, trend, monthlyTrend, recentTransactions }: DashboardProps) {
  return (
    <AppLayout>
      <Head title="Dashboard" />

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-clay-text md:text-3xl">
          Kumusta! Here's today's profit 👋
        </h1>
        <p className="text-sm text-clay-textSoft">
          {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / main column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <StatCard
              label="Today's Profit"
              value={peso(today.profit)}
              sublabel={`${today.count} transaction${today.count === 1 ? '' : 's'}`}
              accent="success"
              icon="💰"
            />
            <StatCard
              label={`${month.label} Profit`}
              value={peso(month.profit)}
              sublabel={`${month.count} transaction${month.count === 1 ? '' : 's'}`}
              accent="primary"
              icon="📈"
            />
            <StatCard
              label="Cash In Today"
              value={peso(today.cashIn.profit)}
              sublabel={`${today.cashIn.count} txns · ₱${today.cashIn.volume.toLocaleString()} moved`}
              accent="primary"
              icon="↓"
            />
            <StatCard
              label="Cash Out Today"
              value={peso(today.cashOut.profit)}
              sublabel={`${today.cashOut.count} txns · ₱${today.cashOut.volume.toLocaleString()} moved`}
              accent="secondary"
              icon="↑"
            />
          </div>

          <div className="clay p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Last 14 days</h3>
              <span className="clay-chip bg-clay-primarySoft px-3 py-1 text-xs font-bold text-clay-primary">
                Daily profit
              </span>
            </div>
            <ClayBarChart
              accent="primary"
              bars={trend.map((t) => ({
                label: new Date(t.date).toLocaleDateString('en-PH', { day: 'numeric' }),
                value: t.profit,
              }))}
            />
          </div>

          <div className="clay p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Last 6 months</h3>
              <span className="clay-chip bg-clay-successSoft px-3 py-1 text-xs font-bold text-clay-success">
                Monthly profit
              </span>
            </div>
            <ClayBarChart accent="success" bars={monthlyTrend.map((m) => ({ label: m.month, value: m.profit }))} />
          </div>

          <div className="clay p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Recent transactions</h3>
              <button
                onClick={() => router.visit('/transactions')}
                className="text-sm font-bold text-clay-primary hover:underline"
              >
                View all →
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {recentTransactions.length === 0 && (
                <p className="py-6 text-center text-sm text-clay-textFaint">
                  No transactions yet — record your first one!
                </p>
              )}
              {recentTransactions.map((t) => (
                <div key={t.id} className="clay-sm flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`clay-chip flex h-9 w-9 items-center justify-center text-sm font-bold text-white ${
                        t.type === 'cash_in' ? 'bg-clay-primary' : 'bg-clay-secondary'
                      }`}
                    >
                      {t.type === 'cash_in' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        {t.type === 'cash_in' ? 'Cash In' : 'Cash Out'} · ₱{parseFloat(t.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-clay-textFaint">
                        {new Date(t.transaction_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                        {t.notes ? ` · ${t.notes}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-clay-success">+₱{parseFloat(t.fee).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: quick add form */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <TransactionForm onSuccess={() => router.reload({ only: ['today', 'month', 'trend', 'monthlyTrend', 'recentTransactions'] })} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
