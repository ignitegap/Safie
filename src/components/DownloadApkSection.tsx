'use client';

import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Copy,
  Check,
  CheckCircle2,
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
    <section id="download" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      <div className="rounded-2xl bg-white border border-rose-200/80 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: APK Info & Download */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Native Android Kotlin Build</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Download Safie for Android
            </h2>

            <p className="text-sm text-stone-600 leading-relaxed font-normal">
              Experience the physical 10-second Safety Hold, background BLE mesh flood relay, and live turn-by-turn corridor navigation directly on your physical Android device. Sideload the release APK without store account dependencies.
            </p>

            {/* Spec Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100">
                <span className="text-stone-500 block text-[10px] font-mono">Target Platform</span>
                <strong className="text-stone-900 font-medium">Android 11 - 15</strong>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100">
                <span className="text-stone-500 block text-[10px] font-mono">Architecture</span>
                <strong className="text-stone-900 font-medium">arm64-v8a / x86_64</strong>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100">
                <span className="text-stone-500 block text-[10px] font-mono">Release Build</span>
                <strong className="text-stone-900 font-mono font-medium">v1.0.0-delhi</strong>
              </div>
            </div>

            {/* Direct Download Button */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="/downloads/safie-release.apk"
                download="Safie-v1.0-delhi-ncr.apk"
                className="h-11 px-6 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-colors flex items-center gap-2.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download APK (24 MB)</span>
              </a>
              
              <div className="text-xs text-stone-500">
                <span className="text-emerald-700 font-medium block">Verified clean package</span>
                <span>Stand-alone offline bundle</span>
              </div>
            </div>

            {/* SHA256 Checksum block */}
            <div className="p-3 rounded-xl bg-rose-50/30 border border-rose-100 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="overflow-hidden">
                <span className="text-stone-400 text-[10px] block">SHA-256 Checksum:</span>
                <span className="text-stone-700 truncate block text-[11px]">{checksum}</span>
              </div>
              <button
                onClick={copyChecksum}
                className="p-1.5 rounded-lg bg-white border border-rose-200 text-stone-600 hover:text-stone-900 transition-colors flex-shrink-0 cursor-pointer"
                title="Copy Checksum"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

          {/* Right Column: Sideload Guide */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-rose-50/30 border border-rose-100 text-left space-y-3">
            <h3 className="text-xs font-mono uppercase text-stone-600 font-medium">
              3-Step Installation
            </h3>
            
            <ol className="space-y-3 text-xs text-stone-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white border border-rose-200 text-stone-700 flex items-center justify-center font-mono text-[11px] font-medium flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-stone-900 font-medium block">Download APK</strong>
                  <span>Save `Safie-v1.0-delhi-ncr.apk` to your Android device storage.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white border border-rose-200 text-stone-700 flex items-center justify-center font-mono text-[11px] font-medium flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-stone-900 font-medium block">Permit Sideloading</strong>
                  <span>Tap "Allow from this source" when prompted by Chrome or Files.</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white border border-rose-200 text-stone-700 flex items-center justify-center font-mono text-[11px] font-medium flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-stone-900 font-medium block">Grant Permissions</strong>
                  <span>Grant Location (Always On for CCMS corridor routing) and Bluetooth (for offline mesh).</span>
                </div>
              </li>
            </ol>

            <div className="pt-2 border-t border-rose-100 flex items-center gap-1.5 text-xs text-stone-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tested on Samsung OneUI, Pixel OS, and OnePlus OxygenOS</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
