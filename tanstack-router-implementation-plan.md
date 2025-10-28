# TanStack Router Implementation Plan

## Overview

This plan outlines the implementation of TanStack Router to replace the current state-based navigation with URL-based routing in the pitch-to-media-contacts React application. The implementation will maintain the existing three-surface layout (contacts, inbox, composer) while adding the benefits of URL-based navigation, deep linking, and browser history management.

## Proposed Route Structure

Based on the requirements, the application will use the following route structure:

```
/                           → Redirect to /contacts/recommended
/contacts                   → Redirect to /contacts/recommended
/contacts/recommended       → Contacts surface with recommended tab
/contacts/all              → Contacts surface with all tab
/contacts/myContacts       → Contacts surface with myContacts tab
/contacts/pitched          → Contacts surface with pitched tab
/inbox                     → Inbox surface
/composer                  → Composer surface
```

## Implementation Strategy

### 1. Router Setup and Configuration

**Dependencies to Install:**
- `@tanstack/react-router`
- `@tanstack/router-devtools` (for development)

**Router Configuration:**
- Create a new router instance using `createRouter` with file-based routing
- Set up route tree in `src/routes` directory
- Configure router with proper TypeScript types

### 2. File-Based Routing Structure

```
src/routes/
├── __root.tsx              → Root route with layout and providers
├── index.tsx               → Root redirect to /contacts/recommended
├── contacts/
│   ├── index.tsx           → Contacts index with redirect to recommended
│   ├── recommended.tsx     → Contacts recommended tab
│   ├── all.tsx            → Contacts all tab
│   ├── myContacts.tsx     → Contacts myContacts tab
│   └── pitched.tsx        → Contacts pitched tab
├── inbox.tsx              → Inbox surface
└── composer.tsx           → Composer surface
```

### 3. Migration from State-Based to URL-Based Navigation

**Current State Management:**
- `useApp` hook manages `activeSurface` and `selectedTab` state
- Navigation handled through `setActiveSurface` and `setSelectedTab` functions
- Components receive `onNavigate` callbacks

**New Router-Based Approach:**
- Replace `activeSurface` with router-based route detection
- Replace `selectedTab` with route parameter parsing
- Use `useNavigate` and `Link` components for navigation
- Maintain backward compatibility during transition

### 4. Component Integration Strategy

**AppShell Refactoring:**
- Replace conditional rendering in `ShellContent.tsx` with `<Outlet />`
- Move surface-specific logic to route components
- Preserve existing layout and styling

**Navigation Components:**
- Update tab navigation in `ContactsPane.tsx` to use `Link` components
- Update surface navigation to use `useNavigate`
- Maintain visual consistency with current design

### 5. State Synchronization

**Enhanced useApp Hook:**
- Add router state synchronization
- Derive `activeSurface` and `selectedTab` from current route
- Provide navigation functions that use router
- Maintain existing API for backward compatibility

**Route-Based State:**
- Use route loaders for data fetching
- Implement route-based search parameters for filters
- Cache data using TanStack Router's built-in caching

### 6. Deep Linking and Browser History

**URL State Preservation:**
- Ensure all application state is reflected in URLs
- Handle browser back/forward navigation properly
- Support direct navigation to any surface/tab combination

**Bookmarkable URLs:**
- Each surface and tab combination has a unique URL
- Support sharing links to specific application states
- Maintain application state on page refresh

### 7. Error Handling and Loading States

**Route-Level Error Boundaries:**
- Implement error boundaries for route components
- Provide fallback UI for navigation errors
- Maintain application stability during route transitions

**Loading States:**
- Use TanStack Router's pending states
- Implement loading indicators for route transitions
- Handle async data loading gracefully

## Technical Implementation Details

### Router Configuration

```typescript
// src/router.ts
import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router'

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
})

// Surface routes
const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts',
  component: ContactsSurface
})

// Tab routes (nested under contacts)
const recommendedRoute = createRoute({
  getParentRoute: () => contactsRoute,
  path: '/recommended',
  component: RecommendedTab
})

// ... other tab routes

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    contactsRoute.addChildren([
      recommendedRoute,
      allRoute,
      myContactsRoute,
      pitchedRoute
    ]),
    inboxRoute,
    composerRoute
  ])
})
```

### Enhanced useApp Hook

```typescript
// src/hooks/useApp.tsx
import { useRouter } from '@tanstack/react-router'

export const useApp = () => {
  const router = useRouter()
  
  // Derive state from router
  const activeSurface = deriveSurfaceFromPath(router.state.location.pathname)
  const selectedTab = deriveTabFromPath(router.state.location.pathname)
  
  // Navigation functions
  const navigateToSurface = (surface: string) => {
    router.navigate({ to: `/${surface}` })
  }
  
  const navigateToTab = (tab: string) => {
    router.navigate({ to: `/contacts/${tab}` })
  }
  
  return {
    activeSurface,
    selectedTab,
    setActiveSurface: navigateToSurface,
    setSelectedTab: navigateToTab,
    // ... other existing state
  }
}
```

### Route Component Structure

```typescript
// src/routes/contacts/recommended.tsx
import { ContactsPane } from '../../../app/panes/contacts/ContactsPane'

export default function RecommendedRoute() {
  return <ContactsPane tab="recommended" />
}
```

## Migration Phases

### Phase 1: Foundation Setup
1. Install TanStack Router dependencies
2. Create basic router configuration
3. Set up file-based routing structure
4. Implement root route with basic layout

### Phase 2: Route Implementation
1. Create surface routes (contacts, inbox, composer)
2. Implement nested tab routes for contacts
3. Add root redirect to default route
4. Create route components with basic functionality

### Phase 3: State Integration
1. Update useApp hook to sync with router
2. Refactor navigation components
3. Implement route-based data loading
4. Add TypeScript types for route parameters

### Phase 4: Feature Enhancement
1. Implement deep linking and browser history
2. Add error boundaries and loading states
3. Optimize with code splitting if needed
4. Update tests for new routing structure

### Phase 5: Cleanup and Optimization
1. Remove old state-based navigation code
2. Optimize bundle size and performance
3. Add comprehensive testing coverage
4. Document new routing patterns

## Benefits of This Approach

1. **URL-Based Navigation**: Every application state has a corresponding URL
2. **Deep Linking**: Users can bookmark and share specific application states
3. **Browser History**: Native back/forward button support
4. **Type Safety**: Full TypeScript support for route parameters
5. **Code Organization**: Clear separation of concerns with file-based routing
6. **Performance**: Built-in code splitting and data caching
7. **Developer Experience**: Excellent devtools and debugging support

## Risk Mitigation

1. **Backward Compatibility**: Maintain existing component APIs during transition
2. **Incremental Migration**: Implement routes incrementally to minimize disruption
3. **Testing**: Comprehensive test coverage for routing functionality
4. **Error Handling**: Robust error boundaries for route-level errors
5. **Performance**: Monitor bundle size and implement code splitting as needed

## Conclusion

This implementation plan provides a comprehensive approach to adding TanStack Router while preserving the existing application functionality and user experience. The migration strategy ensures minimal disruption while delivering the benefits of URL-based routing, deep linking, and improved code organization.