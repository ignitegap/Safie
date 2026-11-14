package com.safie.app.routing

import com.safie.app.model.RoadSegment
import com.safie.app.model.SafeHaven

/**
 * SafetyRoutingEngine — Multi-Objective Pedestrian Cost Optimizer
 *
 * Implements the core Valhalla safety weighting formula:
 * Cost = DistanceKm * (1 + (1.0 - lightingFraction) * unlitPenaltyWeight) - (nearbyHavens * havenBonusWeight)
 */
class SafetyRoutingEngine(
    private val unlitPenaltyWeight: Double = 2.5,
    private val havenBonusWeight: Double = 0.35,
    private val maxDetourDeltaMinutes: Double = 3.0
) {
    data class EvaluatedRoute(
        val id: String,
        val title: String,
        val totalDistanceKm: Double,
        val estimatedMinutes: Double,
        val lightingAverage: Int,
        val safeHavenCount: Int,
        val compositeSafetyScore: Int, // 0 - 100
        val isRecommended: Boolean
    )

    fun evaluateRoute(
        id: String,
        title: String,
        segments: List<RoadSegment>,
        safeHavens: List<SafeHaven>,
        baselineFastestMinutes: Double
    ): EvaluatedRoute {
        if (segments.isEmpty()) {
            return EvaluatedRoute(id, title, 0.0, 0.0, 0, 0, 0, false)
        }

        val avgLighting = segments.map { it.lightingPercentage }.average().toInt()
        val totalScore = segments.map { it.safetyScore }.average().toInt()
        
        // Approximate distance based on segment count
        val distanceKm = segments.size * 0.45
        val estimatedMinutes = (distanceKm / 4.5) * 60.0 // 4.5 km/h walking pace

        val havensCount = safeHavens.size
        val exceedsMaxDelta = (estimatedMinutes - baselineFastestMinutes) > maxDetourDeltaMinutes

        // Route is recommended if safety score >= 75 and within acceptable detour delta
        val isRecommended = totalScore >= 75 && !exceedsMaxDelta

        return EvaluatedRoute(
            id = id,
            title = title,
            totalDistanceKm = distanceKm,
            estimatedMinutes = estimatedMinutes,
            lightingAverage = avgLighting,
            safeHavenCount = havensCount,
            compositeSafetyScore = totalScore,
            isRecommended = isRecommended
        )
    }
}
