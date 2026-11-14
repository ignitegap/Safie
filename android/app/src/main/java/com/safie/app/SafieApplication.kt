package com.safie.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class SafieApplication : Application() {
    companion object {
        const val EMERGENCY_CHANNEL_ID = "safie_emergency_channel"
        const val MONITORING_CHANNEL_ID = "safie_monitoring_channel"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val emergencyChannel = NotificationChannel(
                EMERGENCY_CHANNEL_ID,
                "Safie Critical SOS Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Emergency SOS and physical hold alerts"
                enableVibration(true)
            }

            val monitoringChannel = NotificationChannel(
                MONITORING_CHANNEL_ID,
                "Safie Active Journey Monitor",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Background corridor safety monitoring"
            }

            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(emergencyChannel)
            manager?.createNotificationChannel(monitoringChannel)
        }
    }
}
