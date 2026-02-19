# Issue #26: [Feature] Multi-step task planner

**Labels:** `feature`, `priority: high`, `area: agent`, `tier-3`
**Status:** ⭕ Pending

**Depends on:** #8, #12, #9

## Description
Break complex, high-level requests into smaller, manageable sub-tasks with checkpoints.

## Implementation Details
- Create `src/agent/TaskPlanner.ts`
- Phase 1: Planning (LLM generates checklist)
- Phase 2: Execution (Sequential sub-task processing)
- Automatic re-planning on sub-task failure
- Visualization of plan progress in UI

## Acceptance Criteria
- [ ] Agent can break "Plan a trip to London" into actionable steps
- [ ] Plan is visible and trackable in UI
- [ ] Automatic recovery if a step fails

## Inspired by
OpenClaw's `/mesh` command and the ReAct pattern for complex reasoning.
