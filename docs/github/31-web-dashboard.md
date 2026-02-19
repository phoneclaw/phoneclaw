# Issue #31: [Feature] Web dashboard for remote monitoring

**Labels:** `feature`, `priority: low`, `area: web`, `tier-4`
**Status:** ⭕ Pending

**Depends on:** #15, #20

## Description
A lightweight web dashboard to monitor agent activity, view logs, and manage settings remotely.

## Implementation Details
- Embed a minimal HTTP server in the app
- Provide JSON API for session/usage data
- Static React web UI (single page)
- Basic token-based authentication

## Acceptance Criteria
- [ ] Dashboard accessible on local network via IP
- [ ] Real-time view of agent thinking/actions
- [ ] View usage statistics and logs

## Inspired by
OpenClaw's Control UI and Gateway dashboard.
