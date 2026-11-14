'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Shield,
  MapPin,
  Sun,
  Layers,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import {
  DELHI_NCR_SAFE_HAVENS,
  SafeHaven,
} from '@/lib/data-delhi-ncr';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-white border border-rose-200/80 flex flex-col items-center justify-center text-stone-500 gap-3">
      <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-medium">Loading Delhi-NCR Safety Topology...</p>
    </div>
  ),
});

export default function InteractiveSafetyMap() {
  const [selectedCity, setSelectedCity] = useState<'gurugram' | 'delhi'>('gurugram');
  const [showLightingLayer, setShowLightingLayer] = useState(true);
  const [showSafeHavens, setShowSafeHavens] = useState(true);
  const [activeRouteType, setActiveRouteType] = useState<'safest' | 'fastest'>('safest');
  const [activeHavenDetail, setActiveHavenDetail] = useState<SafeHaven | null>(null);

  return (
    <section id="map" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-rose-700 text-xs font-mono">
          <MapPin className="w-3.5 h-3.5" />
          <span>Geospatial Safety Topology</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          Delhi and Gurugram Live Corridor Map
        </h2>
        <p className="text-sm text-stone-600">
          Streetlight telemetry from GMDA CCMS smart poles and 28 verified 24/7 safe sanctuaries.
        </p>
      </div>

      {/* Map Control Bar */}
      <div className="mb-4 p-3 rounded-2xl bg-white border border-rose-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* City Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-stone-500 mr-1">
            Territory:
          </span>
          <button
            onClick={() => setSelectedCity('gurugram')}
            className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedCity === 'gurugram'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
            }`}
          >
            Gurugram Cyber City
          </button>
          <button
            onClick={() => setSelectedCity('delhi')}
            className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedCity === 'delhi'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
            }`}
          >
            Delhi Rajiv Chowk
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLightingLayer(!showLightingLayer)}
            className={`h-8 px-3 rounded-lg font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
              showLightingLayer
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-white border-stone-200 text-stone-500'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-rose-600" />
            <span>Streetlight CCMS</span>
          </button>

          <button
            onClick={() => setShowSafeHavens(!showSafeHavens)}
            className={`h-8 px-3 rounded-lg font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
              showSafeHavens
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-stone-200 text-stone-500'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safe Havens</span>
          </button>

          <button
            onClick={() =>
              setActiveRouteType(activeRouteType === 'safest' ? 'fastest' : 'safest')
            }
            className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
              activeRouteType === 'safest'
                ? 'bg-stone-900 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <span>{activeRouteType === 'safest' ? 'Showing: Safest Route' : 'Showing: Fastest Shortcut'}</span>
          </button>
        </div>

      </div>

      {/* Main Map + Side Haven Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 h-[500px] rounded-2xl overflow-hidden border border-rose-200/80 relative bg-white">
          <LeafletMapInner
            city={selectedCity}
            showLighting={showLightingLayer}
            showHavens={showSafeHavens}
            routeType={activeRouteType}
            onSelectHaven={(haven: SafeHaven) => setActiveHavenDetail(haven)}
          />
        </div>

        {/* Side Panel: Safe Haven Details & Live Candidate Metrics */}
        <div className="space-y-4">
          
          {/* Active Haven Spotlight */}
          <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-500">
                {activeHavenDetail ? 'Selected Haven' : 'Nearby Sanctuary'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified 24/7
              </span>
            </div>

            {activeHavenDetail ? (
              <div className="space-y-2 text-xs">
                <h4 className="text-base font-semibold text-stone-900">{activeHavenDetail.name}</h4>
                <p className="text-stone-600">{activeHavenDetail.address}</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                    <span className="text-stone-500 block text-[10px]">Type</span>
                    <strong className="text-stone-800 font-medium text-xs">
                      {activeHavenDetail.categoryLabel}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                    <span className="text-stone-500 block text-[10px]">Staff Protocol</span>
                    <strong className="text-rose-700 font-medium text-xs">Ask for Angela</strong>
                  </div>
                </div>
                <div className="pt-2">
                  <a
                    href={`tel:${activeHavenDetail.phone}`}
                    className="w-full h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Emergency Call: {activeHavenDetail.phone}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <h4 className="text-sm font-semibold text-stone-900">Apollo Pharmacy 24/7 (DLF Cyber Hub)</h4>
                <p className="text-stone-600">
                  Shop 14, Building 8B, DLF Cyber City, Gurugram.
                </p>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>On-duty pharmacist and direct police relay</span>
                </div>
                <p className="text-[11px] text-stone-400 pt-1">
                  Click any green marker on the map to inspect refuge capabilities and emergency contacts.
                </p>
              </div>
            )}
          </div>

          {/* Route Comparison Metrics Box */}
          <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-500" />
              <span>Route Safety Delta</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                <div>
                  <span className="font-medium text-stone-900 block">Safie Safe Route</span>
                  <span className="text-[10px] text-stone-500 block">96% illuminated corridor</span>
                </div>
                <span className="font-mono font-semibold text-rose-700 text-sm tabular-nums">Score 86/100</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-medium text-stone-700 block">Fastest Shortcut</span>
                  <span className="text-[10px] text-stone-500 block">Includes 2 unlit alley segments</span>
                </div>
                <span className="font-mono font-medium text-stone-500 text-sm tabular-nums">Score 26/100</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 leading-normal">
              Safie trades +2.5 minutes for a 73% reduction in unlit street exposure.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
