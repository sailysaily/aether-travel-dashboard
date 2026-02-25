import { useReducer, useMemo, useEffect, useState } from 'react';
import type { FilterState } from '../types';
import { transactions } from '../data/transactions';
import { PAGE_SIZE } from '../data/constants';

const DEFAULT_STATE: FilterState = {
  search: '',
  dateFrom: '',
  dateTo: '',
  status: 'all',
  paymentMethod: 'all',
  declineCode: 'all',
  declineCategory: 'all',
  country: 'all',
  amountMin: '',
  amountMax: '',
  sortBy: 'date',
  sortDir: 'desc',
  page: 1,
};

type Action =
  | { type: 'SET'; key: keyof FilterState; value: FilterState[keyof FilterState] }
  | { type: 'SET_DECLINE_CODE'; payload: FilterState['declineCode'] }
  | { type: 'RESET' };

function reducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case 'SET': {
      const isPageKey = action.key === 'page';
      return { ...state, [action.key]: action.value, page: isPageKey ? (action.value as number) : 1 };
    }
    case 'SET_DECLINE_CODE':
      return { ...state, declineCode: action.payload, status: 'declined', page: 1 };
    case 'RESET':
      return DEFAULT_STATE;
    default:
      return state;
  }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useTransactionFilters(initialDeclineCode?: string) {
  const init: FilterState = initialDeclineCode
    ? { ...DEFAULT_STATE, declineCode: initialDeclineCode as FilterState['declineCode'], status: 'declined' }
    : DEFAULT_STATE;

  const [state, dispatch] = useReducer(reducer, init);
  const debouncedSearch = useDebounce(state.search, 200);

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q)
      );
    }
    if (state.dateFrom) result = result.filter(t => t.timestamp.slice(0, 10) >= state.dateFrom);
    if (state.dateTo) result = result.filter(t => t.timestamp.slice(0, 10) <= state.dateTo);
    if (state.status !== 'all') result = result.filter(t => t.status === state.status);
    if (state.paymentMethod !== 'all') result = result.filter(t => t.paymentMethod === state.paymentMethod);
    if (state.declineCode !== 'all') result = result.filter(t => t.declineCode === state.declineCode);
    if (state.declineCategory !== 'all') result = result.filter(t => t.declineCategory === state.declineCategory);
    if (state.country !== 'all') result = result.filter(t => t.country === state.country);
    if (state.amountMin) { const v = parseFloat(state.amountMin); if (!isNaN(v)) result = result.filter(t => t.amount >= v); }
    if (state.amountMax) { const v = parseFloat(state.amountMax); if (!isNaN(v)) result = result.filter(t => t.amount <= v); }

    result.sort((a, b) => {
      const dir = state.sortDir === 'asc' ? 1 : -1;
      if (state.sortBy === 'amount') return (a.amount - b.amount) * dir;
      return a.timestamp.localeCompare(b.timestamp) * dir;
    });

    return result;
  }, [debouncedSearch, state.dateFrom, state.dateTo, state.status, state.paymentMethod,
      state.declineCode, state.declineCategory, state.country, state.amountMin,
      state.amountMax, state.sortBy, state.sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(state.page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return { state, dispatch, filtered, paginated, totalPages, currentPage, totalCount: filtered.length };
}
