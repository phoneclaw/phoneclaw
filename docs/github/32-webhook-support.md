# Issue #32: [Feature] Webhook support for external triggers

**Labels:** `feature`, `priority: low`, `area: automation`, `tier-4`
**Status:** ⭕ Pending

**Depends on:** #19

## Description
Accept incoming HTTP webhook calls that trigger agent tasks.

## Implementation Details
- Expose webhook endpoint on the local server
- Map webhook payloads to predefined agent tasks/prompts
- Token auth for security

## Acceptance Criteria
- [ ] External triggers (IFTTT, Zapier) can start agent tasks
- [ ] Secure endpoint accessible via local network or tunnel
