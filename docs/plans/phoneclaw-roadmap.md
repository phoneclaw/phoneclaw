# 🐾 PhoneClaw — Development Roadmap

> **Goal:** Build an open-source AI phone agent that can read, understand, and interact with any Android app through natural language commands.

---

## Current Status (Feb 2026)

### ✅ Completed
- Expo + React Native project scaffolded with Expo Router
- Android Accessibility Service registered and working
- Basic tools: `scrollUp`, `scrollDown`, `clickByText`, `getScreenText`, `isServiceRunning`
- Gesture-based scroll fallback via `dispatchGesture`
- Modular tool registry architecture (`src/tools/`)
- JS ↔ Kotlin bridge via React Native Native Modules
- Project pushed to GitHub

### 🏗️ Architecture
```
User Command → Agent Core (LLM) → Tool Registry → Native Bridge → Accessibility Service → Android OS
```

---

## Phase 1: Core Native Tools 🔧

**Goal:** Give the agent full control over the phone screen.

### 1.1 Touch Actions
| Tool | Native API | Priority |
|------|-----------|----------|
| `tap(x, y)` | `dispatchGesture` — single point tap | 🔴 Critical |
| `longPress(x, y)` | `dispatchGesture` — 500ms hold | 🟡 High |
| `swipe(x1, y1, x2, y2, duration)` | `dispatchGesture` — path stroke | 🟡 High |
| `doubleTap(x, y)` | Two rapid `dispatchGesture` taps | 🟢 Nice-to-have |

**Implementation:**
```kotlin
// ClawAccessibilityService.kt
fun tap(x: Float, y: Float): Boolean {
    val path = Path().apply { moveTo(x, y) }
    val gesture = GestureDescription.Builder()
        .addStroke(StrokeDescription(path, 0, 50))
        .build()
    return dispatchGesture(gesture, null, null)
}
```

### 1.2 Text Input
| Tool | Native API | Priority |
|------|-----------|----------|
| `typeText(text)` | Find focused node → `ACTION_SET_TEXT` with `Bundle` | 🔴 Critical |
| `clearText()` | Find focused node → `ACTION_SET_TEXT("")` | 🟡 High |
| `pasteText(text)` | Copy to clipboard → `ACTION_PASTE` | 🟢 Nice-to-have |

**Implementation:**
```kotlin
fun typeText(text: String): Boolean {
    val rootNode = rootInActiveWindow ?: return false
    val focusedNode = rootNode.findFocus(AccessibilityNodeInfo.FOCUS_INPUT) ?: return false
    val args = Bundle().apply { putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text) }
    return focusedNode.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, args)
}
```

### 1.3 Navigation & Global Actions
| Tool | Native API | Priority |
|------|-----------|----------|
| `pressBack()` | `performGlobalAction(GLOBAL_ACTION_BACK)` | 🔴 Critical |
| `pressHome()` | `performGlobalAction(GLOBAL_ACTION_HOME)` | 🔴 Critical |
| `openRecents()` | `performGlobalAction(GLOBAL_ACTION_RECENTS)` | 🟡 High |
| `openNotifications()` | `performGlobalAction(GLOBAL_ACTION_NOTIFICATIONS)` | 🟡 High |
| `openQuickSettings()` | `performGlobalAction(GLOBAL_ACTION_QUICK_SETTINGS)` | 🟢 Nice-to-have |

**Implementation:**
```kotlin
fun pressBack(): Boolean = performGlobalAction(GLOBAL_ACTION_BACK)
fun pressHome(): Boolean = performGlobalAction(GLOBAL_ACTION_HOME)
fun openRecents(): Boolean = performGlobalAction(GLOBAL_ACTION_RECENTS)
fun openNotifications(): Boolean = performGlobalAction(GLOBAL_ACTION_NOTIFICATIONS)
```

### 1.4 Screen Reading (Enhanced)
| Tool | Native API | Priority |
|------|-----------|----------|
| `getUITree()` | Traverse accessibility nodes → JSON | 🔴 Critical |
| `getScreenText()` | Already implemented ✅ | ✅ Done |
| `takeScreenshot()` | `takeScreenshot()` API (API 30+) | 🟡 High |
| `getCurrentApp()` | Read root node package name | 🔴 Critical |

**UI Tree JSON Format:**
```json
{
  "packageName": "com.whatsapp",
  "activity": "com.whatsapp.HomeActivity",
  "nodes": [
    {
      "id": 0,
      "className": "android.widget.FrameLayout",
      "text": null,
      "contentDescription": null,
      "bounds": { "left": 0, "top": 0, "right": 1080, "bottom": 2400 },
      "isClickable": false,
      "isScrollable": false,
      "isEditable": false,
      "isFocused": false,
      "viewId": null,
      "children": [1, 2, 3]
    }
  ]
}
```

### 1.5 App Management
| Tool | Native API | Priority |
|------|-----------|----------|
| `launchApp(packageName)` | `context.startActivity(launchIntent)` | 🔴 Critical |
| `listInstalledApps()` | `PackageManager.getInstalledApplications` | 🟢 Nice-to-have |

### 1.6 Files to Modify

| File | Changes |
|------|---------|
| `ClawAccessibilityService.kt` | Add `tap`, `longPress`, `swipe`, `typeText`, `clearText`, `pressBack`, `pressHome`, `openRecents`, `openNotifications`, `getUITree`, `takeScreenshot`, `getCurrentApp`, `launchApp` |
| `ClawAccessibilityModule.kt` | Add `@ReactMethod` wrappers for each new method |
| `ClawAccessibilityModule.ts` | Add TypeScript interface methods + native bindings |
| `src/tools/*.ts` | Already scaffolded ✅ — will work once native methods exist |

---

## Phase 2: Agent Integration 🤖

**Goal:** Connect an LLM to the tools so the agent can autonomously perform tasks.

### 2.1 Agent Core (`src/agent/AgentCore.ts`)

The reasoning loop:

```
┌─────────────────────────────────────────────────┐
│ 1. User says: "Send hi to Mom on WhatsApp"      │
│ 2. Agent calls getUITree() → sees home screen    │
│ 3. Agent reasons: need to open WhatsApp first    │
│ 4. Agent calls launchApp("com.whatsapp")         │
│ 5. Agent calls getUITree() → sees WhatsApp home  │
│ 6. Agent calls clickByText("Mom")                │
│ 7. Agent calls getUITree() → sees chat screen    │
│ 8. Agent taps on the input field                 │
│ 9. Agent calls typeText("hi")                    │
│ 10. Agent calls clickByViewId("send_button")     │
│ 11. Agent says: "Done! Message sent."            │
└─────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- **LLM Provider**: Support OpenRouter / OpenAI / local Ollama
- **Tool Format**: OpenAI function-calling schema
- **Max Steps**: Configurable limit (default: 20) to prevent infinite loops
- **Observation**: After each action, re-read the screen to verify the result
- **Safety**: Confirmation prompt before destructive actions (delete, send money, etc.)

### 2.2 System Prompt (`src/agent/prompts.ts`)

The system prompt tells the LLM:
- What phone it's controlling
- What tools are available (auto-generated from tool registry)
- How to interpret the UI tree
- Safety rules (never enter passwords, never send money without confirmation)
- How to report success/failure

### 2.3 Chat UI (`app/(tabs)/agent.tsx`)

A chat interface where users:
- Type commands in natural language
- See the agent's reasoning in real-time
- Watch a log of tool calls and their results
- Can interrupt the agent at any step
- Get a summary when the task is complete

**UI Components:**
- Message bubbles (user + agent)
- Tool call cards (shows which tool was called, params, result)
- Screen state preview (miniature view of what the agent sees)
- Stop button to abort the current task

### 2.4 Settings Screen (`app/(tabs)/settings.tsx`)
- API key configuration (OpenRouter / OpenAI)
- Model selection
- Safety preferences
- Max steps per task
- Accessibility service status

---

## Phase 3: Advanced Features 🚀

### 3.1 Vision Understanding
- Send screenshots to a vision LLM (GPT-4o, Gemini) for understanding
- Useful when the UI tree doesn't capture everything (e.g., images, icons)
- Combine UI tree + screenshot for richer context

### 3.2 Notification Actions
- Read incoming notifications via `onNotificationPosted`
- Act on notifications (reply, dismiss, open)
- Requires `NotificationListenerService` (separate from AccessibilityService)

### 3.3 Task Memory & Replay
- Store successful task executions as "recordings"
- Replay tasks with slight variations
- Learn from past actions to be more efficient

### 3.4 Multi-Step Planning
- Break complex requests into sub-tasks
- Execute sub-tasks sequentially with checkpoints
- Recover from failures by re-planning

### 3.5 Voice Control
- Wake word detection (local, offline)
- Speech-to-text for commands
- Text-to-speech for agent responses

---

## Development Timeline

| Phase | Scope | Est. Time |
|-------|-------|-----------|
| **Phase 1** | Core Native Tools | 1–2 sessions |
| **Phase 2** | Agent + Chat UI | 2–3 sessions |
| **Phase 3** | Vision, Notifications, Voice | Ongoing |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **App Framework** | React Native + Expo |
| **Navigation** | Expo Router |
| **Native Bridge** | React Native Native Modules (Kotlin) |
| **Accessibility** | Android AccessibilityService API |
| **Gestures** | Android GestureDescription API |
| **AI/LLM** | OpenRouter / OpenAI / Ollama |
| **State** | React hooks + Context |
| **Build** | Gradle + JDK 17 |

---

## Security & Privacy

> [!CAUTION]
> PhoneClaw has **full access to your screen and can perform any action**. Review the safety guidelines below.

- **No cloud storage** — all data stays on-device
- **API keys stored locally** — never transmitted except to the LLM provider
- **Confirmation prompts** — destructive actions require user approval
- **Rate limiting** — max 20 steps per task by default
- **Open source** — full transparency into what the agent does
