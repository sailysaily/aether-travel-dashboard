import { useMemo } from 'react';
import { transactions } from '../data/transactions';

export function useAlerts() {
  return useMemo(() => {
    const failed = transactions
      .filter(t => t.status === 'declined' && t.isHighValue)
      .sort((a, b) => b.amount - a.amount);
    const soft = failed.filter(t => t.declineCategory === 'soft');
    const hard = failed.filter(t => t.declineCategory === 'hard');
    return {
      all: failed,
      soft,
      hard,
      totalRecoverable: soft.reduce((s, t) => s + t.amount, 0),
      totalLost: hard.reduce((s, t) => s + t.amount, 0),
    };
  }, []);
}
