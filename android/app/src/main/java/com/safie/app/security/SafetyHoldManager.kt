package com.safie.app.security

import kotlinx.coroutines.*
import java.util.concurrent.atomic.AtomicBoolean

/**
 * SafetyHoldManager — The Noonlight-inspired Dead Man's Switch Engine
 *
 * Operational Dynamics:
 * 1. User holds thumb down on button when uneasy (State: HOLDING).
 * 2. If user releases thumb, a 10-second countdown immediately initiates (State: COUNTDOWN).
 * 3. Normal PIN (e.g. "1234") -> Verification passed; stands down safely.
 * 4. Duress PIN (e.g. "9876") -> Deceptive "Alarm Cancelled" message rendered to attacker,
 *    while covertly dispatching Tier-3 Police & Family Red Alert with live GPS.
 * 5. Countdown reaches 0s -> Automatic Tier-3 SOS dispatch!
 */
class SafetyHoldManager(
    private val normalPin: String = "1234",
    private val duressPin: String = "9876",
    private val scope: CoroutineScope = CoroutineScope(Dispatchers.Default)
) {
    enum class State {
        IDLE,
        HOLDING,
        COUNTDOWN,
        DISARMED,
        COVERT_DURESS,
        CRISIS_TRIGGERED
    }

    sealed class VerificationResult {
        object SuccessDisarmed : VerificationResult()
        data class DuressTriggered(val deceptiveDisplay: String, val silentPayload: String) : VerificationResult()
        data class InvalidPin(val attemptsRemaining: Int) : VerificationResult()
    }

    var currentState: State = State.IDLE
        private set

    var remainingSeconds: Int = 10
        private set

    private var countdownJob: Job? = null
    var onStateChanged: ((State) -> Unit)? = null
    var onTick: ((Int) -> Unit)? = null
    var onSosDispatched: ((isCovert: Boolean, reason: String) -> Unit)? = null

    fun onHoldPressed() {
        countdownJob?.cancel()
        remainingSeconds = 10
        currentState = State.HOLDING
        onStateChanged?.invoke(currentState)
    }

    fun onHoldReleased() {
        if (currentState != State.HOLDING) return

        currentState = State.COUNTDOWN
        remainingSeconds = 10
        onStateChanged?.invoke(currentState)
        onTick?.invoke(remainingSeconds)

        countdownJob = scope.launch {
            while (remainingSeconds > 0 && isActive) {
                delay(1000)
                remainingSeconds -= 1
                onTick?.invoke(remainingSeconds)
            }

            if (remainingSeconds == 0 && isActive) {
                currentState = State.CRISIS_TRIGGERED
                onStateChanged?.invoke(currentState)
                onSosDispatched?.invoke(false, "Safety Hold countdown expired (10s)")
            }
        }
    }

    fun submitPin(enteredPin: String): VerificationResult {
        countdownJob?.cancel()

        return when (enteredPin) {
            normalPin -> {
                currentState = State.DISARMED
                onStateChanged?.invoke(currentState)
                VerificationResult.SuccessDisarmed
            }
            duressPin -> {
                // Anti-coercion protocol: deceptively display cancelled, but covertly fire Level 3
                currentState = State.COVERT_DURESS
                onStateChanged?.invoke(currentState)
                onSosDispatched?.invoke(true, "Duress PIN entered under coercion (9876)")
                VerificationResult.DuressTriggered(
                    deceptiveDisplay = "Alarm Cancelled",
                    silentPayload = "EMERGENCY_DURESS_COVERT_ACTIVE"
                )
            }
            else -> {
                // Wrong pin; restart countdown with penalty if desired
                VerificationResult.InvalidPin(attemptsRemaining = 2)
            }
        }
    }

    fun cancelManually() {
        countdownJob?.cancel()
        currentState = State.IDLE
        remainingSeconds = 10
        onStateChanged?.invoke(currentState)
    }
}
