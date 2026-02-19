# Issue #17: [Feature] Multi-channel messaging — WhatsApp integration

**Labels:** `feature`, `priority: medium`, `area: channels`, `tier-2`
**Status:** ⭕ Pending

**Depends on:** #2, #16

## Description
WhatsApp integration using a web bridge library.

## Implementation Details
- Create `src/services/WhatsAppService.ts`
- Implement QR code pairing flow
- Handle message types (text, image, voice)
- Share channel architecture from Discord implementation

## Acceptance Criteria
- [ ] Agent responds on WhatsApp
- [ ] QR code pairing works
- [ ] Text and image messages supported

## Inspired by
OpenClaw's WhatsApp channel using Baileys.
