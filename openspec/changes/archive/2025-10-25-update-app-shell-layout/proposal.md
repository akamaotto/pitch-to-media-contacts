## Why
- The current `App` entry point still renders the CRA starter screen, which bears no resemblance to the inbox-driven workflow founders expect.
- We already have a high-fidelity prototype in `idea.tsx` that demonstrates the intended three-pane shell with navigation, contact selection, and conversation detail panes. We need to promote this structure into the real application to align the MVP with stakeholder expectations.

## What Changes
- Replace the CRA starter markup with the inbox shell layout from `idea.tsx`, implemented with production-ready components under `src/features/app-shell/`.
- Stand up a persistent left-rail navigation that exposes inbox, contacts, and pitch composer views as top-level actions.
- Bring the contact selection surface and inbox conversation list into the center pane, backed by the same mocked data hooks we plan to reuse across the MVP.
- Implement the conversation detail pane with thread history, AI suggestion callouts, and mobile-friendly toggles between list and detail views.
- Preserve the prototype’s className vocabulary and visual hierarchy so future styling work remains in sync with the design reference.

## Scope
- Desktop and tablet breakpoints must honor the three-pane layout simultaneously; small screens can swap between list and detail panes but must keep navigation accessible.
- Mocked data and state management should live in reusable hooks (or context) rather than component-level clones of `idea.tsx`.
- Performance fine-tuning, data persistence, and email sending are out of scope for this change.

## Risks
- Large JSX refactor could reintroduce lint or type errors if the extracted components are not organized carefully.
- Without shared hooks, feature duplication could grow; this change must start the refactor toward reusable state.
- Mobile toggle experience may feel jarring if transitions are not handled cleanly; ensure scenarios cover small breakpoint behavior.

## Open Questions
- Do we want to gate any of the panes behind temporary feature flags, or should everything ship behind the new shell immediately?
- Should inbox navigation include placeholders for future analytics or tasks, or keep strictly to the prototype items?
