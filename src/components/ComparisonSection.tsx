'use client';

import React from 'react';
import { Check, X, Shield, AlertCircle } from 'lucide-react';

export default function ComparisonSection() {
  const comparisonData = [
    {
      feature: 'Routing Objective',
      google: 'Shortest time (ETA) — directs through unlit alleys and secluded underpasses if 1 minute faster.',
      legacy: 'Static user-reported danger pins without dynamic turn-by-turn routing.',
      safie: 'Minimizes unlit street exposure, prioritizing CCMS lit corridors and 24/7 havens (+2.5 min delta max).',
    },
    {
      feature: 'Streetlight Data',
      google: 'None (no pedestrian lighting telemetry).',
      legacy: 'Infrequent subjective star ratings.',
      safie: 'Real-time GMDA CCMS 65,000+ smart LED pole telemetry and municipal illumination audits.',
    },
    {
      feature: 'Threat Escalation',
      google: 'None.',
      legacy: 'Reactive panic button (requires unlocking phone during active assault).',
      safie: '10s Safety Hold dead man\'s switch: hold thumb while uneasy; releasing starts 10s countdown.',
    },
    {
      feature: 'Duress Protection',
      google: 'None.',
      legacy: 'None — attacker forces victim to cancel alarm.',
      safie: 'Duress PIN (9876) deceptively displays "Cancelled" while covertly notifying police dispatch.',
    },
    {
      feature: 'Physical Sanctuary',
      google: 'Commercial listings without safety certification.',
      legacy: 'Police station points on map only.',
      safie: 'Vetted "Ask for Angela" network (24/7 pharmacies, hospitals, metro booths) with locked employee refuges.',
    },
    {
      feature: 'Offline Resilience',
      google: 'Offline static road map only.',
      legacy: 'Inoperative without active cellular data.',
      safie: 'Hop-by-hop Bluetooth Low Energy (BLE) mesh relaying encrypted SOS packets across nearby devices without internet.',
    },
  ];

  return (
    <section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-rose-700 text-xs font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>Architectural Distinction</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          How Safie compares to standard navigation
        </h2>
        <p className="text-sm text-stone-600">
          Most panic apps are abandoned because of false alarms, heavy battery drain, and uselessness during surprise physical confrontation.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl bg-white border border-rose-200/80 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="border-b border-rose-100 bg-rose-50/40">
              <th className="py-3.5 px-5 text-xs font-mono uppercase text-stone-600 w-1/4">
                Capability
              </th>
              <th className="py-3.5 px-5 text-xs font-mono uppercase text-stone-600 w-1/4">
                Standard Maps
              </th>
              <th className="py-3.5 px-5 text-xs font-mono uppercase text-stone-600 w-1/4">
                Legacy Panic Apps
              </th>
              <th className="py-3.5 px-5 text-xs font-mono uppercase text-rose-700 w-1/4 bg-rose-50/80 border-x border-rose-200 font-semibold">
                Safie Platform
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100 text-xs">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                <td className="py-3.5 px-5 font-medium text-stone-900 align-top">
                  {row.feature}
                </td>
                <td className="py-3.5 px-5 text-stone-600 align-top leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <X className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                    <span>{row.google}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-stone-600 align-top leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                    <span>{row.legacy}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-stone-900 align-top leading-relaxed bg-rose-50/30 border-x border-rose-100">
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span className="font-normal">{row.safie}</span>
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
