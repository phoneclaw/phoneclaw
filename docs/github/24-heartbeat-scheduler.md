# Issue #24: [Feature] Proactive heartbeat scheduler

**Labels:** `feature`, `priority: medium`, `area: automation`, `tier-3`
**Status:** ⭕ Pending

**Depends on:** #19, #8

## Description
A daemon that periodically checks for notifications, reminders, and system status, proactively alerting the user if needed.

## Implementation Details
- Create `src/automation/Heartbeat.ts`
- Define `HEARTBEAT.md` checklist (instructions for cheap pre-LLM checks)
- Logic: Check notification log -> Check reminders -> If match, invoke LLM to decide on action
- Send proactive messages via Telegram/Discord

## Acceptance Criteria
- [ ] Agent periodically checks background status without prompting
- [ ] Agent can send unsolicited updates/alerts to user
- [ ] Configurable polling intervals

## Inspired by
OpenClaw's proactive heartbeat scheduler.
