'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SafeHaven } from '@/lib/data-delhi-ncr';

interface LeafletMapInnerProps {
  city: 'gurugram' | 'delhi' | 'worldwide';
  showLighting: boolean;
  showHavens: boolean;
  routeType: string;
  routeData: any;
  safeHavens: SafeHaven[];
  userLocation?: [number, number] | null;
  onSelectHaven: (haven: SafeHaven) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

export default function LeafletMapInner({
  city,
  showLighting,
  showHavens,
  routeType,
  routeData,
  safeHavens,
  userLocation,
  onSelectHaven,
  onMapClick,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const centerCoords: [number, number] =
        city === 'gurugram'
          ? [28.490, 77.088]
          : city === 'delhi'
          ? [28.630, 77.218]
          : [28.490, 77.088];

      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: city === 'gurugram' ? 14 : 13,
        zoomControl: true,
        attributionControl: false,
      });

      // Free, reliable OpenStreetMap standard tiles (Zero watermarks, works worldwide)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Map click handler to set custom destinations/origins
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      });

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

  // Update Center when city changes (if no active route bounds)
  useEffect(() => {
    if (!mapInstanceRef.current || routeData?.coordinates?.length) return;
    const centerCoords: [number, number] =
      city === 'gurugram'
        ? [28.490, 77.088]
        : city === 'delhi'
        ? [28.630, 77.218]
        : [28.490, 77.088];
    mapInstanceRef.current.setView(centerCoords, city === 'gurugram' ? 14 : 13);
  }, [city, routeData]);

  // Redraw Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();
    const map = mapInstanceRef.current;

    // 1. Draw Safe Havens
    if (showHavens && safeHavens && safeHavens.length > 0) {
      safeHavens.forEach((haven) => {
        const iconHtml = `
          <div style="width: 26px; height: 26px; border-radius: 9999px; background-color: #059669; border: 2px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-haven-pin',
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([haven.lat, haven.lng], { icon: customIcon });

        marker.on('click', () => {
          onSelectHaven(haven);
        });

        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; max-width: 220px; color: #1C1917;">
            <div style="font-size: 10px; font-weight: 600; color: #059669; text-transform: uppercase;">
              ${haven.categoryLabel} · 24/7 Verified
            </div>
            <div style="font-size: 13px; font-weight: 600; margin: 2px 0 4px 0;">
              ${haven.name}
            </div>
            <div style="font-size: 11px; color: #57534E; margin-bottom: 4px;">
              ${haven.address}
            </div>
            <div style="font-size: 10px; color: #E11D48; font-weight: 600;">
              Ask for Angela Safe Haven
            </div>
            <div style="font-size: 11px; color: #1C1917; font-weight: 500; margin-top: 4px;">
              Direct: ${haven.phone}
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 2. Draw Active Route Polyline
    if (routeData && routeData.coordinates && routeData.coordinates.length > 0) {
      const isBest = routeType === 'best_supported' || routeType === 'safest';
      const isBalanced = routeType === 'balanced';
      const polyColor = isBest ? '#059669' : isBalanced ? '#2563EB' : '#DC2626';

      const routePolyline = L.polyline(routeData.coordinates, {
        color: polyColor,
        weight: 5,
        opacity: 0.9,
        dashArray: isBest ? undefined : isBalanced ? undefined : '6, 6',
      });

      routePolyline.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; padding: 2px 4px;">
          <strong>${routeData.title}</strong><br/>
          Duration: ${routeData.durationMinutes} mins · Distance: ${routeData.distanceKm} km<br/>
          Lighting: ${routeData.litPercentage}% · Support Index: ${routeData.score}/100
        </div>`,
        { permanent: false, sticky: true }
      );

      layerGroup.addLayer(routePolyline);

      // Start & End Pins
      const startCoord = routeData.coordinates[0];
      const endCoord = routeData.coordinates[routeData.coordinates.length - 1];

      const startIcon = L.divIcon({
        html: `<div style="width: 24px; height: 24px; border-radius: 9999px; background-color: #2563EB; border: 2px solid #FFFFFF; box-shadow: 0 2px 5px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 11px; color: #FFFFFF; font-weight: 600;">A</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const endIcon = L.divIcon({
        html: `<div style="width: 24px; height: 24px; border-radius: 9999px; background-color: #E11D48; border: 2px solid #FFFFFF; box-shadow: 0 2px 5px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; font-size: 11px; color: #FFFFFF; font-weight: 600;">B</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      layerGroup.addLayer(L.marker(startCoord, { icon: startIcon }));
      layerGroup.addLayer(L.marker(endCoord, { icon: endIcon }));

      // Auto-fit bounds
      const bounds = L.latLngBounds(routeData.coordinates);
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    // 3. Draw Live GPS User Location (Pulsing Blue Dot)
    if (userLocation && userLocation.length === 2) {
      const liveUserIcon = L.divIcon({
        html: `
          <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background-color: rgba(37, 99, 235, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 14px; height: 14px; border-radius: 50%; background-color: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        className: 'custom-live-user-pin',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const userMarker = L.marker(userLocation, { icon: liveUserIcon, zIndexOffset: 1000 });
      userMarker.bindTooltip('<strong>You are here (Live GPS)</strong>', { permanent: false });
      layerGroup.addLayer(userMarker);
    }
  }, [showHavens, safeHavens, routeData, routeType, userLocation]);

  return <div ref={mapContainerRef} className="w-full h-[520px] rounded-2xl relative z-10" />;
}
