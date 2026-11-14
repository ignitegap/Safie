'use client';

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  PhoneCall,
  Radio,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface ThreatEscalationSectionProps {
  onOpenDemo: () => void;
}

export default function ThreatEscalationSection({ onOpenDemo }: ThreatEscalationSectionProps) {
  const tiers = [
    {
      level: 'Tier 0',
      title: 'Routine Safe Walk',
      trigger: 'Normal Navigation',
      color: 'bg-white border-rose-200 text-stone-900',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badge: 'MONITORED',
      features: [
        'Walking route optimized for 96% CCMS street lighting',
        'Automatic detour suggestion if approaching dark unlit stretch',
        'Passive scream & distress audio detection active in background',
      ],
    },
    {
      level: 'Tier 1',
      title: 'Safety Hold',
      trigger: 'Thumb on Button',
      color: 'bg-white border-rose-200 text-stone-900',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      badge: 'SAFETY HOLD',
      features: [
        'GPS breadcrumb ping rate accelerates to 5s interval',
        'Nearest 24/7 Safe Haven highlighted with 1-tap detour line',
        'Pre-recorded escort call ready on 1 tap',
      ],
    },
    {
      level: 'Tier 2',
      title: 'Hold Released',
      trigger: '10s Countdown Timer',
      color: 'bg-white border-rose-300 text-stone-900 shadow-md',
      badgeColor: 'bg-rose-600 text-white border-rose-600',
      badge: '10-SEC TIMER',
      features: [
        'Vibration & visual 10-second countdown window',
        'Normal PIN (1234): Verification passed, alert cancels safely',
        'Duress PIN (9876): Deceptively displays "Cancelled" to aggressor while covertly firing Tier 3 SOS!',
      ],
    },
    {
      level: 'Tier 3',
      title: 'Active Crisis',
      trigger: '0s Reached or 9876',
      color: 'bg-rose-50/70 border-rose-400 text-stone-900 shadow-md',
      badgeColor: 'bg-rose-700 text-white border-rose-700',
      badge: 'DISPATCH ACTIVE',
      features: [
        'Emergency dispatch packet sent to 112 / Police Control Room',
        'Live tracking URLs sent via SMS/WhatsApp to family contacts',
        'Silent microphone audio streaming + offline BLE mesh broadcast',
      ],
    },
  ];

  return (
    <section id="threat-tiers" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-mono font-bold tracking-wider uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Graduated Escalation Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Why Standard Panic Buttons Don't Work
        </h2>
        <p className="text-base text-stone-600">
          Unlocking a phone during an assault or surprise confrontation is virtually impossible. Safie protects you before violence happens.
        </p>
      </div>

      {/* 4 Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-rose-300 ${t.color}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  {t.level}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.badgeColor}`}>
                  {t.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-stone-900">{t.title}</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Trigger: <span className="text-stone-800 font-semibold">{t.trigger}</span>
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {t.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-stone-600">
                    <span className="font-bold text-rose-500 mt-0.5">•</span>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-rose-100">
              <button
                onClick={onOpenDemo}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition-all flex items-center justify-center gap-1.5 border border-rose-200"
              >
                <span>Test in Phone Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Anti-Coercion Protocol Highlight Card */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-rose-300 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left max-w-2xl">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-600" />
            <h4 className="text-lg font-black text-stone-900">
              The Duress PIN Innovation (Anti-Coercion Protocol)
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            When confronted, aggressors often demand that victims cancel alarms on their phone. Entering Safie's Duress PIN (<code className="text-rose-700 font-mono font-bold bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300">9876</code>) renders an authentic-looking <strong className="text-emerald-800">"Alarm Cancelled — Safe"</strong> screen to satisfy the attacker, while secretly transmitting a high-priority red alert with live GPS coordinates to Gurugram Police and emergency contacts.
          </p>
        </div>

        <button
          onClick={onOpenDemo}
          className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex-shrink-0 shadow-md flex items-center gap-2"
        >
          <span>Try Duress PIN (9876)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
}
