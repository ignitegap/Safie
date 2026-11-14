'use client';

import React from 'react';
import {
  Smartphone,
  Download,
  ArrowRight,
  Shield,
  Lightbulb,
  Clock,
  Radio,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDemo: () => void;
  onOpenAuth: () => void;
}

export default function HeroSection({ onOpenDemo, onOpenAuth }: HeroSectionProps) {
  return (
    <section id="hero" className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        
        {/* Territory Status Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-xs font-mono text-stone-600">
          <span className="w-2 h-2 rounded-full bg-rose-600" />
          <span>Delhi NCR · Gurugram CCMS Integration</span>
        </div>

        {/* Calm, Grounded Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 tracking-tight leading-[1.15]">
          Pedestrian routing for safety, not just speed.
        </h1>

        {/* Clear, Specific Subhead */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed font-normal">
          Designed for commuters and women walking after dark in Delhi and Gurugram. Routes prioritize verified illuminated streets, a 10-second dead man's switch, and 24/7 guarded sanctuaries.
        </p>

        {/* Primary and Secondary Actions Only */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Primary Action */}
          <button
            onClick={onOpenDemo}
            className="h-11 px-5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-white" />
            <span>Launch Phone Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Secondary Action */}
          <a
            href="/downloads/safie-release.apk"
            download="Safie-v1.0-delhi-ncr.apk"
            className="h-11 px-5 rounded-lg bg-white hover:bg-rose-50 text-stone-800 font-medium text-sm border border-rose-200 hover:border-rose-300 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Download Android APK</span>
            <span className="text-[11px] font-mono text-stone-400">v1.0</span>
          </a>
        </div>

        {/* Real Product Architecture Points */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>10-second Safety Hold switch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Duress PIN 9876 alert</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>28 verified safe havens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Offline BLE mesh fallback</span>
          </div>
        </div>

        {/* Real Metrics Row on 4px Grid */}
        <div className="w-full mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-white border border-rose-200/80">
          
          <div className="text-left p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/60">
            <span className="text-[11px] font-mono text-stone-500 block">
              Streetlights Mapped
            </span>
            <span className="text-2xl font-semibold text-stone-900 font-mono tracking-tight block mt-1 tabular-nums">
              65,420
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              GMDA CCMS Smart Poles
            </span>
          </div>

          <div className="text-left p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/60">
            <span className="text-[11px] font-mono text-stone-500 block">
              Safe Sanctuaries
            </span>
            <span className="text-2xl font-semibold text-stone-900 font-mono tracking-tight block mt-1 tabular-nums">
              28
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              24/7 Verified Counters
            </span>
          </div>

          <div className="text-left p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/60">
            <span className="text-[11px] font-mono text-stone-500 block">
              Route Detour Cap
            </span>
            <span className="text-2xl font-semibold text-stone-900 font-mono tracking-tight block mt-1 tabular-nums">
              +2.5 min
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Maximum Pedestrian Delta
            </span>
          </div>

          <div className="text-left p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/60">
            <span className="text-[11px] font-mono text-stone-500 block">
              SOS Latency
            </span>
            <span className="text-2xl font-semibold text-stone-900 font-mono tracking-tight block mt-1 tabular-nums">
              42 ms
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Neon Cloud Edge Relay
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
