## MODIFIED Requirements

### Requirement: Inbox Shell Layout
The application MUST render a unified inbox shell with a persistent left navigation rail, center list pane, and right-side detail pane that mirror the prototype in `idea.tsx`.

#### Scenario: Navigation rail highlights active surface
- **GIVEN** the user views any surface of the unified shell
- **WHEN** a navigation item is active
- **THEN** that item renders the filled/outlined state defined in `openspec/ui-specs.md`
- **AND** inactive items display the subdued style from the spec while remaining keyboard focusable

### Requirement: Contact Selection Surface
The center pane MUST provide the bulk contact selection workflow with AI-recommended defaults and call-to-action controls before pitches are generated.

#### Scenario: Contact cards match spec styling
- **GIVEN** the contacts surface renders a list of media contacts
- **WHEN** the list is displayed
- **THEN** each contact card uses the spacing, border radius, match badge, and typography tokens defined in `openspec/ui-specs.md`
- **AND** hovering or selecting a card applies the specified shadow and border treatments

#### Scenario: Empty state follows panel pattern
- **GIVEN** the active contact tab has zero contacts to display
- **WHEN** the empty state renders
- **THEN** it uses the dashed panel presentation and copy alignment described in `openspec/ui-specs.md`

## ADDED Requirements

### Requirement: Shell Visual Tokens
The unified shell MUST use the shared spacing, color, typography, and interaction tokens documented in `openspec/ui-specs.md` so all surfaces remain visually consistent.

#### Scenario: Tokens generated and reused
- **GIVEN** the application is built
- **WHEN** the utility stylesheet is generated
- **THEN** it includes only the tokenized classes enumerated in `openspec/ui-specs.md`
- **AND** components reuse those tokens instead of hard-coded values

#### Scenario: Hover and disabled states align with spec
- **GIVEN** any interactive element (tabs, buttons, navigation, quick actions) is hovered or disabled
- **WHEN** the state change occurs
- **THEN** the visual response matches the hover/disabled treatment defined for that component in `openspec/ui-specs.md`
