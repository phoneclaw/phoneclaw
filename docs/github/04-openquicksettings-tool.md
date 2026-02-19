# Issue #4: [Bug] Expose openQuickSettings as a tool

**Labels:** `bug`, `priority: low`, `area: tools`, `tier-0`
**Status:** ⭕ Pending

## Description
`ClawAccessibilityService.kt` has `openQuickSettings()` method but it's not registered in the JS tool registry.

## Implementation Details
- Add `openQuickSettings` to `src/tools/navigation.ts`
- Add native bridge method in `ClawAccessibilityModule.kt` if missing

## Acceptance Criteria
- [ ] Agent can call `openQuickSettings` tool
- [ ] Quick settings panel opens on the phone
