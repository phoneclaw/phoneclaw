# Issue #23: [Feature] App list — discover installed applications

**Labels:** `feature`, `priority: low`, `area: tools`, `tier-2`
**Status:** ⭕ Pending

## Description
Agent should be able to list installed apps to discover package names for the `launchApp` tool.

## Implementation Details
- Use `PackageManager` in native code
- Create `listInstalledApps()` tool returning name and package
- Filter out system/unlaunchable apps by default

## Acceptance Criteria
- [ ] Agent can get a list of installed apps
- [ ] Agent can use results to launch any desired app by name
