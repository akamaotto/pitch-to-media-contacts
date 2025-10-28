import React from 'react';
import { cx } from '../../utils/cx';

export type LoadingStateProps = {
  type?: 'conversation' | 'kpi' | 'filter' | 'message' | 'text' | 'detail' | 'action';
  lines?: number;
  className?: string;
  ariaLabel?: string;
};

/**
 * LoadingState component for skeleton screens
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'text',
  lines = 1,
  className,
  ariaLabel = 'Loading content...',
}) => {
  const baseClass = 'animate-pulse rounded-md bg-muted';
  
  const renderSkeleton = () => {
    switch (type) {
      case 'conversation':
        return (
          <div className={cx('space-y-3 p-4', className)} role="status" aria-label={ariaLabel}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <div className={cx(baseClass, 'h-4 w-32')} />
                <div className={cx(baseClass, 'h-3 w-full')} />
              </div>
              <div className={cx(baseClass, 'h-3 w-16 shrink-0')} />
            </div>
            <div className={cx(baseClass, 'h-3 w-3/4')} />
            <div className="flex justify-end">
              <div className={cx(baseClass, 'h-5 w-20')} />
            </div>
          </div>
        );
        
      case 'kpi':
        return (
          <div className={cx('rounded-lg border border-border bg-surface px-3 py-4 shadow-sm sm:px-4 sm:py-5', className)} role="status" aria-label={ariaLabel}>
            <div className={cx(baseClass, 'h-4 w-4 opacity-80 sm:h-5 sm:w-5')} />
            <div className={cx(baseClass, 'mt-2 h-6 w-12 sm:mt-3 sm:h-8 sm:w-16')} />
            <div className={cx(baseClass, 'mt-1 h-3 w-20 sm:mt-0')} />
          </div>
        );
        
      case 'filter':
        return (
          <div className={cx('flex items-center justify-between rounded-md border border-transparent px-3 py-2 min-h-[44px]', className)} role="status" aria-label={ariaLabel}>
            <div className={cx(baseClass, 'h-4 w-24')} />
            <div className={cx(baseClass, 'h-5 w-8 rounded-full')} />
          </div>
        );
        
      case 'detail':
        return (
          <div className={cx('space-y-4 p-6', className)} role="status" aria-label={ariaLabel}>
            <div className="space-y-2">
              <div className={cx(baseClass, 'h-6 w-48')} />
              <div className={cx(baseClass, 'h-4 w-32')} />
            </div>
            <div className="space-y-3">
              <div className={cx(baseClass, 'h-4 w-full')} />
              <div className={cx(baseClass, 'h-4 w-5/6')} />
              <div className={cx(baseClass, 'h-4 w-4/5')} />
            </div>
            <div className="space-y-2">
              <div className={cx(baseClass, 'h-20 w-full rounded-lg')} />
              <div className={cx(baseClass, 'h-10 w-24')} />
            </div>
          </div>
        );
        
      case 'action':
        return (
          <div className={cx('inline-flex items-center gap-2', className)} role="status" aria-label={ariaLabel}>
            <div className={cx(baseClass, 'h-4 w-4 rounded-full')} />
            <div className={cx(baseClass, 'h-4 w-20')} />
          </div>
        );
        
      case 'message':
        return (
          <div className={cx('space-y-2 p-4', className)} role="status" aria-label={ariaLabel}>
            <div className={cx(baseClass, 'h-4 w-32')} />
            <div className={cx(baseClass, 'h-3 w-full')} />
            <div className={cx(baseClass, 'h-3 w-3/4')} />
          </div>
        );
        
      case 'text':
      default:
        return (
          <div className={cx('space-y-2', className)} role="status" aria-label={ariaLabel}>
            {Array.from({ length: lines }, (_, i) => (
              <div
                key={i}
                className={cx(
                  baseClass,
                  i === lines - 1 ? 'w-3/4' : 'w-full',
                  i === 0 ? 'h-4' : 'h-3'
                )}
              />
            ))}
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
};

export default LoadingState;