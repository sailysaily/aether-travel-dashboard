import type { ReactNode } from 'react';
import type { DeclineCategory, TransactionStatus } from '../../types';

export type BadgeVariant = 'approved' | 'soft' | 'hard' | 'neutral';

const STYLES: Record<BadgeVariant, string> = {
  approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  soft:     'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  hard:     'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  neutral:  'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
};

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  size?: 'sm' | 'md';
}

export function Badge({ variant, children, size = 'sm' }: BadgeProps) {
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sz} ${STYLES[variant]}`}>
      {children}
    </span>
  );
}

export function getStatusVariant(status: TransactionStatus, category?: DeclineCategory): BadgeVariant {
  if (status === 'approved') return 'approved';
  return category === 'soft' ? 'soft' : category === 'hard' ? 'hard' : 'neutral';
}
