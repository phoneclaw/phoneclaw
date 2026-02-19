# Issue #2: [Bug] Telegram bot has no authentication

**Labels:** `bug`, `priority: critical`, `area: telegram`, `security`, `tier-0`
**Status:** ⭕ Pending

## Description
Anyone who discovers the bot token can send messages and control the phone. Implement allowlist-based authentication.

## Current Behavior
All incoming Telegram messages are processed without any sender verification.

## Expected Behavior
Only authorized users can interact with the bot. Unknown users receive a rejection message or pairing code.

## Implementation Details
- Add `EXPO_PUBLIC_TELEGRAM_ALLOWED_USERS` env var (comma-separated Telegram user IDs)
- Update `TelegramService.ts` `handleUpdate()` to check sender against allowlist
- Add pairing code flow for new users (inspired by OpenClaw's DM pairing)
- Log unauthorized access attempts

## Acceptance Criteria
- [ ] Unauthorized users receive a rejection message
- [ ] Allowed users can interact normally
- [ ] New user pairing flow works
- [ ] Unauthorized attempts are logged

## Security Impact
**Critical** — Without this, anyone with the bot token can control the physical phone remotely.

## Inspired by
OpenClaw's `dmPolicy="pairing"` with allowlist-based authentication.
