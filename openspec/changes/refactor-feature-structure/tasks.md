## 1. App Shell Composition
- [ ] 1.1 Create `src/app/` entry (providers + shell exports) and update `App.tsx` to consume it
- [ ] 1.2 Split current `AppShell` monolith into `components/AppShell.tsx`, `components/ShellProviders.tsx`, and `panes/` folders per surface

## 2. Contacts Feature Refactor
- [ ] 2.1 Move contacts state logic into `features/contacts/state/` (context, hooks, mock data, selectors)
- [ ] 2.2 Break `ContactSelectionView` into a folder with header, filters, bulk actions, and list subcomponents

## 3. Conversations (Inbox) Feature Refactor
- [ ] 3.1 Extract conversation state to `features/conversations/state/` with context + selectors
- [ ] 3.2 Split inbox UI into focused components (filters, list, detail shell) under `features/conversations/components/`

## 4. Pitches Feature Refactor
- [ ] 4.1 Relocate pitch state into `features/pitches/state/` modules and update provider wiring
- [ ] 4.2 Separate composer UI pieces (header, list, status footer) into dedicated TSX files

## 5. Cross-Cutting Updates
- [ ] 5.1 Update barrel exports and import paths across the app to use new public APIs
- [ ] 5.2 Refresh or add smoke tests ensuring contacts selection, inbox rendering, and composer flows still mount via the new structure
- [ ] 5.3 Document the agreed folder structure in `README` or a contributor guide section
