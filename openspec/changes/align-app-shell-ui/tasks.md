## 1. Visual Token Baseline
- [x] 1.1 Audit current utility classes vs. `openspec/ui-specs.md` and define a minimal token map (colors, spacing, radii, shadows, typography).
- [x] 1.2 Regenerate the Tailwind (or custom utility) bundle to include only required tokens and document the generation command.

## 2. Shell Primitives
- [x] 2.1 Extract shared primitives for navigation rail, tab group, shell panels, buttons, and badges with props for active/disabled states.
- [x] 2.2 Update Contacts surface to use the new primitives and match spacing/typography from the specs (header, filters, contact cards, empty state).
- [x] 2.3 Update Inbox surface (KPI cards, status filters, conversation list/detail) to reuse the primitives and align with specs.
- [x] 2.4 Review Pitch Composer surface to ensure parity with the shared primitives and responsive behavior.

## 3. Responsive & Interaction Polish
- [x] 3.1 Implement spec-compliant mobile breakpoints for nav rail collapsing and list/detail toggles.
- [x] 3.2 Ensure hover/focus/disabled states match the design tokens across all interactive elements.

## 4. Verification
- [ ] 4.1 Add lightweight visual checks (Storybook stories or RTL DOM assertions) covering each surface’s default state.
- [x] 4.2 Run lint/test suites and capture updated UI screenshots for stakeholder review; document any residual gaps in the spec.
