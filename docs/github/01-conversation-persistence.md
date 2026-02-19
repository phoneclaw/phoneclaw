# Issue #1: [Bug] Conversation history lost on app restart

**Labels:** `bug`, `priority: high`, `area: agent`, `tier-0`
**Status:** ⭕ Pending

## Description
All chat messages are stored only in React state and lost when the app restarts. Implement persistent conversation storage.

## Current Behavior
Messages disappear when the app is closed or restarted.

## Expected Behavior
Messages survive app restart and can be browsed in history.

## Implementation Details
- Create `src/storage/ConversationStore.ts` — Save/load messages to AsyncStorage or SQLite
- Update `app/index.tsx` — Load messages on mount, save on new message
- Add conversation list/history UI

## Acceptance Criteria
- [ ] Messages survive app restart
- [ ] Conversation can be continued after restart
- [ ] Old conversations are accessible

## Inspired by
OpenClaw's persistent session model with session history and context compaction.
