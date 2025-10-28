## Why
- The archived shell implementation meets structural requirements but diverges noticeably from the approved visual mocks, making it difficult for users to understand which surface is active.
- Ad-hoc utility classes and inconsistent component states (tabs, nav rail, cards, footers) generate a chaotic presentation that erodes product trust and slows QA.
- We already captured the desired presentation in `openspec/ui-specs.md`; we need to close the gap so every surface reflects those specs.

## What Changes
- Define a shared visual token layer (spacing, radii, shadows, color primitives) and update the generated utility bundle so components render with consistent styling.
- Refactor the navigation rail, tab group, contact cards, and selection summary panels to reuse common primitives with clear active/hover/disabled states matching the UI specs.
- Normalize layout padding, typography, and empty states across the Contacts, Inbox, and Pitch Composer surfaces; align mobile breakpoints with the responsive behaviors captured in the spec.
- Add smoke-level visual checks (Storybook stories or RTL DOM assertions) that ensure the shell renders expected class combinations for each surface.

## Scope
- Desktop and tablet breakpoints for Inbox, Contacts, and Pitch Composer surfaces.
- Navigation rail, contact selection tabs, summary panel, card rows, quick actions, footer CTA, and inbox conversation list/detail states.
- Mobile breakpoint handling for list/detail toggles and navigation.
- Out of scope: brand new features (pitch generation workflow, analytics), content copy changes, or introducing a full design system beyond what is needed for shell alignment.

## Risks
- Tailwind/utility regeneration could bloat the CSS bundle if tokens are not curated carefully.
- Refactoring to shared primitives may surface additional layout regressions that require coordination with pending feature work.
- Visual verification without snapshot tooling may miss subtle spacing regressions; we should scope automated checks early.

## Open Questions
- Do we standardize around Tailwind JIT in the build, or keep generating a static subset checked into `src/styles/tailwind.css`?
- Should we introduce Storybook for visual QA now, or rely on existing testing infrastructure plus manual review?
