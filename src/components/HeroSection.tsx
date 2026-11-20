'use client';

import React from 'react';
import {
  Smartphone,
  Download,
  ArrowRight,
  Shield,
  Lightbulb,
  Clock,
  Radio,
  Eye,
  Languages,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface HeroSectionProps {
  onOpenDemo: () => void;
  onOpenAuth: () => void;
}

export default function HeroSection({ onOpenDemo, onOpenAuth }: HeroSectionProps) {
  const { lang, setLang, t } = useLanguage();

  return (
    <section id="hero" className="pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        
        {/* Top Badges & Quick Language Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-xs font-mono text-stone-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>{t('heroBadge')}</span>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium cursor-pointer transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-rose-600" />
            <span>{lang === 'en' ? 'हिंदी में पढ़ें' : 'English'}</span>
          </button>
        </div>

        {/* Calm, Grounded Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 tracking-tight leading-[1.15]">
          {t('heroHeadline')}
        </h1>

        {/* Clear, Specific Subhead in Simple Language */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed font-normal">
          {t('heroSubhead')}
        </p>

        {/* Primary and Secondary Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Primary Action */}
          <button
            onClick={onOpenDemo}
            className="h-11 px-5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Smartphone className="w-4 h-4 text-white" />
            <span>{t('heroCtaSimulator')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Secondary Action */}
          <a
            href="/downloads/safie-v1.0.0-delhi-ncr.apk"
            download="Safie-v1.0-delhi-ncr.apk"
            className="h-11 px-5 rounded-lg bg-white hover:bg-rose-50 text-stone-800 font-medium text-sm border border-rose-200 hover:border-rose-300 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>{t('heroCtaDownload')}</span>
          </a>
        </div>

        {/* Intuitive Key Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{t('heroPillHold')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{t('heroPillDuress')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{t('heroPillHavens')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{t('heroPillFakeCall')}</span>
          </div>
        </div>

        {/* Grounded Real Metrics Row */}
        <div className="w-full mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-white border border-rose-200/80 shadow-2xs">
          
          <div className="text-left p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/60">
            <span className="text-[11px] font-mono text-stone-500 block">
              {t('metricLights')}
            </span>
            <span className="text-2xl font-semibold text-stone-900 font-mono tracking-tight block mt-1 tabular-nums">
              65,420
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              {t('metricLightsSub')}
            </span>
          </div>

          <div className="text-left p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/60">
            <span className="text-[11px] font-mono text-stone-500 block">
              {t('metricHavens')}
            </span>
            <span className="text-2xl font-semibold text-stone-900 font-mono tracking-tight block mt-1 tabular-nums">
              28
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              {t('metricHavensSub')}
            </span>
          </div>

          <div className="text-left p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/60">
            <span className="text-[11px] font-mono text-stone-500 block">
              {t('metricDetour')}
            </span>
            <span className="text-2xl font-semibold text-stone-900 font-mono tracking-tight block mt-1 tabular-nums">
              +2.5 min
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              {t('metricDetourSub')}
            </span>
          </div>

          <div className="text-left p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/60">
            <span className="text-[11px] font-mono text-stone-500 block">
              {t('metricSurveys')}
            </span>
            <span className="text-2xl font-semibold text-emerald-700 font-mono tracking-tight block mt-1 tabular-nums">
              Live
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              {t('metricSurveysSub')}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
