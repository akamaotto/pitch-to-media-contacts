import React from 'react';
import { cx } from '../../utils/cx';

type ListRowVariant = 'default' | 'active' | 'unread';

const variantClass: Record<ListRowVariant, string> = {
  // Provide a visible boundary on every row for better separation
  default: 'bg-surface border border-border hover:bg-slate-50',
  // Selected thread: strongest emphasis
  active: 'bg-muted/40 border-2 border-foreground font-semibold text-foreground shadow-sm',
  // Unread thread: subtle emphasis that won't look selected
  unread: 'bg-blue-50 border border-blue-200 text-foreground',
};

export type ListRowProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ListRowVariant;
  // Add a callback for keyboard navigation
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

export const ListRow = React.forwardRef<HTMLButtonElement, ListRowProps>(
  ({ className, variant = 'default', type = 'button', onKeyDown, ...props }, ref) => {
    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Call the custom onKeyDown handler if provided
      if (onKeyDown) {
        onKeyDown(event);
      }
      
      // Handle Enter and Space for activation
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.currentTarget.click();
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cx(
          'w-full text-left rounded-lg px-3 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 min-h-[44px] sm:px-4 sm:py-3',
          variantClass[variant],
          className
        )}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

ListRow.displayName = 'ListRow';

export default ListRow;
