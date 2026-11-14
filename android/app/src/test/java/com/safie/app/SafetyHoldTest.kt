package com.safie.app

import com.safie.app.security.SafetyHoldManager
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.TestScope
import kotlinx.coroutines.test.advanceTimeBy
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class SafetyHoldTest {

    private lateinit var testScope: TestScope
    private lateinit var safetyHoldManager: SafetyHoldManager
    private var sosDispatched = false
    private var isCovertAlert = false
    private var dispatchReason = ""

    @Before
    fun setUp() {
        testScope = TestScope()
        safetyHoldManager = SafetyHoldManager(
            normalPin = "1234",
            duressPin = "9876",
            scope = testScope
        )
        sosDispatched = false
        isCovertAlert = false
        dispatchReason = ""

        safetyHoldManager.onSosDispatched = { covert, reason ->
            sosDispatched = true
            isCovertAlert = covert
            dispatchReason = reason
        }
    }

    @Test
    fun testHoldPressChangesStateToHolding() {
        safetyHoldManager.onHoldPressed()
        assertEquals(SafetyHoldManager.State.HOLDING, safetyHoldManager.currentState)
    }

    @Test
    fun testHoldReleaseStarts10SecondCountdown() {
        safetyHoldManager.onHoldPressed()
        safetyHoldManager.onHoldReleased()

        assertEquals(SafetyHoldManager.State.COUNTDOWN, safetyHoldManager.currentState)
        assertEquals(10, safetyHoldManager.remainingSeconds)
    }

    @Test
    fun testNormalPinDisarmsHoldSafely() {
        safetyHoldManager.onHoldPressed()
        safetyHoldManager.onHoldReleased()

        val result = safetyHoldManager.submitPin("1234")

        assertTrue(result is SafetyHoldManager.VerificationResult.SuccessDisarmed)
        assertEquals(SafetyHoldManager.State.DISARMED, safetyHoldManager.currentState)
        assertFalse("SOS should not be dispatched on normal PIN", sosDispatched)
    }

    @Test
    fun testDuressPinTriggersCovertEmergencyAlertWithDeceptiveMessage() {
        safetyHoldManager.onHoldPressed()
        safetyHoldManager.onHoldReleased()

        val result = safetyHoldManager.submitPin("9876")

        assertTrue("Result should be DuressTriggered", result is SafetyHoldManager.VerificationResult.DuressTriggered)
        val duress = result as SafetyHoldManager.VerificationResult.DuressTriggered
        
        // Attacker sees "Alarm Cancelled"
        assertEquals("Alarm Cancelled", duress.deceptiveDisplay)
        
        // Internal state is COVERT_DURESS
        assertEquals(SafetyHoldManager.State.COVERT_DURESS, safetyHoldManager.currentState)
        
        // High priority covert SOS fired!
        assertTrue("SOS must be dispatched immediately", sosDispatched)
        assertTrue("Alert must be tagged as covert", isCovertAlert)
        assertTrue(dispatchReason.contains("Duress PIN"))
    }

    @Test
    fun testCountdownExpirationDispatchesLevel3Sos() = testScope.runTest {
        safetyHoldManager.onHoldPressed()
        safetyHoldManager.onHoldReleased()

        // Advance coroutine clock past 10 seconds
        testScope.advanceTimeBy(11000)

        assertEquals(SafetyHoldManager.State.CRISIS_TRIGGERED, safetyHoldManager.currentState)
        assertTrue("SOS must be dispatched when countdown reaches 0", sosDispatched)
        assertFalse("Expiration SOS is overt, not covert", isCovertAlert)
    }
}
