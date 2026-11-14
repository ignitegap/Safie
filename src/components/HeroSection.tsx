'use client';

import React from 'react';
import Image from 'next/image';
import {
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Download,
  MapPin,
  Radio,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDemo: () => void;
  onOpenAuth: () => void;
}

export default function HeroSection({ onOpenDemo, onOpenAuth }: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-safie-crimson/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-safie-crimson/40 shadow-[0_0_20px_rgba(229,57,53,0.2)] backdrop-blur-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-safie-crimson animate-ping" />
          <span className="text-xs font-mono font-bold tracking-wider text-gray-200 uppercase">
            Delhi · Gurugram Active Intelligence V1.0
          </span>
          <span className="text-safie-crimson font-black text-xs">● LIVE</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
          Google Maps routes for speed.{' '}
          <span className="bg-gradient-to-r from-safie-crimson via-rose-500 to-amber-400 bg-clip-text text-transparent">
            Safie routes for your life.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-xl text-gray-300 max-w-3xl leading-relaxed font-normal">
          The first pre-emptive urban safety platform combining{' '}
          <strong className="text-white font-semibold">GMDA CCMS streetlight telemetry</strong>,{' '}
          <strong className="text-white font-semibold">dead man’s switch deterrence</strong>, and{' '}
          <strong className="text-emerald-400 font-semibold">24/7 verified safe haven sanctuaries</strong>{' '}
          with offline BLE mesh dispatch across Delhi-NCR.
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          
          {/* THE DEMO TRIGGER */}
          <button
            onClick={onOpenDemo}
            className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-safie-crimson to-red-700 hover:from-red-600 hover:to-safie-crimson text-white font-black text-base shadow-[0_0_35px_rgba(229,57,53,0.5)] hover:shadow-[0_0_50px_rgba(229,57,53,0.8)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 border border-red-400/40 cursor-pointer"
          >
            <Smartphone className="w-5 h-5 animate-bounce" />
            <span>Launch Live Phone Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* DOWNLOAD APK */}
          <a
            href="/downloads/safie-release.apk"
            download="Safie-v1.0-delhi-ncr.apk"
            className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-slate-700 hover:border-slate-500 transition-all flex items-center gap-2.5 shadow-xl"
          >
            <Download className="w-5 h-5 text-safie-crimson" />
            <span>Download Android APK</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-emerald-400 border border-slate-700">
              v1.0
            </span>
          </a>

        </div>

        {/* Tactical Key Value Bullets */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>10s Safety Hold Dead Man's Switch</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-safie-crimson" />
            <span>Covert Duress PIN (9876)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
            <span>"Ask for Angela" Verified Havens</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Zero-Data BLE Mesh Relay</span>
          </div>
        </div>

        {/* Live Metrics Proof Bar */}
        <div className="w-full max-w-5xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl">
          
          <div className="text-left space-y-1 p-3 border-r border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Telemetry Grid
            </span>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">65,000+</p>
            <p className="text-xs text-gray-400">Smart Streetlights (GMDA CCMS)</p>
          </div>

          <div className="text-left space-y-1 p-3 border-r border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              Verified Refuges
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">28+</p>
            <p className="text-xs text-gray-400">24/7 Havens in Cyber City & Delhi</p>
          </div>

          <div className="text-left space-y-1 p-3 border-r border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-safie-crimson">
              Pre-Emptive Response
            </span>
            <p className="text-2xl sm:text-3xl font-black text-safie-crimson font-mono">10s</p>
            <p className="text-xs text-gray-400">Auto-Dispatch on Switch Release</p>
          </div>

          <div className="text-left space-y-1 p-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
              Coverage Resilience
            </span>
            <p className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">0-Data</p>
            <p className="text-xs text-gray-400">Hop-by-Hop BLE Mesh Relay</p>
          </div>

        </div>

      </div>

    </section>
  );
}

