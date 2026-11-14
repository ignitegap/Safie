'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  DELHI_NCR_SAFE_HAVENS,
  GURUGRAM_ROAD_SEGMENTS,
  SAMPLE_ROUTE_CANDIDATES,
  SafeHaven,
} from '@/lib/data-delhi-ncr';

interface LeafletMapInnerProps {
  city: 'gurugram' | 'delhi';
  showLighting: boolean;
  showHavens: boolean;
  routeType: 'safest' | 'fastest';
  onSelectHaven: (haven: SafeHaven) => void;
}

export default function LeafletMapInner({
  city,
  showLighting,
  showHavens,
  routeType,
  onSelectHaven,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const centerCoords: [number, number] =
        city === 'gurugram' ? [28.490, 77.088] : [28.630, 77.218];

      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: city === 'gurugram' ? 14 : 13,
        zoomControl: true,
        attributionControl: false,
      });

      // CartoDB Dark Matter / Positron tiles for high-contrast safety rendering
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center when city changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const centerCoords: [number, number] =
      city === 'gurugram' ? [28.490, 77.088] : [28.630, 77.218];
    mapInstanceRef.current.setView(centerCoords, city === 'gurugram' ? 14 : 13);
  }, [city]);

  // Redraw Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // 1. Draw Road Segments (Lighting & Safety)
    if (showLighting) {
      GURUGRAM_ROAD_SEGMENTS.forEach((segment) => {
        const isSafe = segment.environmentalScore >= 70;
        const color = isSafe ? '#10B981' : '#E53935';
        const weight = isSafe ? 5 : 4;
        const dashArray = isSafe ? undefined : '6, 6';

        const polyline = L.polyline([segment.startCoord, segment.endCoord], {
          color,
          weight,
          opacity: 0.85,
          dashArray,
        });

        polyline.bindTooltip(
          `<strong>${segment.name}</strong><br/>Lighting: ${segment.lightingPercentage}% (${segment.lightingStatus})<br/>Score: ${segment.environmentalScore}/100`,
          { className: 'leaflet-tooltip-dark' }
        );

        layerGroup.addLayer(polyline);
      });
    }

    // 2. Draw Safe Havens
    if (showHavens) {
      DELHI_NCR_SAFE_HAVENS.forEach((haven) => {
        const iconHtml = `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.8)] border-2 border-white cursor-pointer hover:scale-110 transition-transform">
            <span style="font-size: 14px;">🛡️</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-haven-pin',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([haven.lat, haven.lng], { icon: customIcon });

        marker.on('click', () => {
          onSelectHaven(haven);
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="font-size: 10px; font-weight: bold; color: #10B981; text-transform: uppercase;">
              ${haven.categoryLabel} · 24/7 VERIFIED
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #FFFFFF; margin: 2px 0;">
              ${haven.name}
            </div>
            <div style="font-size: 11px; color: #94A3B8; margin-bottom: 6px;">
              ${haven.address}
            </div>
            <div style="font-size: 10px; color: #C084FC; font-weight: 600;">
              Codeword: "Ask for Angela"
            </div>
            <div style="font-size: 10px; color: #38BDF8; margin-top: 4px;">
              Emergency: ${haven.phone}
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 3. Draw Active Route Candidates
    const routeData =
      routeType === 'safest'
        ? SAMPLE_ROUTE_CANDIDATES[0]
        : SAMPLE_ROUTE_CANDIDATES[2];

    if (routeData) {
      const routePolyline = L.polyline(routeData.coordinates, {
        color: routeType === 'safest' ? '#10B981' : '#E53935',
        weight: 7,
        opacity: 0.9,
      });

      routePolyline.bindTooltip(
        `<strong>${routeData.title}</strong><br/>Duration: ${routeData.durationMinutes} mins · Distance: ${routeData.distanceKm} km<br/>Lighting: ${routeData.litPercentage}% · Safety Score: ${routeData.score}/100`,
        { permanent: false, sticky: true }
      );

      layerGroup.addLayer(routePolyline);

      // Start & End Pins
      const startCoord = routeData.coordinates[0];
      const endCoord = routeData.coordinates[routeData.coordinates.length - 1];

      const startIcon = L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">A</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const endIcon = L.divIcon({
        html: `<div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">B</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      layerGroup.addLayer(L.marker(startCoord, { icon: startIcon }));
      layerGroup.addLayer(L.marker(endCoord, { icon: endIcon }));
    }
  }, [city, showLighting, showHavens, routeType, onSelectHaven]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
