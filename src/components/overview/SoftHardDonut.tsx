import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';
import { formatPercent } from '../../utils/formatters';

interface SoftHardData {
  soft: number; hard: number; total: number;
  softPercent: number; hardPercent: number;
}

const SOFT_COLOR = '#D97706';
const HARD_COLOR = '#E11D48';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string; description: string } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold" style={{ color: d.payload.color }}>{d.name}</p>
      <p className="text-gray-600 mt-0.5">{d.value} declines</p>
      <p className="text-xs text-gray-500 mt-1">{d.payload.description}</p>
    </div>
  );
}

export function SoftHardDonut({ data }: { data: SoftHardData }) {
  const chartData = [
    {
      name: 'Soft Declines',
      value: data.soft,
      color: SOFT_COLOR,
      description: 'Retriable — revenue recovery is possible',
    },
    {
      name: 'Hard Declines',
      value: data.hard,
      color: HARD_COLOR,
      description: 'Permanent — customer action required',
    },
  ];

  return (
    <Card>
      <h2 className="text-sm font-semibold text-gray-900 mb-1">Soft vs. Hard Declines</h2>
      <p className="text-xs text-gray-500 mb-4">Understanding where your revenue recovery opportunities are</p>

      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xl font-bold text-amber-600">{formatPercent(data.softPercent, 0)}</p>
          <p className="text-xs text-gray-500">Retriable</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <div className="w-3 h-3 rounded-full bg-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-800">Soft Declines — {formatPercent(data.softPercent, 0)} ({data.soft})</p>
            <p className="text-xs text-amber-700 mt-0.5">Temporary bank holds. Retry logic, payment links, or waiting 24–48h can recover this revenue.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg border border-rose-100">
          <div className="w-3 h-3 rounded-full bg-rose-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-rose-800">Hard Declines — {formatPercent(data.hardPercent, 0)} ({data.hard})</p>
            <p className="text-xs text-rose-700 mt-0.5">Permanent failures. The customer must provide a new payment method. Contact them directly.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
