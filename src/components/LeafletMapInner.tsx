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

      // CartoDB Positron: crisp, minimal, high-contrast, non-distracting
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
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
        const color = isSafe ? '#059669' : '#DC2626';
        const weight = isSafe ? 4 : 3;
        const dashArray = isSafe ? undefined : '4, 4';

        const polyline = L.polyline([segment.startCoord, segment.endCoord], {
          color,
          weight,
          opacity: 0.8,
          dashArray,
        });

        polyline.bindTooltip(
          `<div style="font-family: inherit; font-size: 11px; padding: 2px 4px;">
            <strong>${segment.name}</strong><br/>
            Lighting: ${segment.lightingPercentage}% (${segment.lightingStatus})<br/>
            Score: ${segment.environmentalScore}/100
          </div>`,
          { className: 'safie-map-tooltip' }
        );

        layerGroup.addLayer(polyline);
      });
    }

    // 2. Draw Safe Havens
    if (showHavens) {
      DELHI_NCR_SAFE_HAVENS.forEach((haven) => {
        // Crisp line icon shield SVG without emojis or glowing shadows
        const iconHtml = `
          <div style="width: 28px; height: 28px; border-radius: 9999px; background-color: #059669; border: 2px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-haven-pin',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([haven.lat, haven.lng], { icon: customIcon });

        marker.on('click', () => {
          onSelectHaven(haven);
        });

        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px 6px; max-width: 220px; color: #1C1917;">
            <div style="font-size: 10px; font-weight: 600; color: #059669; text-transform: uppercase; letter-spacing: 0.05em;">
              ${haven.categoryLabel} · Verified 24/7
            </div>
            <div style="font-size: 13px; font-weight: 600; margin: 2px 0 4px 0;">
              ${haven.name}
            </div>
            <div style="font-size: 11px; color: #57534E; margin-bottom: 6px;">
              ${haven.address}
            </div>
            <div style="font-size: 10px; color: #E11D48; font-weight: 600;">
              Codeword: "Ask for Angela"
            </div>
            <div style="font-size: 11px; color: #1C1917; font-weight: 500; margin-top: 4px;">
              Direct: ${haven.phone}
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
        color: routeType === 'safest' ? '#059669' : '#DC2626',
        weight: 5,
        opacity: 0.85,
      });

      routePolyline.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; padding: 2px 4px;">
          <strong>${routeData.title}</strong><br/>
          Duration: ${routeData.durationMinutes} mins · Distance: ${routeData.distanceKm} km<br/>
          Lighting: ${routeData.litPercentage}% · Safety Score: ${routeData.score}/100
        </div>`,
        { permanent: false, sticky: true }
      );

      layerGroup.addLayer(routePolyline);

      // Start & End Pins
      const startCoord = routeData.coordinates[0];
      const endCoord = routeData.coordinates[routeData.coordinates.length - 1];

      const startIcon = L.divIcon({
        html: `<div style="width: 22px; height: 22px; border-radius: 9999px; background-color: #2563EB; border: 2px solid #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 10px; color: #FFFFFF; font-weight: 600;">A</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const endIcon = L.divIcon({
        html: `<div style="width: 22px; height: 22px; border-radius: 9999px; background-color: #059669; border: 2px solid #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; font-size: 10px; color: #FFFFFF; font-weight: 600;">B</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      layerGroup.addLayer(L.marker(startCoord, { icon: startIcon }));
      layerGroup.addLayer(L.marker(endCoord, { icon: endIcon }));
    }
  }, [city, showLighting, showHavens, routeType, onSelectHaven]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
