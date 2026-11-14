'use client';

import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  Terminal,
} from 'lucide-react';

export default function DownloadApkSection() {
  const [copied, setCopied] = useState(false);
  const checksum = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const copyChecksum = () => {
    navigator.clipboard.writeText(checksum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="rounded-[40px] bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-white/15 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Glow behind card */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-safie-crimson/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: APK Info & Download */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safie-crimson/20 border border-safie-crimson/40 text-safie-crimson text-xs font-mono font-bold tracking-wider uppercase">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Native Android Kotlin Build</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Test Safie Directly on Your Android Device
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Experience zero-latency Safety Hold, background BLE mesh broadcasting, and real-time turn-by-turn navigation on your physical phone. Sideload the release APK directly without Google Play account restrictions.
            </p>

            {/* Spec Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-gray-400 block text-[10px] uppercase font-mono">Target Platform</span>
                <strong className="text-white font-semibold">Android 11 - 15</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-gray-400 block text-[10px] uppercase font-mono">Architecture</span>
                <strong className="text-emerald-400 font-semibold">arm64-v8a / x86_64</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-gray-400 block text-[10px] uppercase font-mono">Release Build</span>
                <strong className="text-white font-mono">v1.0.0-delhi</strong>
              </div>
            </div>

            {/* Direct Download Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="/downloads/safie-release.apk"
                download="Safie-v1.0-delhi-ncr.apk"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-safie-crimson to-rose-700 hover:from-rose-600 hover:to-safie-crimson text-white font-black text-base shadow-[0_0_35px_rgba(229,57,53,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-red-400/40"
              >
                <Download className="w-5 h-5 animate-bounce" />
                <span>Download Safie APK (24 MB)</span>
              </a>
              
              <div className="text-xs text-gray-400">
                <span className="text-emerald-400 font-semibold block">✓ Verified Clean & Safe</span>
                <span>Self-contained offline routing bundle</span>
              </div>
            </div>

            {/* SHA256 Checksum block */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="overflow-hidden">
                <span className="text-gray-500 text-[10px] block">SHA-256 Checksum:</span>
                <span className="text-gray-300 truncate block text-[11px]">{checksum}</span>
              </div>
              <button
                onClick={copyChecksum}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 transition-colors flex-shrink-0"
                title="Copy Checksum"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Right Column: Scan to Install QR / Device instructions */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/80 border border-white/10 text-center space-y-4">
            
            {/* Visual QR Code Representation */}
            <div className="p-4 rounded-2xl bg-white text-black shadow-xl">
              <div className="w-44 h-44 bg-zinc-900 rounded-lg flex flex-col items-center justify-center p-3 relative group">
                <QrCode className="w-36 h-36 text-white" />
                <div className="absolute inset-0 bg-safie-crimson/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black/90 text-white font-mono text-[10px] px-2 py-1 rounded">
                    Direct APK Sideload
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Scan from Android Phone</h4>
              <p className="text-xs text-gray-400 max-w-xs">
                Point your phone camera to download the APK installer directly to your mobile device.
              </p>
            </div>

            {/* Quick Sideload steps */}
            <div className="text-left w-full space-y-1.5 text-[11px] text-gray-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[9px]">1</span>
                <span>Open downloaded <strong>Safie.apk</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[9px]">2</span>
                <span>Enable <em>"Install Unknown Apps"</em> in Chrome/Settings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[9px]">3</span>
                <span>Allow <em>Location</em> & <em>Nearby Devices (BLE)</em></span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
