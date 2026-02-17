# 🐾 PhoneClaw

**An open-source AI-powered phone automation agent for Android.**

PhoneClaw uses Android's Accessibility Service to give an AI agent full control over your phone — reading screens, tapping buttons, typing text, scrolling, navigating, and executing multi-step tasks through natural language commands.

> ⚠️ **Early Development** — This project is under active development. Contributions welcome!

> [**Watch the Demo on Twitter**](https://twitter.com/8Dazo/status/2023592262782120054)

---

## ✨ Features

### Core Tools (Phase 1)
| Tool | Status | Description |
|------|--------|-------------|
| `scrollUp` / `scrollDown` | ✅ | Scroll with node detection + gesture fallback |
| `clickByText` | ✅ | Find and click elements by visible text |
| `getScreenText` | ✅ | Read all text on the current screen |
| `isServiceRunning` | ✅ | Check if accessibility service is active |
| `tap(x, y)` | 🔜 | Tap at exact screen coordinates |
| `longPress(x, y)` | 🔜 | Long press at coordinates |
| `swipe(x1, y1, x2, y2)` | 🔜 | Arbitrary swipe gestures |
| `typeText(text)` | 🔜 | Type into focused input fields |
| `pressBack` / `pressHome` | 🔜 | System navigation actions |
| `getUITree` | 🔜 | Full accessibility tree as structured JSON |
| `takeScreenshot` | ✅ | Capture screen for vision AI |

### Agent Integration (Phase 2)
- ✅ LLM-powered reasoning loop
- ✅ Natural language command interface
- ✅ Automatic tool selection and execution
- ✅ Chat UI with action visualization

### Advanced Features (Phase 3)
- ✅ App launcher by name
- ✅ Notification reader
- ✅ Vision (Screenshot analysis)
- 🔜 Multi-step task planning (Partially implemented via prompts)
- 🔜 Background execution (Service implemented)

---

## 🏗️ Architecture

```
phoneclaw/
├── app/                          # Expo Router pages
│   ├── (tabs)/
│   │   ├── index.tsx             # Home — service status & manual controls
│   │   └── agent.tsx             # Agent chat UI (Phase 2)
│   └── _layout.tsx
│
├── src/
│   ├── native/                   # React Native ↔ Kotlin bridge
│   │   ├── ClawAccessibilityModule.ts
│   │   └── ClawAccessibilityService.ts
│   │
│   ├── tools/                    # Modular tool definitions
│   │   ├── index.ts              # Tool registry
│   │   ├── touch.ts              # tap, longPress, swipe
│   │   ├── navigation.ts         # back, home, recents, scroll
│   │   ├── screen.ts             # getScreenText, getUITree
│   │   ├── vision.ts             # capture_screen (Phase 3)
│   │   ├── notifications.ts      # notification tools (Phase 3)
│   │   ├── input.ts              # typeText, clickByText, clickByViewId
│   │   └── app.ts                # launchApp, getCurrentApp
│   │
│   └── agent/                    # AI Agent core (Phase 2)
│       ├── AgentCore.ts          # LLM reasoning loop
│       └── prompts.ts            # System prompts & tool definitions
│
├── android/app/src/main/java/com/phoneclaw/app/
│   ├── ClawAccessibilityService.kt   # Core service — all native actions
│   ├── ClawNotificationService.kt    # Notification listener (Phase 3)
│   ├── ClawAccessibilityModule.kt    # React Native bridge module
│   ├── ClawAccessibilityPackage.kt   # RN package registration
│   ├── ClawAccessibilityServiceHolder.kt  # Singleton reference
│   ├── MainApplication.kt
│   └── MainActivity.kt
│
├── android/app/src/main/res/xml/
│   └── accessibility_service_config.xml  # Service capabilities config
│
└── plugins/
    └── with-accessibility-service.js     # Expo config plugin
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **JDK 17** (not newer — JDK 24 breaks the build)
- **Android SDK** with NDK `27.1.12297006`
- Physical Android device with USB debugging enabled

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/phoneclaw.git
cd phoneclaw

# Install dependencies
npm install

# Build and run on connected Android device
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
npx expo run:android --device
```

### Enable Accessibility Service

1. Open **Settings** → **Accessibility** → **Installed Services**
2. Find **PhoneClaw** and toggle it **On**
3. Accept the permission prompt
4. Return to the app — the status should show ✅ Running

---

## 🛠️ Development

```bash
# Run on device (requires native rebuild for Kotlin changes)
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
npx expo run:android --device

# JS-only changes hot-reload automatically via Metro
# Kotlin changes require a full rebuild
```

### Adding a New Tool

1. **Kotlin** — Add the method to `ClawAccessibilityService.kt`
2. **Bridge** — Add `@ReactMethod` wrapper in `ClawAccessibilityModule.kt`
3. **JS Bridge** — Add the native method binding in `ClawAccessibilityModule.ts`
4. **Tool Definition** — Register in `src/tools/` with name, description, params

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 🙏 Inspiration

- [OpenClaw](https://github.com/open-claw) — Personal AI agent with full system access
- Android Accessibility Service documentation
- React Native Native Modules
