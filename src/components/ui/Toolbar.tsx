import React from 'react';
import { cx } from '../../utils/cx';

export type ToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(
        'flex items-center justify-between gap-4 border-b border-border px-6 py-4',
        className
      )}
      {...props}
    />
  )
);

Toolbar.displayName = 'Toolbar';

export default Toolbar;
