# Issue #14: [Enhancement] Clipboard tools — read/write clipboard

**Labels:** `enhancement`, `priority: medium`, `area: tools`, `tier-1`
**Status:** ⭕ Pending

## Description
Agent cannot read or write clipboard. This is needed for copying text between apps.

## Implementation Details
- Add `getClipboard()` and `setClipboard(text)` to Kotlin service using `ClipboardManager`
- Bridge to React Native via `ClawAccessibilityModule`
- Register as tools in `src/tools/clipboard.ts`

## Acceptance Criteria
- [ ] Agent can read clipboard content
- [ ] Agent can set clipboard content
- [ ] Works across different apps
