import React from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { ComposerPane } from '../app/panes/composer/ComposerPane';
import { useApp } from '../hooks/useApp';
import { RouteDataProvider } from '../components/RouteDataProvider';
import { RouteErrorBoundary } from '../components/ui/RouteErrorBoundary';

interface ComposerSurfaceProps {
  tab?: string;
}

// eslint-disable-next-line no-empty-pattern
export const ComposerSurface = ({ }: ComposerSurfaceProps) => {
  const { setActiveSurface } = useApp();
  const loaderData = useLoaderData({ from: '/contacts/composer' });

  const handleNavigate = (surface: 'contacts' | 'inbox' | 'composer') => {
    setActiveSurface(surface);
  };

  React.useEffect(() => {
    document.title = 'Pitch Composer · Poblysh';
  }, []);

  return (
    <RouteErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Error in ComposerSurface:', error, errorInfo);
      }}
    >
      <RouteDataProvider contactsData={loaderData}>
        <ComposerPane onNavigate={handleNavigate} preloadedData={loaderData} />
      </RouteDataProvider>
    </RouteErrorBoundary>
  );
};
