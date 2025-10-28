## Unified App Shell UI Specs

These specs capture the expected layout for the unified shell surfaces derived from the prototype reference screens provided in the design review.

### Global Shell Structure
- The application frame uses a light gray canvas with the primary content centered inside a rounded card or panel, consistent across all surfaces.
- The app header shows the title `Pitch to Media Contacts`, the article subtitle, and a horizontal tab group with the four primary filters: `Pitched`, `AI Recommended`, `All Contacts`, `My Contacts`. The active tab is underlined with a 2px black bar and renders black text; inactive tabs use gray text and show a hover state.
- A sticky footer shows the selected contact count left-aligned and the primary action button (`Generate Pitches`) right-aligned. When disabled, the action uses a light gray background and 40% opacity text.

### Contact Selection Surface (`AI Recommended`, `All Contacts`, `My Contacts`)
- A white card with rounded 16px corners, subtle drop shadow, and 24px internal padding houses the selection controls.
- The card header contains the emoji title “🎯 Select Contacts for Pitch” on the left, with “Add New Contact” and the filter toggle button on the right. Buttons use pill shapes with 12px vertical padding and 16px horizontal padding.
- Bulk-select buttons (`Select All`, `Deselect All`) appear below the header, styled as bordered pills with gray text.
- Filters appear when toggled on: two select dropdowns with 40px height, white fill, rounded 12px corners, border `#E5E7EB`.
- Contact cards:
  - Use a white background with a very light gray border (`#E5E7EB`) and shadow to mimic the Shadcn “card” aesthetic.
  - Each row includes a checkbox, contact name + outlet stacked left, chip badges for contact type/country, beats line with muted text, and a right-aligned black match badge with rounded 9999px pill shape.
  - Hovering a card deepens the shadow; selected cards show a black border and subtle background tint.
- Empty state (e.g., `My Contacts` without entries) replaces the contact list with a dashed border box containing the empty-state copy.

### Pitched Tab (Inbox Dashboard)
- Tab indicator shows a red circular unread badge with white text anchored to the `Pitched` tab.
- The main surface includes:
  - **Performance Snapshot row**: four KPI cards with discrete icons, white backgrounds, thin border, and rounded corners.
  - **Content panes** arranged in a three-column layout:
    - Left: Status filter list with active item filled black, remaining items showing icon + label, grouped sections for Media Type and Country with small uppercase section headings.
    - Middle: Conversation list card with search input (icon left, placeholder “Filter threads…”). Each conversation item uses bold font for unread names, uppercase status badge on the right.
    - Right: Detail panel blank state. When a conversation is selected, the header shows the contact name, email, action icons, followed by subject metadata and the threaded message list with alternating bubble styles (dark for user, light for contact) and the AI suggestion card at the bottom.

### Mobile & Responsive Expectations
- On screens below 768px width, navigation rail collapses and the header provides a surface selector dropdown.
- Contact selection cards remain full-width with padding reduced to 16px on small breakpoints.
- Inbox detail pane uses a back button (`←`) to return from the thread view; when detail is open on mobile, the list pane hides.

### Usage Notes
- These UI specs should be referenced when implementing or refactoring any surface within the unified shell so that future features inherit consistent spacing, typography, and component states.
- When new layouts are added, append corresponding subsections here and cross-link from relevant feature proposals.
