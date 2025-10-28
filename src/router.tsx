import { createRouter, createRootRoute, createRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppShell } from './app/components'
import { ContactsSurface } from './routes/ContactsSurface'
import { InboxSurface } from './routes/InboxSurface'
import { ComposerSurface } from './routes/ComposerSurface'
import { loadContactsByTab, loadInboxData, loadComposerData, loadContacts } from './utils/dataLoaders'
import { RouteLoading } from './components/ui/RouteLoading'
import { RouteError } from './components/ui/RouteError'

// Root route with layout
const RootComponent = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);

const rootRoute = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error }) => <RouteError error={error} showNavigation={true} />,
  pendingComponent: () => <RouteLoading />,
});

// Index route with redirect to /contacts
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  loader: () => {
    throw redirect({
      to: '/contacts'
    })
  },
})

// Contacts routes
const contactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts',
  loader: async () => loadContactsByTab('all'),
  component: () => <ContactsSurface tab="all" />,
  errorComponent: ({ error }) => <RouteError error={error} showNavigation={false} />,
  pendingComponent: () => <RouteLoading message="Loading all contacts..." showSkeleton={true} skeletonType="conversation" />,
});

const contactsPitchedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts/pitched',
  loader: async () => {
    const contacts = await loadContacts();
    return loadInboxData(contacts);
  },
  component: () => <InboxSurface />,
  errorComponent: ({ error }) => <RouteError error={error} showNavigation={false} />,
  pendingComponent: () => <RouteLoading message="Loading pitched contacts..." showSkeleton={true} skeletonType="conversation" />,
});

const contactsRecommendedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts/recommended',
  loader: async () => loadContactsByTab('recommended'),
  component: () => <ContactsSurface tab="recommended" />,
  errorComponent: ({ error }) => <RouteError error={error} showNavigation={false} />,
  pendingComponent: () => <RouteLoading message="Loading recommended contacts..." showSkeleton={true} skeletonType="conversation" />,
});

const contactsMyContactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts/myContacts',
  loader: async () => loadContactsByTab('myContacts'),
  component: () => <ContactsSurface tab="myContacts" />,
  errorComponent: ({ error }) => <RouteError error={error} showNavigation={false} />,
  pendingComponent: () => <RouteLoading message="Loading your contacts..." showSkeleton={true} skeletonType="conversation" />,
});

// Composer route with loader
const composerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacts/composer',
  loader: async () => loadComposerData(),
  component: () => <ComposerSurface />,
  errorComponent: ({ error }) => <RouteError error={error} showNavigation={false} />,
  pendingComponent: () => <RouteLoading message="Opening composer..." showSkeleton={true} skeletonType="detail" />,
});

// Create router instance
export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    contactsRoute,
    contactsPitchedRoute,
    contactsRecommendedRoute,
    contactsMyContactsRoute,
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
