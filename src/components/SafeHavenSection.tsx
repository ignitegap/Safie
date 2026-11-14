'use client';

import React from 'react';
import {
  ShieldAlert,
  Building,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { DELHI_NCR_SAFE_HAVENS } from '@/lib/data-delhi-ncr';

export default function SafeHavenSection() {
  return (
    <section id="safe-havens" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-mono font-bold tracking-wider uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Vetted Physical Sanctuaries</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          "Ask for Angela" Safe Haven Network
        </h2>
        <p className="text-base text-stone-600">
          Digital alarms help nobody if there is nowhere safe to run. Safie partners with 24/7 pharmacies, hospital emergency rooms, and metro security kiosks to provide immediate physical shelter.
        </p>
      </div>

      {/* Protocol Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Discreet Staff Codeword</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Walk into any partner pharmacy or counter and ask: <strong className="text-rose-700">"Can I speak with Angela?"</strong>. Staff are trained to immediately recognize this universal distress protocol without alarming people nearby.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Locked Employee Refuge</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Staff discreetly escorts you behind the counter or into a locked employee room, providing water, phone charging, and a secure environment while keeping pursuers outside under CCTV recording.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Direct Police & Verified Cab</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            The Safe Haven manager calls the nearest Gurugram/Delhi Police PCR van or arranges a verified cab with driver ID verification, ensuring you never leave the haven alone.
          </p>
        </div>

      </div>

      {/* Directory Table / Cards of Real Delhi-NCR Havens */}
      <div className="rounded-3xl bg-white border border-rose-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-rose-600" />
            <span>Active Delhi-NCR Safe Haven Registry</span>
          </h3>
          <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-bold border border-emerald-300">
            {DELHI_NCR_SAFE_HAVENS.length} Verified Locations Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DELHI_NCR_SAFE_HAVENS.map((h) => (
            <div
              key={h.id}
              className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 hover:border-rose-300 transition-all flex flex-col justify-between text-left space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-rose-100 text-rose-700 border border-rose-200 font-bold">
                    {h.categoryLabel}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {h.address.includes('Gurugram') ? 'Gurugram' : 'Delhi'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{h.name}</h4>
                <p className="text-xs text-stone-600">{h.address}</p>
              </div>

              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-semibold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Protocol Certified</span>
                </span>
                <a
                  href={`tel:${h.phone}`}
                  className="font-mono text-[11px] text-rose-600 font-bold hover:underline"
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
