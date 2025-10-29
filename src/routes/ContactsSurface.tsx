import React from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { ContactsPane } from '../app/panes/contacts/ContactsPane';
import { useApp } from '../hooks/useApp';
import { RouteDataProvider } from '../components/RouteDataProvider';
import { RouteErrorBoundary } from '../components/ui/RouteErrorBoundary';

interface ContactsSurfaceProps {
  tab?: 'recommended' | 'all' | 'myContacts' | 'pitched';
}

export const ContactsSurface = ({ tab }: ContactsSurfaceProps) => {
  const { setActiveSurface } = useApp();
  // Handle the case where tab is 'all' - we should use '/contacts' route
  const routePath = tab === 'all' ? '/contacts' : `/contacts/${tab}`;
  const loaderData = useLoaderData({ from: routePath as any });

  const handleNavigate = (surface: 'contacts' | 'inbox' | 'composer') => {
    setActiveSurface(surface);
  };

  React.useEffect(() => {
    const titleForTab = (t?: ContactsSurfaceProps['tab']) => {
      switch (t) {
        case 'recommended':
          return 'AI Recommended Contacts';
        case 'myContacts':
          return 'My Contacts';
        case 'pitched':
          return 'Pitched Contacts';
        case 'all':
        default:
          return 'All Contacts';
      }
    };
    document.title = `${titleForTab(tab)} · Poblysh`;
  }, [tab]);

  return (
    <RouteErrorBoundary
      onError={(error, errorInfo) => {
        console.error(`Error in ContactsSurface (${tab}):`, error, errorInfo);
      }}
    >
      <RouteDataProvider contactsData={loaderData}>
        <ContactsPane onNavigate={handleNavigate} tab={tab} preloadedData={loaderData} />
      </RouteDataProvider>
    </RouteErrorBoundary>
  );
};
