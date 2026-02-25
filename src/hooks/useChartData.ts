import { useMemo } from 'react';
import { transactions } from '../data/transactions';
import {
  computeKPIs, groupByDeclineCode, groupBySoftHard,
  groupByTrend, groupByPaymentMethod, groupByCountry,
  groupByTrendAndMethod, groupByTrendAndCountry,
} from '../utils/aggregators';

export function useChartData() {
  return useMemo(() => ({
    kpis: computeKPIs(transactions),
    declineReasons: groupByDeclineCode(transactions),
    softHard: groupBySoftHard(transactions),
    trend: groupByTrend(transactions),
    byMethod: groupByPaymentMethod(transactions),
    byCountry: groupByCountry(transactions),
    trendByMethod: groupByTrendAndMethod(transactions),
    trendByCountry: groupByTrendAndCountry(transactions),
  }), []);
}
