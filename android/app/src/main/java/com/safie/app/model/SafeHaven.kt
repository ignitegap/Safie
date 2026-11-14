package com.safie.app.model

data class SafeHaven(
    val id: String,
    val name: String,
    val category: HavenCategory,
    val categoryLabel: String,
    val latitude: Double,
    val longitude: Double,
    val address: String,
    val phone: String,
    val is24Hours: Boolean = true,
    val isVerified: Boolean = true,
    val hasAngelaProtocol: Boolean = true,
    val hasCctv: Boolean = true,
    val hasFirstAid: Boolean = true
)

enum class HavenCategory {
    PHARMACY_247,
    METRO_SECURITY,
    HOSPITAL_ER,
    PETROL_STATION,
    COMMERCIAL_RETAIL
}

