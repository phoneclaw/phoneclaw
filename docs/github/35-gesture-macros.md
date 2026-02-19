# Issue #35: [Feature] Gesture macros — complex sequence execution

**Labels:** `feature`, `priority: low`, `area: tools`, `tier-4`
**Status:** ⭕ Pending

## Description
Execute complex, multi-point, or timed gesture sequences (pinch, draw, multi-touch).

## Implementation Details
- Extend `ClawAccessibilityService.kt` to support `GestureDescription.StrokeDescription` lists
- Create JS schema for complex multi-touch paths
- Register `executeGestureMacro` tool

## Acceptance Criteria
- [ ] Support for pinch-to-zoom
- [ ] Support for multi-finger swipes and gestures
