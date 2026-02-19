# Issue #25: [Feature] Task recording and replay

**Labels:** `feature`, `priority: high`, `area: agent`, `tier-3`
**Status:** ⭕ Pending

**Depends on:** #1, #12

## Description
Allow users to record successful multi-step tool sequences as replayable macros.

## Implementation Details
- Create `src/agent/TaskRecorder.ts` to log tool sequence
- Create `src/agent/TaskPlayer.ts` to execute sequence with variable substitution
- Add 'Record' toggle and task library to UI
- Save recordings in `~/.phoneclaw/tasks/`

## Acceptance Criteria
- [ ] User can manually record a sequence of actions
- [ ] Successfully recorded tasks can be replayed with one command
- [ ] Supports basic variable substitution (e.g. name, text)

## Inspired by
Traditional macro recorders, adapted for intent-based AI execution.
