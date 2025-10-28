package com.sistemabsensi

import android.app.AlarmManager
import android.content.ActivityNotFoundException
import android.content.Intent
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ExactAlarmPermissionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ExactAlarmPermission"

    @ReactMethod
    fun checkAndRequestPermission(promise: Promise) {
        val alarmManager = reactApplicationContext.getSystemService(ReactApplicationContext.ALARM_SERVICE) as? AlarmManager
        if (alarmManager == null) {
            promise.reject("NO_ALARM_MANAGER", "AlarmManager not available")
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (alarmManager.canScheduleExactAlarms()) {
                promise.resolve(true) // sudah diizinkan
            } else {
                try {
                    val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    reactApplicationContext.startActivity(intent)
                    promise.resolve(false) // sudah diarahkan ke settings, izin belum tentu diaktifkan
                } catch (e: ActivityNotFoundException) {
                    promise.reject("NO_ACTIVITY", "Cannot open settings screen")
                }
            }
        } else {
            promise.resolve(true) // android < 12 tidak perlu izin
        }
    }

    @ReactMethod
    fun checkPermission(promise: Promise) {
        val alarmManager = reactApplicationContext.getSystemService(ReactApplicationContext.ALARM_SERVICE) as? AlarmManager
        if (alarmManager == null) {
            promise.reject("NO_ALARM_MANAGER", "AlarmManager not available")
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            promise.resolve(alarmManager.canScheduleExactAlarms())
        } else {
            promise.resolve(true)
        }
    }

    @ReactMethod
    fun openSettings() {
        try {
            val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactApplicationContext.startActivity(intent)
        } catch (e: ActivityNotFoundException) {
            // Bisa kasih log atau ignore
        }
    }
}
