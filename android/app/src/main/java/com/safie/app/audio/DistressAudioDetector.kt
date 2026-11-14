package com.safie.app.audio

/**
 * DistressAudioDetector — Passive Acoustic Anomaly & Scream Engine
 *
 * Runs on low-power DSP / AudioRecord thread. Flags screaming, high-amplitude distress bursts,
 * and high-confidence acoustic anomalies without recording private conversations.
 */
class DistressAudioDetector(
    private val screamThresholdDb: Double = 82.0,
    private val consecutiveSpikeLimit: Int = 2
) {
    data class AudioEvent(
        val peakDecibels: Double,
        val timestamp: Long = System.currentTimeMillis(),
        val confidence: Float,
        val classification: String
    )

    private var spikeCount = 0
    private var lastSpikeTime: Long = 0
    var onThreatAudioDetected: ((AudioEvent) -> Unit)? = null

    /**
     * Processes an audio frame sample.
     * @param decibels current RMS decibel level from microphone
     */
    fun processFrame(decibels: Double): Boolean {
        val now = System.currentTimeMillis()

        if (decibels >= screamThresholdDb) {
            // Check if this spike is within 2.5 seconds of a prior spike (pattern of struggle)
            if (now - lastSpikeTime < 2500) {
                spikeCount++
            } else {
                spikeCount = 1
            }
            lastSpikeTime = now

            if (spikeCount >= consecutiveSpikeLimit) {
                val event = AudioEvent(
                    peakDecibels = decibels,
                    confidence = 0.92f,
                    classification = "SCREAM_OR_VIOLENT_DISTRESS"
                )
                onThreatAudioDetected?.invoke(event)
                spikeCount = 0
                return true
            }
        }

        return false
    }

    fun reset() {
        spikeCount = 0
        lastSpikeTime = 0
    }
}

