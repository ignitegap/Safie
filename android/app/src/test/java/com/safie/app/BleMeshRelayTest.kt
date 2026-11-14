package com.safie.app

import com.safie.app.mesh.BleMeshRelay
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class BleMeshRelayTest {

    private lateinit var meshRelay: BleMeshRelay

    @Before
    fun setUp() {
        meshRelay = BleMeshRelay(maxHops = 5)
    }

    @Test
    fun testOriginPacketCreatedWithZeroHops() {
        val packet = meshRelay.createOriginPacket(
            senderHash = "citizen_hash_981",
            lat = 28.4958,
            lng = 77.0895,
            threatTier = 3,
            isDuress = false
        )

        assertEquals(0, packet.hopCount)
        assertEquals(3, packet.threatTier)
        assertEquals(1, meshRelay.getSeenPacketCount())
    }

    @Test
    fun testDuplicatePacketDropped() {
        val packet = meshRelay.createOriginPacket(
            senderHash = "citizen_hash_981",
            lat = 28.4958,
            lng = 77.0895,
            threatTier = 3,
            isDuress = false
        )

        // Attempting to re-process the exact same packet ID
        val wasProcessed = meshRelay.processReceivedPacket(packet, hasActiveInternet = false)
        assertFalse("Duplicate packet must be dropped to prevent network storming", wasProcessed)
    }

    @Test
    fun testPacketReachingMaxHopsIsDropped() {
        val incomingPacket = BleMeshRelay.SosPacket(
            packetId = "pkt_external_123",
            senderHash = "remote_victim_456",
            latitude = 28.4816,
            longitude = 77.0932,
            threatTier = 2,
            isDuress = true,
            hopCount = 5 // Already at max TTL
        )

        val relayed = meshRelay.processReceivedPacket(incomingPacket, hasActiveInternet = false)
        assertFalse("Packet with hopCount == maxHops must not be re-relayed", relayed)
    }

    @Test
    fun testActiveInternetNodeDispatchesUplink() {
        var uplinkCalled = false
        meshRelay.onInternetUplinkDispatched = {
            uplinkCalled = true
        }

        val incomingPacket = BleMeshRelay.SosPacket(
            packetId = "pkt_new_789",
            senderHash = "isolated_user",
            latitude = 28.4720,
            longitude = 77.0725,
            threatTier = 3,
            isDuress = false,
            hopCount = 2
        )

        val relayed = meshRelay.processReceivedPacket(incomingPacket, hasActiveInternet = true)
        assertTrue(relayed)
        assertTrue("Node with internet must bridge BLE mesh packet to cloud uplink", uplinkCalled)
    }
}
