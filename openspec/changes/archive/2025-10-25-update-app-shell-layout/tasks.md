## 1. Shell Foundation
- [x] 1.1 Extract the shared mocked data/state (contacts, conversations, pitches) from `idea.tsx` into reusable app-shell providers.
- [x] 1.2 Define type-safe interfaces in `src/types` for contacts, conversations, messages, and pitches.

## 2. Layout Structure
- [x] 2.1 Implement `AppLayout` with left navigation, middle list pane, and right detail pane, using utility class strings from the prototype.
- [x] 2.2 Rebuild the sidebar navigation with brand header, view shortcuts (Inbox, Contacts, Pitch Composer), and secondary filters/quick actions.
- [x] 2.3 Render the contact selection surface inside the center pane with tabbed filters and bulk select actions.

## 3. Conversation Detail
- [x] 3.1 Port the conversation list cards and message thread detail view with AI suggestion callout and reply composer.
- [x] 3.2 Implement mobile toggle behavior to switch between list and detail panes via header controls.

## 4. App Integration & QA
- [x] 4.1 Replace CRA starter content in `src/App.tsx` with the new shell and ensure styles load from `src/styles/App.css`.
- [x] 4.2 Add smoke tests (RTL) that assert the three-pane layout renders and that selecting a conversation shows the detail pane.
- [x] 4.3 Run lint/test suites and update documentation or story references if needed.
