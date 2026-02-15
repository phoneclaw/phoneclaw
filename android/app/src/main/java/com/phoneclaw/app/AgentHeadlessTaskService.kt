package com.phoneclaw.app

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class AgentHeadlessTaskService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        val extras = intent?.extras
        return HeadlessJsTaskConfig(
            "PhoneClawHeadlessTask",
            if (extras != null) Arguments.fromBundle(extras) else Arguments.createMap(),
            5000, // timeout for the task
            true // allowed in foreground
        )
    }
}
