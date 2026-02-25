import type { ReactNode } from 'react';
import type { Transaction } from '../../types';
import { Badge, getStatusVariant } from '../shared/Badge';
import { DECLINE_CODES, PAYMENT_METHOD_LABELS, COUNTRY_LABELS } from '../../data/constants';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

interface DrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDrawer({ transaction: t, onClose }: DrawerProps) {
  if (!t) return null;

  const codeInfo = t.declineCode ? DECLINE_CODES[t.declineCode] : null;
  const isSoft = t.declineCategory === 'soft';
  const isHard = t.declineCategory === 'hard';

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
          <div>
            <p className="font-mono text-xs text-gray-500">{t.id}</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{formatCurrency(t.amount)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Soft/Hard banner */}
          {isSoft && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600">⚡</span>
                <p className="text-sm font-semibold text-amber-800">Soft Decline — Revenue Recovery Possible</p>
              </div>
              <p className="text-xs text-amber-700">
                This is a <strong>temporary bank hold</strong>. The customer’s payment method is valid and this
                transaction can be recovered with a retry or payment link.
              </p>
            </div>
          )}
          {isHard && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-rose-600">🚫</span>
                <p className="text-sm font-semibold text-rose-800">Hard Decline — Customer Action Required</p>
              </div>
              <p className="text-xs text-rose-700">
                This is a <strong>permanent failure</strong>. Retrying will not succeed. The customer must
                provide a new payment method or resolve the issue with their bank.
              </p>
            </div>
          )}

          {/* Transaction details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Transaction Details</h3>
            <dl className="space-y-3">
              <Row label="Status">
                <Badge variant={getStatusVariant(t.status, t.declineCategory)} size="md">
                  {t.status === 'approved' ? 'Approved' : isSoft ? 'Soft Decline' : 'Hard Decline'}
                </Badge>
              </Row>
              <Row label="Customer">{t.customerName}</Row>
              <Row label="Customer ID"><span className="font-mono text-xs">{t.customerId}</span></Row>
              <Row label="Amount">{formatCurrency(t.amount)}</Row>
              <Row label="Payment Method">{PAYMENT_METHOD_LABELS[t.paymentMethod]}</Row>
              <Row label="Country">{COUNTRY_LABELS[t.country]}</Row>
              <Row label="Date">{formatDate(t.timestamp)} at {formatTime(t.timestamp)}</Row>
              {t.isHighValue && t.status === 'declined' && (
                <Row label="Priority">
                  <span className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-2 py-0.5">
                    High-value failure
                  </span>
                </Row>
              )}
            </dl>
          </div>

          {/* Decline details */}
          {codeInfo && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Decline Information</h3>
              <dl className="space-y-3">
                <Row label="Code"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{t.declineCode}</span></Row>
                <Row label="Reason">{codeInfo.label}</Row>
              </dl>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">{codeInfo.description}</p>
              </div>
            </div>
          )}

          {/* Recovery / Escalation path */}
          {codeInfo?.recoveryPath && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-semibold text-amber-800 mb-1.5">Recovery Path</p>
              <p className="text-xs text-amber-700">{codeInfo.recoveryPath}</p>
            </div>
          )}
          {codeInfo?.escalationPath && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-xs font-semibold text-rose-800 mb-1.5">Escalation Path</p>
              <p className="text-xs text-rose-700">{codeInfo.escalationPath}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs text-gray-500 shrink-0 w-28">{label}</dt>
      <dd className="text-xs font-medium text-gray-900 text-right">{children}</dd>
    </div>
  );
}
