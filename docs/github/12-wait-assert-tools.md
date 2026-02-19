# Issue #12: [Enhancement] Wait/Assert tools for reliable automation

**Labels:** `enhancement`, `priority: medium`, `area: tools`, `tier-1`
**Status:** ⭕ Pending

## Description
Add tools that wait for specific screen states before proceeding. Essential for reliable multi-step automation.

## New Tools
- `waitForText(text, timeoutMs)` — Poll `getScreenText()` until text appears
- `waitForElement(viewId, timeoutMs)` — Wait for element in UI tree
- `assertText(text)` — Verify text is on screen (returns boolean)

## Implementation Details
- Implement polling loop with configurable timeout in JS (no native changes needed)
- Default timeout: 10 seconds, polling interval: 500ms
- Return success/failure with context

## Acceptance Criteria
- [ ] Agent can reliably wait for app screens to load
- [ ] Timeout produces clear error message
- [ ] Polling interval is configurable
