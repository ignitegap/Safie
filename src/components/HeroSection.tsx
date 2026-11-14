'use client';

import React from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ArrowRight,
  Shield,
  Lightbulb,
  Lock,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDemo: () => void;
  onOpenAuth: () => void;
}

export default function HeroSection({ onOpenDemo, onOpenAuth }: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Soft warm pink glow in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-200/40 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/6 w-[350px] h-[350px] bg-pink-100/60 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
        
        {/* Soft Pink Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-200 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-stone-700">
            Delhi · Gurugram Pedestrian Safety Network
          </span>
          <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Live v1.0
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-stone-900 tracking-tight leading-[1.08]">
          Google Maps routes for speed.{' '}
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
            Safie routes for your peace of mind.
          </span>
        </h1>

        {/* Sub-headline - Human, non-slop */}
        <p className="text-base sm:text-xl text-stone-600 max-w-2xl leading-relaxed font-normal">
          Designed specifically for walking after dark in Gurugram and South Delhi. Powered by real street lighting telemetry, a 10-second safety hold, and verified 24/7 safe refuges.
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          
          {/* THE DEMO TRIGGER */}
          <button
            onClick={onOpenDemo}
            className="group px-7 py-4 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold text-base shadow-[0_8px_30px_rgba(225,29,72,0.35)] hover:shadow-[0_12px_40px_rgba(225,29,72,0.45)] hover:scale-102 active:scale-95 transition-all duration-200 flex items-center gap-3 cursor-pointer"
          >
            <Smartphone className="w-5 h-5" />
            <span>Try Interactive Phone Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* DOWNLOAD APK */}
          <a
            href="/downloads/safie-release.apk"
            download="Safie-v1.0-delhi-ncr.apk"
            className="px-6 py-4 rounded-full bg-white hover:bg-rose-50 text-stone-800 font-bold text-base border border-rose-200 hover:border-rose-300 transition-all flex items-center gap-2.5 shadow-sm"
          >
            <Download className="w-5 h-5 text-rose-600" />
            <span>Download Android APK</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-100 text-rose-700 font-bold">
              v1.0
            </span>
          </a>

        </div>

        {/* Non-slop real product highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-semibold text-stone-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
            <span>10s Dead Man's Switch</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
            <span>Covert Duress PIN (9876)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
            <span>"Ask for Angela" Verified Havens</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
            <span>Zero-Data BLE Mesh Fallback</span>
          </div>
        </div>

        {/* Real Metrics Cards in Pinkish Clean Editorial Layout */}
        <div className="w-full max-w-5xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-white/90 border border-rose-200/80 shadow-sm backdrop-blur-md">
          
          <div className="text-left p-4 rounded-2xl bg-rose-50/50 border border-rose-100/70">
            <span className="text-[10px] font-mono uppercase font-bold text-rose-600">
              Streetlights Mapped
            </span>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 font-mono mt-1">65,000+</p>
            <p className="text-xs text-stone-500 mt-0.5">GMDA CCMS Smart Poles</p>
          </div>

          <div className="text-left p-4 rounded-2xl bg-rose-50/50 border border-rose-100/70">
            <span className="text-[10px] font-mono uppercase font-bold text-rose-600">
              Safe Sanctuaries
            </span>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 font-mono mt-1">28+</p>
            <p className="text-xs text-stone-500 mt-0.5">24/7 Pharmacies & Police Desks</p>
          </div>

          <div className="text-left p-4 rounded-2xl bg-rose-50/50 border border-rose-100/70">
            <span className="text-[10px] font-mono uppercase font-bold text-rose-600">
              Response Window
            </span>
            <p className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-1">10s</p>
            <p className="text-xs text-stone-500 mt-0.5">Auto-Dispatch on Hold Release</p>
          </div>

          <div className="text-left p-4 rounded-2xl bg-rose-50/50 border border-rose-100/70">
            <span className="text-[10px] font-mono uppercase font-bold text-rose-600">
              Network Resilience
            </span>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 font-mono mt-1">0-Data</p>
            <p className="text-xs text-stone-500 mt-0.5">Offline Multi-Hop BLE Mesh</p>
          </div>

        </div>

      </div>

    </section>
  );
}
