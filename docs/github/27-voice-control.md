# Issue #27: [Feature] Voice control — TTS and STT

**Labels:** `feature`, `priority: medium`, `area: voice`, `tier-3`
**Status:** ⭕ Pending

**Depends on:** #3

## Description
Audible interaction with the agent via Text-to-Speech and Speech-to-Text.

## Implementation Details
- Use Android's native `TextToSpeech` and `SpeechRecognizer` APIs
- Create bridge to React Native
- Add voice input button and auto-speak toggle in settings
- Handle background voice triggers if possible

## Acceptance Criteria
- [ ] Agent can speak responses audibly
- [ ] User can provide input via voice command
- [ ] Reliable operation even when device is locked/backgrounded

## Note
Previous attempt with Expo libraries caused build errors; use native implementation.
