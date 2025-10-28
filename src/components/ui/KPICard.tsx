import React from 'react';
import { KPICardProps } from '../../types/ui';
import { cx } from '../../utils/cx';

/**
 * KPI Card component for displaying key performance indicators
 */
const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, colorClass }) => (
  <div className="rounded-lg border border-border hover:border-border-strong bg-surface px-3 py-4 shadow-sm transition-colors sm:px-4 sm:py-5">
    <Icon className={cx('h-4 w-4 sm:h-5 sm:w-5', colorClass)} />
    <p className={cx('mt-2 text-xl font-semibold tracking-tight sm:mt-3 sm:text-2xl', colorClass)}>{value}</p>
    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:mt-0">{title}</p>
  </div>
);

export default KPICard;
