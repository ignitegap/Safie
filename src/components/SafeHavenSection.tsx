'use client';

import React from 'react';
import {
  ShieldAlert,
  Building,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Lock,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { DELHI_NCR_SAFE_HAVENS } from '@/lib/data-delhi-ncr';

export default function SafeHavenSection() {
  return (
    <section id="safe-havens" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Vetted Physical Sanctuaries</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          "Ask for Angela" Safe Haven Network
        </h2>
        <p className="text-base text-gray-400">
          Digital alerts mean nothing if you have nowhere physical to run. Safie partners with 24/7 pharmacies, hospital emergency rooms, metro police booths, and commercial retail to establish immediate physical safe harbors.
        </p>
      </div>

      {/* Protocol Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Discreet Staff Codeword</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Walk into any partner location and tell the staff: <strong className="text-purple-300">"Is Angela working tonight?"</strong> or <strong className="text-purple-300">"Can I speak with Angela?"</strong>. Staff are trained to immediately recognize this universal distress protocol without alerting pursuers.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Locked Staff Sanctuary</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Staff discreetly escorts the user into an interior locked employee room or behind counter barrier, offering water, high-speed Wi-Fi, and a secure phone line while keeping pursuers outside under CCTV recording.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-500/30 backdrop-blur-xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Direct Police & Cab Escort</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            The Safe Haven manager uses their verified dedicated line to summon the nearest Gurugram/Delhi Police PCR van or arranges a verified cab with driver ID verification, ensuring the citizen never leaves the haven alone.
          </p>
        </div>

      </div>

      {/* Directory Table / Cards of Real Delhi-NCR Havens */}
      <div className="rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-safie-crimson" />
            <span>Active Delhi-NCR Safe Haven Registry</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {DELHI_NCR_SAFE_HAVENS.length} Verified Locations Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DELHI_NCR_SAFE_HAVENS.map((h) => (
            <div
              key={h.id}
              className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between text-left space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {h.categoryLabel}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {h.address.includes('Gurugram') ? 'Gurugram' : 'Delhi'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{h.name}</h4>
                <p className="text-xs text-gray-400">{h.address}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-semibold text-[11px]">
                  ✓ Staff Protocol Certified
                </span>
                <a
                  href={`tel:${h.phone}`}
                  className="font-mono text-[11px] text-blue-400 hover:underline"
                >
                  {h.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
