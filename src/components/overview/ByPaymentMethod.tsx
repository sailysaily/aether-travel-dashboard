import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from 'recharts';
import { Card } from '../shared/Card';
import type { MethodData } from '../../types';
import { formatPercent } from '../../utils/formatters';

interface Props { data: MethodData[]; }

const METHOD_COLOR: Record<string, string> = {
  credit_card: '#3B82F6',
  digital_wallet: '#8B5CF6',
  bank_transfer: '#E11D48',
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: MethodData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900">{d.label}</p>
      <p className="text-gray-600 mt-0.5">Decline rate: <span className="font-bold">{formatPercent(d.declineRate)}</span></p>
      <p className="text-gray-500 text-xs mt-1">{d.declined} declined of {d.total} total</p>
    </div>
  );
}

export function ByPaymentMethod({ data }: Props) {
  return (
    <Card padding={false} className="p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Decline Rate by Payment Method</h2>
        <p className="text-xs text-gray-500 mt-0.5">Bank transfer shows the highest failure rate</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
          <Bar dataKey="declineRate" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {data.map((entry, i) => (
              <Cell key={i} fill={METHOD_COLOR[entry.method] ?? '#94A3B8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-rose-50 rounded-lg border border-rose-100">
        <p className="text-xs text-rose-700">
          <span className="font-semibold">Bank Transfer has a {formatPercent(data.find(d => d.method === 'bank_transfer')?.declineRate ?? 0)} decline rate</span>
          {' '}— nearly 2× the rate of credit cards. Consider routing bank transfer customers to an alternative method at checkout.
        </p>
      </div>
    </Card>
  );
}
