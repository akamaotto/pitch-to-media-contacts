# Project Context

## Purpose
Build a focused PR workflow tool for startups to discover the right media contacts, generate personalized pitches with AI assistance, and track conversation status in a Gmail-style inbox. The MVP mirrors the interactive prototype in `idea.tsx`, giving founders a single place to select contacts, run AI pitch generation, review drafts, and manage replies.

## Tech Stack
- TypeScript (strict mode) on Create React App 5
- React 19 with functional components and hooks
- lucide-react for the icon set while Shadcn-inspired UI blocks are recreated manually
- Plain CSS plus utility-style class strings (Tailwind vocabulary without the Tailwind build step)
- Jest + React Testing Library for unit and integration tests

## Project Conventions

### Code Style
- TypeScript everywhere (no `.js` files in `src/`) with strict compiler settings enforced by `tsconfig.json`.
- Prefer small, pure functional components and React hooks; class components are out of scope.
- Co-locate feature code under `src/features/<domain>` with `components/` and `hooks/` folders; shared primitives live in `src/components` or `src/hooks`.
- Use descriptive PascalCase for components, camelCase for functions/variables, and SCREAMING_SNAKE_CASE for constants.
- Compose UI with utility class strings that match Tailwind vocabulary; keep bespoke CSS in `src/styles` when necessary.

### Architecture Patterns
- Feature-first folder structure (contacts, pitches, conversations, dashboard) to mirror the product pillars.
- Hooks encapsulate stateful logic per feature (`useContacts`, `usePitches`, `useConversations`); upcoming work will lift this into shared context/state providers to avoid duplicated state across components.
- UI broken into Shadcn-style building blocks (cards, modals, panels) implemented in plain React to match the prototype.
- Data is currently mocked in-memory; future integrations will swap these hooks for API-backed sources while preserving the component contracts defined in `src/types`.

### Testing Strategy
- Jest + React Testing Library (already in `dependencies`) for component behavior and hook logic.
- Prioritize smoke tests for core flows: selecting contacts, triggering pitch generation, and rendering conversations.
- Snapshot tests only for stable presentational components; interaction-heavy pieces should rely on RTL assertions.
- Guard regressions around shared hooks with unit tests once state is centralized.

### Git Workflow
- Default branch: `main`. All work lands via short-lived feature branches (`feature/<summary>` or `bugfix/<summary>`).
- Rebase onto `main` before merging to keep history linear; avoid merge commits.
- Use Conventional Commits (`feat: …`, `fix: …`, `refactor: …`, etc.) so changelog generation stays easy.
- Open PRs early for feedback with linked task/issue context; require at least one review before merge.

## Domain Context
- The app supports PR teams/founders pitching journalists. Terminology such as “match score”, “beats”, “pitched”, and “AI suggestion” reflects the Poblysh workflow.
- Views: (1) Contact selection & AI pitch generation, (2) Inbox dashboard for conversations, mirroring the Gmail split-pane layout in the `idea.tsx` prototype.
- “PitchedContact” cards must adopt the Shadcn v3 block aesthetic shown in the design reference; consistency here is a key product requirement.

## Important Constraints
- No backend yet—everything must function with mocked data while keeping the door open for API integration.
- Maintain parity with the prototype’s behavior and microcopy; UX deviations need explicit sign-off.
- Keep bundle lightweight (CRA baseline); introducing heavy UI frameworks or CSS-in-JS libraries requires approval.
- Target modern Chromium, Firefox, and Safari (per `browserslist`); IE support is out of scope.

## External Dependencies
- lucide-react provides the iconography (subset aligned with the prototype).
- No live external APIs yet; future versions will integrate with email sending and CRM services, so keep data access abstracted behind hooks or service modules.
