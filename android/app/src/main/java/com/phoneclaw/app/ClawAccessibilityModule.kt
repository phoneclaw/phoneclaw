package com.phoneclaw.app

import android.content.Intent
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ClawAccessibilityModule.NAME)
class ClawAccessibilityModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = NAME

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for React Native built-in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for React Native built-in Event Emitter Calls.
    }

    // ─── Touch Actions ───────────────────────────────────────────────

    @ReactMethod
    fun tap(x: Double, y: Double, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.tap(x.toFloat(), y.toFloat()))
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun longPress(x: Double, y: Double, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.longPress(x.toFloat(), y.toFloat()))
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun swipe(x1: Double, y1: Double, x2: Double, y2: Double, duration: Double, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.swipe(x1.toFloat(), y1.toFloat(), x2.toFloat(), y2.toFloat(), duration.toLong()))
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun doubleTap(x: Double, y: Double, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.doubleTap(x.toFloat(), y.toFloat()))
        } else {
            promise.resolve(false)
        }
    }

    // ─── Text Input ──────────────────────────────────────────────────

    @ReactMethod
    fun typeText(text: String, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.typeText(text))
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun clearText(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.clearText())
        } else {
            promise.resolve(false)
        }
    }

    // ─── Element Interaction ─────────────────────────────────────────

    @ReactMethod
    fun clickByText(text: String, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.clickByText(text))
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun clickByViewId(viewId: String, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.clickByViewId(viewId))
        } else {
            promise.resolve(false)
        }
    }

    // ─── Navigation & Global Actions ─────────────────────────────────

    @ReactMethod
    fun pressBack(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.pressBack())
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun pressHome(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.pressHome())
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun openRecents(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.openRecents())
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun openNotifications(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.openNotifications())
        } else {
            promise.resolve(false)
        }
    }

    // ─── Scrolling ───────────────────────────────────────────────────

    @ReactMethod
    fun scrollDown(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.scrollDown())
        } else {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun scrollUp(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.scrollUp())
        } else {
            promise.resolve(false)
        }
    }

    // ─── Screen Reading ──────────────────────────────────────────────

    @ReactMethod
    fun getScreenText(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.getScreenText())
        } else {
            promise.resolve("")
        }
    }

    @ReactMethod
    fun getUITree(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.getUITree())
        } else {
            promise.resolve("{}")
        }
    }

    @ReactMethod
    fun takeScreenshot(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            service.takeScreenshotAsync(object : ClawAccessibilityService.ScreenshotCallback {
                override fun onSuccess(base64: String) {
                    promise.resolve(base64)
                }
                override fun onFailure() {
                    promise.resolve("")
                }
            })
        } else {
            promise.resolve("")
        }
    }

    @ReactMethod
    fun getCurrentApp(promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.getCurrentApp())
        } else {
            promise.resolve("")
        }
    }

    // ─── App Management ──────────────────────────────────────────────

    @ReactMethod
    fun launchApp(packageName: String, promise: Promise) {
        val service = getAccessibilityService()
        if (service != null) {
            promise.resolve(service.launchApp(packageName))
        } else {
            promise.resolve(false)
        }
    }

    // ─── Background Execution ────────────────────────────────────────

    @ReactMethod
    fun isServiceRunning(promise: Promise) {
        promise.resolve(ClawAccessibilityServiceHolder.service != null)
    }

    // ─── Heartbeat ───────────────────────────────────────────────────

    private val heartbeatHandler = android.os.Handler(android.os.Looper.getMainLooper())
    private val heartbeatRunnable = object : Runnable {
        override fun run() {
            // 1. Send Event to React Native (Standard Bridge)
            sendEvent("PhoneClawHeartbeat", null)

            // 2. Start Headless JS Task (keeps bridge alive in background)
            try {
                val serviceIntent = Intent(reactContext, AgentHeadlessTaskService::class.java)
                val bundle = android.os.Bundle()
                bundle.putString("event", "heartbeat")
                serviceIntent.putExtras(bundle)
                reactContext.startService(serviceIntent)
            } catch (e: Exception) {
                // Ignore if service fails to start
            }

            // Schedule next tick
            heartbeatHandler.postDelayed(this, 1000)
        }
    }

    private fun startHeartbeat() {
        stopHeartbeat() // ensure no duplicates
        heartbeatHandler.post(heartbeatRunnable)
    }

    private fun stopHeartbeat() {
        heartbeatHandler.removeCallbacks(heartbeatRunnable)
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            reactContext
                .getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: Exception) {
            // Context might be missing or React instance destroyed
        }
    }

    @ReactMethod
    fun startAgentService(promise: Promise) {
        try {
            val intent = Intent(reactContext, AgentForegroundService::class.java)
            reactContext.startForegroundService(intent)
            startHeartbeat()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun stopAgentService(promise: Promise) {
        try {
            val intent = Intent(reactContext, AgentForegroundService::class.java)
            reactContext.stopService(intent)
            stopHeartbeat()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    private fun getAccessibilityService(): ClawAccessibilityService? {
        return ClawAccessibilityServiceHolder.service
    }

    companion object {
        const val NAME = "ClawAccessibilityModule"
    }
}

