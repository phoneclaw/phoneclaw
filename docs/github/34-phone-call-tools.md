# Issue #34: [Feature] Phone call tools — make and answer calls

**Labels:** `feature`, `priority: low`, `area: tools`, `tier-4`
**Status:** ⭕ Pending

**Depends on:** #21

## Description
Agent can initiate and manage cellular phone calls.

## Implementation Details
- Use `ACTION_CALL` intent in native code
- Add CALL_PHONE permission
- Include tool to check current call state

## Acceptance Criteria
- [ ] Agent can make a call to a contact/number
- [ ] Agent can hang up an active call
