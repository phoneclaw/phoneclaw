package com.phoneclaw.app

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Path
import android.graphics.Rect
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Base64
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream

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

    // ─── Touch Actions ───────────────────────────────────────────────

    fun tap(x: Float, y: Float): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) return false
        val path = Path().apply { moveTo(x, y) }
        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, 50))
            .build()
        return dispatchGesture(gesture, null, null)
    }

    fun longPress(x: Float, y: Float): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) return false
        val path = Path().apply { moveTo(x, y) }
        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, 500))
            .build()
        return dispatchGesture(gesture, null, null)
    }

    fun swipe(x1: Float, y1: Float, x2: Float, y2: Float, duration: Long): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) return false
        val path = Path().apply {
            moveTo(x1, y1)
            lineTo(x2, y2)
        }
        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, duration))
            .build()
        return dispatchGesture(gesture, null, null)
    }

    fun doubleTap(x: Float, y: Float): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) return false
        val path1 = Path().apply { moveTo(x, y) }
        val gesture1 = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path1, 0, 50))
            .build()
        val firstTap = dispatchGesture(gesture1, null, null)
        if (!firstTap) return false
        // Schedule second tap after a brief delay
        val path2 = Path().apply { moveTo(x, y) }
        val gesture2 = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path2, 0, 50))
            .build()
        Handler(Looper.getMainLooper()).postDelayed({
            dispatchGesture(gesture2, null, null)
        }, 100)
        return true
    }

    // ─── Text Input ──────────────────────────────────────────────────

    fun typeText(text: String): Boolean {
        val editableNode = findEditableNode() ?: return false
        val args = Bundle().apply {
            putCharSequence(
                AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE,
                text
            )
        }
        return editableNode.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, args)
    }

    fun clearText(): Boolean {
        val editableNode = findEditableNode() ?: return false
        val args = Bundle().apply {
            putCharSequence(
                AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE,
                ""
            )
        }
        return editableNode.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, args)
    }

    /**
     * Find an editable/focused input node. Tries multiple strategies:
     * 1. findFocus(FOCUS_INPUT) — standard approach
     * 2. findFocus(FOCUS_ACCESSIBILITY) — fallback for some apps 
     * 3. Tree traversal for any editable/focusable EditText
     */
    private fun findEditableNode(): AccessibilityNodeInfo? {
        val rootNode = rootInActiveWindow ?: return null
        
        // Strategy 1: standard input focus
        rootNode.findFocus(AccessibilityNodeInfo.FOCUS_INPUT)?.let { node ->
            if (node.isEditable) return node
        }
        
        // Strategy 2: accessibility focus
        rootNode.findFocus(AccessibilityNodeInfo.FOCUS_ACCESSIBILITY)?.let { node ->
            if (node.isEditable) return node
        }
        
        // Strategy 3: traverse tree for the first focused+editable or just editable node
        return findEditableInTree(rootNode)
    }

    private fun findEditableInTree(node: AccessibilityNodeInfo): AccessibilityNodeInfo? {
        // If this node is editable and focused, it's the best match
        if (node.isEditable && node.isFocused) return node
        
        // Check children
        var firstEditable: AccessibilityNodeInfo? = null
        for (i in 0 until node.childCount) {
            node.getChild(i)?.let { child ->
                val found = findEditableInTree(child)
                if (found != null) {
                    if (found.isFocused && found.isEditable) return found
                    if (firstEditable == null && found.isEditable) firstEditable = found
                }
            }
        }
        
        // If no focused+editable found, return any editable node
        if (firstEditable == null && node.isEditable) return node
        return firstEditable
    }

    // ─── Element Interaction ─────────────────────────────────────────

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

    fun clickByViewId(viewId: String): Boolean {
        val rootNode = rootInActiveWindow ?: return false
        val nodes = rootNode.findAccessibilityNodeInfosByViewId(viewId)
        if (nodes.isEmpty()) return false
        
        for (node in nodes) {
            // If this node is clickable, click it directly
            if (node.isClickable) {
                node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                return true
            }
            // Walk up the parent hierarchy looking for a clickable ancestor (up to 5 levels)
            var parent = node.parent
            var depth = 0
            while (parent != null && depth < 5) {
                if (parent.isClickable) {
                    parent.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                    return true
                }
                parent = parent.parent
                depth++
            }
        }

        // Fallback: force-click the first node even if not marked clickable
        nodes[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)
        return true
    }

    // ─── Navigation & Global Actions ─────────────────────────────────

    fun pressBack(): Boolean = performGlobalAction(GLOBAL_ACTION_BACK)
    fun pressHome(): Boolean = performGlobalAction(GLOBAL_ACTION_HOME)
    fun openRecents(): Boolean = performGlobalAction(GLOBAL_ACTION_RECENTS)
    fun openNotifications(): Boolean = performGlobalAction(GLOBAL_ACTION_NOTIFICATIONS)
    fun openQuickSettings(): Boolean = performGlobalAction(GLOBAL_ACTION_QUICK_SETTINGS)

    // ─── Scrolling ───────────────────────────────────────────────────

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

    // ─── Screen Reading ──────────────────────────────────────────────

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

    fun getUITree(): String {
        val rootNode = rootInActiveWindow ?: return "{}"
        val result = JSONObject()
        result.put("packageName", rootNode.packageName ?: "")
        
        var nodeId = 0
        val nodesArray = JSONArray()

        fun traverseNode(node: AccessibilityNodeInfo): Int {
            val currentId = nodeId++
            val nodeObj = JSONObject()
            nodeObj.put("id", currentId)
            nodeObj.put("className", node.className?.toString() ?: "")
            nodeObj.put("text", node.text?.toString() ?: JSONObject.NULL)
            nodeObj.put("contentDescription", node.contentDescription?.toString() ?: JSONObject.NULL)

            val bounds = Rect()
            node.getBoundsInScreen(bounds)
            val boundsObj = JSONObject()
            boundsObj.put("left", bounds.left)
            boundsObj.put("top", bounds.top)
            boundsObj.put("right", bounds.right)
            boundsObj.put("bottom", bounds.bottom)
            nodeObj.put("bounds", boundsObj)

            nodeObj.put("isClickable", node.isClickable)
            nodeObj.put("isScrollable", node.isScrollable)
            nodeObj.put("isEditable", node.isEditable)
            nodeObj.put("isFocused", node.isFocused)
            nodeObj.put("viewId", node.viewIdResourceName ?: JSONObject.NULL)

            val childIds = JSONArray()
            for (i in 0 until node.childCount) {
                node.getChild(i)?.let { child ->
                    val childId = traverseNode(child)
                    childIds.put(childId)
                    child.recycle()
                }
            }
            nodeObj.put("children", childIds)
            nodesArray.put(nodeObj)
            return currentId
        }

        traverseNode(rootNode)
        result.put("nodes", nodesArray)
        return result.toString()
    }

    fun getCurrentApp(): String {
        val rootNode = rootInActiveWindow ?: return ""
        return rootNode.packageName?.toString() ?: ""
    }

    interface ScreenshotCallback {
        fun onSuccess(base64: String)
        fun onFailure()
    }

    fun takeScreenshotAsync(callback: ScreenshotCallback) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            Log.w(TAG, "takeScreenshot requires API 30+")
            callback.onFailure()
            return
        }
        takeScreenshot(
            android.view.Display.DEFAULT_DISPLAY,
            mainExecutor,
            object : TakeScreenshotCallback {
                override fun onSuccess(screenshot: ScreenshotResult) {
                    try {
                        val bitmap = Bitmap.wrapHardwareBuffer(
                            screenshot.hardwareBuffer,
                            screenshot.colorSpace
                        )
                        if (bitmap == null) {
                            callback.onFailure()
                            return
                        }
                        val softBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, false)
                        val stream = ByteArrayOutputStream()
                        softBitmap.compress(Bitmap.CompressFormat.PNG, 80, stream)
                        val base64String = Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
                        screenshot.hardwareBuffer.close()
                        bitmap.recycle()
                        softBitmap.recycle()
                        callback.onSuccess(base64String)
                    } catch (e: Exception) {
                        Log.e(TAG, "Error processing screenshot", e)
                        callback.onFailure()
                    }
                }

                override fun onFailure(errorCode: Int) {
                    Log.e(TAG, "Screenshot failed with error code: $errorCode")
                    callback.onFailure()
                }
            }
        )
    }

    // ─── App Management ──────────────────────────────────────────────

    fun launchApp(packageName: String): Boolean {
        return try {
            val intent = applicationContext.packageManager.getLaunchIntentForPackage(packageName)
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                applicationContext.startActivity(intent)
                true
            } else {
                Log.w(TAG, "No launch intent for package: $packageName")
                false
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error launching app: $packageName", e)
            false
        }
    }
}
