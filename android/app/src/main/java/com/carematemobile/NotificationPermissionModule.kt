package com.sistemabsensi

import android.app.NotificationManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NotificationPermissionModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NotificationPermission"
    }

    @ReactMethod
    fun areNotificationsEnabled(promise: Promise) {
        try {
            val manager =
                reactContext.getSystemService(ReactApplicationContext.NOTIFICATION_SERVICE) as NotificationManager
            val enabled = manager.areNotificationsEnabled()
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun openNotificationSettings() {
        val intent: Intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                putExtra(Settings.EXTRA_APP_PACKAGE, reactContext.packageName)
            }
        } else {
            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.parse("package:${reactContext.packageName}")
            }
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(intent)
    }
}