export type TransactionType = 'cash_in' | 'cash_out';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: string; // Laravel decimal casts serialize as strings
  fee: string;
  transaction_date: string; // YYYY-MM-DD
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeeTier {
  id: number;
  min_amount: number;
  max_amount: number | null;
  fee: string;
  sort_order: number;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: { url: string | null; label: string; active: boolean }[];
}

export interface TypeBreakdown {
  count: number;
  profit: number;
  volume: number;
}

export interface DashboardProps {
  today: TypeBreakdown & { cashIn: TypeBreakdown; cashOut: TypeBreakdown };
  month: TypeBreakdown & { label: string };
  trend: { date: string; profit: number; count: number }[];
  monthlyTrend: { month: string; profit: number }[];
  recentTransactions: Transaction[];
}

export interface TransactionsIndexProps {
  transactions: Paginated<Transaction>;
  filters: { from?: string; to?: string; type?: TransactionType };
  summary: { count: number; profit: number; volume: number };
}

export interface FeeTiersPageProps {
  tiers: FeeTier[];
}
