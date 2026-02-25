import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine,
} from 'recharts';
import { Card } from '../shared/Card';
import type { TrendPoint } from '../../types';
import { formatPercent } from '../../utils/formatters';

interface Props { data: TrendPoint[]; }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-blue-600 mt-0.5">Auth rate: <span className="font-semibold">{formatPercent(d.value)}</span></p>
    </div>
  );
}

export function TrendLineChart({ data }: Props) {
  const monthEndDates = data.filter(d => d.isMonthEnd).map(d => d.label);
  const weekendDates = data.filter(d => d.isWeekend).map(d => d.label);

  return (
    <Card padding={false} className="p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Approval Rate Trend</h2>
        <p className="text-xs text-gray-500 mt-0.5">Jan 11 – Feb 24, 2026 · daily approval rate</p>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-1.5 rounded bg-gray-200" /> Weekend
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-0 h-3 border-r border-dashed border-rose-400" /> Month-end
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="authGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            interval={6}
          />
          <YAxis
            domain={[40, 100]}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Weekend bands */}
          {weekendDates.map(d => (
            <ReferenceLine key={d} x={d} stroke="#E5E7EB" strokeWidth={8} strokeOpacity={0.5} />
          ))}
          {/* Month-end markers */}
          {monthEndDates.slice(0, 1).map(d => (
            <ReferenceLine key={d} x={d} stroke="#FDA4AF" strokeDasharray="4 2" label={{ value: 'Month-end', position: 'top', fontSize: 9, fill: '#9CA3AF' }} />
          ))}
          <Area
            type="monotone"
            dataKey="approvalRate"
            stroke="#2563EB"
            strokeWidth={2}
            fill="url(#authGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
