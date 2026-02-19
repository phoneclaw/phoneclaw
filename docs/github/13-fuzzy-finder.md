# Issue #13: [Enhancement] Smart element finder — fuzzy text matching

**Labels:** `enhancement`, `priority: medium`, `area: tools`, `tier-1`
**Status:** ⭕ Pending

## Description
Current `clickByText()` requires exact match. Add fuzzy matching to handle partial text, case differences, etc.

## Implementation Details
- Add `clickByPartialText(text)` tool or improve `clickByText` with fuzzy flag
- Implement case-insensitive and `contains` matching in Kotlin
- Add `findAllByText(text)` to return all matching elements with bounds
- Consider Levenshtein distance for typo tolerance

## Acceptance Criteria
- [ ] Agent can click elements with approximate text matches
- [ ] Multiple matches return ranked results
- [ ] Case-insensitive matching works
