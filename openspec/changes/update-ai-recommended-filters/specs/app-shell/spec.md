## MODIFIED Requirements

### Requirement: Contact Selection Surface
The center pane MUST provide the bulk contact selection workflow with AI-recommended defaults and call-to-action controls before pitches are generated.

#### Scenario: AI Recommended applies full filter bundle
- **GIVEN** the AI engine returns recommended filters for a campaign
- **WHEN** the user opens the `AI Recommended` tab
- **THEN** the contacts list applies the AI-provided countries, beats, languages, and media types simultaneously
- **AND** the active filters surface all applied values so the user can inspect or adjust them

#### Scenario: All Contacts opens unfiltered
- **GIVEN** the user switches to the `All Contacts` tab
- **WHEN** the pane renders
- **THEN** no filters are pre-applied to the contacts list
- **AND** the filter controls reflect their default, unselected state
