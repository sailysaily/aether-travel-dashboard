import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Card } from '../shared/Card';
import type { DeclineReasonData } from '../../types';

interface Props { data: DeclineReasonData[]; }

const SOFT_COLOR = '#D97706';
const HARD_COLOR = '#E11D48';

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DeclineReasonData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm max-w-xs">
      <p className="font-semibold text-gray-900">{d.label}</p>
      <p className="text-gray-600 mt-0.5">{d.count} declines ({d.percentage.toFixed(1)}%)</p>
      <p className={`mt-1.5 text-xs font-medium ${
        d.category === 'soft' ? 'text-amber-700' : 'text-rose-700'
      }`}>
        {d.category === 'soft'
          ? '⚡ Soft Decline — retriable, revenue recovery possible'
          : '🚫 Hard Decline — permanent, customer action required'}
      </p>
    </div>
  );
}

export function DeclineReasonChart({ data }: Props) {
  const navigate = useNavigate();

  const handleClick = (entry: DeclineReasonData) => {
    navigate('/transactions', { state: { declineCode: entry.code } });
  };

  return (
    <Card padding={false} className="p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Top Decline Reasons</h2>
        <p className="text-xs text-gray-500 mt-0.5">Click a bar to filter transactions by this reason</p>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="w-3 h-3 rounded-sm bg-amber-500" /> Soft — Retriable
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="w-3 h-3 rounded-sm bg-rose-600" /> Hard — Permanent
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
          onClick={(e) => { if (e?.activePayload?.[0]) handleClick(e.activePayload[0].payload as DeclineReasonData); }}
          style={{ cursor: 'pointer' }}
        >
          <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={130}
            tick={{ fontSize: 11, fill: '#374151' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.category === 'soft' ? SOFT_COLOR : HARD_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
