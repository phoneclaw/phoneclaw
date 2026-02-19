# Issue #6: [Enhancement] Auto-save settings with debounce

**Labels:** `enhancement`, `priority: low`, `area: ui`, `tier-0`
**Status:** ⭕ Pending

## Description
Settings require manual 'Save' button tap. Auto-save with debounce when values change.

## Implementation Details
- Add `useEffect` with debounced `saveSettings()` call in `settings.tsx`
- Show subtle 'Saving...' / 'Saved' indicator
- Keep manual save button as fallback

## Acceptance Criteria
- [ ] Settings persist without manual save
- [ ] Debounce prevents excessive writes
- [ ] Visual indicator shows save status
