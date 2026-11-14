'use client';

import React from 'react';
import { Check, X, Shield, AlertTriangle } from 'lucide-react';

export default function ComparisonSection() {
  const comparisonData = [
    {
      feature: 'Routing Goal',
      google: 'Shortest time (ETA) — readily routes through pitch-black alleys and secluded underpasses if 1 min faster.',
      legacy: 'Static manual danger pins — no dynamic turn-by-turn navigation.',
      safie: 'Minimizes unlit stretches, prioritizes monitored corridors and 24/7 havens (+2.5 min delta max).',
    },
    {
      feature: 'Streetlight Data',
      google: 'None (no pedestrian lighting awareness).',
      legacy: 'Infrequent crowdsourced subjective star ratings.',
      safie: 'Real-time GMDA CCMS 65,000+ smart LED streetlight pole telemetry & Delhi Police illumination audits.',
    },
    {
      feature: 'Threat Escalation',
      google: 'None.',
      legacy: 'Reactive panic button (requires unlocking phone during active assault).',
      safie: '10s Safety Hold dead man\'s switch — hold thumb while uneasy; release triggers automated emergency dispatch.',
    },
    {
      feature: 'Duress Protection',
      google: 'None.',
      legacy: 'None — attacker forces victim to cancel alarm.',
      safie: 'Duress PIN (9876) displays authentic "Alarm Cancelled" to attacker while covertly alerting police control room.',
    },
    {
      feature: 'Physical Refuge Protocol',
      google: 'Standard commercial listings (no safety training).',
      legacy: 'Police station locations on map.',
      safie: 'Vetted "Ask for Angela" network (24/7 pharmacies, hospitals, metro booths) with trained staff and locked employee shelters.',
    },
    {
      feature: 'Zero-Data Resilience',
      google: 'Offline static road geometry only.',
      legacy: 'Completely inoperative without active 4G/5G data.',
      safie: 'Hop-by-hop Bluetooth Low Energy (BLE) Mesh relaying encrypted SOS packets across nearby devices without internet.',
    },
  ];

  return (
    <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-mono font-bold tracking-wider uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Architectural Distinction</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Why Legacy Safety Apps Failed Indian Cities
        </h2>
        <p className="text-base text-stone-600">
          Most panic apps are uninstalled after 3 weeks because of false alarms, heavy battery drain, and uselessness during surprise physical confrontation.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-3xl bg-white border border-rose-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-rose-200 bg-rose-50/60">
              <th className="py-5 px-6 text-xs font-mono uppercase tracking-wider text-stone-600 w-1/4">
                Capability
              </th>
              <th className="py-5 px-6 text-xs font-mono uppercase tracking-wider text-stone-600 w-1/4">
                Google / Apple Maps
              </th>
              <th className="py-5 px-6 text-xs font-mono uppercase tracking-wider text-stone-600 w-1/4">
                Legacy Panic Apps
              </th>
              <th className="py-5 px-6 text-xs font-mono uppercase tracking-wider text-rose-700 w-1/4 bg-rose-100/60 border-x border-rose-300 font-bold">
                Safie Platform
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100 text-xs sm:text-sm">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-rose-50/30 transition-colors">
                <td className="py-4 px-6 font-bold text-stone-900 align-top">
                  {row.feature}
                </td>
                <td className="py-4 px-6 text-stone-600 align-top leading-relaxed">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                    <span>{row.google}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-stone-600 align-top leading-relaxed">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{row.legacy}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-rose-900 font-medium align-top leading-relaxed bg-rose-50/40 border-x border-rose-200">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{row.safie}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}
