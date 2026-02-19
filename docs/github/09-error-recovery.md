# Issue #9: [Enhancement] Error recovery and retry logic in agent loop

**Labels:** `enhancement`, `priority: medium`, `area: agent`, `tier-1`
**Status:** ⭕ Pending

## Description
When a tool fails, the agent has no retry mechanism. Implement configurable retry with exponential backoff.

## Implementation Details
- Add `maxRetries` to `AgentSettings`
- Wrap `executeTool()` in retry logic in `AgentCore.ts`
- Add tool-specific retry policies (e.g., don't retry tap, but retry screenshot)
- Feed error context back to LLM for self-correction

## Acceptance Criteria
- [ ] Agent retries failed tool calls up to N times before giving up
- [ ] Retry count is configurable
- [ ] Error messages are fed back to LLM for recovery
