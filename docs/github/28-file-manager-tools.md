# Issue #28: [Feature] File manager tools — read/write files

**Labels:** `feature`, `priority: medium`, `area: tools`, `tier-3`
**Status:** ⭕ Pending

## Description
Enable the agent to interact with the phone's file system for data storage and extraction.

## Implementation Details
- Create `FileModule.kt` with `readFile`, `writeFile`, `listDirectory`
- Add STORAGE permissions/Scoped Storage handling
- Register JS tools in `src/tools/files.ts`

## Acceptance Criteria
- [ ] Agent can list directory contents
- [ ] Agent can read/write text files
- [ ] Path constraints enforced for safety
