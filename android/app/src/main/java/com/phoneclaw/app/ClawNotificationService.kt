package com.phoneclaw.app

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import java.util.concurrent.ConcurrentLinkedQueue

class ClawNotificationService : NotificationListenerService() {

    override fun onListenerConnected() {
        super.onListenerConnected()
        Log.d(TAG, "Notification listener connected")
        ClawNotificationHolder.service = this
    }

    override fun onListenerDisconnected() {
        super.onListenerDisconnected()
        Log.d(TAG, "Notification listener disconnected")
        ClawNotificationHolder.service = null
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return
        
        // Add to buffer
        ClawNotificationHolder.addNotification(sbn)
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
        // Optionally handle removal
    }

    companion object {
        const val TAG = "ClawNotification"
    }
}

object ClawNotificationHolder {
    var service: ClawNotificationService? = null
    
    // Store recent notifications (keep last 20)
    private val buffer = ConcurrentLinkedQueue<StatusBarNotification>()
    private const val MAX_SIZE = 20

    fun addNotification(sbn: StatusBarNotification) {
        buffer.add(sbn)
        while (buffer.size > MAX_SIZE) {
            buffer.poll()
        }
    }

    fun getRecentNotifications(): List<StatusBarNotification> {
        return buffer.toList().reversed() // Newest first
    }

    fun clearNotifications() {
        buffer.clear()
    }
}
