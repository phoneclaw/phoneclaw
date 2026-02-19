# Issue #20: [Feature] Usage tracking — token count and cost estimation

**Labels:** `feature`, `priority: medium`, `area: agent`, `tier-2`
**Status:** ⭕ Pending

## Description
Track token consumption and estimate costs per conversation and in aggregate.

## Implementation Details
- Extract `usage` object from LLM API responses in `AgentCore.ts`
- Create `src/agent/UsageTracker.ts` to persist data
- Add logic to calculate cost based on model/provider
- Display info in settings and via `/status` command

## Acceptance Criteria
- [ ] Token counts are tracked and stored
- [ ] Cost estimation is accurate for configured models
- [ ] Usage footer shown in Telegram/Discord if enabled

## Inspired by
OpenClaw's usage tracking and `/usage` command.
