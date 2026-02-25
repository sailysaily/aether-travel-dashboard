import type { Transaction, FilterState } from '../../types';
import { Badge, getStatusVariant } from '../shared/Badge';
import { Pagination } from '../shared/Pagination';
import { EmptyState } from '../shared/EmptyState';
import { PAGE_SIZE, PAYMENT_METHOD_LABELS, COUNTRY_LABELS, DECLINE_CODES } from '../../data/constants';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

interface TableProps {
  transactions: Transaction[];
  allFiltered: Transaction[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  state: FilterState;
  dispatch: React.Dispatch<{ type: 'SET'; key: keyof FilterState; value: FilterState[keyof FilterState] } | { type: 'SET_DECLINE_CODE'; payload: FilterState['declineCode'] } | { type: 'RESET' }>;
  onSelectRow: (t: Transaction) => void;
}

export function TransactionTable({
  transactions, currentPage, totalPages, totalCount, state, dispatch, onSelectRow,
}: TableProps) {
  const setSort = (col: FilterState['sortBy']) => {
    if (state.sortBy === col) {
      dispatch({ type: 'SET', key: 'sortDir', value: state.sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      dispatch({ type: 'SET', key: 'sortBy', value: col });
      dispatch({ type: 'SET', key: 'sortDir', value: 'desc' });
    }
  };

  const SortIcon = ({ col }: { col: FilterState['sortBy'] }) => {
    if (state.sortBy !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-600 ml-1">{state.sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200">
        <EmptyState
          title="No transactions match your filters"
          description="Try adjusting the filters above"
          icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">ID</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700"
                onClick={() => setSort('amount')}
              >
                Amount <SortIcon col="amount" />
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Method</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Country</th>
              <th
                className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700"
                onClick={() => setSort('date')}
              >
                Date <SortIcon col="date" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map(t => (
              <tr
                key={t.id}
                onClick={() => onSelectRow(t)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{t.customerName}</p>
                  <p className="text-xs text-gray-400">{t.customerId}</p>
                </td>
                <td className="px-4 py-3 font-semibold tabular-nums">
                  {formatCurrency(t.amount)}
                  {t.isHighValue && t.status === 'declined' && (
                    <span className="ml-1.5 text-xs bg-rose-100 text-rose-600 rounded px-1">High-value</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getStatusVariant(t.status, t.declineCategory)}>
                    {t.status === 'approved'
                      ? 'Approved'
                      : t.declineCategory === 'soft'
                        ? 'Soft Decline'
                        : 'Hard Decline'}
                  </Badge>
                  {t.declineCode && (
                    <p className="text-xs text-gray-400 mt-0.5">{DECLINE_CODES[t.declineCode].label}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{PAYMENT_METHOD_LABELS[t.paymentMethod]}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{COUNTRY_LABELS[t.country]}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  <p>{formatDate(t.timestamp)}</p>
                  <p className="text-gray-400">{formatTime(t.timestamp)}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={p => dispatch({ type: 'SET', key: 'page', value: p })}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
