# Issue #33: [Feature] System controls — WiFi, Bluetooth, Volume, Brightness

**Labels:** `feature`, `priority: low`, `area: tools`, `tier-4`
**Status:** ⭕ Pending

## Description
Allow the agent to toggle and adjust basic phone system settings.

## Implementation Details
- Create `SystemModule.kt`
- Add WRITE_SETTINGS permissions
- Register tools for WiFi (toggle), Bluetooth (toggle), Volume (slider), Brightness (slider)

## Acceptance Criteria
- [ ] Agent can toggle WiFi/Bluetooth reliably
- [ ] Agent can adjust volume and brightness
