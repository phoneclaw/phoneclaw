# Issue #30: [Feature] Location services tool

**Labels:** `feature`, `priority: low`, `area: tools`, `tier-3`
**Status:** ⭕ Pending

## Description
Agent can access device GPS location.

## Implementation Details
- Create `LocationModule.kt` using FusedLocationProvider
- Add LOCATION permissions
- Tool returns lat/long and address if possible

## Acceptance Criteria
- [ ] Agent can report user's current location
- [ ] Location is usable for location-aware requests

## Inspired by
OpenClaw's `location.get` tool.
