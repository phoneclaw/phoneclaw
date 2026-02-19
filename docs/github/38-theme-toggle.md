# Issue #38: [Enhancement] Dark/Light theme toggle

**Labels:** `enhancement`, `priority: low`, `area: ui`, `tier-5`
**Status:** ⭕ Pending

## Description
Add a light mode option in settings. Currently the app is dark-only.

## Implementation Details
- Create a light palette in `src/constants/theme.ts`
- Use `Appearance` API or manual toggle in settings
- Ensure all components respect theme change

## Acceptance Criteria
- [ ] High contrast between light and dark modes
- [ ] Theme selection persists
