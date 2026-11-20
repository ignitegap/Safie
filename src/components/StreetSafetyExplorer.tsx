'use client';

import React, { useState } from 'react';
import {
  Sun,
  Users,
  Shield,
  Footprints,
  Search,
  CheckCircle2,
  AlertTriangle,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Info,
  X,
  Camera,
  Layers,
  Filter,
  Activity,
  Sliders,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

interface StreetAuditData {
  id: string;
  name: string;
  nameHi: string;
  zone: string;
  baseScore: number;
  timeScores: {
    '18:00': number;
    '21:00': number;
    '23:30': number;
    '02:00': number;
    '04:30': number;
  };
  lightingLabel: string;
  lightingLabelHi: string;
  lightingPct: number;
  crowdLabel: string;
  crowdLabelHi: string;
  securityLabel: string;
  securityLabelHi: string;
  footpathLabel: string;
  footpathLabelHi: string;
  cctvCount: number;
  smartPolesCount: number;
  pcrKiosksCount: number;
  safeHavensCount: number;
  auditCount: number;
  lastAudited: string;
  lastAuditedHi: string;
}

const DELHI_NCR_STREETS: StreetAuditData[] = [
  {
    id: 'cyber-city-sec29',
    name: 'DLF Cyber Hub to Sector 29 Leisure Corridor',
    nameHi: 'डीएलएफ साइबर हब से सेक्टर 29 कॉरिडोर',
    zone: 'Gurugram',
    baseScore: 94,
    timeScores: { '18:00': 98, '21:00': 95, '23:30': 91, '02:00': 82, '04:30': 86 },
    lightingLabel: '96% CCMS Smart LED Lit',
    lightingLabelHi: '96% स्मार्ट एलईडी लाइट युक्त',
    lightingPct: 96,
    crowdLabel: 'Active Night Crowd & 24/7 Eateries',
    crowdLabelHi: 'देर रात तक चहल-पहल और खुली दुकानें',
    securityLabel: 'Mall Security, Guards & PCR Patrol',
    securityLabelHi: 'मॉल सुरक्षा गार्ड व पीसीआर गश्त',
    footpathLabel: 'Paved, Barrier-Free Footpath',
    footpathLabelHi: 'पक्का, रुकावट-मुक्त फुटपाथ',
    cctvCount: 36,
    smartPolesCount: 142,
    pcrKiosksCount: 3,
    safeHavensCount: 4,
    auditCount: 142,
    lastAudited: '4 hours ago',
    lastAuditedHi: '4 घंटे पहले',
  },
  {
    id: 'sikanderpur-galleria',
    name: 'Sikanderpur Metro to Galleria Market',
    nameHi: 'सिकंदरपुर मेट्रो से गलेरिया मार्केट',
    zone: 'Gurugram',
    baseScore: 82,
    timeScores: { '18:00': 92, '21:00': 84, '23:30': 78, '02:00': 64, '04:30': 72 },
    lightingLabel: '84% Continuous Streetlights',
    lightingLabelHi: '84% लगातार स्ट्रीटलाइट्स',
    lightingPct: 84,
    crowdLabel: 'Steady Evening Commuter Flow',
    crowdLabelHi: 'यात्रियों की नियमित आवाजाही',
    securityLabel: 'Metro Police Post & Society Gates',
    securityLabelHi: 'मेट्रो पुलिस व सोसाइटी गेट्स',
    footpathLabel: 'Wide Footpath with Metro Access',
    footpathLabelHi: 'चौड़ा फुटपाथ व मेट्रो निकास',
    cctvCount: 22,
    smartPolesCount: 88,
    pcrKiosksCount: 2,
    safeHavensCount: 3,
    auditCount: 98,
    lastAudited: 'Yesterday',
    lastAuditedHi: 'कल',
  },
  {
    id: 'rajiv-chowk-hauz-khas',
    name: 'Rajiv Chowk Metro Arterial to Hauz Khas',
    nameHi: 'राजीव चौक से हौज़ खास मुख्य मार्ग',
    zone: 'Delhi',
    baseScore: 88,
    timeScores: { '18:00': 96, '21:00': 90, '23:30': 84, '02:00': 70, '04:30': 76 },
    lightingLabel: '91% High-Mast Illuminated',
    lightingLabelHi: '91% हाई-मास्ट पोल द्वारा रोशन',
    lightingPct: 91,
    crowdLabel: 'Dense Pedestrian Transit',
    crowdLabelHi: 'भारी पैदल यात्री आवागमन',
    securityLabel: 'Delhi Police Kiosk & 24/7 CCTV',
    securityLabelHi: 'दिल्ली पुलिस कियोस्क व 24/7 सीसीटीवी',
    footpathLabel: 'Continuous Raised Sidewalk',
    footpathLabelHi: 'उठा हुआ निरंतर पैदल पथ',
    cctvCount: 48,
    smartPolesCount: 160,
    pcrKiosksCount: 5,
    safeHavensCount: 5,
    auditCount: 215,
    lastAudited: '2 hours ago',
    lastAuditedHi: '2 घंटे पहले',
  },
  {
    id: 'saket-khan-market',
    name: 'Saket Metro Corridor to Khan Market',
    nameHi: 'साकेत मेट्रो से खान मार्केट मार्ग',
    zone: 'Delhi',
    baseScore: 85,
    timeScores: { '18:00': 94, '21:00': 87, '23:30': 81, '02:00': 66, '04:30': 74 },
    lightingLabel: '88% Sodium & LED Lighting',
    lightingLabelHi: '88% एलईडी व स्ट्रीटलाइट्स',
    lightingPct: 88,
    crowdLabel: 'Steady Evening Footfall',
    crowdLabelHi: 'शाम को नियमित पैदल यात्री',
    securityLabel: 'Traffic Post & Active Staff',
    securityLabelHi: 'ट्रैफिक पुलिस व बाज़ार गार्ड्स',
    footpathLabel: 'Level Walking Sidewalk',
    footpathLabelHi: 'समतल पैदल फुटपाथ',
    cctvCount: 28,
    smartPolesCount: 110,
    pcrKiosksCount: 3,
    safeHavensCount: 3,
    auditCount: 110,
    lastAudited: '6 hours ago',
    lastAuditedHi: '6 घंटे पहले',
  },
  {
    id: 'golf-course-road',
    name: 'Golf Course Road Rapid Metro Spine',
    nameHi: 'गोल्फ कोर्स रोड रैपिड मेट्रो मार्ग',
    zone: 'Gurugram',
    baseScore: 90,
    timeScores: { '18:00': 97, '21:00': 92, '23:30': 87, '02:00': 79, '04:30': 84 },
    lightingLabel: '95% Underpass & Surface Lit',
    lightingLabelHi: '95% अंडरपास व सतह पर रोशनी',
    lightingPct: 95,
    crowdLabel: 'Corporate & Residential Flow',
    crowdLabelHi: 'दफ्तर व रिहायशी इलाकों की भीड़',
    securityLabel: 'DLF Security Hub & PCR Bikes',
    securityLabelHi: 'सुरक्षा गार्ड्स व बाइक गश्त',
    footpathLabel: 'Dedicated Cycle & Pedestrian Track',
    footpathLabelHi: 'अलग साइकिल व पैदल ट्रैक',
    cctvCount: 54,
    smartPolesCount: 210,
    pcrKiosksCount: 4,
    safeHavensCount: 4,
    auditCount: 88,
    lastAudited: '12 hours ago',
    lastAuditedHi: '12 घंटे पहले',
  },
  {
    id: 'mg-road-iffco',
    name: 'MG Road (Sikanderpur to IFFCO Chowk)',
    nameHi: 'एमजी रोड (सिकंदरपुर से इफ्को चौक)',
    zone: 'Gurugram',
    baseScore: 79,
    timeScores: { '18:00': 90, '21:00': 82, '23:30': 74, '02:00': 58, '04:30': 66 },
    lightingLabel: '80% Lit (Caution under flyover)',
    lightingLabelHi: '80% रोशनी (फ्लाईओवर के नीचे ध्यान दें)',
    lightingPct: 80,
    crowdLabel: 'Busy Near Malls; Quiet Near Overpasses',
    crowdLabelHi: 'मॉल्स के पास भीड़; पुल के नीचे शांति',
    securityLabel: 'Mall Gates & Traffic Chowki',
    securityLabelHi: 'मॉल गेट व ट्रैफिक चौकी',
    footpathLabel: 'Mixed Quality Sidewalk',
    footpathLabelHi: 'सामान्य गुणवत्ता वाला फुटपाथ',
    cctvCount: 32,
    smartPolesCount: 130,
    pcrKiosksCount: 2,
    safeHavensCount: 3,
    auditCount: 164,
    lastAudited: '3 hours ago',
    lastAuditedHi: '3 घंटे पहले',
  },
];

type TimeSlot = '18:00' | '21:00' | '23:30' | '02:00' | '04:30';

export default function StreetSafetyExplorer() {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<'all' | 'Gurugram' | 'Delhi'>('all');
  const [activeTimeSlot, setActiveTimeSlot] = useState<TimeSlot>('23:30');
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [activeStreetToAudit, setActiveStreetToAudit] = useState<StreetAuditData | null>(null);

  // 15-second Quick Audit State
  const [auditStreetName, setAuditStreetName] = useState('');
  const [auditLighting, setAuditLighting] = useState<'bright' | 'dim' | 'dark'>('bright');
  const [auditCrowd, setAuditCrowd] = useState<'busy' | 'moderate' | 'deserted'>('busy');
  const [auditSecurity, setAuditSecurity] = useState<'present' | 'absent'>('present');
  const [auditFootpath, setAuditFootpath] = useState<'good' | 'broken'>('good');
  const [auditComments, setAuditComments] = useState('');
  const [auditPhotoAttached, setAuditPhotoAttached] = useState(false);
  const [auditSubmitting, setAuditSubmitting] = useState(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState('');

  const timeSlots: { slot: TimeSlot; label: string; labelHi: string }[] = [
    { slot: '18:00', label: '6:00 PM (Dusk)', labelHi: 'शाम 6:00 (शाम)' },
    { slot: '21:00', label: '9:00 PM (Transit)', labelHi: 'रात 9:00 (आवाजाही)' },
    { slot: '23:30', label: '11:30 PM (Late Night)', labelHi: 'रात 11:30 (देर रात)' },
    { slot: '02:00', label: '2:00 AM (Midnight)', labelHi: 'रात 2:00 (मध्यरात्रि)' },
    { slot: '04:30', label: '4:30 AM (Dawn)', labelHi: 'सुबह 4:30 (भोर)' },
  ];

  const filteredStreets = DELHI_NCR_STREETS.filter((street) => {
    const matchesSearch =
      street.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      street.nameHi.includes(searchQuery) ||
      street.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === 'all' || street.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const handleOpenAudit = (street?: StreetAuditData) => {
    if (street) {
      setActiveStreetToAudit(street);
      setAuditStreetName(street.name);
    } else {
      setActiveStreetToAudit(null);
      setAuditStreetName('');
    }
    setAuditPhotoAttached(false);
    setAuditSuccessMsg('');
    setIsSurveyModalOpen(true);
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuditSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'street_survey_audit',
          address: auditStreetName || 'Delhi NCR Corridor',
          description: `Citizen Audit [${activeTimeSlot}]: Lighting=${auditLighting}, Crowd=${auditCrowd}, Security=${auditSecurity}, Footpath=${auditFootpath}, PhotoEvidence=${auditPhotoAttached}. Comment: ${auditComments}`,
          lat: 28.4900,
          lng: 77.0880,
        }),
      });

      if (res.ok) {
        setAuditSuccessMsg(
          lang === 'hi'
            ? 'धन्यवाद! आपकी सड़क रेटिंग डेटाबेस में सुरक्षित हो गई है।'
            : 'Thank you! Your 15-second street audit is recorded on Neon PostgreSQL.'
        );
        setTimeout(() => {
          setIsSurveyModalOpen(false);
          setAuditSuccessMsg('');
          setAuditComments('');
          setAuditPhotoAttached(false);
        }, 1500);
      } else {
        setAuditSuccessMsg(lang === 'hi' ? 'जमा करने में विफल।' : 'Failed to submit audit');
      }
    } catch (err: any) {
      setAuditSuccessMsg('Error: ' + err.message);
    } finally {
      setAuditSubmitting(false);
    }
  };

  return (
    <section id="street-survey" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-rose-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-rose-700 text-xs font-mono">
          <Sun className="w-3.5 h-3.5" />
          <span>{t('surveyBadge')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          {t('surveyTitle')}
        </h2>
        <p className="text-sm text-stone-600">
          {t('surveySub')}
        </p>
      </div>

      {/* NEW: Temporal Intelligence Time-of-Day Slider Toolbar */}
      <div className="mb-6 p-4 rounded-2xl bg-stone-900 text-white shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold text-white">
              {t('temporalTime')}
            </span>
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            {lang === 'hi' ? 'समय के अनुसार स्कोर बदलता है' : 'Dynamic Nocturnal Weighting'}
          </span>
        </div>

        {/* Time Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {timeSlots.map((ts) => (
            <button
              key={ts.slot}
              onClick={() => setActiveTimeSlot(ts.slot)}
              className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
                activeTimeSlot === ts.slot
                  ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-sm'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <span className="font-mono block text-xs">
                {lang === 'hi' ? ts.labelHi : ts.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-rose-200/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchStreetPlaceholder')}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setSelectedZone('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedZone === 'all'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              {lang === 'hi' ? 'सभी' : 'All'}
            </button>
            <button
              onClick={() => setSelectedZone('Gurugram')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedZone === 'Gurugram'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              Gurugram
            </button>
            <button
              onClick={() => setSelectedZone('Delhi')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedZone === 'Delhi'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              Delhi
            </button>
          </div>

          <button
            onClick={() => handleOpenAudit()}
            className="h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
          >
            <Star className="w-3.5 h-3.5" />
            <span>{t('surveyRateThisStreet')}</span>
          </button>
        </div>
      </div>

      {/* Street Cards Grid with Dynamic Temporal Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStreets.map((street) => {
          const currentDynamicScore = street.timeScores[activeTimeSlot];
          return (
            <div
              key={street.id}
              className="p-5 rounded-2xl bg-white border border-rose-200/80 hover:border-rose-300 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Header: Title + Temporal SSI Score Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                      {street.zone}
                    </span>
                    <h3 className="text-sm font-semibold text-stone-900 mt-1 leading-snug">
                      {lang === 'hi' ? street.nameHi : street.name}
                    </h3>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                        currentDynamicScore >= 90
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : currentDynamicScore >= 75
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                      title="Street Support Index (SSI) at current time slot"
                    >
                      SSI {currentDynamicScore}/100
                    </span>
                    <span className="text-[9px] text-stone-400 block font-mono mt-0.5">
                      {street.auditCount} {lang === 'hi' ? 'ऑडिट्स' : 'Audits'}
                    </span>
                  </div>
                </div>

                {/* 4 Core Environmental Pillars */}
                <div className="space-y-2 pt-2 border-t border-rose-100/70 text-xs">
                  <div className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-500 font-medium block text-[10px]">
                        {t('pillarLighting')} ({street.lightingPct}%)
                      </span>
                      <strong className="text-stone-800 font-medium text-[11px]">
                        {lang === 'hi' ? street.lightingLabelHi : street.lightingLabel}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-500 font-medium block text-[10px]">
                        {t('pillarCrowd')}
                      </span>
                      <strong className="text-stone-800 font-medium text-[11px]">
                        {lang === 'hi' ? street.crowdLabelHi : street.crowdLabel}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-500 font-medium block text-[10px]">
                        {t('pillarSecurity')}
                      </span>
                      <strong className="text-stone-800 font-medium text-[11px]">
                        {lang === 'hi' ? street.securityLabelHi : street.securityLabel}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Footprints className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-stone-500 font-medium block text-[10px]">
                        {t('pillarFootpath')}
                      </span>
                      <strong className="text-stone-800 font-medium text-[11px]">
                        {lang === 'hi' ? street.footpathLabelHi : street.footpathLabel}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Verified Infrastructure Telemetry Badges */}
                <div className="pt-2 border-t border-rose-100/70 grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                  <div className="p-1.5 rounded-lg bg-rose-50/40 border border-rose-100">
                    <span className="text-stone-400 block text-[9px]">Poles</span>
                    <strong className="text-stone-800 font-semibold">{street.smartPolesCount}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-rose-50/40 border border-rose-100">
                    <span className="text-stone-400 block text-[9px]">CCTV</span>
                    <strong className="text-stone-800 font-semibold">{street.cctvCount}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-rose-50/40 border border-rose-100">
                    <span className="text-stone-400 block text-[9px]">PCR</span>
                    <strong className="text-stone-800 font-semibold">{street.pcrKiosksCount}</strong>
                  </div>
                  <div className="p-1.5 rounded-lg bg-rose-50/40 border border-rose-100">
                    <span className="text-stone-400 block text-[9px]">Havens</span>
                    <strong className="text-emerald-700 font-semibold">{street.safeHavensCount}</strong>
                  </div>
                </div>
              </div>

              {/* Card Footer: Last audit + Quick Rate CTA */}
              <div className="pt-2 border-t border-rose-100/70 flex items-center justify-between text-[11px]">
                <span className="text-stone-400 font-mono text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{lang === 'hi' ? street.lastAuditedHi : street.lastAudited}</span>
                </span>

                <button
                  onClick={() => handleOpenAudit(street)}
                  className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'रेट करें' : 'Rate this'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Epistemological Disclaimer Note */}
      <div className="mt-8 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11.5px] text-stone-600 text-center max-w-3xl mx-auto flex items-center justify-center gap-2">
        <Info className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <span>
          {lang === 'hi'
            ? 'पारदर्शिता नोट: स्ट्रीट सपोर्ट इंडेक्स (SSI) नागरिक रेटिंग और नगर निगम स्मार्ट लाइटिंग पर आधारित पर्यावरणीय संकेतक है। यह सुरक्षा की कानूनी गारंटी नहीं है।'
            : 'Transparency Notice: Street Support Index (SSI) is an environmental indicator summarizing lighting, activity, and infrastructure. It is not an absolute guarantee of personal safety.'}
        </span>
      </div>

      {/* ============================================================== */}
      {/* MODAL: 15-SECOND QUICK STREET AUDIT (WITH PHOTO ATTACH) */}
      {/* ============================================================== */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="relative max-w-lg w-full rounded-2xl bg-white border border-rose-200 p-6 shadow-xl text-left space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSurveyModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono">
                <Sparkles className="w-3 h-3 text-rose-600" />
                <span>{lang === 'hi' ? '15-सेकंड त्वरित ऑडिट' : '15-Second Citizen Audit'}</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mt-1">
                {lang === 'hi' ? 'सड़क की स्थिति रेट करें' : 'Rate Street Safety & Lighting'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi'
                  ? 'आपकी 4 त्वरित टैप से रात को चलने वाले अन्य यात्रियों को सुरक्षित रास्ता मिलता है।'
                  : 'Your quick feedback updates real-time routing weights and alerts fellow commuters.'}
              </p>
            </div>

            <form onSubmit={handleSurveySubmit} className="space-y-3.5 text-xs">
              {/* Street Name */}
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'hi' ? 'सड़क / मेट्रो स्टेशन का नाम' : 'Street / Metro Station Name'}
                </label>
                <input
                  type="text"
                  required
                  value={auditStreetName}
                  onChange={(e) => setAuditStreetName(e.target.value)}
                  placeholder="e.g. Sikanderpur Metro Service Lane"
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                />
              </div>

              {/* Q1: Lighting */}
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'hi' ? '1. स्ट्रीटलाइट की रोशनी कैसी है?' : '1. How is the street lighting?'}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuditLighting('bright')}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      auditLighting === 'bright'
                        ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('optBright')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditLighting('dim')}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      auditLighting === 'dim'
                        ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('optDim')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditLighting('dark')}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      auditLighting === 'dark'
                        ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('optDark')}
                  </button>
                </div>
              </div>

              {/* Q2: Crowd & Open Shops */}
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>{lang === 'hi' ? '2. लोग और खुली दुकानें?' : '2. People & Open Shops?'}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuditCrowd('busy')}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      auditCrowd === 'busy'
                        ? 'bg-blue-600 text-white border-blue-700 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('optBusy')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditCrowd('moderate')}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      auditCrowd === 'moderate'
                        ? 'bg-blue-600 text-white border-blue-700 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('optModerate')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditCrowd('deserted')}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      auditCrowd === 'deserted'
                        ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t('optDeserted')}
                  </button>
                </div>
              </div>

              {/* Q3: Police & Guards */}
              <div>
                <label className="block text-stone-700 font-medium mb-1.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'hi' ? '3. सुरक्षा / पुलिस या गार्ड दिखे?' : '3. Police, CCTV, or Guards present?'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuditSecurity('present')}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      auditSecurity === 'present'
                        ? 'bg-emerald-600 text-white border-emerald-700 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {lang === 'hi' ? 'हाँ, गार्ड/पुलिस दिखे' : 'Yes, Guards/Police Active'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditSecurity('absent')}
                    className={`py-2 px-1 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                      auditSecurity === 'absent'
                        ? 'bg-stone-800 text-white border-stone-800 font-semibold'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {lang === 'hi' ? 'कोई नहीं दिखा' : 'None Visible'}
                  </button>
                </div>
              </div>

              {/* Photo Simulation Button */}
              <div className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-stone-500" />
                  <div>
                    <span className="font-medium text-stone-800 block text-[11px]">
                      {lang === 'hi' ? 'फोटो साक्ष्य जोड़ें (वैकल्पिक)' : 'Attach Geo-tagged Photo Proof'}
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      {auditPhotoAttached ? (lang === 'hi' ? 'फोटो संलग्न: dark_stretch_audit.jpg' : 'Photo attached: dark_stretch_audit.jpg') : (lang === 'hi' ? 'स्मार्टलाइट या टूटे खंभे की फोटो' : 'Streetlight or dark stretch image')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuditPhotoAttached(!auditPhotoAttached)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium border cursor-pointer ${
                    auditPhotoAttached
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {auditPhotoAttached ? (lang === 'hi' ? 'संलग्न है' : 'Attached') : (lang === 'hi' ? 'फोटो चुनें' : 'Attach Photo')}
                </button>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'hi' ? 'कोई अन्य टिप्पणी (वैकल्पिक)' : 'Additional Comments (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={auditComments}
                  onChange={(e) => setAuditComments(e.target.value)}
                  placeholder={lang === 'hi' ? 'जैसे: 24/7 केमिस्ट खुला रहता है, मेट्रो के पास अच्छा माहौल है।' : 'e.g. 24/7 chemist is open, well populated corridor.'}
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                />
              </div>

              {auditSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  {auditSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={auditSubmitting}
                className="w-full h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {auditSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{t('submitRating')}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}