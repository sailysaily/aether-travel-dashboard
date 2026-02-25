import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { FilterPanel } from '../components/transactions/FilterPanel';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionDrawer } from '../components/transactions/TransactionDrawer';
import { SearchInput } from '../components/shared/SearchInput';
import type { Transaction } from '../types';

export default function Transactions() {
  const location = useLocation();
  const initialCode = (location.state as Record<string, string> | null)?.declineCode;

  const { state, dispatch, paginated, filtered, totalPages, currentPage, totalCount } =
    useTransactionFilters(initialCode);

  const [selected, setSelected] = useState<Transaction | null>(null);

  // Clear location state after consuming it
  useEffect(() => {
    window.history.replaceState({}, '');
  }, []);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{totalCount} matching transactions</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchInput
            value={state.search}
            onChange={v => dispatch({ type: 'SET', key: 'search', value: v })}
            placeholder="Search by ID or customer name…"
          />
        </div>
      </div>

      <FilterPanel state={state} dispatch={dispatch} />

      <TransactionTable
        transactions={paginated}
        allFiltered={filtered}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        state={state}
        dispatch={dispatch}
        onSelectRow={t => setSelected(t)}
      />

      <TransactionDrawer transaction={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
