import { useState } from 'react';
import type { Transaction } from '../../types';
import { Badge, getStatusVariant } from '../shared/Badge';
import { EmptyState } from '../shared/EmptyState';
import { DECLINE_CODES, PAYMENT_METHOD_LABELS, COUNTRY_LABELS } from '../../data/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

type Tab = 'all' | 'soft' | 'hard';

interface AlertCardProps { transaction: Transaction; }

function AlertCard({ transaction: t }: AlertCardProps) {
  const codeInfo = t.declineCode ? DECLINE_CODES[t.declineCode] : null;
  const isSoft = t.declineCategory === 'soft';

  return (
    <div className={`bg-white rounded-xl border p-4 ${
      isSoft ? 'border-amber-200' : 'border-rose-200'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900">{t.customerName}</p>
            <Badge variant={getStatusVariant(t.status, t.declineCategory)}>
              {isSoft ? 'Soft — Retry' : 'Hard — Escalate'}
            </Badge>
          </div>
          <p className="font-mono text-xs text-gray-400 mt-0.5">{t.id}</p>
        </div>
        <p className="text-xl font-bold tabular-nums shrink-0" style={{ color: isSoft ? '#D97706' : '#E11D48' }}>
          {formatCurrency(t.amount)}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-gray-500">Decline</span>
        <span className="font-medium text-gray-700">{codeInfo?.label ?? t.declineCode}</span>
        <span className="text-gray-500">Method</span>
        <span className="font-medium text-gray-700">{PAYMENT_METHOD_LABELS[t.paymentMethod]}</span>
        <span className="text-gray-500">Country</span>
        <span className="font-medium text-gray-700">{COUNTRY_LABELS[t.country]}</span>
        <span className="text-gray-500">Date</span>
        <span className="font-medium text-gray-700">{formatDate(t.timestamp)}</span>
      </div>

      {isSoft && codeInfo?.recoveryPath && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-xs font-medium text-amber-800 mb-0.5">Recovery Action</p>
          <p className="text-xs text-amber-700">{codeInfo.recoveryPath}</p>
        </div>
      )}
      {!isSoft && codeInfo?.escalationPath && (
        <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-100">
          <p className="text-xs font-medium text-rose-800 mb-0.5">Escalation Action</p>
          <p className="text-xs text-rose-700">{codeInfo.escalationPath}</p>
        </div>
      )}
    </div>
  );
}

interface AlertsPanelProps {
  all: Transaction[];
  soft: Transaction[];
  hard: Transaction[];
  totalRecoverable: number;
  totalLost: number;
}

export function AlertsPanel({ all, soft, hard, totalRecoverable, totalLost }: AlertsPanelProps) {
  const [tab, setTab] = useState<Tab>('all');
  const shown = tab === 'all' ? all : tab === 'soft' ? soft : hard;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: 'All Failures', count: all.length },
    { id: 'soft', label: 'Soft — Retry', count: soft.length },
    { id: 'hard', label: 'Hard — Escalate', count: hard.length },
  ];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Recoverable (Soft)</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(totalRecoverable)}</p>
          <p className="text-xs text-amber-600 mt-0.5">{soft.length} transactions — send retry links now</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <p className="text-xs font-medium text-rose-700 uppercase tracking-wide">Lost (Hard)</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{formatCurrency(totalLost)}</p>
          <p className="text-xs text-rose-600 mt-0.5">{hard.length} transactions — contact customers directly</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            <span className={`ml-2 text-xs rounded-full px-1.5 py-0.5 ${
              tab === t.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {shown.length === 0 ? (
          <EmptyState title="No alerts in this category" />
        ) : (
          shown.map(t => <AlertCard key={t.id} transaction={t} />)
        )}
      </div>
    </div>
  );
}
