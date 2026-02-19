# Issue #5: [Bug] Screenshot optimization — compress before sending to LLM

**Labels:** `bug`, `priority: medium`, `area: vision`, `tier-0`
**Status:** ⭕ Pending

## Description
Full-resolution screenshots (1080×2400) are sent as base64 to the LLM, wasting tokens and increasing latency.

## Implementation Details
- Update `ClawAccessibilityService.kt` `takeScreenshotAsync()` to resize bitmap to ~540×1200
- Use JPEG compression at 60-70% quality
- Optionally make quality/size configurable in settings

## Acceptance Criteria
- [ ] Screenshot payload size reduced by ~70%
- [ ] Image quality remains sufficient for LLM analysis
- [ ] No regression in vision tool accuracy
