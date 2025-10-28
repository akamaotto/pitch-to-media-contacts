import React from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { InboxPane } from '../app/panes/inbox/InboxPane';
import { useApp } from '../hooks/useApp';
import { RouteDataProvider } from '../components/RouteDataProvider';
import { RouteErrorBoundary } from '../components/ui/RouteErrorBoundary';

interface InboxSurfaceProps {
  tab?: string;
}

// eslint-disable-next-line no-empty-pattern
export const InboxSurface = ({ }: InboxSurfaceProps) => {
  const { setActiveSurface } = useApp();
  // Since inbox is now part of contacts/pitched, we'll use the pitched route data
  const loaderData = useLoaderData({ from: '/contacts/pitched' });

  const handleNavigate = (surface: 'contacts' | 'inbox' | 'composer') => {
    setActiveSurface(surface);
  };

  return (
    <RouteErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Error in InboxSurface:', error, errorInfo);
      }}
    >
      <RouteDataProvider conversationsData={loaderData}>
        <InboxPane onNavigate={handleNavigate} preloadedData={loaderData} />
      </RouteDataProvider>
    </RouteErrorBoundary>
  );
};