# GCash Profit Tracker

A Laravel + TypeScript (React/Inertia) app for tracking the profit (service fee) you earn
on every GCash cash-in / cash-out transaction, with daily and monthly income tracking.
UI is styled in **claymorphism** — soft, puffy, rounded surfaces with dual light/dark shadows.

## What's included

- **Configurable fee tiers** (Settings → Fee Tiers). Ships pre-seeded with your example:
  - ₱1 – ₱299 → ₱3 fee
  - ₱300 – ₱599 → ₱5 fee
  - ₱600 and up → ₱10 fee
  - You can add/edit/delete tiers any time — new transactions always use the current tiers.
- **Dashboard**: today's profit, this month's profit, cash-in vs cash-out breakdown,
  a 14-day daily trend and a 6-month trend, recent transactions, and a quick-add form
  with a live fee preview as you type the amount.
- **Transactions page**: full list with date-range + type filters, inline edit (fee
  auto-recalculates if you change the amount), delete, and pagination.
- Fee is calculated **server-side** (`app/Services/FeeCalculator.php`) so it can't be
  tampered with from the browser.

## Stack

- Laravel 11 (PHP)
- Inertia.js + React 18 + **TypeScript**
- Tailwind CSS (claymorphism design tokens in `resources/css/app.css`)
- SQLite by default (swap to MySQL/Postgres easily — see below)

## Setup

This repo contains the **application code** (models, controllers, migrations, and the
full TypeScript/React frontend). Because I can't run Composer/NPM in this sandbox, start
from a fresh Laravel install and drop these files in — it takes about 5 minutes:

```bash
# 1. Create a fresh Laravel app
composer create-project laravel/laravel gcash-tracker
cd gcash-tracker

# 2. Install Inertia (server-side) + React/TS scaffolding
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
# Add \App\Http\Middleware\HandleInertiaRequests::class to the 'web'
# middleware group in bootstrap/app.php (Laravel 11) or app/Http/Kernel.php (Laravel 10)

# 3. Install frontend deps (this package.json already lists everything you need)
npm install

# 4. Copy the files from this download over the fresh install,
#    overwriting package.json, vite.config.ts, tsconfig.json, tailwind.config.js,
#    postcss.config.js, and the app/, database/, resources/, routes/ folders.

# 5. Point .env at SQLite (simplest) ...
touch database/database.sqlite
```

In `.env`, set:
```
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/gcash-tracker/database/database.sqlite
```
(Or configure MySQL/Postgres as usual — the code has no SQLite-specific queries.)

```bash
# 6. Migrate + seed the default fee tiers
php artisan migrate --seed

# 7. Run it
npm run dev        # in one terminal — Vite dev server
php artisan serve  # in another terminal — Laravel app

# visit http://127.0.0.1:8000
```

### Adding login (optional but recommended)

Right now every route is open — anyone with the URL can see and add transactions.
If you're deploying this somewhere besides your own machine, install
[Laravel Breeze](https://laravel.com/docs/starter-kits) or Fortify, then wrap the
routes in `routes/web.php` in `Route::middleware(['auth'])->group(fn () => ...)`.

## Project structure

```
app/
  Models/Transaction.php       — transaction record + query scopes (today/thisMonth/betweenDates)
  Models/FeeTier.php           — configurable fee bracket
  Services/FeeCalculator.php   — looks up the right fee for an amount
  Http/Controllers/
    DashboardController.php    — daily/monthly aggregates, 14-day & 6-month trends
    TransactionController.php  — CRUD + live fee preview endpoint
    FeeTierController.php      — manage fee brackets

database/migrations/           — fee_tiers, transactions
database/seeders/FeeTierSeeder.php  — seeds your example tiers

resources/js/
  Pages/Dashboard.tsx
  Pages/Transactions/Index.tsx
  Pages/Settings/FeeTiers.tsx
  Components/                  — StatCard, TransactionForm, ClayBarChart
  Layouts/AppLayout.tsx
  types/index.ts                — shared TS types for all page props
resources/css/app.css          — claymorphism tokens & utility classes (.clay, .clay-inset, .clay-btn...)
```

## Customizing the fee tiers later

You don't need to touch code — go to **Settings → Fee Tiers** in the app. If you'd rather
seed different defaults, edit `database/seeders/FeeTierSeeder.php` and re-run
`php artisan db:seed --class=FeeTierSeeder`.
