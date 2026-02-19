# Issue #22: [Feature] SMS tools — send and read messages

**Labels:** `feature`, `priority: medium`, `area: tools`, `tier-2`
**Status:** ⭕ Pending

**Depends on:** #21

## Description
Direct SMS capabilities without needing to open the Messages app UI.

## Implementation Details
- Add SEND_SMS and READ_SMS permissions
- Use `SmsManager` in native code
- Create `sendSms(recipient, body)` and `getRecentSms(limit)` tools
- Handle dual-SIM if possible

## Acceptance Criteria
- [ ] Agent can send SMS to numbers or contacts
- [ ] Agent can read recent incoming SMS
- [ ] Tool reports delivery status

## Related to
OpenClaw's Android node which provides SMS exposure.
