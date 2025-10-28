import React from 'react';
import { cx } from '../../utils/cx';

type BadgeVariant = 'default' | 'outline' | 'subtle';

const baseClass =
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors';

const variantClass: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-slate-900 text-white',
  outline: 'border-slate-300 text-slate-900 bg-white',
  subtle: 'border-transparent bg-slate-100 text-slate-900',
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'subtle', ...props }, ref) => (
    <span ref={ref} className={cx(baseClass, variantClass[variant], className)} {...props} />
  )
);

Badge.displayName = 'Badge';

export default Badge;
