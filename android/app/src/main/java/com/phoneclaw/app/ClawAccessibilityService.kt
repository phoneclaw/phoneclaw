package com.phoneclaw.app

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.graphics.Rect
import android.os.Build
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class ClawAccessibilityService : AccessibilityService() {
    
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Can capture screen content here if needed
    }

    companion object {
        const val NAME = "ClawAccessibilityModule"
        private const val TAG = "ClawAccessibility"
    }

    override fun onInterrupt() {
        // Called when accessibility service is interrupted
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "Accessibility service connected")
        ClawAccessibilityServiceHolder.service = this
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "Accessibility service destroyed")
        ClawAccessibilityServiceHolder.service = null
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
        Log.d(TAG, "Attempting to scroll down")
        val rootNode = rootInActiveWindow
        if (rootNode != null) {
            val scrollableNode = findScrollableNode(rootNode)
            if (scrollableNode != null) {
                val result = scrollableNode.performAction(AccessibilityNodeInfo.ACTION_SCROLL_FORWARD)
                Log.d(TAG, "Scroll down via node result: $result")
                scrollableNode.recycle()
                if (result) return true
            }
        } else {
            Log.w(TAG, "rootInActiveWindow is null")
        }
        // Fallback: gesture-based swipe up (scrolls content down)
        Log.d(TAG, "Falling back to gesture scroll down")
        return performSwipeGesture(isScrollDown = true)
    }

    fun scrollUp(): Boolean {
        Log.d(TAG, "Attempting to scroll up")
        val rootNode = rootInActiveWindow
        if (rootNode != null) {
            val scrollableNode = findScrollableNode(rootNode)
            if (scrollableNode != null) {
                val result = scrollableNode.performAction(AccessibilityNodeInfo.ACTION_SCROLL_BACKWARD)
                Log.d(TAG, "Scroll up via node result: $result")
                scrollableNode.recycle()
                if (result) return true
            }
        } else {
            Log.w(TAG, "rootInActiveWindow is null")
        }
        // Fallback: gesture-based swipe down (scrolls content up)
        Log.d(TAG, "Falling back to gesture scroll up")
        return performSwipeGesture(isScrollDown = false)
    }

    private fun performSwipeGesture(isScrollDown: Boolean): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            Log.w(TAG, "Gesture API requires API 24+")
            return false
        }
        val displayMetrics = resources.displayMetrics
        val screenWidth = displayMetrics.widthPixels
        val screenHeight = displayMetrics.heightPixels
        val centerX = screenWidth / 2f
        val startY: Float
        val endY: Float
        if (isScrollDown) {
            startY = screenHeight * 0.7f
            endY = screenHeight * 0.3f
        } else {
            startY = screenHeight * 0.3f
            endY = screenHeight * 0.7f
        }
        val path = Path()
        path.moveTo(centerX, startY)
        path.lineTo(centerX, endY)
        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, 300))
            .build()
        val dispatched = dispatchGesture(gesture, null, null)
        Log.d(TAG, "Gesture scroll dispatched: $dispatched")
        return dispatched
    }

    private fun findScrollableNode(root: AccessibilityNodeInfo): AccessibilityNodeInfo? {
        if (root.isScrollable) {
            return root
        }
        for (i in 0 until root.childCount) {
            val child = root.getChild(i)
            if (child != null) {
                val scrollableChild = findScrollableNode(child)
                if (scrollableChild != null) {
                    return scrollableChild
                }
                child.recycle()
            }
        }
        return null
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
