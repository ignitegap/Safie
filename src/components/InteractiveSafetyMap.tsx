'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Shield,
  MapPin,
  Sun,
  Layers,
  CheckCircle,
} from 'lucide-react';
import {
  DELHI_NCR_SAFE_HAVENS,
  SafeHaven,
} from '@/lib/data-delhi-ncr';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center text-stone-500 gap-3">
      <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium">Loading Delhi-NCR Safety Intelligence Map...</p>
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
    <section id="map" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-mono font-bold tracking-wider uppercase">
          <MapPin className="w-3.5 h-3.5" />
          <span>Real-World Geospatial Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Delhi & Gurugram Live Safety Topology
        </h2>
        <p className="text-base text-stone-600">
          Powered by GMDA CCMS Smart Streetlight telemetry, Delhi Police CCTV registries, and verified 24/7 Safe Haven sanctuaries.
        </p>
      </div>

      {/* Map Control Bar */}
      <div className="mb-4 p-4 rounded-3xl bg-white border border-rose-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* City Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono">
            Territory:
          </span>
          <button
            onClick={() => setSelectedCity('gurugram')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCity === 'gurugram'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-stone-700 hover:bg-rose-100'
            }`}
          >
            Gurugram (Cyber City / Golf Course)
          </button>
          <button
            onClick={() => setSelectedCity('delhi')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCity === 'delhi'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-stone-700 hover:bg-rose-100'
            }`}
          >
            Delhi (Rajiv Chowk / Hauz Khas / Saket)
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLightingLayer(!showLightingLayer)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              showLightingLayer
                ? 'bg-rose-100 border-rose-300 text-rose-800'
                : 'bg-white border-stone-200 text-stone-500'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-rose-600" />
            <span>Streetlight CCMS (65k Poles)</span>
          </button>

          <button
            onClick={() => setShowSafeHavens(!showSafeHavens)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              showSafeHavens
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-stone-200 text-stone-500'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Safe Havens (24/7)</span>
          </button>

          <button
            onClick={() =>
              setActiveRouteType(activeRouteType === 'safest' ? 'fastest' : 'safest')
            }
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              activeRouteType === 'safest'
                ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                : 'bg-stone-900 border-stone-900 text-white'
            }`}
          >
            <span>{activeRouteType === 'safest' ? 'Safest Route' : 'Fastest (Unlit)'}</span>
          </button>
        </div>

      </div>

      {/* Main Map + Side Haven Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 h-[520px] rounded-3xl overflow-hidden border border-rose-200 relative shadow-sm">
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
          <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-rose-600">
                {activeHavenDetail ? 'Haven Selected' : 'Nearby Haven Spotlight'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Verified 24/7
              </span>
            </div>

            {activeHavenDetail ? (
              <div className="space-y-2">
                <h4 className="text-lg font-black text-stone-900">{activeHavenDetail.name}</h4>
                <p className="text-xs text-stone-600">{activeHavenDetail.address}</p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                    <span className="text-stone-500 block text-[10px]">Type</span>
                    <strong className="text-rose-700 font-mono text-xs">
                      {activeHavenDetail.categoryLabel}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-100">
                    <span className="text-stone-500 block text-[10px]">Staff Protocol</span>
                    <strong className="text-rose-700 font-mono text-xs">Ask for Angela</strong>
                  </div>
                </div>
                <div className="pt-2">
                  <a
                    href={`tel:${activeHavenDetail.phone}`}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Direct Emergency Call: {activeHavenDetail.phone}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-base font-bold text-stone-900">Apollo Pharmacy 24/7 (DLF Cyber Hub)</h4>
                <p className="text-xs text-stone-600">
                  Shop 14, Building 8B, DLF Cyber City, Gurugram.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>On-Duty Pharmacist + CCTV Security + Direct Police Buzzer</span>
                </div>
                <p className="text-[11px] text-stone-500 pt-1">
                  Click any marker on the map to inspect refuge capabilities and emergency phone numbers.
                </p>
              </div>
            )}
          </div>

          {/* Route Comparison Metrics Box */}
          <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-600" />
              <span>Safety Scoring vs Standard Navigation</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <div>
                  <span className="font-bold text-stone-900">Safie Safe Route</span>
                  <p className="text-[10px] text-stone-500">Via 96% CCMS Lit Streets</p>
                </div>
                <span className="font-mono font-bold text-rose-600 text-base">Score 86/100</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-bold text-stone-700">Standard Shortcut</span>
                  <p className="text-[10px] text-stone-500">Includes 2 unlit alley detours</p>
                </div>
                <span className="font-mono font-bold text-stone-500 text-base">Score 26/100</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 italic">
              "Safie trades an acceptable 2.5 min delta for a 73% drop in unlit alley exposure."
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
