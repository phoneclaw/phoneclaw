# Issue #11: [Enhancement] Chat commands — /new, /status, /history, /compact

**Labels:** `enhancement`, `priority: medium`, `area: ui`, `area: telegram`, `tier-1`
**Status:** ⭕ Pending

## Description
Add slash commands for both the app UI and Telegram bot.

## Commands
- `/new` — Clear conversation and start fresh
- `/status` — Show service status, model info, token usage
- `/history` — List past conversations
- `/compact` — Summarize and compress context to save tokens
- `/abort` — Stop current agent execution (already exists in Telegram)

## Implementation Details
- Parse commands in `app/index.tsx` `handleSend()`
- Parse commands in `TelegramService.ts` `handleUpdate()`
- Shared command handler module

## Acceptance Criteria
- [ ] All commands work in chat UI
- [ ] All commands work via Telegram
- [ ] Help text available via `/help`

## Inspired by
OpenClaw's chat commands: `/status`, `/new`, `/reset`, `/compact`, `/think`, `/verbose`, `/usage`.
