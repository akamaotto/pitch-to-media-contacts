# Pitch to Media Contacts

This project implements the Poblysh inbox prototype in React 19 with TypeScript. It provides a unified workspace for selecting media contacts, generating AI-assisted pitches, and managing conversations.

## Getting Started

```bash
npm install
npm start
```

The development server runs on http://localhost:3000. Run the test suite with `npm test` to execute the Jest smoke tests that cover the unified shell navigation.

## Project Structure

```
src/
├── app/                  # App-level shell and pane composition
│   ├── components/       # Shell providers and layout wiring
│   └── panes/            # Contacts, inbox, and composer surface modules
├── features/
│   ├── contacts/
│   │   ├── components/   # Contact cards, modal, and selection workflow
│   │   └── state/        # Contacts provider, hooks, and mock data
│   ├── conversations/
│   │   ├── components/   # Conversation detail, bubbles, list items
│   │   └── state/        # Inbox provider, selectors, and mock threads
│   └── pitches/
│       ├── components/   # Pitch composer leaf components
│       └── state/        # Pitch provider and generation logic
├── components/           # Shared UI primitives (cards, alerts, etc.)
├── hooks/                # Cross-feature hooks such as `useApp`
├── styles/               # Global and feature-scoped stylesheets
└── types/                # Shared TypeScript types for the domain
```

Each feature directory exposes its public API via `index.ts` so other modules can import `ContactsProvider`, `usePitches`, or UI components without reaching into deep paths.

## Testing

The smoke tests in `src/App.test.tsx` verify:
- The contact selection surface renders by default
- Navigation to the inbox shows conversation details
- Generating pitches transitions to the composer pane

Use `npm test` to run the suite in watch mode.

## Conventions

- Keep stateful logic under `state/` directories and export consumer hooks via the feature barrel.
- Use the `src/app` boundary for shell composition and top-level navigation.
- Co-locate surface-specific components under `src/app/panes/<surface>` to keep files focused and under 200 lines.
