## 1. Token Discovery & Definition
- [ ] 1.1 Audit existing utility usage across Inbox, Contacts, and Conversation Detail to catalogue spacing, radii, typography, and interaction patterns.
- [ ] 1.2 Define the canonical Shadcn-aligned token map (spacing scale, radii tiers, color palette, typography scale, shadow levels) and document it in code plus developer notes.
- [ ] 1.3 Regenerate or refactor the utility layer (Tailwind config or custom CSS bundle) so only the approved tokens are exposed.

## 2. Primitive Implementation
- [ ] 2.1 Build TypeScript component primitives for Card, Panel, Toolbar, Button, Badge, Input, Select, and ListRow that consume the shared tokens.
- [ ] 2.2 Implement variant props (default, outline, subtle, destructive) and state handling (hover, focus-visible, disabled) consistent with Shadcn interactions.
- [ ] 2.3 Provide usage guidelines/examples (mdx notes or Storybook stories) demonstrating correct composition of the primitives.

## 3. Surface Migration
- [ ] 3.1 Analyze the Shadcn inbox reference screenshot to document container shapes, internal component structure, spacing, and separator treatments that must be replicated.
- [ ] 3.2 Rebuild the Inbox shell (nav rail, message list, detail pane) using the new primitives, eliminating gutters between the three columns in favor of Shadcn-style divider lines and container radii.
- [ ] 3.3 Update Contacts selection flow (tabs, cards, bulk action footer) with the standardized tokens and components.
- [ ] 3.4 Align Pitch Composer and Conversation Detail views with the primitives, ensuring responsive behavior matches the reference designs.
- [ ] 3.5 Remove or deprecate legacy utility class fragments that conflict with the new system, adding codemods or lint rules where needed.

## 4. Verification & Rollout
- [ ] 4.1 Add automated checks (RTL assertions, visual snapshots, or Storybook interaction tests) that confirm representative surfaces render required class combinations.
- [ ] 4.2 Run `openspec validate adopt-shadcn-design-language --strict`, lint, and unit/integration test suites; document any follow-up tasks before requesting approval.
