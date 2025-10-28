## Why
- `AppShell` currently hosts three full surfaces and provider composition in a single 400+ line file, which makes it difficult to reason about or target incremental UI changes.
- Feature folders hold mixed responsibilities (components, mocked data, and context logic) inside single files such as `useContacts.tsx`, creating tight coupling between state and rendering concerns.
- Imports depend on deep relative paths (`../../../`) because shared providers and UI primitives live outside any central module, raising the risk of cyclical dependencies as the app grows.
- We need a documented structure to support upcoming changes while preserving behavioral parity with the existing spec for the inbox shell.

## What Changes
- Introduce an `src/app/` boundary that centralizes top-level providers and shell composition, allowing feature folders to expose only their public modules.
- Refactor `features/app-shell` into a `components/` entry point and `panes/` sub-folders (`contacts`, `inbox`, `composer`) so each surface renders from focused files with co-located leaf components.
- Split domain state hooks (`useContacts`, `useConversations`, `usePitches`) into `state/` folders with dedicated context, selectors, and mock data modules to decouple provider wiring from consumer hooks.
- Restructure feature UI folders so shared blocks (filters, lists, cards, modals) live in their own component files under feature-scoped directories, replacing monolithic exports like `ContactSelectionView.tsx`.
- Update all imports and re-export barrels (`index.ts`) to reflect the new boundaries, ensuring external consumers reference feature public APIs instead of deep paths.
- Keep runtime behavior intact, adding targeted smoke tests where components gain new entry points to safeguard parity.

## Impact
- Behavioural change is not expected; this is an internal refactor focused on maintainability.
- Snapshot/RTL coverage must be updated to reference the new component locations, but no new behaviour specs are required.
- Documentation: update `README` or contributor notes with the new folder map once the refactor lands.
