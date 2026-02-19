# Issue #8: [Enhancement] Persistent memory — remember across sessions

**Labels:** `enhancement`, `priority: high`, `area: agent`, `tier-1`
**Status:** ⭕ Pending

**Depends on:** #1

## Description
The agent should remember user preferences, frequently used apps, and key facts across sessions.

## Implementation Details
- Create `src/agent/MemoryStore.ts` — Key-value store for agent memory
- Add `remember(key, value)` and `recall(key)` tools
- Inject relevant memories into system prompt on session start
- Add memory management UI in settings

## Acceptance Criteria
- [ ] Agent remembers user's name and preferences
- [ ] Memories persist across app restarts
- [ ] User can view and manage stored memories

## Inspired by
OpenClaw's persistent memory with Markdown-based storage and deep personalization.
