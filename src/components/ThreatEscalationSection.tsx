'use client';

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  Lock,
  Clock,
  Radio,
  Zap,
  Volume2,
  Smartphone,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface ThreatEscalationSectionProps {
  onOpenDemo: () => void;
}

export default function ThreatEscalationSection({ onOpenDemo }: ThreatEscalationSectionProps) {
  const { lang, t } = useLanguage();

  const safetyFeatures = [
    {
      icon: ShieldAlert,
      tag: lang === 'hi' ? 'फीचर 1' : 'Feature 1',
      title: t('toolHoldTitle'),
      desc: t('toolHoldDesc'),
      highlight: lang === 'hi' ? '10 सेकंड की सुरक्षा खिड़की' : '10s Safety Countdown',
      color: 'border-rose-200 bg-rose-50/30',
    },
    {
      icon: Lock,
      tag: lang === 'hi' ? 'फीचर 2' : 'Feature 2',
      title: t('toolDuressTitle'),
      desc: t('toolDuressDesc'),
      highlight: lang === 'hi' ? 'चुपके से पुलिस को अलर्ट' : 'Covert 112 Dispatch',
      color: 'border-amber-200 bg-amber-50/30',
    },
    {
      icon: PhoneCall,
      tag: lang === 'hi' ? 'फीचर 3' : 'Feature 3',
      title: t('toolFakeCallTitle'),
      desc: t('toolFakeCallDesc'),
      highlight: lang === 'hi' ? 'भैया / मम्मी की असली आवाज़' : 'Spoken Voice Deterrence',
      color: 'border-blue-200 bg-blue-50/30',
    },
    {
      icon: Clock,
      tag: lang === 'hi' ? 'फीचर 4' : 'Feature 4',
      title: t('toolTimerTitle'),
      desc: t('toolTimerDesc'),
      highlight: lang === 'hi' ? 'ऑटो चेक-इन सुरक्षा' : 'Auto SOS on Expiry',
      color: 'border-emerald-200 bg-emerald-50/30',
    },
    {
      icon: Volume2,
      tag: lang === 'hi' ? 'फीचर 5' : 'Feature 5',
      title: t('toolSirenTitle'),
      desc: t('toolSirenDesc'),
      highlight: lang === 'hi' ? 'आस-पास के लोगों का ध्यान खींचें' : 'Acoustic Public Deterrent',
      color: 'border-purple-200 bg-purple-50/30',
    },
    {
      icon: Radio,
      tag: lang === 'hi' ? 'फीचर 6' : 'Feature 6',
      title: lang === 'hi' ? 'बिना इंटरनेट वाली मेश सुरक्षा' : 'Zero-Data BLE Mesh Relay',
      desc:
        lang === 'hi'
          ? 'अगर मोबाइल नेटवर्क या डेटा बंद हो जाए, तो सेफ़ी ब्लूटूथ के ज़रिए पास के अन्य फोनों से संपर्क बनाकर पुलिस तक संकट का संदेश पहुंचा देता है।'
          : 'When cellular coverage or mobile data drops, Safie hops encrypted SOS packets device-to-device across nearby Bluetooth nodes to reach 112.',
      highlight: lang === 'hi' ? 'ऑफ़लाइन पीयर-टू-पीयर' : 'Offline Peer-to-Peer',
      color: 'border-stone-200 bg-stone-50/40',
    },
  ];

  return (
    <section id="safety-tools" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-rose-100">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-rose-700 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{t('toolsBadge')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          {t('toolsTitle')}
        </h2>
        <p className="text-sm text-stone-600">
          {t('toolsSub')}
        </p>
      </div>

      {/* 6 Core Personal Safety Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safetyFeatures.map((feat, idx) => {
          const IconComp = feat.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${feat.color} hover:border-rose-400 transition-all flex flex-col justify-between space-y-4 shadow-xs`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white border border-rose-100 flex items-center justify-center shadow-2xs">
                    <IconComp className="w-4.5 h-4.5 text-rose-600" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                    {feat.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-stone-900">{feat.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{feat.desc}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-rose-100/60 flex items-center justify-between text-[11px]">
                <span className="font-mono font-medium text-rose-700">{feat.highlight}</span>
                <button
                  onClick={onOpenDemo}
                  className="text-stone-700 hover:text-rose-600 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'डेमो देखें' : 'Try Demo'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Simulator Banner */}
      <div className="mt-8 p-6 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono uppercase text-rose-400">
            {lang === 'hi' ? 'लाइव ब्राउज़र सिम्युलेटर' : 'Live Browser Sandbox'}
          </span>
          <h3 className="text-lg font-semibold text-white">
            {lang === 'hi' ? 'फोन में चलाकर देखें कि यह कैसे काम करता है' : 'Experience the phone safety tools in real time'}
          </h3>
          <p className="text-xs text-stone-300 max-w-xl">
            {lang === 'hi'
              ? 'अंगूठा दबाकर सुरक्षा बटन, 9876 गुप्त पिन, भैया/मम्मी की फर्जी कॉल, और तेज़ सायरन का सीधा अनुभव लें।'
              : 'Test the 10-second safety hold, covert duress PIN 9876, real voice fake calls, and acoustic panic siren in our virtual phone.'}
          </p>
        </div>

        <button
          onClick={onOpenDemo}
          className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer flex-shrink-0"
        >
          <Smartphone className="w-4 h-4" />
          <span>{t('heroCtaSimulator')}</span>
        </button>
      </div>
    </section>
  );
}