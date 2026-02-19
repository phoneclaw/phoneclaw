# Issue #19: [Feature] Scheduled tasks / Cron jobs

**Labels:** `feature`, `priority: medium`, `area: automation`, `tier-2`
**Status:** ⭕ Pending

**Depends on:** #3

## Description
Allow users to schedule recurring or one-time tasks that the agent executes automatically.

## Implementation Details
- Create `src/automation/Scheduler.ts`
- Use `WorkManager` or `AlarmManager` in Kotlin for reliable Android scheduling
- Handle device reboot persistence
- Add schedule management UI (list, create, delete)
- Support cron-like syntax or simple intervals

## Acceptance Criteria
- [ ] Scheduled tasks execute reliably (even when app is closed)
- [ ] Tasks persist after device reboot
- [ ] UI allows managing active schedules

## Inspired by
OpenClaw's cron scheduler for periodic tasks like email monitoring or daily briefings.
