# Issue #3: [Bug] Background execution unreliable — JS thread pauses

**Labels:** `bug`, `priority: high`, `area: native`, `tier-0`
**Status:** ⭕ Pending

## Description
JavaScript thread pauses when app is backgrounded. The HeadlessJS approach has limitations on continuous execution.

## Current Behavior
Agent stops executing when PhoneClaw is not the foreground app. The HeadlessJS + ForegroundService approach was implemented but may not work reliably for all scenarios.

## Expected Behavior
Agent continues executing multi-step tasks even when the app is in background for 10+ minutes.

## Implementation Details
- Investigate `WorkManager` for persistent background tasks
- Consider periodic heartbeat via `AlarmManager`
- Test foreground service notification visibility requirements
- Ensure the React Native bridge stays alive

## Acceptance Criteria
- [ ] Agent continues executing when app backgrounded for 10+ minutes
- [ ] Foreground notification shown during execution
- [ ] Agent resumes correctly after device sleep/wake

## Related Files
- `AgentForegroundService.kt`
- `AgentHeadlessTaskService.kt`
