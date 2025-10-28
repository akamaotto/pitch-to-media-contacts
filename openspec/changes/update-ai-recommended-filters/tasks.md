## 1. Spec & State Review
- [x] 1.1 Audit existing AI recommendation data structures and filter state handlers.
- [x] 1.2 Confirm expected filter taxonomies (countries, beats, languages, media types) and default behaviors for each tab.

## 2. Implementation
- [x] 2.1 Update AI recommendation hook/state to persist language and media-type suggestions alongside existing filters.
- [x] 2.2 Apply the AI recommender filters only when the AI Recommended tab is active; ensure All Contacts loads without defaults.
- [x] 2.3 Reflect the expanded filter set in the UI (badges, chips, or filter list) so users can see applied values.

## 3. Verification
- [x] 3.1 Add or update tests covering AI Recommended vs. All Contacts filter application.
- [ ] 3.2 Run lint/tests locally and document results.
