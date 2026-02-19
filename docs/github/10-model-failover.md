# Issue #10: [Enhancement] Model failover — automatic fallback models

**Labels:** `enhancement`, `priority: medium`, `area: agent`, `tier-1`
**Status:** ⭕ Pending

## Description
If the primary model fails (rate limit, timeout, error), fall back to alternative models automatically.

## Implementation Details
- Add `fallbackModels: string[]` to `AgentSettings`
- Update `callLLM()` in `AgentCore.ts` to try fallback models on failure
- Add fallback model configuration in settings UI
- Log model switches for debugging

## Acceptance Criteria
- [ ] Agent transparently falls back when primary model fails
- [ ] Fallback chain is configurable in settings
- [ ] User is notified which model is being used

## Inspired by
OpenClaw's model failover with auth profile rotation and fallback chains.
