package com.safie.app.model

data class RoadSegment(
    val id: String,
    val name: String,
    val zone: String, // e.g. "Gurugram" or "Delhi"
    val startLat: Double,
    val startLng: Double,
    val endLat: Double,
    val endLng: Double,
    val lightingPercentage: Int, // 0 - 100%
    val isCcmsConnected: Boolean, // GMDA SCADA CCMS
    val hasContinuousSidewalk: Boolean,
    val safetyScore: Int // 0 - 100
)
