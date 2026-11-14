package com.safie.app.service

import android.app.Notification
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.safie.app.SafieApplication

class SafetyForegroundService : Service() {

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification: Notification = NotificationCompat.Builder(this, SafieApplication.MONITORING_CHANNEL_ID)
            .setContentTitle("Safie Active Escort")
            .setContentText("Continuous safety monitoring and BLE mesh relay active")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setOngoing(true)
            .build()

        startForeground(1001, notification)
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
