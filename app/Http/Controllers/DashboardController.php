<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();
        $startOfMonth = now()->startOfMonth()->toDateString();
        $endOfMonth = now()->endOfMonth()->toDateString();

        $todayStats = Transaction::today()
            ->selectRaw('COUNT(*) as count, COALESCE(SUM(fee),0) as profit, COALESCE(SUM(amount),0) as volume')
            ->first();

        $monthStats = Transaction::thisMonth()
            ->selectRaw('COUNT(*) as count, COALESCE(SUM(fee),0) as profit, COALESCE(SUM(amount),0) as volume')
            ->first();

        $todayByType = Transaction::today()
            ->select('type', DB::raw('COUNT(*) as count'), DB::raw('COALESCE(SUM(fee),0) as profit'), DB::raw('COALESCE(SUM(amount),0) as volume'))
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        // Last 14 days of profit, for the trend chart
        $last14Days = Transaction::betweenDates(now()->subDays(13)->toDateString(), $today)
            ->select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('COALESCE(SUM(fee),0) as profit'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy(DB::raw('DATE(transaction_date)'))
            ->orderBy(DB::raw('DATE(transaction_date)'))
            ->get()
            ->keyBy(fn ($row) => Carbon::parse($row->date)->toDateString());

        $trend = collect(range(0, 13))->map(function ($i) use ($last14Days) {
            $date = now()->subDays(13 - $i)->toDateString();
            $row = $last14Days->get($date);

            return [
                'date' => $date,
                'profit' => $row ? (float) $row->profit : 0.0,
                'count' => $row ? (int) $row->count : 0,
            ];
        });

        // Monthly totals for the last 6 months.
        // Grouped in PHP (rather than a DB-specific date-format function) so this$row
        // works the same on SQLite, MySQL, or Postgres without changes.
        $rangeStart = now()->subMonths(5)->startOfMonth()->toDateString();
        $monthlyRows = Transaction::where('transaction_date', '>=', $rangeStart)
            ->select('transaction_date', 'fee')
            ->get()
            ->groupBy(fn ($row) => $row->transaction_date->format('Y-m'));

        $monthlyTrend = collect(range(0, 5))->map(function ($i) use ($monthlyRows) {
            $month = now()->subMonths(5 - $i);
            $key = $month->format('Y-m');
            $rows = $monthlyRows->get($key);

            return [
                'month' => $month->format('M'),
                'profit' => $rows ? (float) $rows->sum('fee') : 0.0,
            ];
        });

        $recentTransactions = Transaction::orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->limit(8)
            ->get();

        return Inertia::render('Dashboard', [
            'today' => [
                'count' => (int) $todayStats->count,
                'profit' => (float) $todayStats->profit,
                'volume' => (float) $todayStats->volume,
                'cashIn' => [
                    'count' => (int) ($todayByType->get('cash_in')->count ?? 0),
                    'profit' => (float) ($todayByType->get('cash_in')->profit ?? 0),
                    'volume' => (float) ($todayByType->get('cash_in')->volume ?? 0),
                ],
                'cashOut' => [
                    'count' => (int) ($todayByType->get('cash_out')->count ?? 0),
                    'profit' => (float) ($todayByType->get('cash_out')->profit ?? 0),
                    'volume' => (float) ($todayByType->get('cash_out')->volume ?? 0),
                ],
            ],
            'month' => [
                'count' => (int) $monthStats->count,
                'profit' => (float) $monthStats->profit,
                'volume' => (float) $monthStats->volume,
                'label' => now()->format('F Y'),
            ],
            'trend' => $trend,
            'monthlyTrend' => $monthlyTrend,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
