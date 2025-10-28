import React from 'react';
import { cx } from '../../utils/cx';

type CardVariant = 'default' | 'active';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

const variantClass: Record<CardVariant, string> = {
  default: 'border border-border hover:border-border-strong bg-surface shadow-sm',
  active: 'border-2 border-border-strong bg-muted/40 shadow-md',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cx('rounded-xl text-foreground transition-colors', variantClass[variant], className)}
    {...props}
  />
));

Card.displayName = 'Card';

export default Card;
