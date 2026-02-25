import type { Dispatch } from 'react';
import { Select } from '../shared/Select';
import type { FilterState } from '../../types';
import { DECLINE_CODES } from '../../data/constants';
import type { DeclineCode } from '../../types';
import type { FilterAction } from '../../hooks/useTransactionFilters';

const ALL_DECLINE_CODES = Object.keys(DECLINE_CODES) as DeclineCode[];

interface FilterPanelProps {
  state: FilterState;
  dispatch: Dispatch<FilterAction>;
}

export function FilterPanel({ state, dispatch }: FilterPanelProps) {
  const set = (key: keyof FilterState, value: FilterState[keyof FilterState]) =>
    dispatch({ type: 'SET', key, value });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="text-xs text-blue-600 hover:underline"
        >
          Reset all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">From</label>
          <input
            type="date"
            value={state.dateFrom}
            onChange={e => set('dateFrom', e.target.value)}
            className="block w-full border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">To</label>
          <input
            type="date"
            value={state.dateTo}
            onChange={e => set('dateTo', e.target.value)}
            className="block w-full border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select
          label="Status"
          value={state.status}
          onChange={v => set('status', v as FilterState['status'])}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'approved', label: 'Approved' },
            { value: 'declined', label: 'Declined' },
          ]}
        />
        <Select
          label="Payment Method"
          value={state.paymentMethod}
          onChange={v => set('paymentMethod', v as FilterState['paymentMethod'])}
          options={[
            { value: 'all', label: 'All methods' },
            { value: 'credit_card', label: 'Credit Card' },
            { value: 'digital_wallet', label: 'Digital Wallet' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
          ]}
        />
        <Select
          label="Decline Code"
          value={state.declineCode}
          onChange={v => set('declineCode', v as FilterState['declineCode'])}
          options={[
            { value: 'all', label: 'All codes' },
            ...ALL_DECLINE_CODES.map(c => ({ value: c, label: DECLINE_CODES[c].label })),
          ]}
        />
        <Select
          label="Decline Type"
          value={state.declineCategory}
          onChange={v => set('declineCategory', v as FilterState['declineCategory'])}
          options={[
            { value: 'all', label: 'All types' },
            { value: 'soft', label: 'Soft — Retriable' },
            { value: 'hard', label: 'Hard — Permanent' },
          ]}
        />
        <Select
          label="Country"
          value={state.country}
          onChange={v => set('country', v as FilterState['country'])}
          options={[
            { value: 'all', label: 'All countries' },
            { value: 'TH', label: 'Thailand' },
            { value: 'VN', label: 'Vietnam' },
            { value: 'ID', label: 'Indonesia' },
            { value: 'PH', label: 'Philippines' },
          ]}
        />
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Amount Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min $"
              value={state.amountMin}
              onChange={e => set('amountMin', e.target.value)}
              className="block w-full border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max $"
              value={state.amountMax}
              onChange={e => set('amountMax', e.target.value)}
              className="block w-full border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
