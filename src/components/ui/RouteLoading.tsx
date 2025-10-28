import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { LoadingState } from './LoadingState';
import { useLocation } from '@tanstack/react-router';

interface RouteLoadingProps {
  message?: string;
  showSkeleton?: boolean;
  skeletonType?: 'conversation' | 'kpi' | 'filter' | 'detail';
}

export const RouteLoading: React.FC<RouteLoadingProps> = ({
  message,
  showSkeleton = false,
  skeletonType = 'detail'
}) => {
  const location = useLocation();
  
  // Determine context-specific loading messages
  const getContextMessage = () => {
    if (message) return message;
    
    const pathname = location.pathname;
    if (pathname.includes('/contacts')) {
      return 'Loading contacts...';
    } else if (pathname.includes('/inbox')) {
      return 'Loading conversations...';
    } else if (pathname.includes('/composer')) {
      return 'Opening composer...';
    }
    return 'Loading...';
  };

  const loadingMessage = getContextMessage();

  if (showSkeleton) {
    return (
      <div className="min-h-[400px] animate-fadeIn">
        <div className="flex flex-col items-center justify-center py-8">
          <LoadingSpinner size="lg" ariaLabel={loadingMessage} />
          <p className="mt-4 text-sm text-muted-foreground animate-pulse">{loadingMessage}</p>
        </div>
        <LoadingState type={skeletonType} ariaLabel={loadingMessage} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] animate-fadeIn">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <LoadingSpinner size="lg" ariaLabel={loadingMessage} />
        <p className="text-sm text-muted-foreground animate-pulse">{loadingMessage}</p>
        <p className="text-xs text-muted-foreground/70">
          This should only take a moment...
        </p>
      </div>
    </div>
  );
};