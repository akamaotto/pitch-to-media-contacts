import React from 'react';
import { cx } from '../../utils/cx';

type PanelVariant = 'default' | 'active';

export type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: PanelVariant;
};

const paddingClass: Record<NonNullable<PanelProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantClass: Record<PanelVariant, string> = {
  default: 'border border-border hover:border-border-strong bg-surface shadow-sm',
  active: 'border-2 border-border-strong bg-muted/40 shadow-md',
};

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, padding = 'md', variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cx(
        'rounded-xl text-foreground transition-colors',
        variantClass[variant],
        paddingClass[padding],
        className
      )}
      {...props}
    />
  )
);

Panel.displayName = 'Panel';

export default Panel;
