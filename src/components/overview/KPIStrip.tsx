import { Card } from '../shared/Card';
import type { KPIData } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface KPIStripProps { kpis: KPIData; }

function KPICard({
  label, value, sub, valueColor = 'text-gray-900', subColor = 'text-gray-500',
}: { label: string; value: string; sub?: string; valueColor?: string; subColor?: string }) {
  return (
    <Card className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-1.5 text-3xl font-bold tabular-nums ${valueColor}`}>{value}</p>
      {sub && <p className={`mt-1 text-xs ${subColor}`}>{sub}</p>}
    </Card>
  );
}

export function KPIStrip({ kpis }: KPIStripProps) {
  const delta = kpis.authRate - kpis.previousAuthRate;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label="Auth Rate"
        value={formatPercent(kpis.authRate)}
        sub={`${delta.toFixed(1)} pp vs prior period (${formatPercent(kpis.previousAuthRate)})`}
        valueColor={kpis.authRate < kpis.previousAuthRate ? 'text-rose-600' : 'text-emerald-600'}
        subColor="text-rose-500"
      />
      <KPICard
        label="Recoverable Revenue"
        value={formatCurrency(kpis.recoverableRevenue)}
        sub={`${kpis.softDeclined} soft declines — can be retried`}
        valueColor="text-amber-600"
        subColor="text-amber-600"
      />
      <KPICard
        label="Lost Revenue"
        value={formatCurrency(kpis.lostRevenue)}
        sub={`${kpis.hardDeclined} hard declines — permanent`}
        valueColor="text-rose-600"
        subColor="text-rose-500"
      />
      <KPICard
        label="High-Value Failures"
        value={String(kpis.highValueFailures)}
        sub={`Declined transactions over $500`}
        valueColor="text-gray-900"
      />
    </div>
  );
}
