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
  Unlock,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface ThreatEscalationSectionProps {
  onOpenDemo: () => void;
}

export default function ThreatEscalationSection({ onOpenDemo }: ThreatEscalationSectionProps) {
  const tiers = [
    {
      level: 'Tier 0',
      title: 'Routine Safe Navigation',
      trigger: 'Active Walk / Commute',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      accent: 'text-emerald-400',
      badge: 'PROACTIVE',
      features: [
        'Multi-objective Valhalla safety costing (96% CCMS lit)',
        'Passive background scream & distress keyword monitoring',
        'Automatic reroute if user approaches unlit high-risk corridor',
      ],
    },
    {
      level: 'Tier 1',
      title: 'Pre-Emptive Unease',
      trigger: 'Thumb on Safety Hold',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      accent: 'text-amber-400',
      badge: 'SAFETY HOLD',
      features: [
        'Live GPS ping frequency increases from 60s to 5s interval',
        'Nearest 24/7 Safe Haven highlighted with 1-tap detour line',
        'Ready-to-fire fake escort call generator on 1 touch',
      ],
    },
    {
      level: 'Tier 2',
      title: 'Dead Man\'s Switch Release',
      trigger: 'Thumb Released · 10s Timer',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
      accent: 'text-rose-400',
      badge: '10-SEC COUNTDOWN',
      features: [
        '10-second silent vibration + visual countdown window',
        'Normal PIN (1234): Verification passed, alert disarmed',
        'Duress PIN (9876): Deceptive "Alarm Cancelled" shown to attacker while covertly dispatching Tier 3 SOS!',
      ],
    },
    {
      level: 'Tier 3',
      title: 'Active High-Priority Crisis',
      trigger: 'Countdown Expired or 9876',
      color: 'border-safie-crimson bg-red-950/40 text-safie-crimson',
      accent: 'text-safie-crimson',
      badge: 'DISPATCH ENGAGED',
      features: [
        'Automated dispatch packet to 112 / ERSS / Police Control Room',
        'Live tracking URLs SMS/WhatsApp dispatched to emergency contacts',
        'Silent ambient mic capture + offline BLE multi-hop mesh broadcast',
      ],
    },
  ];

  return (
    <section id="threat-tiers" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-safie-crimson/10 border border-safie-crimson/30 text-safie-crimson text-xs font-mono font-bold tracking-wider uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Graduated Escalation Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          4-Tier Threat Escalation Matrix
        </h2>
        <p className="text-base text-gray-400">
          Traditional panic buttons fail because unlocking a phone during an assault is impossible. Safie protects you before the attack happens.
        </p>
      </div>

      {/* 4 Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:scale-102 hover:shadow-2xl ${t.color}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/10">
                  {t.level}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 font-mono">
                  {t.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">{t.title}</h3>
                <p className="text-xs font-mono text-gray-300 mt-1">
                  Trigger: <span className="text-white font-semibold">{t.trigger}</span>
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {t.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-gray-300">
                    <span className={`font-bold mt-0.5 ${t.accent}`}>•</span>
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10">
              <button
                onClick={onOpenDemo}
                className="w-full py-2 rounded-xl bg-black/40 hover:bg-black/70 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 border border-white/10"
              >
                <span>Test in Phone Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tactical Highlight Banner: The Duress PIN Innovation */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-safie-crimson/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left max-w-2xl">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-safie-crimson" />
            <h4 className="text-lg font-black text-white">
              The Duress PIN Innovation (Anti-Coercion Protocol)
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            In violent extortion or kidnapping scenarios, perpetrators force victims to unlock their phone and disable alarms. When forced, entering Safie's Duress PIN (<code className="text-safie-crimson font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded border border-safie-crimson/40">9876</code>) renders an authentic-looking <span className="text-emerald-400 font-semibold">"Alarm Cancelled — Safe"</span> screen, while secretly dispatching priority red SOS, silent microphone audio streaming, and live GPS breadcrumbs.
          </p>
        </div>

        <button
          onClick={onOpenDemo}
          className="px-6 py-3 rounded-2xl bg-safie-crimson hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex-shrink-0 shadow-lg flex items-center gap-2"
        >
          <span>Try Duress PIN (9876)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
}
