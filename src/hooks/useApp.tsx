import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useRouter, useLocation } from '@tanstack/react-router';
import { ContactTab, MainView } from '../types';

/**
 * Custom hook for managing main application state
 */
// Helper functions to derive state from path
const deriveSurfaceFromPath = (pathname: string): 'contacts' | 'inbox' | 'composer' => {
  if (pathname.startsWith('/contacts')) return 'contacts';
  if (pathname.startsWith('/inbox')) return 'inbox';
  if (pathname.startsWith('/composer')) return 'composer';
  return 'contacts'; // default
};

const deriveTabFromPath = (pathname: string): ContactTab => {
  if (pathname === '/contacts' || pathname === '/contacts/') return 'all';
  if (pathname.includes('/recommended')) return 'recommended';
  if (pathname.includes('/myContacts')) return 'myContacts';
  if (pathname.includes('/pitched')) return 'pitched';
  if (pathname.includes('/contacts')) return 'all';
  return 'recommended'; // default
};

const useAppState = () => {
  const router = useRouter();
  const location = useLocation();
  
  // Derive state from router
  const activeSurface = deriveSurfaceFromPath(location.pathname);
  const selectedTab = deriveTabFromPath(location.pathname);
  
  // Local state that doesn't need to be in URL
  const [showFilters, setShowFilters] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  // Navigation functions using router
  const setActiveSurface = useCallback((surface: 'contacts' | 'inbox' | 'composer') => {
    router.navigate({ to: `/${surface}` });
  }, [router]);

  const setSelectedTab = useCallback((tab: ContactTab) => {
    if (tab === 'all') {
      router.navigate({ to: '/contacts' });
    } else {
      router.navigate({ to: `/contacts/${tab}` });
    }
  }, [router]);

  // Auto-select recommended tab when pitched tab is not available
  const handleTabChange = useCallback((tab: ContactTab, showPitchedTab: boolean) => {
    if (!showPitchedTab && tab === 'pitched') {
      router.navigate({ to: '/contacts/recommended' });
    } else if (tab === 'all') {
      router.navigate({ to: '/contacts' });
    } else {
      router.navigate({ to: `/contacts/${tab}` });
    }
  }, [router]);

  // Legacy state setters for backward compatibility
  const setMainView = useCallback((view: MainView) => {
    const surfaceMap: Record<MainView, 'contacts' | 'inbox' | 'composer'> = {
      'contacts': 'contacts',
      'generating': 'composer',
      'review': 'inbox',
      'sent': 'inbox'
    };
    setActiveSurface(surfaceMap[view] || 'contacts');
  }, [setActiveSurface]);

  return useMemo(() => ({
    mainView: activeSurface as MainView,
    setMainView,
    selectedTab,
    setSelectedTab,
    showFilters,
    setShowFilters,
    showAddContactModal,
    setShowAddContactModal,
    handleTabChange,
    activeSurface,
    setActiveSurface,
  }), [
    activeSurface,
    selectedTab,
    showFilters,
    showAddContactModal,
    handleTabChange,
    setActiveSurface,
  ]);
};

type AppContextValue = ReturnType<typeof useAppState>;

const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Provider that exposes the shared application shell state
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const value = useAppState();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook for consuming the shared application shell state
 */
export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
