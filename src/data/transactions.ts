import type { Transaction, DeclineCode, PaymentMethod, Country } from '../types';
import { SOFT_CODES } from './constants';

// Seeded PRNG (mulberry32) — ensures reproducible data
function mulberry32(seed: number) {
  let s = seed;
  return function (): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

function pickWeighted<T>(items: readonly T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function generateAmount(): number {
  const r = rand();
  if (r < 0.38) return Math.round((50 + rand() * 250) * 100) / 100;
  if (r < 0.62) return Math.round((300 + rand() * 200) * 100) / 100;
  if (r < 0.83) return Math.round((500 + rand() * 500) * 100) / 100;
  return Math.round((1000 + rand() * 1000) * 100) / 100;
}

// 45-day window: Jan 11 – Feb 24, 2026
const START_MS = new Date('2026-01-11T00:00:00Z').getTime();
const END_MS = new Date('2026-02-24T23:59:59Z').getTime();
const RANGE_MS = END_MS - START_MS;

function generateTimestamp(): string {
  const ms = START_MS + rand() * RANGE_MS;
  return new Date(ms).toISOString();
}

const COUNTRIES = ['TH', 'VN', 'ID', 'PH'] as const;
const COUNTRY_WEIGHTS = [35, 25, 25, 15];

const METHODS = ['credit_card', 'digital_wallet', 'bank_transfer'] as const;
const METHOD_WEIGHTS = [55, 30, 15];
const METHOD_DECLINE_RATES: Record<PaymentMethod, number> = {
  credit_card: 0.26,
  digital_wallet: 0.18,
  bank_transfer: 0.45,
};

const ALL_DECLINE_CODES: DeclineCode[] = [
  'insufficient_funds', 'do_not_honor', 'fraud_suspected', 'network_timeout',
  'expired_card', 'issuer_unavailable', 'invalid_cvv', 'lost_stolen_card',
  'card_not_supported', 'invalid_card_number',
];
const BASE_DECLINE_WEIGHTS = [28, 20, 12, 10, 10, 7, 5, 4, 3, 1];

function pickDeclineCode(dayOfMonth: number): DeclineCode {
  // Days 28-31: insufficient_funds rate triples (month-end cash flow crunch)
  const weights = [...BASE_DECLINE_WEIGHTS];
  if (dayOfMonth >= 28) weights[0] *= 3;
  return pickWeighted(ALL_DECLINE_CODES, weights);
}

const FIRST_NAMES = [
  'James', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'John', 'Anna',
  'Robert', 'Maria', 'Wei', 'Yuki', 'Chen', 'Priya', 'Ahmad', 'Siti',
  'Tom', 'Nina', 'Carlos', 'Aisha', 'Lucas', 'Mei', 'Omar', 'Sophie',
];
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez',
  'Davis', 'Wilson', 'Taylor', 'Nguyen', 'Park', 'Kim', 'Santos', 'Cruz',
  'Reyes', 'Lee', 'Tanaka', 'Patel', 'Hassan', 'Tran', 'Bautista', 'Rizal', 'Chai',
];

function generateName(): string {
  const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];

  for (let i = 0; i < 450; i++) {
    const timestamp = generateTimestamp();
    const dayOfMonth = new Date(timestamp).getUTCDate();
    const method = pickWeighted(METHODS, METHOD_WEIGHTS);
    const isDeclined = rand() < METHOD_DECLINE_RATES[method];
    const amount = generateAmount();
    const country = pickWeighted(COUNTRIES, COUNTRY_WEIGHTS);
    const declineCode = isDeclined ? pickDeclineCode(dayOfMonth) : undefined;
    const declineCategory = declineCode
      ? (SOFT_CODES.includes(declineCode) ? 'soft' : 'hard')
      : undefined;

    txns.push({
      id: `TXN-${String(i + 1).padStart(5, '0')}`,
      customerId: `CUST-${String(Math.floor(rand() * 2000) + 1).padStart(4, '0')}`,
      customerName: generateName(),
      amount,
      currency: 'USD',
      status: isDeclined ? 'declined' : 'approved',
      declineCode,
      declineCategory,
      paymentMethod: method,
      country,
      timestamp,
      isHighValue: amount > 500,
    });
  }

  return txns.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export const transactions: Transaction[] = generateTransactions();
