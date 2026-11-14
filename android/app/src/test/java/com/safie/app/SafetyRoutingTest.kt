package com.safie.app

import com.safie.app.model.HavenCategory
import com.safie.app.model.RoadSegment
import com.safie.app.model.SafeHaven
import com.safie.app.routing.SafetyRoutingEngine
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class SafetyRoutingTest {

    private lateinit var routingEngine: SafetyRoutingEngine

    @Before
    fun setUp() {
        routingEngine = SafetyRoutingEngine(
            unlitPenaltyWeight = 2.5,
            havenBonusWeight = 0.35,
            maxDetourDeltaMinutes = 3.0
        )
    }

    @Test
    fun testWellLitRouteWithSafeHavensIsRecommended() {
        val litSegments = listOf(
            RoadSegment("seg-1", "Cyber City Boulevard", "Gurugram", 28.495, 77.089, 28.492, 77.088, 96, true, true, 92),
            RoadSegment("seg-2", "Belvedere Walkway", "Gurugram", 28.492, 77.088, 28.488, 77.089, 88, true, true, 84)
        )
        val havens = listOf(
            SafeHaven("sh-1", "Apollo 24/7", HavenCategory.PHARMACY_247, "Pharmacy", 28.495, 77.089, "Cyber City", "112")
        )

        val route = routingEngine.evaluateRoute(
            id = "safie-safe",
            title = "Safie Safest Corridor",
            segments = litSegments,
            safeHavens = havens,
            baselineFastestMinutes = 11.0
        )

        assertTrue("Lit route with havens should be recommended", route.isRecommended)
        assertTrue("Safety score should be high", route.compositeSafetyScore >= 80)
        assertEquals(92, route.lightingAverage)
    }

    @Test
    fun testUnlitAlleyRouteIsNotRecommended() {
        val darkAlleySegments = listOf(
            RoadSegment("seg-dark", "Phase 2 Alley", "Gurugram", 28.491, 77.085, 28.487, 77.086, 22, false, false, 24)
        )

        val route = routingEngine.evaluateRoute(
            id = "risky-shortcut",
            title = "Dark Shortcut",
            segments = darkAlleySegments,
            safeHavens = emptyList(),
            baselineFastestMinutes = 8.0
        )

        assertFalse("Unlit shortcut without havens must not be recommended", route.isRecommended)
        assertEquals(24, route.compositeSafetyScore)
        assertEquals(22, route.lightingAverage)
    }
}
