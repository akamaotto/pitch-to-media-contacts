## ADDED Requirements
### Requirement: App Boundary Exports Shell + Providers
The application MUST expose its top-level shell and provider wiring from a dedicated `src/app/` boundary so features no longer import deep relative paths.

#### Scenario: Shell entrypoint published from src/app
- **GIVEN** a developer imports `{ AppShell }` from `src/app`
- **WHEN** the project is compiled
- **THEN** the import resolves to a file under `src/app/components/AppShell.tsx`
- **AND** the same boundary exports a `ShellProviders` module that composes shared feature providers without referencing `features/app-shell` internals.

#### Scenario: App.tsx relies on app boundary
- **GIVEN** the root `src/App.tsx`
- **WHEN** the module tree is evaluated
- **THEN** it only imports from `src/app` (and not `features/app-shell`) to render the top-level UI.

### Requirement: Feature State Organized Under state/ Modules
Each feature MUST centralize context providers, selectors, and mock data inside a `state/` subdirectory to keep rendering components lightweight.

#### Scenario: Contacts state isolated
- **GIVEN** the `src/features/contacts` folder
- **WHEN** a contributor inspects its structure
- **THEN** they find a `state/` directory containing modules for the provider, shared hooks, and mock data
- **AND** UI components import contacts state through the feature's public barrel instead of pointing at legacy `hooks/useContacts`.

#### Scenario: Conversations and pitches follow same pattern
- **GIVEN** the `src/features/conversations` and `src/features/pitches` folders
- **WHEN** examining their contents
- **THEN** each contains a `state/` directory with the provider, hooks, and mock data modules
- **AND** there are no remaining imports referencing `hooks/useConversations.tsx` or `hooks/usePitches.tsx`; consumers rely on the feature barrel instead.

### Requirement: Surface Panes Split Into Focused Folders
The shell's primary surfaces MUST be broken into smaller component files grouped by surface to simplify targeted updates.

#### Scenario: Contacts pane decomposed
- **GIVEN** the contacts surface implementation
- **WHEN** reviewing `src/app/panes/contacts`
- **THEN** the folder contains dedicated files for header, filters, bulk actions, and list rendering that compose into a `ContactsPane.tsx`
- **AND** legacy monolithic files like `ContactSelectionView.tsx` are removed.

#### Scenario: Inbox and composer panes follow suite
- **GIVEN** the inbox and composer surfaces
- **WHEN** examining `src/app/panes/inbox` and `src/app/panes/composer`
- **THEN** each folder contains focused components (e.g., filters, list, detail shell, composer header, drafts list)
- **AND** the assembled panes are composed from these smaller building blocks rather than a single monolithic file.
