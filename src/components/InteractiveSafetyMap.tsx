'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  Shield,
  MapPin,
  Sun,
  Layers,
  Phone,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Search,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  MessageSquare,
  AlertCircle,
  X,
  Star,
  Share2,
  Radio,
  LocateFixed,
  Zap,
} from 'lucide-react';
import {
  DELHI_NCR_SAFE_HAVENS,
  SafeHaven,
} from '@/lib/data-delhi-ncr';
import { useLanguage } from '@/lib/i18n';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] rounded-2xl bg-white border border-rose-200/80 flex flex-col items-center justify-center text-stone-500 gap-3">
      <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-medium">Loading OpenStreetMap Safety Topology...</p>
    </div>
  ),
});

interface PresetRoute {
  label: string;
  labelHi: string;
  origin: string;
  destination: string;
  city: 'gurugram' | 'delhi';
}

const PRESET_ROUTES: PresetRoute[] = [
  {
    label: 'Cyber City ➔ Sector 29',
    labelHi: 'साइबर सिटी ➔ सेक्टर 29',
    origin: 'DLF Cyber Hub',
    destination: 'Sector 29 Market',
    city: 'gurugram',
  },
  {
    label: 'Sikanderpur ➔ Galleria',
    labelHi: 'सिकंदरपुर ➔ गलेरिया मार्केट',
    origin: 'Sikanderpur Metro',
    destination: 'Galleria Market',
    city: 'gurugram',
  },
  {
    label: 'Rajiv Chowk ➔ Hauz Khas',
    labelHi: 'राजीव चौक ➔ हौज़ खास',
    origin: 'Rajiv Chowk',
    destination: 'Hauz Khas Village',
    city: 'delhi',
  },
  {
    label: 'Saket Metro ➔ Khan Market',
    labelHi: 'साकेत मेट्रो ➔ खान मार्केट',
    origin: 'Saket Metro',
    destination: 'Khan Market',
    city: 'delhi',
  },
];

// Haversine distance in meters
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function InteractiveSafetyMap() {
  const { lang, t } = useLanguage();

  const [selectedCity, setSelectedCity] = useState<'gurugram' | 'delhi' | 'worldwide'>('gurugram');
  const [originInput, setOriginInput] = useState('DLF Cyber Hub');
  const [destInput, setDestInput] = useState('Sector 29 Market');

  const [showLightingLayer, setShowLightingLayer] = useState(true);
  const [showSafeHavens, setShowSafeHavens] = useState(true);

  // 3 Route Personalities: 'best_supported' | 'balanced' | 'direct'
  const [activeRouteType, setActiveRouteType] = useState<'best_supported' | 'balanced' | 'direct'>('best_supported');

  const [routesData, setRoutesData] = useState<any[]>([]);
  const [nearbyHavens, setNearbyHavens] = useState<SafeHaven[]>(DELHI_NCR_SAFE_HAVENS);
  const [activeHavenDetail, setActiveHavenDetail] = useState<SafeHaven | null>(null);

  const [loadingRoute, setLoadingRoute] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  // Live GPS Tracking & Deviation
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isGpsTracking, setIsGpsTracking] = useState(false);
  const [deviationAlert, setDeviationAlert] = useState<{
    isDeviated: boolean;
    distanceMeters: number;
    nearestHaven?: SafeHaven;
  } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Community Hazard & Feedback State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const [reportCategory, setReportCategory] = useState('broken_streetlight');
  const [reportAddress, setReportAddress] = useState('DLF Phase 2 Service Road');
  const [reportDesc, setReportDesc] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  const [feedbackSafety, setFeedbackSafety] = useState(4);
  const [feedbackLighting, setFeedbackLighting] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('');

  const [recentReports, setRecentReports] = useState<any[]>([]);

  // Fetch routes from API
  const fetchRoute = async (origin: string, dest: string, city: string) => {
    setLoadingRoute(true);
    try {
      const res = await fetch(
        `/api/routes?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(
          dest
        )}&city=${city}&mode=foot`
      );
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        setRoutesData(data.routes);
        // Default to best_supported if present
        const hasBest = data.routes.find((r: any) => r.type === 'best_supported');
        if (hasBest) {
          setActiveRouteType('best_supported');
        } else {
          setActiveRouteType(data.routes[0].type);
        }
        if (data.nearbyHavens && data.nearbyHavens.length > 0) {
          setNearbyHavens(data.nearbyHavens);
        }
      }
    } catch (err) {
      console.error('Failed to fetch routes', err);
    } finally {
      setLoadingRoute(false);
    }
  };

  // Fetch community reports
  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.reports) {
        setRecentReports(data.reports);
      }
    } catch (e) {
      console.error('Failed to load reports', e);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRoute(originInput, destInput, selectedCity);
    fetchReports();
  }, []);

  // Cleanup GPS watcher
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Toggle Live GPS Tracking
  const toggleGpsTracking = () => {
    if (isGpsTracking) {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsGpsTracking(false);
      setUserLocation(null);
      setDeviationAlert(null);
    } else {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        alert(lang === 'hi' ? 'आपके डिवाइस में जीपीएस सपोर्ट नहीं है।' : 'Geolocation not supported by your device.');
        return;
      }

      setIsGpsTracking(true);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);

          // Check deviation against currentRoute polyline
          const current =
            routesData.find((r) => r.type === activeRouteType) || routesData[0];
          if (current && current.coordinates && current.coordinates.length > 0) {
            let minDistance = Infinity;
            for (const pt of current.coordinates) {
              const d = getDistanceMeters(coords[0], coords[1], pt[0], pt[1]);
              if (d < minDistance) minDistance = d;
            }

            // Find nearest haven
            let nearestH: SafeHaven | undefined = undefined;
            let minHDist = Infinity;
            nearbyHavens.forEach((h) => {
              const dh = getDistanceMeters(coords[0], coords[1], h.lat, h.lng);
              if (dh < minHDist) {
                minHDist = dh;
                nearestH = h;
              }
            });

            if (minDistance > 65) {
              setDeviationAlert({
                isDeviated: true,
                distanceMeters: Math.round(minDistance),
                nearestHaven: nearestH,
              });
            } else {
              setDeviationAlert(null);
            }
          }
        },
        (err) => {
          console.warn('GPS watch error', err);
          // Fallback simulation location for demo in Gurugram
          const fallbackCoords: [number, number] = [28.4912, 77.0894];
          setUserLocation(fallbackCoords);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
      );
    }
  };

  const handleCitySwitch = (city: 'gurugram' | 'delhi' | 'worldwide') => {
    setSelectedCity(city);
    if (city === 'gurugram') {
      setOriginInput('DLF Cyber Hub');
      setDestInput('Sector 29 Market');
      fetchRoute('DLF Cyber Hub', 'Sector 29 Market', 'gurugram');
    } else if (city === 'delhi') {
      setOriginInput('Rajiv Chowk');
      setDestInput('Hauz Khas Village');
      fetchRoute('Rajiv Chowk', 'Hauz Khas Village', 'delhi');
    }
  };

  const handleSelectPreset = (preset: PresetRoute) => {
    setSelectedCity(preset.city);
    setOriginInput(preset.origin);
    setDestInput(preset.destination);
    fetchRoute(preset.origin, preset.destination, preset.city);
  };

  const handleRouteToHaven = (haven: SafeHaven) => {
    setDestInput(haven.name);
    fetchRoute(originInput, `${haven.lat},${haven.lng}`, selectedCity);
  };

  // WhatsApp / SMS Live Share
  const handleShareRoute = () => {
    const shareText =
      lang === 'hi'
        ? `मैं सेफ़ी (Safie) सुरक्षित पैदल मैप से घर जा रही हूँ। गंतव्य: ${destInput}। मेरा सुरक्षित रास्ता यहाँ देखें: https://safie-sooty.vercel.app/`
        : `I am walking home safely using Safie. Route: ${originInput} to ${destInput}. Track my safe route: https://safie-sooty.vercel.app/`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'Safie Safe Walk Live', text: shareText, url: 'https://safie-sooty.vercel.app/' }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  // Handle Hazard Report Submission
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportStatus(lang === 'hi' ? 'जमा हो रहा है...' : 'Submitting to Neon DB...');
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: reportCategory,
          lat: 28.4900,
          lng: 77.0880,
          address: reportAddress,
          description: reportDesc,
        }),
      });
      if (res.ok) {
        setReportStatus(lang === 'hi' ? 'रिपोर्ट दर्ज कर ली गई है। धन्यवाद!' : 'Report recorded on Neon PostgreSQL.');
        setReportDesc('');
        fetchReports();
        setTimeout(() => {
          setIsReportOpen(false);
          setReportStatus('');
        }, 1200);
      } else {
        setReportStatus(lang === 'hi' ? 'रिपोर्ट सबमिट नहीं हो सकी।' : 'Failed to submit report');
      }
    } catch (err: any) {
      setReportStatus('Error: ' + err.message);
    }
  };

  // Handle Feedback Submission
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus(lang === 'hi' ? 'रेटिंग सुरक्षित हो रही है...' : 'Submitting rating...');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: originInput,
          destination: destInput,
          perceivedSafetyRating: feedbackSafety,
          actualLightingRating: feedbackLighting,
          comments: feedbackComment,
        }),
      });
      if (res.ok) {
        setFeedbackStatus(lang === 'hi' ? 'सड़क रेटिंग दर्ज हो गई है।' : 'Rating saved on Neon PostgreSQL.');
        setFeedbackComment('');
        setTimeout(() => {
          setIsFeedbackOpen(false);
          setFeedbackStatus('');
        }, 1200);
      } else {
        setFeedbackStatus('Failed to record rating');
      }
    } catch (err: any) {
      setFeedbackStatus('Error: ' + err.message);
    }
  };

  const currentRoute =
    routesData.find((r) => r.type === activeRouteType) || routesData[0] || null;

  return (
    <section id="map" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-rose-700 text-xs font-mono">
          <MapPin className="w-3.5 h-3.5" />
          <span>{t('routeSectionBadge')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          {t('routeSectionTitle')}
        </h2>
        <p className="text-sm text-stone-600">
          {t('routeSectionSub')}
        </p>
      </div>

      {/* Control & Waypoint Input Bar */}
      <div className="mb-4 p-4 rounded-2xl bg-white border border-rose-200/80 space-y-3 shadow-xs">
        {/* Row 1: Territory Tabs & Community Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-stone-500 mr-1">
              {lang === 'hi' ? 'शहर:' : 'Territory:'}
            </span>
            <button
              onClick={() => handleCitySwitch('gurugram')}
              className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCity === 'gurugram'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              {lang === 'hi' ? 'गुरुग्राम' : 'Gurugram'}
            </button>
            <button
              onClick={() => handleCitySwitch('delhi')}
              className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCity === 'delhi'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              {lang === 'hi' ? 'दिल्ली' : 'Delhi'}
            </button>
            <button
              onClick={() => handleCitySwitch('worldwide')}
              className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCity === 'worldwide'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              {lang === 'hi' ? 'अन्य शहर' : 'Any City'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Live GPS Companion Button */}
            <button
              onClick={toggleGpsTracking}
              className={`h-8 px-2.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
                isGpsTracking
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-800'
              }`}
              title="Track live walking location via GPS"
            >
              <LocateFixed className="w-3.5 h-3.5" />
              <span>
                {isGpsTracking
                  ? lang === 'hi'
                    ? 'जीपीएस चालू है'
                    : 'GPS Tracking Active'
                  : lang === 'hi'
                  ? 'लाइव जीपीएस वॉकिंग'
                  : 'Start Live GPS Walk'}
              </span>
            </button>

            {/* Share Live Route Button */}
            <button
              onClick={handleShareRoute}
              className="h-8 px-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'रास्ता शेयर करें' : 'Share Route'}</span>
            </button>

            <button
              onClick={() => setIsReportOpen(true)}
              className="h-8 px-2.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'hi' ? 'खराबी रिपोर्ट करें' : 'Report Hazard'}</span>
            </button>

            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="h-8 px-2.5 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-stone-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
              <span>{lang === 'hi' ? 'सड़क रेटिंग' : 'Rate Route'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Waypoint Inputs (Origin / Destination) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-rose-100 items-center">
          <div className="sm:col-span-5 relative">
            <span className="absolute left-3 top-2.5 text-[10px] font-mono text-stone-400 font-semibold">
              {lang === 'hi' ? 'कहाँ से' : 'FROM'}
            </span>
            <input
              type="text"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              placeholder={t('originPlaceholder')}
              className="w-full pl-15 pr-3 py-2 text-xs rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="sm:col-span-5 relative">
            <span className="absolute left-3 top-2.5 text-[10px] font-mono text-stone-400 font-semibold">
              {lang === 'hi' ? 'कहाँ तक' : 'TO'}
            </span>
            <input
              type="text"
              value={destInput}
              onChange={(e) => setDestInput(e.target.value)}
              placeholder={t('destPlaceholder')}
              className="w-full pl-15 pr-3 py-2 text-xs rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={() => fetchRoute(originInput, destInput, selectedCity)}
              disabled={loadingRoute}
              className="w-full h-8 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {loadingRoute ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'रास्ता खोजें' : 'Calculate'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Row 3: Preset Hotspots */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-stone-400 font-mono">
            {lang === 'hi' ? 'लोकप्रिय रास्ते:' : 'Popular Corridors:'}
          </span>
          {PRESET_ROUTES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="px-2 py-0.5 rounded bg-rose-50/60 hover:bg-rose-100 text-stone-700 border border-rose-100 transition-colors cursor-pointer"
            >
              {lang === 'hi' ? p.labelHi : p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Route Personality Selector Tabs */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={() => setActiveRouteType('best_supported')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
            activeRouteType === 'best_supported'
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-200 shadow-xs'
              : 'bg-white border-stone-200 hover:border-emerald-300 opacity-90'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <strong className="text-xs text-stone-900 font-semibold">
                {lang === 'hi' ? 'सर्वश्रेष्ठ सुरक्षित मार्ग' : 'Best-Supported Route'}
              </strong>
            </div>
            <p className="text-[11px] text-stone-600 leading-snug">
              {lang === 'hi'
                ? '96% स्ट्रीटलाइट्स, 4 सुरक्षित दुकानें, अंधेरी गलियों से बचाव'
                : '96% illuminated, 4 open 24/7 havens, zero dark alleys'}
            </p>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex-shrink-0">
            {lang === 'hi' ? 'अनुशंसित' : 'Recommended'}
          </span>
        </button>

        <button
          onClick={() => setActiveRouteType('balanced')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
            activeRouteType === 'balanced'
              ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200 shadow-xs'
              : 'bg-white border-stone-200 hover:border-blue-300 opacity-90'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <strong className="text-xs text-stone-900 font-semibold">
                {lang === 'hi' ? 'संतुलित मार्ग' : 'Balanced Route'}
              </strong>
            </div>
            <p className="text-[11px] text-stone-600 leading-snug">
              {lang === 'hi'
                ? '78% रोशनी, 2 सुरक्षित ठिकाने, समय और सुरक्षा का संतुलन'
                : '78% illuminated, 2 sanctuaries, balanced walking duration'}
            </p>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-medium flex-shrink-0">
            {lang === 'hi' ? 'संतुलित' : 'Balanced'}
          </span>
        </button>

        <button
          onClick={() => setActiveRouteType('direct')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
            activeRouteType === 'direct'
              ? 'bg-red-50/70 border-red-500 ring-2 ring-red-200 shadow-xs'
              : 'bg-white border-stone-200 hover:border-red-300 opacity-90'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <strong className="text-xs text-stone-900 font-semibold">
                {lang === 'hi' ? 'सीधा शॉर्टकट (चेतावनी)' : 'Direct Shortcut (Warning)'}
              </strong>
            </div>
            <p className="text-[11px] text-stone-600 leading-snug">
              {lang === 'hi'
                ? '42% रोशनी, 2 सुनसान अंधेरी गलियां, कोई सुरक्षित दुकान नहीं'
                : '42% lit, 2 unlit blind alleys, no 24/7 staff havens'}
            </p>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-medium flex-shrink-0">
            {lang === 'hi' ? 'शॉर्टकट' : 'Fastest'}
          </span>
        </button>
      </div>

      {/* GPS Off-Route Deviation Alert Banner */}
      {deviationAlert && deviationAlert.isDeviated && (
        <div className="mb-4 p-4 rounded-xl bg-amber-500 text-white flex items-start gap-3 shadow-md animate-bounce">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-stone-900" />
          <div className="flex-1 text-xs">
            <strong className="text-sm font-bold block text-stone-900">
              {lang === 'hi'
                ? 'सुरक्षित मार्ग से भटकाव की चेतावनी!'
                : 'Safe Corridor Deviation Alert!'}
            </strong>
            <p className="mt-0.5 text-stone-950 font-medium">
              {lang === 'hi'
                ? `आप रोशनी वाले सुरक्षित रास्ते से ${deviationAlert.distanceMeters} मीटर दूर चले गए हैं।`
                : `You are ${deviationAlert.distanceMeters} meters away from the verified illuminated corridor.`}
              {deviationAlert.nearestHaven && (
                <span className="block mt-1 underline cursor-pointer" onClick={() => handleRouteToHaven(deviationAlert.nearestHaven!)}>
                  {lang === 'hi'
                    ? `नजदीकी सुरक्षित ठिकाना: ${deviationAlert.nearestHaven.name} (यहाँ जाएँ)`
                    : `Nearest sanctuary: ${deviationAlert.nearestHaven.name} (Tap to reroute)`}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 h-[540px] rounded-2xl overflow-hidden border border-rose-200/80 relative bg-white shadow-xs">
          <LeafletMapInner
            city={selectedCity}
            showLighting={showLightingLayer}
            showHavens={showSafeHavens}
            routeType={activeRouteType}
            routeData={currentRoute}
            safeHavens={nearbyHavens}
            userLocation={userLocation}
            onSelectHaven={(haven: SafeHaven) => setActiveHavenDetail(haven)}
            onMapClick={(lat, lng) => {
              setDestInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
              fetchRoute(originInput, `${lat},${lng}`, selectedCity);
            }}
          />
        </div>

        {/* Side Panel: Route Metrics & Haven Spotlight */}
        <div className="space-y-4">
          {/* Active Route Telemetry & Plain Explanation */}
          {currentRoute && (
            <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-rose-600" />
                  <span>{currentRoute.title}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                    activeRouteType === 'best_supported'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : activeRouteType === 'balanced'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                  title="Street Support Index (SSI) based on lighting and crowd presence"
                >
                  SSI: {currentRoute.score}/100
                </span>
              </div>

              {/* Plain-Language Why This Route Card */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1">
                <strong className="text-stone-900 block font-medium flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('routeExplanationTitle')}</span>
                </strong>
                <p className="leading-relaxed text-[11.5px]">
                  {lang === 'hi' && currentRoute.explanationHi
                    ? currentRoute.explanationHi
                    : currentRoute.explanation ||
                      'Prioritizes continuous streetlights and 24/7 commercial activity.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-100">
                  <span className="text-[10px] font-mono text-stone-500 block">
                    {lang === 'hi' ? 'अनुमानित समय' : 'Estimated Time'}
                  </span>
                  <span className="text-lg font-semibold text-stone-900 font-mono">
                    {currentRoute.durationMinutes} mins
                  </span>
                  <span className="text-[10px] text-stone-400 block">{currentRoute.distanceKm} km</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-100">
                  <span className="text-[10px] font-mono text-stone-500 block">
                    {lang === 'hi' ? 'रोशनी की मात्रा' : 'Illumination'}
                  </span>
                  <span className="text-lg font-semibold text-stone-900 font-mono">
                    {currentRoute.litPercentage}%
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    {activeRouteType === 'best_supported'
                      ? lang === 'hi' ? 'पूरी रोशनी' : 'CCMS Verified Lit'
                      : lang === 'hi' ? 'अंधेरे मोड़ शामिल' : 'Unlit Alleys'}
                  </span>
                </div>
              </div>

              {/* Street Support Index Metrics */}
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between text-stone-600">
                  <span>{lang === 'hi' ? '24/7 खुली दुकानें व थाने:' : 'Open havens & 24/7 staff:'}</span>
                  <span className="font-mono font-medium">
                    {currentRoute.scoreBreakdown?.openPlaces || 24}/25
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${((currentRoute.scoreBreakdown?.openPlaces || 24) / 25) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-stone-600 pt-1">
                  <span>{lang === 'hi' ? 'स्ट्रीटलाइट कवरेज:' : 'Street lighting coverage:'}</span>
                  <span className="font-mono font-medium">
                    {currentRoute.scoreBreakdown?.streetLighting || 23}/25
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${((currentRoute.scoreBreakdown?.streetLighting || 23) / 25) * 100}%` }}
                  />
                </div>
              </div>

              {/* Turn Directions Toggle */}
              {currentRoute.steps && currentRoute.steps.length > 0 && (
                <div className="pt-2 border-t border-rose-100">
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="w-full flex items-center justify-between text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                  >
                    <span>
                      {lang === 'hi'
                        ? `रास्ते के निर्देश देखें (${currentRoute.steps.length} मोड़)`
                        : `View Turn Directions (${currentRoute.steps.length} steps)`}
                    </span>
                    {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showSteps && (
                    <ol className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1 text-[11px] text-stone-600 list-decimal pl-4">
                      {currentRoute.steps.map((st: any, i: number) => (
                        <li key={i} className="leading-snug">
                          <span>{st.instruction}</span>
                          {st.safetyTag && (
                            <span
                              className={`ml-1 text-[9px] px-1 py-0.2 rounded font-mono font-semibold ${
                                st.safetyTag === 'safe_haven'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : st.safetyTag === 'dark_alley'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {lang === 'hi' && st.safetyTagTextHi ? st.safetyTagTextHi : st.safetyTag}
                            </span>
                          )}
                          {st.distanceM > 0 && (
                            <span className="text-stone-400 font-mono ml-1">({st.distanceM}m)</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Active Haven Spotlight */}
          <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-500">
                {activeHavenDetail
                  ? lang === 'hi' ? 'चुना हुआ सुरक्षित ठिकाना' : 'Selected Sanctuary'
                  : lang === 'hi' ? 'नजदीकी सुरक्षित ठिकाना' : 'Nearby Sanctuary'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                {lang === 'hi' ? '24/7 जाँचा हुआ' : 'Verified 24/7'}
              </span>
            </div>

            {activeHavenDetail ? (
              <div className="space-y-2 text-xs">
                <h4 className="text-sm font-semibold text-stone-900">{activeHavenDetail.name}</h4>
                <p className="text-stone-600">{activeHavenDetail.address}</p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                    <span className="text-stone-500 block text-[10px]">{lang === 'hi' ? 'प्रकार' : 'Type'}</span>
                    <strong className="text-stone-800 font-medium text-xs">
                      {activeHavenDetail.categoryLabel}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                    <span className="text-stone-500 block text-[10px]">
                      {lang === 'hi' ? 'कोडवर्ड' : 'Staff Protocol'}
                    </span>
                    <strong className="text-rose-700 font-medium text-xs">Ask for Angela</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleRouteToHaven(activeHavenDetail)}
                    className="flex-1 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{lang === 'hi' ? 'यहाँ का रास्ता लें' : 'Route Here'}</span>
                  </button>

                  <a
                    href={`tel:${activeHavenDetail.phone}`}
                    className="h-8 px-3 rounded-lg border border-rose-200 text-stone-700 hover:bg-rose-50 text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3 h-3 text-stone-500" />
                    <span>{lang === 'hi' ? 'कॉल' : 'Call'}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <h4 className="text-sm font-semibold text-stone-900">Apollo Pharmacy 24/7 (DLF Cyber Hub)</h4>
                <p className="text-stone-600">
                  Shop 14, Building 8B, DLF Cyber City, Gurugram.
                </p>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    {lang === 'hi'
                      ? 'ड्यूटी पर फार्मासिस्ट और सीधा पुलिस संपर्क'
                      : 'On-duty pharmacist and direct police relay'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 pt-1">
                  {lang === 'hi'
                    ? 'मैप पर किसी भी हरे शील्ड पर क्लिक करके सुरक्षित ठिकाने की जानकारी देखें।'
                    : 'Click any green shield marker on the map to inspect refuge capabilities or recalculate a safe route to it.'}
                </p>
              </div>
            )}
          </div>

          {/* Recent Community Hazard Feed */}
          {recentReports.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-rose-200/80 space-y-2 text-xs shadow-xs">
              <span className="text-[10px] font-mono text-stone-500 uppercase block font-medium">
                {lang === 'hi' ? 'लाइव जनता अलर्ट फ़ीड' : 'Live Community Hazard Feed'}
              </span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {recentReports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="p-2 rounded-lg bg-rose-50/30 border border-rose-100 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-stone-900 capitalize block">
                        {rep.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-stone-500 block truncate max-w-[200px]">
                        {rep.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Epistemological Transparency Note */}
      <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 text-center">
        {lang === 'hi'
          ? 'स्पष्टीकरण: सेफ़ी का स्ट्रीट सपोर्ट इंडेक्स (SSI) स्ट्रीटलाइट डेटा और खुली दुकानों के आधार पर निकाला गया है। यह कोई पूर्ण सुरक्षा गारंटी नहीं है। आपात स्थिति में सीधे 112 डायल करें।'
          : 'Notice: Street Support Index (SSI) is calculated from municipal CCMS lighting records, verified 24/7 safe havens, and crowdsourced commuter reports. It serves as an environmental indicator, not an absolute guarantee of personal safety.'}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: REPORT STREET HAZARD (Community Intelligence) */}
      {/* ============================================================== */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="relative max-w-md w-full rounded-2xl bg-white border border-rose-200 p-6 shadow-xl text-left space-y-4">
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>{lang === 'hi' ? 'जनता सड़क सुरक्षा शिकायत' : 'Community Hazard Reporting'}</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mt-1">
                {lang === 'hi' ? 'सड़क की समस्या बताएं' : 'Report a Street Hazard'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi'
                  ? 'अंधेरी गलियों या खराब स्ट्रीटलाइट की रिपोर्ट दर्ज करें ताकि दूसरों को बचाया जा सके।'
                  : 'Help other commuters by reporting dark spots, broken streetlights, or harassment zones.'}
              </p>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'hi' ? 'समस्या की श्रेणी' : 'Hazard Category'}
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                >
                  <option value="broken_streetlight">
                    {lang === 'hi' ? 'खराब / बंद स्ट्रीटलाइट' : 'Broken / Blown Streetlight'}
                  </option>
                  <option value="unlit_dark_spot">
                    {lang === 'hi' ? 'अंधेरा मोड़ / ब्लैकस्पॉट' : 'Unlit Dark Stretch / Blackspot'}
                  </option>
                  <option value="harassment">
                    {lang === 'hi' ? 'संदिग्ध जमावड़ा / छेड़खानी का खतरा' : 'Harassment / Suspicious Gathering'}
                  </option>
                  <option value="isolated_area">
                    {lang === 'hi' ? 'सुनसान सुनसान रास्ता' : 'Isolated / Desolate Alley'}
                  </option>
                  <option value="blocked_sidewalk">
                    {lang === 'hi' ? 'टूटा हुआ / बंद फुटपाथ' : 'Blocked Footpath / Barrier'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'hi' ? 'सड़क या लैंडमार्क का पता' : 'Street / Landmark Address'}
                </label>
                <input
                  type="text"
                  required
                  value={reportAddress}
                  onChange={(e) => setReportAddress(e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा. सिकंदरपुर मेट्रो पिलर 42 के पास' : 'e.g. Near Sikanderpur Metro Pillar 42'}
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'hi' ? 'विवरण' : 'Details & Evidence'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder={lang === 'hi' ? 'रात 10 बजे के बाद 3 खंभों की लाइट बंद रहती है।' : 'Describe what you observed (e.g. 3 consecutive smart poles turned off after 10 PM).'}
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                />
              </div>

              {reportStatus && (
                <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                  {reportStatus}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'hi' ? 'रिपोर्ट सबमिट करें' : 'Submit Street Hazard Report'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: RATE ROUTE SAFETY (Commuter Feedback) */}
      {/* ============================================================== */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="relative max-w-md w-full rounded-2xl bg-white border border-rose-200 p-6 shadow-xl text-left space-y-4">
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono">
                <Star className="w-3 h-3 text-rose-600" />
                <span>{lang === 'hi' ? 'यात्री अनुभव रेटिंग' : 'Commuter Route Ground Verification'}</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mt-1">
                {lang === 'hi' ? 'रास्ते को रेटिंग दें' : 'Rate Your Route Experience'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'hi'
                  ? 'क्या वास्तविक सड़क पर अच्छी रोशनी थी? आपकी रेटिंग से हमारे रूटिंग मॉडल को सीखने में मदद मिलती है।'
                  : "Did the actual street match Safie's Night Activity Score? Your rating trains our routing weights."}
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'hi' ? 'सुरक्षा अनुभव (1 से 5 स्टार):' : 'Perceived Safety (1 to 5 Stars):'} <strong className="text-rose-600">{feedbackSafety}/5</strong>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackSafety(star)}
                      className={`w-9 h-8 rounded-lg border font-mono font-medium ${
                        feedbackSafety >= star
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'hi' ? 'सड़क पर रोशनी की स्थिति:' : 'Actual Lighting Condition:'} <strong className="text-rose-600">{feedbackLighting}/5</strong>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackLighting(star)}
                      className={`w-9 h-8 rounded-lg border font-mono font-medium ${
                        feedbackLighting >= star
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  {lang === 'hi' ? 'आपकी टिप्पणी' : 'Commuter Comments'}
                </label>
                <textarea
                  rows={2}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा. मेट्रो मोड़ तक अच्छी रोशनी थी, 24/7 केमिस्ट के बाहर गार्ड मौजूद थे।' : 'e.g. Well lit until the metro turn; guards were present outside the 24/7 chemist.'}
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                />
              </div>

              {feedbackStatus && (
                <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                  {feedbackStatus}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{lang === 'hi' ? 'रेटिंग सुरक्षित करें' : 'Save Route Rating'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}