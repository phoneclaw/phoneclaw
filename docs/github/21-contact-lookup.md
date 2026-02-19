# Issue #21: [Feature] Contact lookup tool

**Labels:** `feature`, `priority: medium`, `area: tools`, `tier-2`
**Status:** ⭕ Pending

## Description
Allow the agent to find contact information by name, enabling requests like "Send a message to John Doe".

## Implementation Details
- Add `ContactsModule.kt` using `ContactsContract`
- Add READ_CONTACTS permission
- Create `findContact(name)` tool that returns phone/email/ID
- Implement fuzzy name matching

## Acceptance Criteria
- [ ] Agent can find contacts by full or partial name
- [ ] Tool returns structured contact data
- [ ] Handles multiple matches gracefully
