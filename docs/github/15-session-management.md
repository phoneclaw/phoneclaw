# Issue #15: [Feature] Conversation history and session management

**Labels:** `feature`, `priority: high`, `area: ui`, `tier-2`
**Status:** ⭕ Pending

**Depends on:** #1, #8

## Description
Full conversation history with ability to continue past sessions, search through history, and export conversations.

## Implementation Details
- Create `src/storage/SessionManager.ts`
- Add conversation list screen (`app/history.tsx`)
- Add session switching in header
- Context compaction (summarize long conversations to reduce token usage)

## Acceptance Criteria
- [ ] Users can view past conversations
- [ ] Users can continue past conversations
- [ ] Search through conversation history
- [ ] Context compaction reduces token usage

## Inspired by
OpenClaw's session model with history, compaction, and pruning.
