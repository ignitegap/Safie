package com.safie.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.safie.app.mesh.BleMeshRelay
import com.safie.app.security.SafetyHoldManager

class MainActivity : ComponentActivity() {

    private lateinit var holdManager: SafetyHoldManager
    private lateinit var meshRelay: BleMeshRelay

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        holdManager = SafetyHoldManager(
            normalPin = "1234",
            duressPin = "9876"
        )

        meshRelay = BleMeshRelay(maxHops = 5)

        setContent {
            SafieAppScreen()
        }
    }

    @Composable
    fun SafieAppScreen() {
        MaterialTheme(
            colorScheme = lightColorScheme(
                primary = Color(0xFFE11D48),
                surface = Color(0xFFFFF1F2),
                background = Color(0xFFF9F7F2)
            )
        ) {
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = Color(0xFFF9F7F2)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // Header
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(top = 40.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = Color(0xFFFFF1F2),
                            border = ButtonDefaults.outlinedButtonBorder
                        ) {
                            Text(
                                text = "SAFIE MOBILE ESCORT",
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFFE11D48)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = "Walk with Certainty",
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF1E293B)
                        )

                        Text(
                            text = "Delhi NCR Pilot • GMDA SCADA Connected",
                            fontSize = 13.sp,
                            color = Color(0xFF64748B),
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }

                    // Main Status Card
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(20.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "Active Shield Status",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF64748B)
                            )
                            
                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "Protected by BLE Mesh & Safe Sanctuaries",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color(0xFF0F172A),
                                textAlign = TextAlign.Center
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceEvenly
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("96%", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF059669))
                                    Text("Lit Corridor", fontSize = 11.sp, color = Color(0xFF64748B))
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("28", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFFE11D48))
                                    Text("Havens Online", fontSize = 11.sp, color = Color(0xFF64748B))
                                }
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("BLE Hop", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF2563EB))
                                    Text("Zero-Data Mesh", fontSize = 11.sp, color = Color(0xFF64748B))
                                }
                            }
                        }
                    }

                    // Bottom Safety Hold Action
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(bottom = 30.dp)
                    ) {
                        Button(
                            onClick = {},
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE11D48)),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(56.dp)
                        ) {
                            Text(
                                text = "Hold Thumb to Arm (Safety Switch)",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color.White
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Text(
                            text = "Release invokes 10s countdown. Covert Duress PIN: 9876",
                            fontSize = 11.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }
                }
            }
        }
    }
}
