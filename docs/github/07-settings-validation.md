# Issue #7: [Enhancement] Settings input validation

**Labels:** `enhancement`, `priority: low`, `area: ui`, `tier-0`
**Status:** ⭕ Pending

## Description
No validation on settings inputs. Users can enter invalid URLs, negative numbers, empty strings.

## Implementation Details
- Validate base URL format (must start with http:// or https://)
- Clamp max steps to 1-100
- Validate API key is non-empty
- Show inline validation errors with red border

## Acceptance Criteria
- [ ] Invalid inputs show error state
- [ ] Invalid settings cannot be saved
- [ ] Clear error messages displayed
