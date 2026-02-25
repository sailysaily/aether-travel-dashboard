export type DeclineCode =
  | 'insufficient_funds'
  | 'do_not_honor'
  | 'fraud_suspected'
  | 'network_timeout'
  | 'expired_card'
  | 'issuer_unavailable'
  | 'invalid_cvv'
  | 'lost_stolen_card'
  | 'card_not_supported'
  | 'invalid_card_number';

export type DeclineCategory = 'soft' | 'hard';
export type TransactionStatus = 'approved' | 'declined';
export type PaymentMethod = 'credit_card' | 'digital_wallet' | 'bank_transfer';
export type Country = 'TH' | 'VN' | 'ID' | 'PH';

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  declineCode?: DeclineCode;
  declineCategory?: DeclineCategory;
  paymentMethod: PaymentMethod;
  country: Country;
  timestamp: string;
  isHighValue: boolean;
}

export interface FilterState {
  search: string;
  dateFrom: string;
  dateTo: string;
  status: 'all' | 'approved' | 'declined';
  paymentMethod: 'all' | PaymentMethod;
  declineCode: 'all' | DeclineCode;
  declineCategory: 'all' | DeclineCategory;
  country: 'all' | Country;
  amountMin: string;
  amountMax: string;
  sortBy: 'date' | 'amount';
  sortDir: 'asc' | 'desc';
  page: number;
}

export interface KPIData {
  authRate: number;
  previousAuthRate: number;
  totalVolume: number;
  totalDeclined: number;
  softDeclined: number;
  hardDeclined: number;
  recoverableRevenue: number;
  lostRevenue: number;
  highValueFailures: number;
}

export interface DeclineReasonData {
  code: DeclineCode;
  label: string;
  count: number;
  category: DeclineCategory;
  percentage: number;
}

export interface TrendPoint {
  date: string;
  label: string;
  approvalRate: number;
  approved: number;
  declined: number;
  total: number;
  isWeekend: boolean;
  isMonthEnd: boolean;
}

export interface MethodData {
  method: PaymentMethod;
  label: string;
  declineRate: number;
  approved: number;
  declined: number;
  total: number;
}

export interface CountryData {
  country: Country;
  label: string;
  declineRate: number;
  approved: number;
  declined: number;
  total: number;
}

export interface ComparisonTrendPoint {
  date: string;
  label: string;
  credit_card: number;
  digital_wallet: number;
  bank_transfer: number;
}

export interface CountryTrendPoint {
  date: string;
  label: string;
  TH: number;
  VN: number;
  ID: number;
  PH: number;
}
