# Issue #16: [Feature] Multi-channel messaging — Discord bot

**Labels:** `feature`, `priority: medium`, `area: channels`, `tier-2`
**Status:** ⭕ Pending

**Depends on:** #2

## Description
Add Discord bot integration alongside Telegram.

## Implementation Details
- Create `src/services/DiscordService.ts`
- Use `discord.js` for bot integration
- Share agent execution logic with `TelegramService`
- Add Discord token to settings/env
- Support text messages, embeds, and thread-based conversations

## Acceptance Criteria
- [ ] Agent responds on Discord with same capabilities as Telegram
- [ ] Message formatting works correctly
- [ ] Authentication/allowlist applies

## Inspired by
OpenClaw's multi-channel inbox with WhatsApp, Telegram, Slack, Discord, and more.
