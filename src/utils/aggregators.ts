import type {
  Transaction, KPIData, DeclineReasonData, TrendPoint,
  MethodData, CountryData, DeclineCode, ComparisonTrendPoint, CountryTrendPoint,
} from '../types';
import { DECLINE_CODES, PAYMENT_METHOD_LABELS, COUNTRY_LABELS } from '../data/constants';
import { formatShortDate } from './formatters';

export function computeKPIs(txns: Transaction[]): KPIData {
  const total = txns.length;
  const declined = txns.filter(t => t.status === 'declined');
  const approved = total - declined.length;
  const soft = declined.filter(t => t.declineCategory === 'soft');
  const hard = declined.filter(t => t.declineCategory === 'hard');

  return {
    authRate: total > 0 ? (approved / total) * 100 : 0,
    previousAuthRate: 82,
    totalVolume: txns.reduce((s, t) => s + t.amount, 0),
    totalDeclined: declined.length,
    softDeclined: soft.length,
    hardDeclined: hard.length,
    recoverableRevenue: soft.reduce((s, t) => s + t.amount, 0),
    lostRevenue: hard.reduce((s, t) => s + t.amount, 0),
    highValueFailures: declined.filter(t => t.isHighValue).length,
  };
}

export function groupByDeclineCode(txns: Transaction[]): DeclineReasonData[] {
  const declined = txns.filter(t => t.status === 'declined' && t.declineCode);
  const total = declined.length;
  const counts: Partial<Record<DeclineCode, number>> = {};
  declined.forEach(t => {
    const c = t.declineCode!;
    counts[c] = (counts[c] ?? 0) + 1;
  });
  return (Object.entries(counts) as [DeclineCode, number][])
    .map(([code, count]) => ({
      code,
      label: DECLINE_CODES[code].label,
      count,
      category: DECLINE_CODES[code].category,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function groupBySoftHard(txns: Transaction[]) {
  const declined = txns.filter(t => t.status === 'declined');
  const soft = declined.filter(t => t.declineCategory === 'soft').length;
  const hard = declined.filter(t => t.declineCategory === 'hard').length;
  const total = declined.length;
  return {
    soft, hard, total,
    softPercent: total > 0 ? (soft / total) * 100 : 0,
    hardPercent: total > 0 ? (hard / total) * 100 : 0,
  };
}

export function groupByTrend(txns: Transaction[]): TrendPoint[] {
  const byDate = new Map<string, { approved: number; declined: number }>();
  txns.forEach(t => {
    const date = t.timestamp.slice(0, 10);
    const e = byDate.get(date) ?? { approved: 0, declined: 0 };
    t.status === 'approved' ? e.approved++ : e.declined++;
    byDate.set(date, e);
  });
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { approved, declined }]) => {
      const total = approved + declined;
      const d = new Date(date + 'T12:00:00Z');
      const dow = d.getUTCDay();
      return {
        date,
        label: formatShortDate(date),
        approvalRate: total > 0 ? (approved / total) * 100 : 0,
        approved,
        declined,
        total,
        isWeekend: dow === 0 || dow === 6,
        isMonthEnd: d.getUTCDate() >= 28,
      };
    });
}

export function groupByPaymentMethod(txns: Transaction[]): MethodData[] {
  return (['credit_card', 'digital_wallet', 'bank_transfer'] as const).map(method => {
    const mt = txns.filter(t => t.paymentMethod === method);
    const declined = mt.filter(t => t.status === 'declined').length;
    const approved = mt.length - declined;
    return {
      method,
      label: PAYMENT_METHOD_LABELS[method],
      declineRate: mt.length > 0 ? (declined / mt.length) * 100 : 0,
      approved,
      declined,
      total: mt.length,
    };
  });
}

export function groupByCountry(txns: Transaction[]): CountryData[] {
  return (['TH', 'VN', 'ID', 'PH'] as const).map(country => {
    const ct = txns.filter(t => t.country === country);
    const declined = ct.filter(t => t.status === 'declined').length;
    const approved = ct.length - declined;
    return {
      country,
      label: COUNTRY_LABELS[country],
      declineRate: ct.length > 0 ? (declined / ct.length) * 100 : 0,
      approved,
      declined,
      total: ct.length,
    };
  });
}

export function groupByTrendAndMethod(txns: Transaction[]): ComparisonTrendPoint[] {
  const byDate = new Map<string, Record<string, { ok: number; fail: number }>>();
  txns.forEach(t => {
    const date = t.timestamp.slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, { credit_card: { ok: 0, fail: 0 }, digital_wallet: { ok: 0, fail: 0 }, bank_transfer: { ok: 0, fail: 0 } });
    const entry = byDate.get(date)![t.paymentMethod];
    t.status === 'approved' ? entry.ok++ : entry.fail++;
  });
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, methods]) => ({
      date,
      label: formatShortDate(date),
      credit_card: safeRate(methods.credit_card),
      digital_wallet: safeRate(methods.digital_wallet),
      bank_transfer: safeRate(methods.bank_transfer),
    }));
}

export function groupByTrendAndCountry(txns: Transaction[]): CountryTrendPoint[] {
  const byDate = new Map<string, Record<string, { ok: number; fail: number }>>();
  txns.forEach(t => {
    const date = t.timestamp.slice(0, 10);
    if (!byDate.has(date)) byDate.set(date, { TH: { ok: 0, fail: 0 }, VN: { ok: 0, fail: 0 }, ID: { ok: 0, fail: 0 }, PH: { ok: 0, fail: 0 } });
    const entry = byDate.get(date)![t.country];
    t.status === 'approved' ? entry.ok++ : entry.fail++;
  });
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, countries]) => ({
      date,
      label: formatShortDate(date),
      TH: safeRate(countries.TH),
      VN: safeRate(countries.VN),
      ID: safeRate(countries.ID),
      PH: safeRate(countries.PH),
    }));
}

function safeRate(e: { ok: number; fail: number }): number {
  const total = e.ok + e.fail;
  return total > 0 ? (e.fail / total) * 100 : 0;
}
