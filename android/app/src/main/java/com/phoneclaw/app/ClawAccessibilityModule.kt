package com.phoneclaw.app

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ClawAccessibilityModule.NAME)
class ClawAccessibilityModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

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
        promise.resolve(ClawAccessibilityServiceHolder.service != null)
    }

    private fun getAccessibilityService(): ClawAccessibilityService? {
        return ClawAccessibilityServiceHolder.service
    }

    companion object {
        const val NAME = "ClawAccessibilityModule"
    }
}
