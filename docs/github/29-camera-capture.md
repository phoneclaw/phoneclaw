# Issue #29: [Feature] Camera capture tool

**Labels:** `feature`, `priority: low`, `area: tools`, `tier-3`
**Status:** ⭕ Pending

## Description
Agent can take photos using the device camera for situational awareness.

## Implementation Details
- Create `CameraModule.kt` using CameraX
- Return photo as base64 or path
- Add CAMERA permission

## Acceptance Criteria
- [ ] Agent can take a photo on request
- [ ] Photo is available for follow-up Vision analysis
