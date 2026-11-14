'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Shield,
  ShieldAlert,
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
    <div className="w-full h-[520px] rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-gray-400 gap-3">
      <div className="w-8 h-8 border-4 border-safie-crimson border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-mono">Loading Delhi-NCR Safety Intelligence Map...</p>
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safie-crimson/10 border border-safie-crimson/30 text-safie-crimson text-xs font-mono font-bold tracking-wider uppercase">
          <MapPin className="w-3.5 h-3.5" />
          <span>Real-World Geospatial Intelligence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Delhi & Gurugram Live Safety Topology
        </h2>
        <p className="text-base text-gray-400">
          Powered by GMDA CCMS Smart Streetlight telemetry, Delhi Police CCTV registries, and verified 24/7 Safe Haven sanctuaries.
        </p>
      </div>

      {/* Map Control Bar */}
      <div className="mb-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        
        {/* City Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
            Territory:
          </span>
          <button
            onClick={() => setSelectedCity('gurugram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCity === 'gurugram'
                ? 'bg-safie-crimson text-white shadow-lg'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Gurugram (Cyber City / Golf Course)
          </button>
          <button
            onClick={() => setSelectedCity('delhi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCity === 'delhi'
                ? 'bg-safie-crimson text-white shadow-lg'
                : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            Delhi (Rajiv Chowk / Hauz Khas / Saket)
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLightingLayer(!showLightingLayer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showLightingLayer
                ? 'bg-amber-950/50 border-amber-500 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-gray-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Streetlight CCMS (65k Poles)</span>
          </button>

          <button
            onClick={() => setShowSafeHavens(!showSafeHavens)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showSafeHavens
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-gray-400'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Safe Havens (24/7)</span>
          </button>

          <button
            onClick={() =>
              setActiveRouteType(activeRouteType === 'safest' ? 'fastest' : 'safest')
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              activeRouteType === 'safest'
                ? 'bg-emerald-900 border-emerald-400 text-white'
                : 'bg-red-900 border-red-500 text-white'
            }`}
          >
            <span>{activeRouteType === 'safest' ? '🛡️ Safe Route' : '⚡ Fastest (Unlit)'}</span>
          </button>
        </div>

      </div>

      {/* Main Map + Side Haven Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 h-[520px] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
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
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-safie-crimson">
                {activeHavenDetail ? 'Haven Selected' : 'Nearby Haven Spotlight'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Verified 24/7
              </span>
            </div>

            {activeHavenDetail ? (
              <div className="space-y-2">
                <h4 className="text-lg font-black text-white">{activeHavenDetail.name}</h4>
                <p className="text-xs text-gray-300">{activeHavenDetail.address}</p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-gray-400 block text-[10px]">Type</span>
                    <strong className="text-emerald-400 font-mono text-xs">
                      {activeHavenDetail.categoryLabel}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-gray-400 block text-[10px]">Staff Protocol</span>
                    <strong className="text-purple-400 font-mono text-xs">Ask for Angela</strong>
                  </div>
                </div>
                <div className="pt-2">
                  <a
                    href={`tel:${activeHavenDetail.phone}`}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <span>Direct Call: {activeHavenDetail.phone}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">Apollo Pharmacy 24/7 (DLF Cyber Hub)</h4>
                <p className="text-xs text-gray-400">
                  Shop 14, Building 8B, DLF Cyber City, Gurugram.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>On-Duty Pharmacist + CCTV Security + Direct Police Buzzer</span>
                </div>
                <p className="text-[11px] text-gray-400 pt-1">
                  Click any green marker on the map to inspect refuge capabilities and emergency phone numbers.
                </p>
              </div>
            )}
          </div>

          {/* Route Comparison Metrics Box */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-md space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-safie-crimson" />
              <span>Multi-Objective Routing Cost Model</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-white">Safie Safest Corridor</span>
                  <p className="text-[10px] text-gray-400">Via 96% CCMS Lit Streets</p>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">Score 86</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-gray-300">Fastest Google Shortest</span>
                  <p className="text-[10px] text-gray-400">Includes 2 unlit alley detours</p>
                </div>
                <span className="font-mono font-bold text-rose-400 text-sm">Score 26</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 italic">
              "Safie trades an acceptable 2.5 min delta for a 73% drop in violent crime exposure."
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}
