'use client';

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  PhoneCall,
  Radio,
  Lock,
  ArrowRight,
  Smartphone,
} from 'lucide-react';

interface ThreatEscalationSectionProps {
  onOpenDemo: () => void;
}

export default function ThreatEscalationSection({ onOpenDemo }: ThreatEscalationSectionProps) {
  const tiers = [
    {
      level: 'Tier 0',
      title: 'Monitored Walk',
      trigger: 'Normal navigation',
      badge: 'Active Monitoring',
      features: [
        'Route prioritized for CCMS streetlight coverage (96%)',
        'Automatic reroute if approaching unlit or secluded stretches',
        'Background distress audio sensor standby',
      ],
    },
    {
      level: 'Tier 1',
      title: 'Safety Hold',
      trigger: 'Thumb placed on screen',
      badge: 'Standby Hold',
      features: [
        'GPS breadcrumb ping accelerates from 30s to 5s interval',
        'Nearest verified Safe Haven highlighted with 1-tap detour line',
        'One-tap simulated escort call ready on screen',
      ],
    },
    {
      level: 'Tier 2',
      title: 'Hold Released',
      trigger: '10s countdown window',
      badge: '10s Grace Window',
      features: [
        'Haptic vibration and visual countdown timer',
        'Normal PIN (1234): Verification confirmed, alert cancels quietly',
        'Duress PIN (9876): Deceptively shows "Cancelled" while dispatching Tier 3 emergency',
      ],
    },
    {
      level: 'Tier 3',
      title: 'Emergency Dispatch',
      trigger: 'Timer expires or PIN 9876',
      badge: 'Active Dispatch',
      features: [
        'Encrypted SOS packet dispatched to 112 Police Control Room',
        'Live tracking links sent via SMS to trusted emergency contacts',
        'Silent microphone audio streaming and offline BLE mesh broadcast',
      ],
    },
  ];

  return (
    <section id="threat-tiers" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-rose-700 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Graduated Escalation Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          Protection before physical confrontation
        </h2>
        <p className="text-sm text-stone-600">
          Unlocking a phone during a surprise physical confrontation is virtually impossible. Safie arms users with a dead man's switch.
        </p>
      </div>

      {/* 4 Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-rose-200/80 bg-white flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-medium text-stone-500">
                  {t.level}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                  {t.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-stone-900">{t.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5 font-mono">{t.trigger}</p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-rose-100/70 text-xs text-stone-600">
                {t.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 text-[11px] font-mono text-stone-400">
              Response: Sub-100ms
            </div>
          </div>
        ))}
      </div>

      {/* Simulator Link Card */}
      <div className="mt-6 p-4 rounded-xl bg-white border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 flex-shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-900 block">
              Experience the 10-Second Safety Hold
            </span>
            <span className="text-xs text-stone-500 block">
              Test normal PIN (1234) vs covert duress PIN (9876) in the interactive phone simulator.
            </span>
          </div>
        </div>
        <button
          onClick={onOpenDemo}
          className="h-9 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer flex-shrink-0"
        >
          <span>Open Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </section>
  );
}
