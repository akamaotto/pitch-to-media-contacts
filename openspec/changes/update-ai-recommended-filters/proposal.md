## Why
The AI Recommended contacts view needs to match the latest workflow: the AI engine outputs the exact filter values users should apply (countries, beats, languages, and media types). Today the UI only reflects countries and beats, so users must manually reapply the missing filters, and the All Contacts tab bootstraps with the AI defaults instead of showing an unfiltered list.

## What Changes
- Extend the AI Recommended payload to persist language and media-type filters that the AI suggests.
- Ensure the Contacts view applies the full AI filter set only in the AI Recommended tab and leaves All Contacts unfiltered on first load.
- Update UI state and copy so users understand which filters are being applied automatically.

## Impact
- Keeps parity with the updated AI guidance experience so campaigns launch with the most relevant outreach list.
- Reduces confusion when switching to All Contacts because it now starts empty of filters as expected.
- Requires coordination with contact filter state management and tab switching behaviors.
