# TanStack Router Architecture Diagram

## Current vs. Proposed Navigation Flow

### Current State-Based Navigation
```mermaid
graph TD
    A[App Shell] --> B[useApp Hook]
    B --> C[activeSurface State]
    B --> D[selectedTab State]
    C --> E[Conditional Rendering]
    D --> E
    E --> F[Contacts Pane]
    E --> G[Inbox Pane]
    E --> H[Composer Pane]
    F --> I[Tab Navigation Logic]
    I --> J[Tab State Updates]
    J --> B
```

### Proposed URL-Based Navigation
```mermaid
graph TD
    A[Browser URL] --> B[TanStack Router]
    B --> C[Route Matching]
    C --> D[Route Components]
    D --> E[Contacts Surface]
    D --> F[Inbox Surface]
    D --> G[Composer Surface]
    E --> H[Nested Tab Routes]
    H --> I[Recommended Tab]
    H --> J[All Tab]
    H --> K[MyContacts Tab]
    H --> L[Pitched Tab]
    B --> M[useApp Hook]
    M --> N[Derived State]
    N --> O[Component Props]
```

## Route Hierarchy Structure

```mermaid
graph TD
    A[/ - Root] --> B[Redirect to /contacts/recommended]
    C[/contacts] --> D[Redirect to /contacts/recommended]
    E[/contacts/recommended] --> F[ContactsSurface + RecommendedTab]
    G[/contacts/all] --> H[ContactsSurface + AllTab]
    I[/contacts/myContacts] --> J[ContactsSurface + MyContactsTab]
    K[/contacts/pitched] --> L[ContactsSurface + PitchedTab]
    M[/inbox] --> N[InboxSurface]
    O[/composer] --> P[ComposerSurface]
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#e8f5e8
    style F fill:#f3e5f5
    style G fill:#e8f5e8
    style H fill:#f3e5f5
    style I fill:#e8f5e8
    style J fill:#f3e5f5
    style K fill:#e8f5e8
    style L fill:#f3e5f5
    style M fill:#e8f5e8
    style N fill:#f3e5f5
    style O fill:#e8f5e8
    style P fill:#f3e5f5
```

## Component Integration Flow

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant R as TanStack Router
    participant RC as Route Component
    participant A as useApp Hook
    participant C as Component

    U->>B: Clicks navigation link
    B->>R: URL change event
    R->>RC: Match route
    RC->>A: Get derived state
    A->>C: Pass props
    C->>U: Render updated UI
    
    Note over R,A: Router state syncs with useApp hook
    Note over C: Components maintain existing API
```

## Migration Strategy Phases

```mermaid
gantt
    title TanStack Router Implementation Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1: Foundation
    Install Dependencies     :done, p1-1, 2024-01-01, 1d
    Router Setup           :done, p1-2, after p1-1, 2d
    Basic Routes          :active, p1-3, after p1-2, 2d
    
    section Phase 2: Implementation
    Surface Routes        :p2-1, after p1-3, 3d
    Tab Routes           :p2-2, after p2-1, 2d
    Route Components     :p2-3, after p2-2, 3d
    
    section Phase 3: Integration
    useApp Hook Update   :p3-1, after p2-3, 2d
    Navigation Refactor  :p3-2, after p3-1, 3d
    Data Loading        :p3-3, after p3-2, 2d
    
    section Phase 4: Enhancement
    Deep Linking        :p4-1, after p3-3, 2d
    Error Handling      :p4-2, after p4-1, 2d
    Code Splitting      :p4-3, after p4-2, 2d
    
    section Phase 5: Cleanup
    Remove Old Code     :p5-1, after p4-3, 2d
    Testing             :p5-2, after p5-1, 3d
    Documentation       :p5-3, after p5-2, 1d
```

## State Management Flow

```mermaid
graph LR
    A[URL] --> B[Router State]
    B --> C[Route Parameters]
    B --> D[Search Params]
    C --> E[useApp Hook]
    D --> E
    E --> F[Derived State]
    F --> G[activeSurface]
    F --> H[selectedTab]
    F --> I[Other State]
    G --> J[Components]
    H --> J
    I --> J
    J --> K[UI Rendering]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style E fill:#e8f5e8
    style J fill:#fff3e0
    style K fill:#fce4ec
```

## File Structure After Implementation

```mermaid
graph TD
    A[src/] --> B[index.tsx]
    A --> C[App.tsx]
    A --> D[router.ts]
    A --> E[routes/]
    E --> F[__root.tsx]
    E --> G[index.tsx]
    E --> H[contacts/]
    H --> I[index.tsx]
    H --> J[recommended.tsx]
    H --> K[all.tsx]
    H --> L[myContacts.tsx]
    H --> M[pitched.tsx]
    E --> N[inbox.tsx]
    E --> O[composer.tsx]
    A --> P[hooks/]
    P --> Q[useApp.tsx]
    A --> R[app/]
    R --> S[components/]
    S --> T[AppShell.tsx]
    S --> U[ShellContent.tsx]
    
    style E fill:#e8f5e8
    style H fill:#f3e5f5
    style P fill:#fff3e0
    style R fill:#fce4ec