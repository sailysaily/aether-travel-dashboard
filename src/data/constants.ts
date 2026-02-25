import type { DeclineCode, DeclineCategory } from '../types';

export interface DeclineCodeInfo {
  label: string;
  category: DeclineCategory;
  weight: number;
  description: string;
  recoveryPath?: string;
  escalationPath?: string;
}

export const DECLINE_CODES: Record<DeclineCode, DeclineCodeInfo> = {
  insufficient_funds: {
    label: 'Insufficient Funds',
    category: 'soft',
    weight: 28,
    description: 'The customer's bank account balance is temporarily too low to cover the charge.',
    recoveryPath: 'Send a payment retry link via email. Success rates are highest when retried after month-end payroll (1st–5th). Consider splitting into installments for amounts over $500.',
  },
  do_not_honor: {
    label: 'Do Not Honor',
    category: 'soft',
    weight: 20,
    description: 'The issuing bank declined without a specific reason — commonly a temporary fraud prevention hold.',
    recoveryPath: 'Ask the customer to contact their bank to authorize the transaction, then retry within 24 hours. Success rate: ~65% on first retry.',
  },
  fraud_suspected: {
    label: 'Fraud Suspected',
    category: 'hard',
    weight: 12,
    description: 'The issuing bank has flagged this card for suspected fraudulent activity.',
    escalationPath: 'Do not retry — additional attempts will be declined and may trigger further security flags. Direct customer to use a different payment method immediately.',
  },
  network_timeout: {
    label: 'Network Timeout',
    category: 'soft',
    weight: 10,
    description: 'The payment network did not respond in time. This is a transient technical issue, not a problem with the card.',
    recoveryPath: 'Retry immediately — 85% of network timeouts succeed on the first retry. No customer action required.',
  },
  expired_card: {
    label: 'Expired Card',
    category: 'hard',
    weight: 10,
    description: 'The card's expiry date has passed. Expired cards cannot be charged under any circumstances.',
    escalationPath: 'Ask the customer to update their saved payment method with a new, valid card. Offer a payment link with a 48-hour expiry.',
  },
  issuer_unavailable: {
    label: 'Issuer Unavailable',
    category: 'soft',
    weight: 7,
    description: 'The customer's bank authorization system is temporarily unreachable — a bank-side outage.',
    recoveryPath: 'Retry automatically after 30 minutes. If the issue persists beyond 2 hours, ask the customer to try a different card or payment method.',
  },
  invalid_cvv: {
    label: 'Invalid CVV',
    category: 'hard',
    weight: 5,
    description: 'The security code entered does not match what the bank has on file.',
    escalationPath: 'Ask the customer to carefully re-enter their card details. If the CVV error repeats, flag the session for security review — could indicate a compromised card.',
  },
  lost_stolen_card: {
    label: 'Lost / Stolen Card',
    category: 'hard',
    weight: 4,
    description: 'The cardholder has reported this card as lost or stolen. It has been cancelled by the bank.',
    escalationPath: 'Do not retry. Contact the customer via an alternative channel (email/phone). Flag this transaction for your security team.',
  },
  card_not_supported: {
    label: 'Card Not Supported',
    category: 'hard',
    weight: 3,
    description: 'This card network or card type is not accepted by the payment processor in this region.',
    escalationPath: 'Ask the customer to use a different card type (e.g., Visa or Mastercard instead of Amex or UnionPay).',
  },
  invalid_card_number: {
    label: 'Invalid Card Number',
    category: 'hard',
    weight: 1,
    description: 'The card number fails the Luhn algorithm check — it is not a valid card number.',
    escalationPath: 'Ask the customer to re-enter their card details carefully. This is almost always a data entry error.',
  },
};

export const SOFT_CODES: DeclineCode[] = [
  'insufficient_funds',
  'do_not_honor',
  'network_timeout',
  'issuer_unavailable',
];

export const HARD_CODES: DeclineCode[] = [
  'expired_card',
  'fraud_suspected',
  'lost_stolen_card',
  'invalid_card_number',
  'card_not_supported',
  'invalid_cvv',
];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  credit_card: 'Credit Card',
  digital_wallet: 'Digital Wallet',
  bank_transfer: 'Bank Transfer',
};

export const COUNTRY_LABELS: Record<string, string> = {
  TH: 'Thailand',
  VN: 'Vietnam',
  ID: 'Indonesia',
  PH: 'Philippines',
};

export const PAGE_SIZE = 25;
