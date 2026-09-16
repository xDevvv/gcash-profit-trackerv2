import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

const nav = [
  { href: '/', label: 'Dashboard', icon: '🏠', routeName: 'dashboard' },
  { href: '/transactions', label: 'Transactions', icon: '🧾', routeName: 'transactions.index' },
  { href: '/settings/fee-tiers', label: 'Cash in / Cash out Fee', icon: '⚙️', routeName: 'fee-tiers.index' },
];

export default function AppLayout({
  children,
  header,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const { url } = usePage();

  return (
    <div className="min-h-screen bg-clay-bg font-body text-clay-text">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="clay sticky top-6 flex flex-col gap-2 p-5">
            <div className="mb-4 flex items-center gap-3 px-2">
              <div className="clay-sm flex h-11 w-11 items-center justify-center bg-clay-primary text-xl">
                💸
              </div>
              <div>
                <p className="font-display text-lg font-bold leading-tight text-clay-text">
                  GCash Ledger
                </p>
                <p className="text-xs text-clay-textSoft">Profit tracker</p>
              </div>
            </div>

            {nav.map((item) => {
              const active = item.href === '/' ? url === '/' : url.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`clay-sm flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-clay-primary text-white shadow-none'
                      : 'text-clay-textSoft hover:text-clay-text'
                  }`}
                  style={
                    active
                      ? { boxShadow: 'inset 3px 3px 6px rgba(0,0,0,0.15), inset -3px -3px 6px rgba(255,255,255,0.3)' }
                      : undefined
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Mobile top nav */}
          <div className="clay-sm mb-6 flex items-center justify-between gap-2 p-2 md:hidden">
            {nav.map((item) => {
              const active = item.href === '/' ? url === '/' : url.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-semibold ${
                    active ? 'bg-clay-primary text-white' : 'text-clay-textSoft'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {header && <div className="mb-6">{header}</div>}
          {children}
        </main>
      </div>
    </div>
  );
}
