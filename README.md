# Aether Travel — Payment Intelligence Dashboard

An interactive analytics dashboard for diagnosing payment declines across Southeast Asian travel markets.

## Live Demo

Deployed on Vercel: [aether-travel-dashboard.vercel.app](https://aether-travel-dashboard.vercel.app)

## The Problem

Aether Travel’s payment approval rate dropped from 82% → 71%, costing ~$450K/month. This dashboard gives the operations team visibility into **why** payments are failing and **what to do about it**.

## Soft vs. Hard Declines

The single most important concept in this dashboard:

| | Soft Decline 🟡 | Hard Decline 🔴 |
|---|---|---|
| **What it means** | Temporary — the bank said “not now” | Permanent — the bank said “never” |
| **Retriable?** | Yes — revenue recovery is possible | No — retrying wastes effort |
| **Action** | Send retry link, wait 24–48h | Ask customer for new payment method |
| **Color** | **Amber** throughout the dashboard | **Rose** throughout the dashboard |

**Soft declines are opportunities. Hard declines require customer escalation.**

## Features

- **Overview** — KPI strip (auth rate, recoverable/lost revenue, high-value failures), 5 charts
- **Decline Reason Chart** — click any bar to pre-filter the transaction table
- **Soft/Hard Donut** — shows what % of declines are retriable
- **Trend Chart** — daily approval rate over 45 days with weekend bands and month-end markers
- **Transactions** — 8 filter controls + debounced search by ID or name; click row for drawer with recovery guidance
- **High-Value Alerts** — all failed transactions >$500, tabbed by Soft (retry) / Hard (escalate)
- **Comparison** — side-by-side trend lines by payment method and country

## Tech Stack

| Tool | Why |
|---|---|
| React 18 + TypeScript | Type-safe components; eliminates runtime errors |
| Vite | Sub-second HMR, ~45s production builds |
| Recharts | Composable chart library with full React control |
| Tailwind CSS | Consistent design tokens without per-component CSS |
| React Router v6 | SPA routing; `vercel.json` rewrite handles direct URL access |

## Data

450 seeded transactions generated at build time (no backend required):
- 45-day window: Jan 11 – Feb 24, 2026
- Countries: Thailand 35%, Vietnam 25%, Indonesia 25%, Philippines 15%
- Methods: Credit Card 55% (26% decline), Digital Wallet 30% (18%), Bank Transfer 15% (45%)
- Temporal patterns: weekends have 40% more volume; month-end sees 3× `insufficient_funds`

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel

1. Push this repo to GitHub
2. Import at [vercel.com](https://vercel.com) — no environment variables needed
3. `vercel.json` handles SPA routing so direct URLs like `/transactions` work
