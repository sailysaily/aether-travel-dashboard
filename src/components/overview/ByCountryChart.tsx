import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from 'recharts';
import { Card } from '../shared/Card';
import type { CountryData } from '../../types';
import { formatPercent } from '../../utils/formatters';

interface Props { data: CountryData[]; }

function getBarColor(rate: number): string {
  if (rate < 20) return '#059669';
  if (rate < 30) return '#D97706';
  return '#E11D48';
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CountryData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const color = getBarColor(d.declineRate);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900">{d.label}</p>
      <p style={{ color }} className="mt-0.5 font-bold">{formatPercent(d.declineRate)}</p>
      <p className="text-gray-500 text-xs mt-1">{d.declined} declined of {d.total} total</p>
    </div>
  );
}

export function ByCountryChart({ data }: Props) {
  return (
    <Card padding={false} className="p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Decline Rate by Country</h2>
        <p className="text-xs text-gray-500 mt-0.5">Color: green &lt;20% · amber 20–30% · rose &gt;30%</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
          <Bar dataKey="declineRate" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getBarColor(entry.declineRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex gap-3 text-xs">
        <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-emerald-600" /> &lt;20%</span>
        <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-amber-500" /> 20–30%</span>
        <span className="flex items-center gap-1 text-gray-500"><span className="w-2 h-2 rounded-full bg-rose-600" /> &gt;30%</span>
      </div>
    </Card>
  );
}
