# Aether Travel — Payment Intelligence Dashboard

An interactive analytics dashboard for diagnosing payment declines across Southeast Asian travel markets.

## Live Demo

Deployed on Vercel: see the URL from your Vercel project dashboard after importing this repo.

---

## The Problem

Aether Travel’s payment approval rate dropped from 82% → 71%, costing ~$450K/month. The operations team had no visibility into *why* payments were failing — just green/red indicators. This dashboard gives them the ability to **see, diagnose, and act on** payment failures.

---

## Soft vs. Hard Declines — The Core Concept

The single most important idea in this dashboard:

| | Soft Decline 🟡 Amber | Hard Decline 🔴 Rose |
|---|---|---|
| **What it means** | Temporary — the bank said “not now” | Permanent — the bank said “never” |
| **Retriable?** | Yes — revenue recovery is possible | No — retrying wastes effort and may trigger fraud flags |
| **Team action** | Send retry link, wait 24–48h | Ask customer for a new payment method |
| **Color** | **Amber** consistently across all views | **Rose** consistently across all views |

Every badge, chart bar, tooltip, drawer panel, and alert card uses this color encoding. An operations staff member should never have to guess whether a decline is recoverable.

---

## Features

### Core
- **Overview Dashboard** — KPI strip (auth rate vs. prior period, recoverable revenue, lost revenue, high-value failure count) + 5 charts
- **Decline Reason Chart** — horizontal bar chart; amber = soft, rose = hard; click any bar to jump to transactions pre-filtered by that code
- **Soft/Hard Donut** — shows what % of declines are retriable with plain-language explanations for operations staff
- **Approval Rate Trend** — 45-day area chart with weekend bands and month-end markers
- **By Payment Method** — bar chart showing decline rate per method; insight callout for bank transfer
- **By Country** — color-coded bars (green/amber/rose) by decline rate threshold

### Transaction Search & Filter
- 8 filter controls: date range, status, payment method, decline code, decline type (soft/hard), country, amount range
- Debounced search (200ms) by transaction ID prefix or customer name
- 25 rows/page with smart pagination (first/last + window around current page)
- Sortable columns (date, amount)
- Click any row → drawer with full transaction details + **Recovery Path** (soft) or **Escalation Path** (hard)

### Stretch Goals (both implemented)
- **High-Value Alerts** (`/alerts`) — all failed transactions >$500, tabbed: All / Soft (Retry) / Hard (Escalate); each card shows the exact action to take
- **Comparison View** (`/comparison`) — side-by-side trend lines: decline rate by payment method (3 lines) and by country (4 lines) over 45 days

---

## Written Walkthrough

### 1. Main Dashboard (`/`)
On load, the KPI strip immediately shows the auth rate at ~73% (down 9 pp from 82%). Two numbers stand out: **Recoverable Revenue** (amber — soft declines that can be retried) and **Lost Revenue** (rose — permanent failures). Below, the Decline Reason chart shows `insufficient_funds` and `do_not_honor` as the top two failures, both in amber (soft), confirming most failures are retriable. The donut confirms ~65% of declines are soft. The trend chart shows daily approval rate with a visible dip near month-end (Jan 28–31), consistent with the `insufficient_funds` spike baked into the data.

### 2. Search & Filter for a Specific Transaction
1. Click **Transactions** in the sidebar
2. Type `TXN-00042` in the search box — the table filters instantly (debounced 200ms)
3. Click the row — a drawer slides in showing the full transaction, the decline code, a plain-language explanation, and either a Recovery Path or Escalation Path
4. Alternatively: go back to Overview, click the `Insufficient Funds` bar — you are taken directly to Transactions with that filter pre-applied

### 3. Stretch Features
- **Alerts page**: Shows all high-value failures (>$500). Click “Soft — Retry” tab to see only recoverable ones with retry instructions per decline code. Click “Hard — Escalate” to see permanent failures requiring customer outreach.
- **Comparison page**: Two line charts side-by-side. Bank Transfer (rose line) sits visibly above Credit Card and Digital Wallet throughout the period, confirming it as the highest-risk method. Philippines (purple) shows elevated decline rate vs. Thailand.

---

## Tech Stack

| Tool | Why |
|---|---|
| React 18 + TypeScript | Type-safe components; shared types between data layer and UI eliminate runtime errors |
| Vite | Sub-second HMR for development; ~45s production build |
| Recharts | Composable React-first chart library; custom tooltips and click handlers are straightforward |
| Tailwind CSS | Design tokens (amber/rose/emerald) applied consistently across 40+ components without per-component CSS files |
| React Router v6 | SPA routing; `vercel.json` rewrite rule handles direct URL access to `/transactions`, `/alerts`, `/comparison` |

---

## Test Data

450 seeded transactions generated at build time (no backend, no external API):

| Attribute | Value |
|---|---|
| Period | Jan 11 – Feb 24, 2026 (45 days) |
| Overall decline rate | ~26% (by payment method weighting) |
| Soft/hard split | ~65% soft / 35% hard |
| Countries | Thailand 35%, Vietnam 25%, Indonesia 25%, Philippines 15% |
| Methods | Credit Card 55% (26% decline), Digital Wallet 30% (18%), Bank Transfer 15% (45%) |
| Temporal patterns | Weekends have 40% higher volume; days 28–31 have 3× `insufficient_funds` rate |
| High-value failures | ~35 declined transactions above $500 |
| Decline codes | 10 codes with realistic frequency distribution |

Data is generated using a seeded PRNG (mulberry32, seed=42) so results are identical on every build.

---

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No environment variables needed.

```bash
npm run build   # TypeScript check + Vite production build
npm run preview # Preview the production build locally
```

---

## Assumptions Made

1. **USD currency only** — the spec mentioned amounts in $50–$2,000 range; all transactions are in USD for simplicity
2. **Static dataset** — "real-time" in the spec was interpreted as *interactive* (fast filtering/drill-down), not live data streaming
3. **45-day window** — chosen within the 30–60 day spec range to include one full month-end cycle and meaningful weekend/weekday contrast
4. **`invalid_cvv` as hard decline** — some processors treat CVV failures as soft; we classify as hard because a wrong CVV on retry indicates fraud risk
5. **High-value threshold at $500** — the spec said “e.g., >$500”; we used exactly $500 as the threshold
6. **No backend** — the spec said “with or without a backend”; static data was chosen for zero-config deployment

---

## What I Would Add With More Time

1. **Retry queue workflow** — a bulk-select action to send retry payment links to all soft-declined customers in one click
2. **Date range picker on all pages** — currently the data window is fixed; a shared date context would let all charts respond to the same filter
3. **Real-time data via WebSocket** — stream live payment events so the dashboard reflects the last 60 minutes, not a static snapshot
4. **Cohort analysis** — track individual customers across multiple failed attempts to identify repeat decline patterns
5. **Export to CSV** — operations teams invariably want to export filtered transaction lists for offline analysis or ticketing systems
6. **Decline rate benchmarking** — show how Aether’s rates compare to industry averages for each payment method and region
7. **Alert thresholds** — email/Slack notification when decline rate for a specific method or country exceeds a configurable threshold
