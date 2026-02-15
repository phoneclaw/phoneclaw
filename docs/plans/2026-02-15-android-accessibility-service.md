# Android Accessibility Service Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Android Accessibility Service to PhoneClaw to enable clicking, scrolling, and reading screen content of other apps (like Reddit).

**Architecture:** 
- Native Kotlin AccessibilityService that intercepts UI events and performs actions
- Expo Config Plugin to register the service in AndroidManifest
- React Native bridge (Expo Native Module) to communicate between JS and native service
- UI to trigger automation actions

**Tech Stack:** Expo SDK 54, React Native 0.81, Kotlin, Android Accessibility API

---

## Task 1: Pre-build Android Project

**Files:**
- Modify: `app.json`
- Run: `npx expo prebuild --platform android`

**Step 1: Add package name to app.json**

Modify `app.json:14-22` to add package name:

```json
"android": {
  "package": "com.phoneclaw.app",
  "adaptiveIcon": {
    "backgroundColor": "#E6F4FE",
    "foregroundImage": "./assets/images/android-icon-foreground.png",
    "backgroundImage": "./assets/images/android-icon-background.png",
    "monochromeImage": "./assets/images/android-icon-monochrome.png"
  },
  "edgeToEdgeEnabled": true,
  "predictiveBackGestureEnabled": false
}
```

**Step 2: Run prebuild to generate android folder**

Run: `npx expo prebuild --platform android`
Expected: Generates `android/` folder with native project

---

## Task 2: Create AccessibilityService Native Module

**Files:**
- Create: `android/app/src/main/java/com/phoneclaw/app/ClawAccessibilityService.kt`
- Create: `android/app/src/main/res/xml/accessibility_service_config.xml`

**Step 1: Create Kotlin AccessibilityService**

Create `android/app/src/main/java/com/phoneclaw/app/ClawAccessibilityService.kt`:

```kotlin
package com.phoneclaw.app

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class ClawAccessibilityService : AccessibilityService() {
    
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Can capture screen content here if needed
    }

    override fun onInterrupt() {
        // Called when accessibility service is interrupted
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        // Service connected
    }

    fun clickByText(text: String): Boolean {
        val rootNode = rootInActiveWindow ?: return false
        val nodes = rootNode.findAccessibilityNodeInfosByText(text)
        for (node in nodes) {
            if (node.isClickable) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                return true
            }
            node.parent?.let { parent ->
                if (parent.isClickable) {
                    parent.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                    return true
                }
            }
        }
        return false
    }

    fun scrollDown(): Boolean {
        val rootNode = rootInActiveWindow ?: return false
        return rootNode.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD)
    }

    fun scrollUp(): Boolean {
        val rootNode = rootInActiveWindow ?: return false
        return rootNode.performAction(AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD)
    }

    fun getScreenText(): String {
        val rootNode = rootInActiveWindow ?: return ""
        return getAllText(rootNode)
    }

    private fun getAllText(node: AccessibilityNodeInfo): String {
        val sb = StringBuilder()
        node.text?.let { sb.append(it).append(" ") }
        node.contentDescription?.let { sb.append(it).append(" ") }
        for (i in 0 until node.childCount) {
            node.getChild(i)?.let { child ->
                sb.append(getAllText(child))
                child.recycle()
            }
        }
        return sb.toString()
    }

    fun clickByDescription(description: String): Boolean {
        val rootNode = rootInActiveWindow ?: return false
        val nodes = rootNode.findAccessibilityNodeInfosByViewId(description)
        for (node in nodes) {
            if (node.isClickable) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                return true
            }
        }
        return false
    }
}
```

**Step 2: Create accessibility service config**

Create `android/app/src/main/res/xml/accessibility_service_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeAllMask"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagDefault"
    android:canRetrieveWindowContent="true"
    android:description="@string/accessibility_service_description"
    android:notificationTimeout="100"
    android:settingsActivity="com.phoneclaw.app.MainActivity" />
```

**Step 3: Add string resource**

Modify `android/app/src/main/res/values/strings.xml` to add:

```xml
<string name="accessibility_service_description">PhoneClaw Accessibility Service</string>
```

---

## Task 3: Create Expo Config Plugin

**Files:**
- Create: `plugins/with-accessibility-service.js`

**Step 1: Create config plugin**

Create directory `plugins/` and file `plugins/with-accessibility-service.js`:

```javascript
const { withAndroidManifest } = require('@expo/config-plugins');

const withAccessibilityService = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    const application = androidManifest.manifest.application[0];
    
    const service = {
      $: {
        'android:name': '.ClawAccessibilityService',
        'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
        'android:exported': 'false'
      },
      'intent-filter': [
        {
          action: [
            {
              $: {
                'android:name': 'android.accessibilityservice.AccessibilityService'
              }
            }
          ]
        }
      ],
      'meta-data': [
        {
          $: {
            'android:name': 'android.accessibilityservice',
            'android:resource': '@xml/accessibility_service_config'
          }
        }
      ]
    };

    if (!application.service) {
      application.service = [];
    }
    application.service.push(service);

    return config;
  });
};

module.exports = withAccessibilityService;
```

**Step 2: Register plugin in app.json**

Modify `app.json:28-42` to add plugin:

```json
"plugins": [
  "expo-router",
  "./plugins/with-accessibility-service",
  [
    "expo-splash-screen",
    {
      "image": "./assets/images/splash-icon.png",
      "imageWidth": 200,
      "resizeMode": "contain",
      "backgroundColor": "#ffffff",
      "dark": {
        "backgroundColor": "#000000"
      }
    }
  ]
]
```

---

## Task 4: Create React Native Bridge (Expo Native Module)

**Files:**
- Create: `src/native/ClawAccessibilityModule.ts`
- Create: `src/native/ClawAccessibilityService.ts`

**Step 1: Create TypeScript bridge module**

Create `src/native/ClawAccessibilityModule.ts`:

```typescript
import { NativeModules, Platform } from 'react-native';

const { ClawAccessibilityModule: NativeClawModule } = NativeModules;

interface ClawAccessibilityInterface {
  clickByText(text: string): Promise<boolean>;
  scrollDown(): Promise<boolean>;
  scrollUp(): Promise<boolean>;
  getScreenText(): Promise<string>;
  isServiceRunning(): Promise<boolean>;
}

const ClawAccessibilityModule: ClawAccessibilityInterface = {
  async clickByText(text: string): Promise<boolean> {
    if (Platform.OS !== 'android') {
      console.warn('Accessibility only works on Android');
      return false;
    }
    try {
      return await NativeClawModule.clickByText(text);
    } catch (e) {
      console.error('Error clicking by text:', e);
      return false;
    }
  },

  async scrollDown(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      return await NativeClawModule.scrollDown();
    } catch (e) {
      console.error('Error scrolling down:', e);
      return false;
    }
  },

  async scrollUp(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      return await NativeClawModule.scrollUp();
    } catch (e) {
      console.error('Error scrolling up:', e);
      return false;
    }
  },

  async getScreenText(): Promise<string> {
    if (Platform.OS !== 'android') return '';
    try {
      return await NativeClawModule.getScreenText();
    } catch (e) {
      console.error('Error getting screen text:', e);
      return '';
    }
  },

  async isServiceRunning(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;
    try {
      return await NativeClawModule.isServiceRunning();
    } catch (e) {
      console.error('Error checking service:', e);
      return false;
    }
  }
};

export default ClawAccessibilityModule;
```

**Step 2: Create service manager**

Create `src/native/ClawAccessibilityService.ts`:

```typescript
import { NativeModules, Linking, Platform, Alert } from 'react-native';

const ANDROID_ACCESSIBILITY_SETTINGS = 'android.settings.ACCESSIBILITY_SETTINGS';

export class ClawAccessibilityService {
  static async openAccessibilitySettings(): Promise<void> {
    if (Platform.OS !== 'android') {
      Alert.alert('Error', 'Accessibility settings only available on Android');
      return;
    }
    await Linking.openSettings();
  }

  static async requestAccessibilityPermission(): Promise<void> {
    if (Platform.OS !== 'android') return;
    
    try {
      await Linking.openSettings();
    } catch (e) {
      Alert.alert(
        'Permission Required',
        'Please enable PhoneClaw accessibility service in Settings > Accessibility'
      );
    }
  }
}

export default ClawAccessibilityService;
```

---

## Task 5: Create Native Module Implementation

**Files:**
- Create: `android/app/src/main/java/com/phoneclaw/app/ClawAccessibilityModule.kt`

**Step 1: Create native module**

Create `android/app/src/main/java/com/phoneclaw/app/ClawAccessibilityModule.kt`:

```kotlin
package com.phoneclaw.app

import com.facebook.react.bridge.*

@ReactModule(name = ClawAccessibilityModule.NAME)
class ClawAccessibilityModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var accessibilityService: ClawAccessibilityService? = null

    override fun getName(): String = NAME

    @ReactMethod
    fun clickByText(text: String, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            val result = service.clickByText(text)
            promise.resolve(result)
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun scrollDown(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            val result = service.scrollDown()
            promise.resolve(result)
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun scrollUp(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            val result = service.scrollUp()
            promise.resolve(result)
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun getScreenText(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            val result = service.getScreenText()
            promise.resolve(result)
        } else {
            promise.resolve("")
        }
    }

    @ReactMethod
    fun isServiceRunning(promise: Promise) {
        promise.resolve(accessibilityService != null)
    }

    private fun getAccessibilityService(): ClawAccessibilityService? {
        // Get the service from MainApplication or use a static reference
        return ClawAccessibilityServiceHolder.service
    }

    companion object {
        const val NAME = "ClawAccessibilityModule"
    }
}
```

**Step 2: Create service holder**

Create `android/app/src/main/java/com/phoneclaw/app/ClawAccessibilityServiceHolder.kt`:

```kotlin
package com.phoneclaw.app

object ClawAccessibilityServiceHolder {
    var service: ClawAccessibilityService? = null
}
```

**Step 3: Update service to register itself**

Modify `ClawAccessibilityService.kt` to add:

```kotlin
override fun onServiceConnected() {
    super.onServiceConnected()
    ClawAccessibilityServiceHolder.service = this
}
```

**Step 4: Register module in MainApplication**

Modify `android/app/src/main/java/com/phoneclaw/app/MainApplication.kt` to add the module registration (follow existing pattern in the file).

---

## Task 6: Update UI to Use Accessibility

**Files:**
- Modify: `app/(tabs)/index.tsx`

**Step 1: Add automation buttons**

Modify `app/(tabs)/index.tsx` to add click, scroll, and read buttons:

```typescript
import ClawAccessibilityModule from '@/src/native/ClawAccessibilityModule';
import ClawAccessibilityService from '@/src/native/ClawAccessibilityService';
// ... existing imports

// Add state for screen text
const [screenText, setScreenText] = useState('');

// Add functions
const handleScrollDown = async () => {
  await ClawAccessibilityModule.scrollDown();
};

const handleReadScreen = async () => {
  const text = await ClawAccessibilityModule.getScreenText();
  setScreenText(text.slice(0, 500)); // Limit display
};

const handleOpenSettings = () => {
  ClawAccessibilityService.openAccessibilitySettings();
};
```

Add buttons in the UI for these actions.

---

## Task 7: Build and Test

**Step 1: Rebuild Android project**

Run: `npx expo prebuild --platform android && cd android && ./gradlew assembleDebug`

**Step 2: Install on device**

Run: `adb install android/app/build/outputs/apk/debug/app-debug.apk`

**Step 3: Enable accessibility service**

1. Open PhoneClaw app
2. Go to Settings > Accessibility
3. Enable PhoneClaw service

**Step 4: Test automation**

1. Open Reddit app
2. Come back to PhoneClaw
3. Tap "Read Screen" - should show Reddit UI text
4. Tap "Scroll Down" - should scroll Reddit feed

---

## Verification Checklist

- [ ] Android project generates with `npx expo prebuild`
- [ ] Accessibility service appears in AndroidManifest.xml
- [ ] App builds without errors
- [ ] Accessibility permission can be requested
- [ ] Service connects successfully
- [ ] ClickByText works on target app
- [ ] ScrollDown/ScrollUp works
- [ ] GetScreenText returns UI content
