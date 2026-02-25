import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';
import { Card } from '../shared/Card';
import type { ComparisonTrendPoint, CountryTrendPoint } from '../../types';
import { formatPercent } from '../../utils/formatters';

const METHOD_COLORS = {
  credit_card: '#3B82F6',
  digital_wallet: '#8B5CF6',
  bank_transfer: '#E11D48',
};

const COUNTRY_COLORS = {
  TH: '#059669',
  VN: '#D97706',
  ID: '#2563EB',
  PH: '#7C3AED',
};

function MethodTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {formatPercent(p.value)}</p>
      ))}
    </div>
  );
}

interface Props {
  methodData: ComparisonTrendPoint[];
  countryData: CountryTrendPoint[];
}

export function ComparisonView({ methodData, countryData }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card padding={false} className="p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Decline Rate by Payment Method</h2>
        <p className="text-xs text-gray-500 mb-4">Daily trend — 45-day window</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={methodData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={6} />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<MethodTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="credit_card" name="Credit Card" stroke={METHOD_COLORS.credit_card} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="digital_wallet" name="Digital Wallet" stroke={METHOD_COLORS.digital_wallet} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="bank_transfer" name="Bank Transfer" stroke={METHOD_COLORS.bank_transfer} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card padding={false} className="p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Decline Rate by Country</h2>
        <p className="text-xs text-gray-500 mb-4">Daily trend — 45-day window</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={countryData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} interval={6} />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<MethodTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="TH" name="Thailand" stroke={COUNTRY_COLORS.TH} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="VN" name="Vietnam" stroke={COUNTRY_COLORS.VN} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ID" name="Indonesia" stroke={COUNTRY_COLORS.ID} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="PH" name="Philippines" stroke={COUNTRY_COLORS.PH} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
