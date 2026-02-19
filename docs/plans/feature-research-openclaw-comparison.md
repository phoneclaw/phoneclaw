# 🐾 PhoneClaw — Feature Research & GitHub Issues Plan

> **Objective:** Comprehensive comparison of PhoneClaw vs OpenClaw, identifying all potential features, improvements, and bugs. This document serves as the master list for creating GitHub issues in chronological/dependency order.

---

## 1. Current State — What PhoneClaw Has

### ✅ Core Tools (Phase 1)
| Tool | Status | Kotlin Native | Notes |
|------|--------|---------------|-------|
| `tap(x, y)` | ✅ | `dispatchGesture` | Single point tap |
| `longPress(x, y)` | ✅ | `dispatchGesture` 500ms | |
| `swipe(x1,y1,x2,y2)` | ✅ | `dispatchGesture` path | Configurable duration |
| `doubleTap(x, y)` | ✅ | Two rapid gestures | |
| `scrollUp` / `scrollDown` | ✅ | Node detection + gesture fallback | |
| `clickByText(text)` | ✅ | Accessibility node search | Recursive tree walk |
| `clickByViewId(viewId)` | ✅ | Resource ID lookup | |
| `getScreenText()` | ✅ | All text + content descriptions | |
| `getUITree()` | ✅ | Full JSON accessibility tree | |
| `takeScreenshot()` | ✅ | API 30+ screenshot | Base64 encoded |
| `isServiceRunning()` | ✅ | Singleton check | |
| `typeText(text)` | ✅ | `ACTION_SET_TEXT` | Multi-strategy node finder |
| `clearText()` | ✅ | Set text to empty | |
| `pressBack/Home` | ✅ | Global actions | |
| `openRecents` | ✅ | Global action | |
| `openNotifications` | ✅ | Global action | |
| `openQuickSettings` | ✅ | Global action | (Kotlin only, no JS tool) |
| `launchApp(pkg)` | ✅ | Launch intent | 2s delay for loading |
| `getCurrentApp()` | ✅ | Root node package name | |
| `returnToPhoneClaw()` | ✅ | Launch self | |

### ✅ Agent Integration (Phase 2)
- **LLM Reasoning Loop** — `AgentCore.ts` with multi-step tool execution
- **SSE Streaming** — Custom `XMLHttpRequest`-based SSE parser (React Native doesn't support `ReadableStream`)
- **Tool Registry** — Modular architecture in `src/tools/` with auto-generated schemas
- **System Prompt** — Dynamic prompt builder with tool descriptions, safety rules, multi-step examples
- **Chat UI** — Full chat interface with message bubbles, tool execution cards, thinking indicator, suggestions
- **Settings Screen** — API key, base URL, model, max steps, vision toggle, image model
- **Image Context Optimization** — Keeps only the last screenshot, replaces older with placeholders

### ✅ Advanced Features (Phase 3)
- **Vision** — Screenshot → base64 → vision LLM analysis
- **Notifications** — `ClawNotificationService.kt` + tools to get/click/clear notifications
- **Background Execution** — `AgentForegroundService.kt` + `HeadlessTask.ts`
- **Telegram Bot** — `TelegramService.ts` with long-polling, streaming message edits, markdown→HTML

### 🏗️ Architecture
```
React Native (Expo) → RN Native Modules Bridge → Kotlin Accessibility Service → Android OS
                                                       ↕
                                              Notification Listener Service
```

---

## 2. What OpenClaw Has That PhoneClaw Doesn't

> [!IMPORTANT]
> OpenClaw is a **desktop-first** general AI assistant (runs on macOS/Linux/Windows via Node.js gateway). PhoneClaw is a **mobile-first** Android phone automation agent. They solve different problems, but OpenClaw's architecture has many ideas we can adapt.

### 🔴 Critical Gaps (High Impact, Should Implement)

| # | OpenClaw Feature | PhoneClaw Gap | Adaptable? |
|---|------------------|---------------|------------|
| 1 | **Persistent Memory** — Long-term memory, user preferences, past conversations | No memory between sessions. Each conversation starts fresh. | ✅ Very adaptable |
| 2 | **Multi-Channel Messaging** — WhatsApp, Slack, Discord, Signal, etc. | Only Telegram bot integration | ✅ Add more channels |
| 3 | **Chat Commands** — `/status`, `/new`, `/reset`, `/compact`, `/abort` | Only `/start` and `/abort` in Telegram | ✅ Easy to add |
| 4 | **Session Management** — Session history, context compaction, reset | No session persistence | ✅ Adaptable |
| 5 | **Model Failover** — Automatic fallback to alternate models | Single model, no failover | ✅ Adaptable |
| 6 | **Skills Platform** — Modular instruction packages that extend capabilities | No skills system | ✅ Adaptable |
| 7 | **Proactive Heartbeat** — Scheduler that runs tasks without prompting | No proactive behavior | ✅ Adaptable |
| 8 | **Browser Control** — Dedicated browser with CDP control | No browser automation | 🟡 Complex on mobile |
| 9 | **Cron Jobs / Scheduled Tasks** — Time-based automation | No scheduling | ✅ Adaptable |
| 10 | **Security Model** — Sandbox, pairing codes, allowlists | Minimal safety (just prompt-level rules) | ✅ Needs work |

### 🟡 Medium Gaps (Nice-to-Have, Valuable)

| # | OpenClaw Feature | PhoneClaw Gap |
|---|------------------|---------------|
| 11 | **Voice Wake + Talk Mode** — Always-on speech with ElevenLabs | Attempted but build issues; not functional |
| 12 | **Canvas / Visual Workspace** — Agent-driven visual UI | No visual workspace |
| 13 | **Usage Tracking** — Token count and cost tracking | No usage metrics |
| 14 | **Typing Indicators** — Show typing status on messaging channels | No typing indicators |
| 15 | **Media Pipeline** — Image/audio/video processing with transcription | Only screenshots; no audio/video |
| 16 | **Multi-Agent Routing** — Route to isolated agents | Single agent only |
| 17 | **Webhooks** — Inbound event triggers | No webhook support |
| 18 | **Control UI / Web Dashboard** — Browser-based management | Settings screen only (in-app) |
| 19 | **Agent-to-Agent Communication** — `sessions_send`, `sessions_list` | No inter-agent communication |

### 🟢 Lower Priority (Future Vision)

| # | OpenClaw Feature | PhoneClaw Gap |
|---|------------------|---------------|
| 20 | **Docker Sandboxing** | N/A for mobile |
| 21 | **Tailscale / Remote Gateway** | Could adapt for remote phone control |
| 22 | **macOS App** | Android-only project |
| 23 | **iOS Node** | Android-only project |
| 24 | **Email Hooks (Gmail Pub/Sub)** | Could be a skill/integration |

---

## 3. PhoneClaw-Specific Improvements & Bugs

### 🐛 Known Bugs / Issues

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| B1 | **Telegram markdown rendering** | Medium | Multiple conversations fixing `mdToHtml()` — may still have edge cases with nested formatting |
| B2 | **Background execution unreliable** | High | JS thread pauses when app backgrounded; HeadlessJS implemented but may not work for all scenarios |
| B3 | **Voice control build failures** | Medium | `expo-speech`/`expo-av` integration attempted but caused duplicate class errors |
| B4 | **`openQuickSettings` not exposed as tool** | Low | Kotlin method exists but no JS tool definition |
| B5 | **No error recovery in agent loop** | Medium | If a tool fails, agent may get confused; no retry logic |
| B6 | **Screenshot quality/size** | Low | Full-resolution screenshots sent to LLM; no compression/resize |
| B7 | **No conversation history persistence** | High | All messages lost when app restarts |
| B8 | **Settings not auto-saved** | Low | User must tap "Save" manually |
| B9 | **No input validation for settings** | Low | Can enter invalid base URL, negative max steps, etc. |
| B10 | **Telegram bot has no authentication** | High | Anyone can message the bot and control the phone |

### 🚀 PhoneClaw-Specific Feature Opportunities

| # | Feature | Priority | Details |
|---|---------|----------|---------|
| F1 | **Task Recording & Replay** | High | Record successful multi-step tasks, replay with variations |
| F2 | **Smart Element Finder** | High | Fuzzy matching for `clickByText`, similarity search |
| F3 | **Wait/Assert Tools** | Medium | `waitForText()`, `waitForElement()`, `assertText()` |
| F4 | **Clipboard Tools** | Medium | Read/write clipboard content |
| F5 | **File Manager Tools** | Medium | Read/write files on the phone |
| F6 | **Contact Lookup** | Medium | Find contacts by name → phone number |
| F7 | **SMS Tools** | Medium | Send/read SMS messages |
| F8 | **Phone Call Tools** | Low | Make/answer calls |
| F9 | **WiFi/Bluetooth Toggle** | Low | System setting toggles |
| F10 | **Screen Brightness/Volume** | Low | System controls |
| F11 | **Camera Capture** | Medium | Take photos from camera |
| F12 | **Location Services** | Medium | Get GPS coordinates |
| F13 | **App List / Installed Apps** | Medium | List all installed apps with icons |
| F14 | **Gesture Macros** | Medium | Define complex gesture sequences |
| F15 | **Status Bar Info** | Low | Battery %, WiFi status, signal strength |

---

## 4. GitHub Issues — Chronological & Dependency-Ordered

> [!NOTE]
> Issues are grouped into **Tiers** by dependency. Tier 1 has no dependencies. Each subsequent tier depends on the previous one. Within each tier, issues are independent and can be parallelized.

---

### 🏗️ Tier 0 — Infrastructure & Bug Fixes (No Dependencies)

> These are foundational fixes and improvements that everything else builds on.

#### Issue #1: `[Bug] Conversation history lost on app restart`
- **Labels:** `bug`, `priority: high`, `area: agent`
- **Description:** All chat messages are stored only in React state and lost when the app restarts. Implement persistent conversation storage using AsyncStorage or SQLite.
- **Changes needed:**
  - Create `src/storage/ConversationStore.ts` — Save/load messages to AsyncStorage
  - Update `app/index.tsx` — Load messages on mount, save on new message
  - Add conversation list/history UI
- **Acceptance:** Messages survive app restart

#### Issue #2: `[Bug] Telegram bot has no authentication`
- **Labels:** `bug`, `priority: critical`, `area: telegram`, `security`
- **Description:** Anyone who discovers the bot token can send messages and control the phone. Implement allowlist-based authentication.
- **Changes needed:**
  - Add `EXPO_PUBLIC_TELEGRAM_ALLOWED_USERS` env var (comma-separated user IDs)
  - Update `TelegramService.ts` `handleUpdate()` to check sender against allowlist
  - Add pairing code flow for new users (inspired by OpenClaw's DM pairing)
- **Acceptance:** Unauthorized users receive a rejection message

#### Issue #3: `[Bug] Background execution unreliable`
- **Labels:** `bug`, `priority: high`, `area: native`
- **Description:** JavaScript thread pauses when app is backgrounded. The HeadlessJS approach has limitations on continuous execution. Research and implement a more robust solution.
- **Changes needed:**
  - Investigate `WorkManager` for persistent background tasks
  - Consider periodic heartbeat via `AlarmManager`
  - Test foreground service notification visibility requirements
- **Acceptance:** Agent continues executing when app is backgrounded for 10+ minutes

#### Issue #4: `[Bug] Expose openQuickSettings as a tool`
- **Labels:** `bug`, `priority: low`, `area: tools`
- **Description:** `ClawAccessibilityService.kt` has `openQuickSettings()` but it's not registered in the JS tool registry.
- **Changes needed:**
  - Add `openQuickSettings` to `navigation.ts` tools
  - Add native bridge method if missing in `ClawAccessibilityModule.kt`
- **Acceptance:** Agent can call `openQuickSettings` tool

#### Issue #5: `[Bug] Screenshot optimization — compress before sending to LLM`
- **Labels:** `bug`, `priority: medium`, `area: vision`
- **Description:** Full-resolution screenshots (1080×2400) are sent as base64 to the LLM, wasting tokens. Resize to ~540×1200 and compress JPEG to reduce payload.
- **Changes needed:**
  - Update `ClawAccessibilityService.kt` `takeScreenshotAsync()` to resize bitmap
  - Use JPEG compression at 60-70% quality
  - Optionally make quality/size configurable in settings
- **Acceptance:** Screenshot payload size reduced by ~70%

#### Issue #6: `[Enhancement] Auto-save settings`
- **Labels:** `enhancement`, `priority: low`, `area: ui`
- **Description:** Settings require manual "Save" button tap. Auto-save with debounce when values change.
- **Changes needed:**
  - Add `useEffect` with debounced `saveSettings()` call in `settings.tsx`
  - Show subtle "Saving..." / "Saved" indicator
- **Acceptance:** Settings persist without manual save

#### Issue #7: `[Enhancement] Settings input validation`
- **Labels:** `enhancement`, `priority: low`, `area: ui`
- **Description:** No validation on settings inputs. User can enter invalid URLs, negative numbers, empty strings.
- **Changes needed:**
  - Validate base URL format
  - Clamp max steps to 1-100
  - Validate API key format (non-empty)
  - Show inline validation errors
- **Acceptance:** Invalid inputs show error state and prevent save

---

### 🏗️ Tier 1 — Core Agent Improvements (Depends on Tier 0)

> These improve the agent's reliability and capabilities.

#### Issue #8: `[Enhancement] Persistent memory — remember across sessions`
- **Labels:** `enhancement`, `priority: high`, `area: agent`
- **Depends on:** #1 (conversation storage)
- **Description:** Inspired by OpenClaw's persistent memory. The agent should remember user preferences, frequently used apps, and key facts across sessions.
- **Changes needed:**
  - Create `src/agent/MemoryStore.ts` — Key-value store for agent memory
  - Add `remember(key, value)` and `recall(key)` tools
  - Inject relevant memories into system prompt
  - Add memory management UI in settings
- **Acceptance:** Agent remembers user's name, preferred apps, and past interactions

#### Issue #9: `[Enhancement] Error recovery & retry logic in agent loop`
- **Labels:** `enhancement`, `priority: medium`, `area: agent`
- **Description:** When a tool fails, the agent has no retry mechanism. Implement configurable retry with exponential backoff.
- **Changes needed:**
  - Add `maxRetries` to `AgentSettings`
  - Wrap `executeTool()` in retry logic in `AgentCore.ts`
  - Add tool-specific retry policies (e.g., don't retry tap, but retry screenshot)
  - Feed error context back to LLM for self-correction
- **Acceptance:** Agent retries failed tool calls up to N times before giving up

#### Issue #10: `[Enhancement] Model failover — automatic fallback models`
- **Labels:** `enhancement`, `priority: medium`, `area: agent`
- **Description:** Inspired by OpenClaw's model failover. If the primary model fails (rate limit, timeout), fall back to alternative models.
- **Changes needed:**
  - Add `fallbackModels: string[]` to `AgentSettings`
  - Update `callLLM()` in `AgentCore.ts` to try fallback models on failure
  - Add fallback model configuration in settings UI
- **Acceptance:** Agent transparently falls back when primary model fails

#### Issue #11: `[Enhancement] Chat commands — /new, /status, /history, /compact`
- **Labels:** `enhancement`, `priority: medium`, `area: ui`, `area: telegram`
- **Description:** Inspired by OpenClaw's chat commands. Add slash commands for both the app UI and Telegram bot.
- **Changes needed:**
  - Parse commands in `app/index.tsx` `handleSend()`
  - Parse commands in `TelegramService.ts` `handleUpdate()`
  - `/new` — Clear conversation
  - `/status` — Show service, model, token usage
  - `/history` — List past conversations
  - `/compact` — Summarize and compress context
- **Acceptance:** All commands work in both UI and Telegram

#### Issue #12: `[Enhancement] Wait/Assert tools for reliable automation`
- **Labels:** `enhancement`, `priority: medium`, `area: tools`
- **Description:** Add tools that wait for specific screen states before proceeding. Essential for reliable multi-step automation.
- **Changes needed:**
  - `waitForText(text, timeoutMs)` — Poll `getScreenText()` until text appears
  - `waitForElement(viewId, timeoutMs)` — Wait for element in UI tree
  - `assertText(text)` — Verify text is on screen (returns boolean)
  - Implement polling loop with configurable timeout in JS (no native changes)
- **Acceptance:** Agent can reliably wait for app screens to load

#### Issue #13: `[Enhancement] Smart element finder — fuzzy text matching`
- **Labels:** `enhancement`, `priority: medium`, `area: tools`
- **Description:** Current `clickByText()` requires exact match. Add fuzzy matching to handle partial text, case differences, etc.
- **Changes needed:**
  - Add `clickByPartialText(text)` tool or improve `clickByText` with fuzzy flag
  - Implement Levenshtein distance or simple `contains` matching in Kotlin
  - Add `findAllByText(text)` to return all matching elements with bounds
- **Acceptance:** Agent can click elements with approximate text matches

#### Issue #14: `[Enhancement] Clipboard tools`
- **Labels:** `enhancement`, `priority: medium`, `area: tools`
- **Description:** Agent cannot read or write clipboard. This is needed for copying text between apps.
- **Changes needed:**
  - Add `getClipboard()` and `setClipboard(text)` to Kotlin service
  - Use `ClipboardManager` system service
  - Register as tools in `src/tools/clipboard.ts`
- **Acceptance:** Agent can copy/paste text programmatically

---

### 🏗️ Tier 2 — Platform Features (Depends on Tier 1)

> These add major new capabilities to the platform.

#### Issue #15: `[Feature] Conversation history & session management`
- **Labels:** `feature`, `priority: high`, `area: ui`
- **Depends on:** #1, #8
- **Description:** Full conversation history with ability to continue past sessions, search through history, and export conversations.
- **Changes needed:**
  - Create `src/storage/SessionManager.ts`
  - Add conversation list screen (`app/history.tsx`)
  - Add session switching in header
  - Context compaction (summarize long conversations to reduce token usage)
- **Acceptance:** Users can view, continue, and search past conversations

#### Issue #16: `[Feature] Multi-channel messaging — Discord bot`
- **Labels:** `feature`, `priority: medium`, `area: channels`
- **Depends on:** #2 (auth pattern)
- **Description:** Inspired by OpenClaw's multi-channel support. Add Discord bot integration alongside Telegram.
- **Changes needed:**
  - Create `src/services/DiscordService.ts`
  - Use `discord.js` for bot integration
  - Share agent execution logic with `TelegramService`
  - Add Discord token to settings/env
- **Acceptance:** Agent responds on Discord with same capabilities as Telegram

#### Issue #17: `[Feature] Multi-channel messaging — WhatsApp integration`
- **Labels:** `feature`, `priority: medium`, `area: channels`
- **Depends on:** #2, #16 (shared channel architecture)
- **Description:** WhatsApp integration using `whatsapp-web.js` or similar library.
- **Changes needed:**
  - Create `src/services/WhatsAppService.ts`
  - Implement QR code pairing flow
  - Handle message types (text, image, voice)
- **Acceptance:** Agent responds on WhatsApp

#### Issue #18: `[Feature] Skills platform — modular capability packages`
- **Labels:** `feature`, `priority: high`, `area: agent`
- **Depends on:** #8 (memory for skill state)
- **Description:** Inspired by OpenClaw's skills system. Skills are instruction packages (Markdown + optional scripts) that teach the agent new capabilities.
- **Changes needed:**
  - Define skill format: `skills/<name>/SKILL.md` with YAML frontmatter
  - Create `src/agent/SkillLoader.ts` to parse and inject skills into prompts
  - Add built-in skills: "WhatsApp Message Sender", "App Installer", "Settings Changer"
  - Add skill management UI
- **Acceptance:** Users can install/create skills that modify agent behavior

#### Issue #19: `[Feature] Scheduled tasks / Cron jobs`
- **Labels:** `feature`, `priority: medium`, `area: automation`
- **Depends on:** #3 (background execution)
- **Description:** Inspired by OpenClaw's cron system. Allow users to schedule recurring tasks.
- **Changes needed:**
  - Create `src/automation/Scheduler.ts`
  - Use `WorkManager` or `AlarmManager` for Android scheduling
  - Add schedule management UI
  - Example schedules: "Check notifications every hour", "Send daily summary at 9am"
- **Acceptance:** Scheduled tasks execute even when app is closed

#### Issue #20: `[Feature] Usage tracking — token count & cost estimation`
- **Labels:** `feature`, `priority: medium`, `area: agent`
- **Description:** Track token usage per conversation and estimate costs. Inspired by OpenClaw's `/usage` and `/status` commands.
- **Changes needed:**
  - Parse `usage` from LLM API responses in `AgentCore.ts`
  - Create `src/agent/UsageTracker.ts`
  - Store per-session and aggregate usage
  - Display in settings and via `/status` command
- **Acceptance:** Users can see token usage and cost per conversation

#### Issue #21: `[Feature] Contact lookup tool`
- **Labels:** `feature`, `priority: medium`, `area: tools`
- **Description:** Agent can look up contacts by name to find phone numbers, enabling "Send a message to Mom" use cases.
- **Changes needed:**
  - Add `ContactsModule.kt` using `ContactsContract` content provider
  - Register `findContact(name)` tool
  - Add contacts permission to manifest
- **Acceptance:** Agent can find contacts by name and use their info

#### Issue #22: `[Feature] SMS tools — send and read messages`
- **Labels:** `feature`, `priority: medium`, `area: tools`
- **Depends on:** #21 (contacts)
- **Description:** Direct SMS sending/reading without opening the messaging app.
- **Changes needed:**
  - Add SMS permission to manifest
  - Create `SmsModule.kt` with `SmsManager`
  - Register `sendSms(number, text)` and `getRecentSms(count)` tools
- **Acceptance:** Agent can send and read SMS messages

#### Issue #23: `[Feature] App list — list all installed apps`
- **Labels:** `feature`, `priority: low`, `area: tools`
- **Description:** Agent can list all installed apps to find the right package name for `launchApp()`.
- **Changes needed:**
  - Add `listInstalledApps()` to Kotlin service using `PackageManager`
  - Return list of `{name, packageName, category}`
  - Register as tool
- **Acceptance:** Agent can discover and launch any installed app by name

---

### 🏗️ Tier 3 — Advanced Agent Features (Depends on Tier 2)

> These transform PhoneClaw from a tool into an intelligent assistant.

#### Issue #24: `[Feature] Proactive heartbeat scheduler`
- **Labels:** `feature`, `priority: medium`, `area: automation`
- **Depends on:** #19 (scheduler), #8 (memory), #1 (history)
- **Description:** Inspired by OpenClaw's heartbeat. A configurable daemon that periodically checks for notifications, reminders, etc. and proactively notifies the user.
- **Changes needed:**
  - Create `src/automation/Heartbeat.ts`
  - Define `HEARTBEAT.md` checklist format
  - Run cheap checks first (new notifications? pending reminders?)
  - Only invoke LLM if action is needed
  - Send proactive messages via Telegram/notification
- **Acceptance:** Agent proactively alerts user about important events

#### Issue #25: `[Feature] Task recording & replay`
- **Labels:** `feature`, `priority: high`, `area: agent`
- **Depends on:** #1 (storage), #12 (wait tools)
- **Description:** Record successful multi-step task executions as replayable macros. Users can replay tasks with slight variations.
- **Changes needed:**
  - Create `src/agent/TaskRecorder.ts` — Record tool call sequences
  - Create `src/agent/TaskPlayer.ts` — Replay with variable substitution
  - Add "Record" toggle in chat UI
  - Add task library screen
- **Acceptance:** Users can record "Send WhatsApp message to X" and replay with different recipient

#### Issue #26: `[Feature] Multi-step task planner`
- **Labels:** `feature`, `priority: high`, `area: agent`
- **Depends on:** #8 (memory), #12 (wait tools), #9 (retry)
- **Description:** Inspired by OpenClaw's `/mesh` command. Break complex requests into sub-tasks with checkpoints and recovery.
- **Changes needed:**
  - Create `src/agent/TaskPlanner.ts`
  - Two-phase approach: Plan (generate sub-tasks) → Execute (run sub-tasks sequentially)
  - Checkpoint after each sub-task
  - Re-plan on failure
  - Show plan in UI with progress
- **Acceptance:** "Set up my phone for a meeting" generates and executes sub-tasks

#### Issue #27: `[Feature] Voice control — TTS and STT`
- **Labels:** `feature`, `priority: medium`, `area: voice`
- **Depends on:** #3 (background execution)
- **Description:** Previous attempt failed due to build issues. Retry with a simpler approach using Android native TTS/STT.
- **Changes needed:**
  - Use Android's `TextToSpeech` API directly in Kotlin (no Expo packages)
  - Use Android's `SpeechRecognizer` API for STT
  - Bridge to React Native
  - Add voice toggle in chat UI
  - Optionally integrate cloud TTS (ElevenLabs) for better quality
- **Acceptance:** Users can speak commands and hear responses

#### Issue #28: `[Feature] File manager tools`
- **Labels:** `feature`, `priority: medium`, `area: tools`
- **Depends on:** #14 (clipboard for file content)
- **Description:** Agent can read/write files on the phone for data extraction and automation.
- **Changes needed:**
  - Create `FileModule.kt` with `readFile()`, `writeFile()`, `listDirectory()`
  - Add storage permissions
  - Handle scoped storage restrictions (API 30+)
- **Acceptance:** Agent can read and write files in accessible storage

#### Issue #29: `[Feature] Camera capture tool`
- **Labels:** `feature`, `priority: low`, `area: tools`
- **Description:** Agent can take photos using the phone's camera.
- **Changes needed:**
  - Create `CameraModule.kt` using `CameraX` API
  - Return base64 image
  - Add camera permission
- **Acceptance:** Agent can capture photos and analyze them with vision

#### Issue #30: `[Feature] Location services tool`
- **Labels:** `feature`, `priority: low`, `area: tools`
- **Depends on:** GPS permissions
- **Description:** Inspired by OpenClaw's `location.get`. Agent can get current GPS coordinates.
- **Changes needed:**
  - Create `LocationModule.kt` using `FusedLocationProviderClient`
  - Register `getLocation()` tool
  - Add location permissions
- **Acceptance:** Agent can report user's location

---

### 🏗️ Tier 4 — Platform & Ecosystem (Depends on Tier 3)

> These build the ecosystem around PhoneClaw.

#### Issue #31: `[Feature] Web dashboard for remote monitoring`
- **Labels:** `feature`, `priority: low`, `area: web`
- **Depends on:** #15 (sessions), #20 (usage)
- **Description:** Inspired by OpenClaw's Control UI. A lightweight web dashboard to monitor agent activity, view logs, and manage settings remotely.
- **Changes needed:**
  - Create minimal Express.js server in the app
  - WebSocket for real-time updates
  - Simple React web UI
- **Acceptance:** Web dashboard accessible on local network

#### Issue #32: `[Feature] Webhook support for external triggers`
- **Labels:** `feature`, `priority: low`, `area: automation`
- **Depends on:** #19 (scheduler)
- **Description:** Accept webhook calls that trigger agent tasks. Enables integration with IFTTT, Zapier, etc.
- **Changes needed:**
  - HTTP endpoint for receiving webhook events
  - Map webhook payloads to agent commands
- **Acceptance:** External services can trigger PhoneClaw tasks

#### Issue #33: `[Feature] System controls — WiFi, Bluetooth, Volume, Brightness`
- **Labels:** `feature`, `priority: low`, `area: tools`
- **Description:** Agent can toggle system settings.
- **Changes needed:**
  - Create `SystemModule.kt` with toggle methods
  - Add appropriate permissions
  - Register tools for each control
- **Acceptance:** Agent can toggle WiFi, adjust volume, etc.

#### Issue #34: `[Feature] Phone call tools`
- **Labels:** `feature`, `priority: low`, `area: tools`
- **Depends on:** #21 (contacts)
- **Description:** Agent can initiate and answer phone calls.
- **Changes needed:**
  - Use `ACTION_CALL` intent
  - Add phone call permission
  - Add tool for call status monitoring
- **Acceptance:** Agent can make phone calls

#### Issue #35: `[Feature] Gesture macros — complex gesture sequences`
- **Labels:** `feature`, `priority: low`, `area: tools`
- **Description:** Define and execute complex gesture sequences (pinch-to-zoom, multi-touch, draw shapes).
- **Changes needed:**
  - Add `executeGestureMacro(gestures[])` to Kotlin
  - Support multi-stroke gesture descriptions
  - Register as tool
- **Acceptance:** Agent can perform complex gestures

---

### 🏗️ Tier 5 — Polish & Developer Experience

#### Issue #36: `[Enhancement] Onboarding wizard`
- **Labels:** `enhancement`, `priority: medium`, `area: ui`
- **Description:** Inspired by OpenClaw's `openclaw onboard`. Guide new users through setup: enable accessibility service, set API key, make first request.
- **Changes:** Add onboarding flow screens

#### Issue #37: `[Enhancement] Markdown rendering in chat messages`
- **Labels:** `enhancement`, `priority: medium`, `area: ui`
- **Description:** Agent responses are plain text. Render markdown formatting (bold, italic, code blocks, lists) in chat bubbles.
- **Changes:** Add markdown renderer component to chat UI

#### Issue #38: `[Enhancement] Dark/Light theme toggle`
- **Labels:** `enhancement`, `priority: low`, `area: ui`
- **Description:** Currently dark-only theme. Add light mode option.
- **Changes:** Create light palette, add theme toggle in settings

#### Issue #39: `[Enhancement] CI/CD pipeline`
- **Labels:** `enhancement`, `priority: medium`, `area: devops`
- **Description:** Set up GitHub Actions for linting, type checking, and building APK.
- **Changes:** Create `.github/workflows/ci.yml`

#### Issue #40: `[Enhancement] Contributing guide & developer docs`
- **Labels:** `enhancement`, `priority: medium`, `area: docs`
- **Description:** Add CONTRIBUTING.md with development setup, code style, PR process, and architecture overview.
- **Changes:** Create CONTRIBUTING.md, add architecture diagrams

#### Issue #41: `[Enhancement] Unit & integration tests`
- **Labels:** `enhancement`, `priority: medium`, `area: testing`
- **Description:** No tests exist. Add unit tests for tool registry, agent core, and settings. Add integration tests for native bridge.
- **Changes:** Set up Jest, write tests for core modules

---

## 5. Dependency Graph

```mermaid
graph TD
    T0["Tier 0: Infrastructure"]
    T1["Tier 1: Core Agent"]
    T2["Tier 2: Platform Features"]
    T3["Tier 3: Advanced Agent"]
    T4["Tier 4: Ecosystem"]
    T5["Tier 5: Polish"]

    T0 --> T1
    T1 --> T2
    T2 --> T3
    T3 --> T4
    T0 --> T5

    subgraph "Tier 0 (No Dependencies)"
        I1["#1 Conversation Persistence"]
        I2["#2 Telegram Auth"]
        I3["#3 Background Exec"]
        I4["#4 openQuickSettings"]
        I5["#5 Screenshot Optimize"]
        I6["#6 Auto-save Settings"]
        I7["#7 Input Validation"]
    end

    subgraph "Tier 1 (Depends on T0)"
        I8["#8 Persistent Memory"]
        I9["#9 Error Recovery"]
        I10["#10 Model Failover"]
        I11["#11 Chat Commands"]
        I12["#12 Wait/Assert Tools"]
        I13["#13 Fuzzy Finder"]
        I14["#14 Clipboard Tools"]
    end

    subgraph "Tier 2 (Depends on T1)"
        I15["#15 Session Management"]
        I16["#16 Discord Bot"]
        I17["#17 WhatsApp"]
        I18["#18 Skills Platform"]
        I19["#19 Scheduled Tasks"]
        I20["#20 Usage Tracking"]
        I21["#21 Contact Lookup"]
        I22["#22 SMS Tools"]
        I23["#23 App List"]
    end

    subgraph "Tier 3 (Depends on T2)"
        I24["#24 Heartbeat"]
        I25["#25 Task Recording"]
        I26["#26 Task Planner"]
        I27["#27 Voice Control"]
        I28["#28 File Manager"]
        I29["#29 Camera"]
        I30["#30 Location"]
    end

    I1 --> I8
    I1 --> I15
    I2 --> I16
    I3 --> I19
    I3 --> I27
    I8 --> I18
    I8 --> I24
    I8 --> I26
    I12 --> I25
    I12 --> I26
    I9 --> I26
    I19 --> I24
    I21 --> I22
    I21 --> I34["#34 Phone Calls"]
    I16 --> I17
end
```

---

## 6. Summary Statistics

| Category | Count |
|----------|-------|
| **Bug Fixes** | 10 |
| **Core Enhancements** | 13 |
| **New Features** | 18 |
| **Total GitHub Issues** | 41 |
| **Tier 0 (Immediate)** | 7 |
| **Tier 1 (Core)** | 7 |
| **Tier 2 (Platform)** | 9 |
| **Tier 3 (Advanced)** | 7 |
| **Tier 4 (Ecosystem)** | 5 |
| **Tier 5 (Polish)** | 6 |

---

> [!TIP]
> **Recommended approach:** Start with **Tier 0** bug fixes (especially #1, #2, #3), then move to **Tier 1** core improvements. These will make the agent significantly more reliable and usable. Tier 2+ features can be distributed across parallel GitHub issues for different contributors.
