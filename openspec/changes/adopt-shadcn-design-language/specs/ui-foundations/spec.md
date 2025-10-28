## ADDED Requirements
### Requirement: Shadcn Token Baseline
The application MUST expose a shared token system for color, spacing, radii, typography, and elevation that mirrors the Shadcn design language.

#### Scenario: Tokens available in code and compiled styles
- **GIVEN** a developer imports design tokens or utility classes
- **WHEN** they reference spacing (`space-2`, `space-6`), radii (`rounded-md`, `rounded-xl`), or color roles (`bg-muted`, `border-border`)
- **THEN** the values match the documented Shadcn scale for spacing (4/8/12/16px tiers), radii (4/8/12/16px tiers), neutral color ramps, typography (14/16/20px steps), and elevation (`shadow-sm`, `shadow-md`)
- **AND** tokens are defined once in TypeScript plus the generated CSS so UI primitives consume identical values.

### Requirement: Core Surface Primitives
The system MUST provide reusable primitives (Card, Panel, Toolbar, Button, Badge, ListRow, Input, Select) that consume the shared tokens and keep layout/spacing consistent.

#### Scenario: High-traffic surfaces compose primitives
- **GIVEN** the Inbox, Contacts, Conversation Detail, or Pitch Composer surface renders
- **WHEN** the component tree mounts
- **THEN** outer sections use the Card or Panel primitives with `px-6`/`py-4` default padding and `rounded-xl` surfaces
- **AND** list rows and cards apply the ListRow primitive with `rounded-lg` corners, `gap-4` spacing, and hover/active states sourced from the shared tokens
- **AND** actions (buttons, badges, form inputs) render via the standardized primitives rather than bespoke utility strings.

### Requirement: Shadcn Interaction States
All interactive elements MUST align with Shadcn hover, focus-visible, active, and disabled treatments using the shared token definitions.

#### Scenario: Focus and hover states reflect tokenized styles
- **GIVEN** a user interacts with a button, list row, or input rendered by the primitives
- **WHEN** the element receives `:hover` or `:focus-visible`
- **THEN** it applies the tokenized background (`bg-accent/90` on hover), ring (`ring-2 ring-offset-2 ring-accent`) and text color treatments defined in the shared tokens
- **AND** disabled states use muted colors and cursor styles consistent with Shadcn defaults
- **AND** regression tests or stories verify these class combinations for at least one example of each primitive.
