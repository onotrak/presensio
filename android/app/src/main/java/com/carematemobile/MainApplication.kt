package com.sistemabsensi

import android.app.Application
import com.sistemabsensi.NotificationPermissionPackage
import com.sistemabsensi.ExactAlarmPermissionModule
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.uimanager.ViewManager

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> {
          val packages = PackageList(this).packages.toMutableList()
          packages.add(NotificationPermissionPackage())
          // Tambahkan module ExactAlarmPermissionModule secara manual
          packages.add(object : ReactPackage {
              override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
                  return listOf(ExactAlarmPermissionModule(reactContext))
              }

              // Tambahkan dua generic parameter untuk ViewManager agar sesuai
              override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
                  return emptyList()
              }
          })

          return packages
        }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
