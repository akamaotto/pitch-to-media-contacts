# TanStack Router Technical Implementation Specification

## 1. Router Configuration

### 1.1 Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-router": "^1.45.0",
    "@tanstack/router-devtools": "^1.45.0"
  }
}
```

### 1.2 Router Setup

```typescript
// src/router.ts
import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from './app/components/AppShell'

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})

// Contacts index route with redirect
const contactsIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts',
  loader: () => {
    throw new Error({ 
      code: 'NOT_FOUND', 
      redirect: '/contacts/recommended' 
    })
  },
})

// Contacts surface route
const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts',
  component: () => <Outlet />,
})

// Tab routes
const recommendedRoute = createRoute({
  getParentRoute: () => contactsRoute,
  path: '/recommended',
  component: () => <ContactsSurface tab="recommended" />,
})

const allRoute = createRoute({
  getParentRoute: () => contactsRoute,
  path: '/all',
  component: () => <ContactsSurface tab="all" />,
})

const myContactsRoute = createRoute({
  getParentRoute: () => contactsRoute,
  path: '/myContacts',
  component: () => <ContactsSurface tab="myContacts" />,
})

const pitchedRoute = createRoute({
  getParentRoute: () => contactsRoute,
  path: '/pitched',
  component: () => <ContactsSurface tab="pitched" />,
})

// Inbox route
const inboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inbox',
  component: () => <InboxSurface />,
})

// Composer route
const composerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/composer',
  component: () => <ComposerSurface />,
})

// Index route with redirect
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  loader: () => {
    throw new Error({ 
      code: 'NOT_FOUND', 
      redirect: '/contacts/recommended' 
    })
  },
})

// Create router instance
export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    contactsIndexRoute,
    contactsRoute.addChildren([
      recommendedRoute,
      allRoute,
      myContactsRoute,
      pitchedRoute,
    ]),
    inboxRoute,
    composerRoute,
  ]),
  defaultPreload: 'intent',
})

// Register router for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

## 2. Enhanced useApp Hook

```typescript
// src/hooks/useApp.tsx
import { useRouter, useLocation } from '@tanstack/react-router'
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { ContactTab, MainView } from '../types'

// Helper functions to derive state from path
const deriveSurfaceFromPath = (pathname: string): 'contacts' | 'inbox' | 'composer' => {
  if (pathname.startsWith('/contacts')) return 'contacts'
  if (pathname.startsWith('/inbox')) return 'inbox'
  if (pathname.startsWith('/composer')) return 'composer'
  return 'contacts' // default
}

const deriveTabFromPath = (pathname: string): ContactTab => {
  if (pathname.includes('/recommended')) return 'recommended'
  if (pathname.includes('/all')) return 'all'
  if (pathname.includes('/myContacts')) return 'myContacts'
  if (pathname.includes('/pitched')) return 'pitched'
  return 'recommended' // default
}

/**
 * Custom hook for managing main application state with router integration
 */
const useAppState = () => {
  const router = useRouter()
  const location = useLocation()
  
  // Derive state from router
  const activeSurface = deriveSurfaceFromPath(location.pathname)
  const selectedTab = deriveTabFromPath(location.pathname)
  
  // Local state that doesn't need to be in URL
  const [showFilters, setShowFilters] = useState(false)
  const [showAddContactModal, setShowAddContactModal] = useState(false)

  // Navigation functions
  const setActiveSurface = useCallback((surface: 'contacts' | 'inbox' | 'composer') => {
    router.navigate({ to: `/${surface}` })
  }, [router])

  const setSelectedTab = useCallback((tab: ContactTab) => {
    router.navigate({ to: `/contacts/${tab}` })
  }, [router])

  // Auto-select recommended tab when pitched tab is not available
  const handleTabChange = useCallback((tab: ContactTab, showPitchedTab: boolean) => {
    if (!showPitchedTab && tab === 'pitched') {
      router.navigate({ to: '/contacts/recommended' })
    } else {
      router.navigate({ to: `/contacts/${tab}` })
    }
  }, [router])

  return useMemo(() => ({
    mainView: activeSurface as MainView,
    setMainView: setActiveSurface,
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
  ])
}

type AppContextValue = ReturnType<typeof useAppState>

const AppContext = createContext<AppContextValue | undefined>(undefined)

/**
 * Provider that exposes the shared application shell state
 */
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const value = useAppState()
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/**
 * Hook for consuming the shared application shell state
 */
export const useApp = (): AppContextValue => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
```

## 3. Surface Components

### 3.1 Contacts Surface Component

```typescript
// src/routes/contacts/ContactsSurface.tsx
import { Outlet } from '@tanstack/react-router'
import { ContactsPane } from '../../app/panes/contacts/ContactsPane'
import { useApp } from '../../hooks/useApp'

interface ContactsSurfaceProps {
  tab?: ContactTab
}

export const ContactsSurface = ({ tab }: ContactsSurfaceProps) => {
  const { setActiveSurface } = useApp()

  const handleNavigate = (surface: 'contacts' | 'inbox' | 'composer') => {
    setActiveSurface(surface)
  }

  return <ContactsPane onNavigate={handleNavigate} />
}
```

### 3.2 Tab Route Components

```typescript
// src/routes/contacts/recommended.tsx
import { ContactsSurface } from '../ContactsSurface'

export default function RecommendedRoute() {
  return <ContactsSurface tab="recommended" />
}
```

## 4. Navigation Component Updates

### 4.1 Updated ContactsPane

```typescript
// src/app/panes/contacts/ContactsPane.tsx (updated sections)
import { Link } from '@tanstack/react-router'
import { useApp } from '../../../hooks/useApp'
import { useContacts } from '../../../features/contacts'
import { usePitches } from '../../../features/pitches'
import { getMenuItems } from '../../../components/ui/menuConfig'

export const ContactsPane = ({ className, onNavigate }: ContactsPaneProps) => {
  const { selectedTab, handleTabChange, setShowAddContactModal } = useApp()
  const {
    selectedContacts,
    showPitchedTab,
    autoSelectRecommended,
    mediaContacts,
  } = useContacts()
  const { generatePitches } = usePitches()

  useEffect(() => {
    autoSelectRecommended()
  }, [autoSelectRecommended])

  const tabList = getMenuItems(showPitchedTab)

  return (
    <div className={cx('space-y-6', className)}>
      <Header variant="page" size="lg">
        <Tabs value={selectedTab}>
          <TabsList>
            {tabList.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} asChild>
                <Link 
                  to={`/contacts/${tab.id}`}
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                    selectedTab === tab.id && "bg-background text-foreground shadow-sm"
                  )}
                >
                  {tab.name}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Header>

      <ContactSelectionView />

      <Panel padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{selectedContacts.size}</span> contacts selected
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setShowAddContactModal(true)} variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Add Contact
          </Button>
          <Button
            onClick={() =>
              generatePitches(selectedContacts, mediaContacts, () => {
                onNavigate('composer')
              })
            }
            disabled={selectedContacts.size === 0}
            className="gap-2"
          >
            Generate Pitches ({selectedContacts.size})
          </Button>
        </div>
      </Panel>
    </div>
  )
}
```

### 4.2 Updated Header Navigation

```typescript
// src/components/ui/Header.tsx (updated navigation section)
import { Link, useLocation } from '@tanstack/react-router'

export const Header = () => {
  const location = useLocation()
  const isActivePath = (path: string) => location.pathname.startsWith(path)

  return (
    <header className="app-header">
      <nav className="app-nav">
        <Link 
          to="/contacts"
          className={cn(
            "nav-item",
            isActivePath('/contacts') && "nav-item-active"
          )}
        >
          Contacts
        </Link>
        <Link 
          to="/inbox"
          className={cn(
            "nav-item",
            isActivePath('/inbox') && "nav-item-active"
          )}
        >
          Inbox
        </Link>
        <Link 
          to="/composer"
          className={cn(
            "nav-item",
            isActivePath('/composer') && "nav-item-active"
          )}
        >
          Composer
        </Link>
      </nav>
    </header>
  )
}
```

## 5. App Integration

### 5.1 Updated App.tsx

```typescript
// src/App.tsx
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './styles/App.css'

const App: React.FC = () => {
  return <RouterProvider router={router} />
}

export default App
```

### 5.2 Updated AppShell

```typescript
// src/app/components/AppShell.tsx
import { Outlet } from '@tanstack/react-router'
import { ShellProviders } from './ShellProviders'

const AppShell = ({ children }: { children: React.ReactNode }) => (
  <ShellProviders>
    <div className="app-shell">
      <Header />
      <main className="app-main">
        {children || <Outlet />}
      </main>
    </div>
  </ShellProviders>
)

export default AppShell
```

## 6. Error Handling

### 6.1 Error Boundary Component

```typescript
// src/components/ui/RouteErrorBoundary.tsx
import { ErrorComponent } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { Alert } from './Alert'

export const RouteErrorBoundary: ErrorComponent = ({ error }) => {
  if (error.code === 'NOT_FOUND' && error.redirect) {
    // Handle redirects
    window.location.href = error.redirect
    return null
  }

  return (
    <div className="p-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Navigation Error</AlertTitle>
        <AlertDescription>
          {error.message || 'An error occurred while navigating.'}
        </AlertDescription>
        <Button 
          onClick={() => window.history.back()} 
          variant="outline" 
          size="sm" 
          className="mt-4"
        >
          Go Back
        </Button>
      </Alert>
    </div>
  )
}
```

## 7. Data Loading Strategy

### 7.1 Route Loaders

```typescript
// src/routes/contacts/contacts.loader.ts
import { ContactsProvider } from '../../features/contacts/state/ContactsProvider'

export const contactsLoader = async () => {
  // Preload contacts data
  return {
    contacts: await fetchContacts(),
    mediaContacts: await fetchMediaContacts(),
  }
}
```

### 7.2 Updated Route with Loader

```typescript
// src/routes/contacts/recommended.tsx
import { ContactsSurface } from '../ContactsSurface'
import { contactsLoader } from '../contacts.loader'

export default function RecommendedRoute() {
  return <ContactsSurface tab="recommended" />
}

export const loader = contactsLoader
```

## 8. Testing Strategy

### 8.1 Router Testing Utilities

```typescript
// src/test-utils/router.tsx
import { createMemoryRouter } from '@tanstack/react-router'
import { render } from '@testing-library/react'

export const renderWithRouter = (component: React.ReactElement) => {
  const router = createMemoryRouter({
    routeTree: router.routeTree,
    initialEntries: ['/'],
  })

  return render(
    <RouterProvider router={router}>
      {component}
    </RouterProvider>
  )
}
```

### 8.2 Navigation Tests

```typescript
// src/app/panes/contacts/ContactsPane.test.tsx
import { screen, fireEvent } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/router'
import { ContactsPane } from './ContactsPane'

describe('ContactsPane Navigation', () => {
  it('navigates to correct tab when tab is clicked', async () => {
    renderWithRouter(<ContactsPane onNavigate={jest.fn()} />)
    
    const allTab = screen.getByText('All Contacts')
    fireEvent.click(allTab)
    
    expect(window.location.pathname).toBe('/contacts/all')
  })
})
```

## 9. Performance Optimizations

### 9.1 Code Splitting

```typescript
// src/routes/lazy-routes.ts
import { createLazyRoute } from '@tanstack/react-router'

export const LazyComposerRoute = createLazyRoute('/', 'ComposerRoute', () => 
  import('./composer').then(mod => ({ default: mod.default }))
)
```

### 9.2 Preloading Strategy

```typescript
// Configure router with intelligent preloading
export const router = createRouter({
  routeTree: routeTree,
  defaultPreload: 'intent', // Preload on hover/intent
  defaultPreloadDelay: 50, // 50ms delay
})
```

## 10. Migration Checklist

- [ ] Install TanStack Router dependencies
- [ ] Create router configuration
- [ ] Set up file-based routing structure
- [ ] Implement root route with layout
- [ ] Create surface routes
- [ ] Create nested tab routes
- [ ] Update useApp hook
- [ ] Refactor navigation components
- [ ] Add error boundaries
- [ ] Implement data loading
- [ ] Add TypeScript types
- [ ] Update tests
- [ ] Remove old navigation code
- [ ] Performance optimization
- [ ] Documentation updates