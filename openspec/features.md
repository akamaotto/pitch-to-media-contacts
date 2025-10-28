# Feature Status & UI References

## Completed in `update-app-shell-layout`

- **Unified App Layout & Navigation** – Implemented; see `openspec/ui-specs.md` for layout expectations.
- **Shared Application State** – Delivered via context providers (`useApp`, `useContacts`, `useConversations`, `usePitches`) wiring the shell surfaces together.
- **Contact Selection & Shadcn Cards** – Tabbed selector, filters, bulk select, and card styling now match the prototype; UI behaviors captured in `openspec/ui-specs.md`.
- **Inbox Dashboard & Conversations** – Status filters, search, conversation list, and detail pane with AI suggestion footer migrated into the app shell.
- **Icon & Hook Compliance Cleanup** – lucide-react usage standardized and hooks refactored into providers to satisfy linting rules.

## Still Pending

- **AI Pitch Generation Flow** – Port generating-progress screen, review list, send action, and ensure generated pitches synchronize contact + conversation state. Requires new UI specs once design is finalized.
- **Follow-up Automation & Draft Composer Enhancements** – Placeholder for future work on AI reply suggestions, scheduling, and template management (design pending).

Refer to `openspec/ui-specs.md` for detailed visual expectations of the implemented shell. Update that document alongside future proposals to keep layout guidance centralized.
