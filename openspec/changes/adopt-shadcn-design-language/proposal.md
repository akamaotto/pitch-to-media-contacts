## Why
- Current surfaces still mix ad-hoc radii, spacing, and color tokens, so screens feel inconsistent and drift from the Shadcn reference the product wants to emulate.
- Designers rely on Shadcn interaction and layout patterns for future mocks, but developers lack a codified set of primitives, leading to rework and visual regressions in every feature.
- A shared design foundation is required before we scale new surfaces (analytics, outreach workflows) so they feel cohesive and trustworthy.

## What Changes
- Define a codified token map (spacing, sizing, radii, color, typography, shadows) that mirrors the Shadcn defaults and expose it as TypeScript constants plus compiled utility classes.
- Establish reusable surface primitives (card, panel, toolbar, list row, button, form controls) that consume the tokens and enforce consistent padding, border radii, and state styling.
- Apply the primitives to the highest traffic flows (Inbox shell, Contacts grid, Conversation detail, Pitch composer) and retire bespoke utility strings that conflict with the new tokens.
- Add guardrails (lint rule or RTL/Storybook checks) that verify required class combinations so future components stay aligned with the design language.

## Scope
- Token layer, typography scale, border radii, elevation rules, and spacing system inspired by Shadcn.
- Core surface primitives and their variants (default, subtle, destructive, outline as applicable).
- Inbox, Contacts, Conversation Detail, and Pitch Composer surfaces, including responsive breakpoints.
- Documentation for developers describing how to apply the primitives and when to extend them.

## Out of Scope
- Introducing third-party component packages beyond what is necessary to mirror Shadcn styles.
- Net-new product features, data integrations, or content changes unrelated to the visual refresh.
- Design system automation (Figma plugins, design tokens sync tooling) beyond the documented constants.

## Risks
- Token refactors may conflict with the ongoing `align-app-shell-ui` change; coordination is required to avoid duplicate work or regressions.
- Replacing ad-hoc utility strings could surface layout bugs in less frequently tested surfaces (e.g., mobile composer).
- Guardrail tooling may lengthen CI times or add complexity if not scoped carefully.

## Open Questions
- Should we fully mirror Shadcn naming (`bg-muted`, `ring-offset`) or adapt names to existing conventions to ease adoption?
- Do we need to introduce Storybook now for visual regression coverage, or can we lean on RTL DOM assertions plus manual review for the first iteration?
- How do we communicate the deprecation path for old utility strings so feature teams migrate without blocking releases?
