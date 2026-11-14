package com.safie.app.mesh

import java.util.UUID

/**
 * BleMeshRelay — Zero-Data Bluetooth Low Energy Multi-Hop Emergency Protocol
 *
 * Designed for blackout scenarios or when cellular data is cut off in basements / unlit alleys.
 * Emergency SOS packets hop device-to-device with a maximum Time-To-Live (TTL) of 5 hops.
 */
class BleMeshRelay(
    private val maxHops: Int = 5
) {
    data class SosPacket(
        val packetId: String = UUID.randomUUID().toString().substring(0, 8),
        val senderHash: String,
        val timestamp: Long = System.currentTimeMillis(),
        val latitude: Double,
        val longitude: Double,
        val threatTier: Int, // 1 to 3
        val isDuress: Boolean,
        val hopCount: Int = 0
    )

    private val seenPacketIds = mutableSetOf<String>()
    var onPacketRelayed: ((SosPacket) -> Unit)? = null
    var onInternetUplinkDispatched: ((SosPacket) -> Unit)? = null

    /**
     * Originates a new SOS packet from this device.
     */
    fun createOriginPacket(
        senderHash: String,
        lat: Double,
        lng: Double,
        threatTier: Int,
        isDuress: Boolean
    ): SosPacket {
        val packet = SosPacket(
            senderHash = senderHash,
            latitude = lat,
            longitude = lng,
            threatTier = threatTier,
            isDuress = isDuress,
            hopCount = 0
        )
        seenPacketIds.add(packet.packetId)
        return packet
    }

    /**
     * Called when a nearby device advertises an SOS mesh packet over BLE.
     * Returns true if packet was valid and relayed; false if duplicate or expired.
     */
    fun processReceivedPacket(packet: SosPacket, hasActiveInternet: Boolean): Boolean {
        // 1. Loop prevention / Deduplication
        if (seenPacketIds.contains(packet.packetId)) {
            return false // Already processed; drop to prevent mesh storming
        }
        seenPacketIds.add(packet.packetId)

        // 2. Hop limit check (TTL)
        if (packet.hopCount >= maxHops) {
            return false // Packet exceeded max range
        }

        // 3. If THIS node has active cellular/Wi-Fi, bridge to Safie Neon cloud immediately!
        if (hasActiveInternet) {
            onInternetUplinkDispatched?.invoke(packet)
        }

        // 4. Increment hop and re-broadcast over BLE to extend range
        val relayedPacket = packet.copy(hopCount = packet.hopCount + 1)
        onPacketRelayed?.invoke(relayedPacket)
        return true
    }

    fun getSeenPacketCount(): Int = seenPacketIds.size

    fun clearHistory() {
        seenPacketIds.clear()
    }
}
