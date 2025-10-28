## ADDED Requirements

### Requirement: Inbox Shell Layout
The application MUST render a unified inbox shell with a persistent left navigation rail, center list pane, and right-side detail pane that mirror the prototype in `idea.tsx`.

#### Scenario: Desktop shell renders three panes
- **GIVEN** the user opens the application on a viewport that is at least 1024px wide
- **WHEN** the shell loads
- **THEN** the left navigation rail, center list pane, and right detail pane are all visible simultaneously
- **AND** the navigation rail includes branded header content and primary actions for `Inbox`, `Contacts`, and `Pitch Composer`

#### Scenario: Navigation switches primary surface
- **GIVEN** the user is viewing the unified shell
- **WHEN** they activate a primary navigation action (`Inbox`, `Contacts`, or `Pitch Composer`)
- **THEN** the center pane swaps to the corresponding surface while the navigation rail and detail pane remain mounted
- **AND** the selected navigation item shows an active state that matches the prototype styling

### Requirement: Contact Selection Surface
The center pane MUST provide the bulk contact selection workflow with AI-recommended defaults and call-to-action controls before pitches are generated.

#### Scenario: Tabbed contact filters render in center pane
- **GIVEN** the `Contacts` navigation surface is active and no pitches have been generated yet
- **WHEN** the center pane renders
- **THEN** it shows tab buttons for `Inbox` (if available), `AI Recommended`, `All Contacts`, and `My Contacts`
- **AND** the active tab’s underline and count badge styling match the prototype

#### Scenario: Bulk select updates selection count
- **GIVEN** the user is on the `Contacts` surface with contacts listed
- **WHEN** they toggle a contact card selection checkbox
- **THEN** the contact gains the selected styling and the sticky footer updates the total selected count and enables the `Generate Pitches` button when the count is greater than zero

### Requirement: Conversation Detail Toggles
The shell MUST allow users to review conversation threads in the right detail pane while keeping the thread list accessible, including a mobile-friendly toggle between list and detail views.

#### Scenario: Selecting a conversation opens detail pane
- **GIVEN** the user is on the `Inbox` surface with conversation cards in the center pane
- **WHEN** they select a conversation card
- **THEN** the right detail pane displays the full thread history, AI suggestion callout, and reply composer for that conversation
- **AND** the selected card shows its active styling while the list remains visible on desktop viewports

#### Scenario: Mobile detail toggle
- **GIVEN** the user is on a viewport narrower than 768px with the `Inbox` surface active
- **WHEN** they open a conversation from the center list
- **THEN** the UI swaps to the detail view and reveals a back control in the header
- **AND** tapping the back control returns the user to the conversation list without losing read state
