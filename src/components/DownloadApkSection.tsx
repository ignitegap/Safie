'use client';

import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  QrCode,
  Copy,
  Check,
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
      
      <div className="rounded-[40px] bg-gradient-to-br from-white via-rose-50/50 to-pink-50/40 border border-rose-200/90 p-8 sm:p-12 shadow-sm relative overflow-hidden">
        
        {/* Soft pink ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: APK Info & Download */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-mono font-bold tracking-wider uppercase">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Native Android Kotlin Build</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
              Download Safie for Android
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Experience zero-latency Safety Hold, background BLE mesh broadcasting, and real-time turn-by-turn navigation on your physical phone. Sideload the release APK directly without Google Play account restrictions.
            </p>

            {/* Spec Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-rose-200 shadow-sm">
                <span className="text-stone-500 block text-[10px] uppercase font-mono font-bold">Target Platform</span>
                <strong className="text-stone-900 font-bold">Android 11 - 15</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-rose-200 shadow-sm">
                <span className="text-stone-500 block text-[10px] uppercase font-mono font-bold">Architecture</span>
                <strong className="text-rose-700 font-bold">arm64-v8a / x86_64</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-rose-200 shadow-sm">
                <span className="text-stone-500 block text-[10px] uppercase font-mono font-bold">Release Build</span>
                <strong className="text-stone-900 font-mono font-bold">v1.0.0-delhi</strong>
              </div>
            </div>

            {/* Direct Download Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="/downloads/safie-release.apk"
                download="Safie-v1.0-delhi-ncr.apk"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold text-base shadow-md shadow-rose-200 hover:scale-102 active:scale-95 transition-all flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                <span>Download APK (24 MB)</span>
              </a>
              
              <div className="text-xs text-stone-500">
                <span className="text-emerald-700 font-semibold block">✓ Verified Clean & Safe</span>
                <span>Self-contained offline bundle</span>
              </div>
            </div>

            {/* SHA256 Checksum block */}
            <div className="p-3 rounded-2xl bg-white border border-rose-200 flex items-center justify-between gap-3 text-xs font-mono shadow-sm">
              <div className="overflow-hidden">
                <span className="text-stone-400 text-[10px] block font-bold">SHA-256 Checksum:</span>
                <span className="text-stone-700 truncate block text-[11px]">{checksum}</span>
              </div>
              <button
                onClick={copyChecksum}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors flex-shrink-0"
                title="Copy Checksum"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Right Column: QR Code / Device instructions */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-white border border-rose-200 shadow-sm text-center space-y-4">
            
            {/* Visual QR Code Representation */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-stone-900 shadow-sm">
              <div className="w-44 h-44 bg-white rounded-xl flex flex-col items-center justify-center p-3 relative group border border-rose-100">
                <QrCode className="w-36 h-36 text-rose-600" />
                <div className="absolute inset-0 bg-rose-600/10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-rose-700 text-white font-mono text-[10px] px-2.5 py-1 rounded-full shadow">
                    Direct Sideload
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-900">Scan from Android Phone</h4>
              <p className="text-xs text-stone-500 max-w-xs">
                Scan with your phone camera to download the APK installer directly to your device.
              </p>
            </div>

            {/* Quick Sideload steps */}
            <div className="text-left w-full space-y-1.5 text-[11px] text-stone-600 pt-3 border-t border-rose-100">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[9px]">1</span>
                <span>Open downloaded <strong>Safie.apk</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[9px]">2</span>
                <span>Enable <em>"Install Unknown Apps"</em> in settings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[9px]">3</span>
                <span>Allow <em>Location</em> & <em>Nearby Devices (BLE)</em></span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
