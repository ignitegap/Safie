'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  DELHI_NCR_SAFE_HAVENS,
  SafeHaven,
} from '@/lib/data-delhi-ncr';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-white border border-rose-200/80 flex flex-col items-center justify-center text-stone-500 gap-3">
      <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-medium">Loading OpenStreetMap Safety Topology...</p>
    </div>
  ),
});

interface PresetRoute {
  label: string;
  origin: string;
  destination: string;
  city: 'gurugram' | 'delhi';
}

const PRESET_ROUTES: PresetRoute[] = [
  {
    label: 'Cyber City ➔ Sector 29',
    origin: 'DLF Cyber Hub',
    destination: 'Sector 29 Market',
    city: 'gurugram',
  },
  {
    label: 'Sikanderpur ➔ Galleria',
    origin: 'Sikanderpur Metro',
    destination: 'Galleria Market',
    city: 'gurugram',
  },
  {
    label: 'Rajiv Chowk ➔ Hauz Khas',
    origin: 'Rajiv Chowk',
    destination: 'Hauz Khas Village',
    city: 'delhi',
  },
  {
    label: 'Saket Metro ➔ Khan Market',
    origin: 'Saket Metro',
    destination: 'Khan Market',
    city: 'delhi',
  },
];

export default function InteractiveSafetyMap() {
  const [selectedCity, setSelectedCity] = useState<'gurugram' | 'delhi' | 'worldwide'>('gurugram');
  const [originInput, setOriginInput] = useState('DLF Cyber Hub');
  const [destInput, setDestInput] = useState('Sector 29 Market');
  
  const [showLightingLayer, setShowLightingLayer] = useState(true);
  const [showSafeHavens, setShowSafeHavens] = useState(true);
  const [activeRouteType, setActiveRouteType] = useState<'safest' | 'fastest'>('safest');
  
  const [routesData, setRoutesData] = useState<any[]>([]);
  const [nearbyHavens, setNearbyHavens] = useState<SafeHaven[]>(DELHI_NCR_SAFE_HAVENS);
  const [activeHavenDetail, setActiveHavenDetail] = useState<SafeHaven | null>(null);
  
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

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

  // Handle Hazard Report Submission
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportStatus('Submitting to Neon DB...');
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
        setReportStatus('Report recorded on Neon PostgreSQL.');
        setReportDesc('');
        fetchReports();
        setTimeout(() => {
          setIsReportOpen(false);
          setReportStatus('');
        }, 1200);
      } else {
        setReportStatus('Failed to submit report');
      }
    } catch (err: any) {
      setReportStatus('Error: ' + err.message);
    }
  };

  // Handle Feedback Submission
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus('Submitting rating...');
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
        setFeedbackStatus('Rating saved on Neon PostgreSQL.');
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
          <span>Interactive Urban Safety Topology</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          Delhi & Gurugram Live Safety Routing Engine
        </h2>
        <p className="text-sm text-stone-600">
          Compare safest illuminated corridors vs standard shortest paths with real-time community reports.
        </p>
      </div>

      {/* Control & Waypoint Input Bar */}
      <div className="mb-4 p-4 rounded-2xl bg-white border border-rose-200/80 space-y-3">
        
        {/* Row 1: Territory Tabs & Community Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-stone-500 mr-1">Territory:</span>
            <button
              onClick={() => handleCitySwitch('gurugram')}
              className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCity === 'gurugram'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              Gurugram
            </button>
            <button
              onClick={() => handleCitySwitch('delhi')}
              className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCity === 'delhi'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              Delhi
            </button>
            <button
              onClick={() => handleCitySwitch('worldwide')}
              className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCity === 'worldwide'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50/60 text-stone-700 hover:bg-rose-100'
              }`}
            >
              Worldwide Search
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportOpen(true)}
              className="h-8 px-2.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Report Hazard</span>
            </button>

            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="h-8 px-2.5 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-stone-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
              <span>Rate Route</span>
            </button>

            <button
              onClick={() =>
                setActiveRouteType(activeRouteType === 'safest' ? 'fastest' : 'safest')
              }
              className={`h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeRouteType === 'safest'
                  ? 'bg-stone-900 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              <span>{activeRouteType === 'safest' ? 'Showing: Safest Route' : 'Showing: Fastest Shortcut'}</span>
            </button>
          </div>

        </div>

        {/* Row 2: Waypoint Inputs (Origin / Destination) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-rose-100 items-center">
          
          <div className="sm:col-span-5 relative">
            <span className="absolute left-3 top-2.5 text-[10px] font-mono text-stone-400 font-semibold">
              FROM
            </span>
            <input
              type="text"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              placeholder="e.g. DLF Cyber Hub or Connaught Place"
              className="w-full pl-13 pr-3 py-2 text-xs rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="sm:col-span-5 relative">
            <span className="absolute left-3 top-2.5 text-[10px] font-mono text-stone-400 font-semibold">
              TO
            </span>
            <input
              type="text"
              value={destInput}
              onChange={(e) => setDestInput(e.target.value)}
              placeholder="e.g. Sector 29 or Hauz Khas"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600"
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
                  <span>Calculate</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Row 3: Preset Hotspots */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-stone-400 font-mono">Popular Corridors:</span>
          {PRESET_ROUTES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(p)}
              className="px-2 py-0.5 rounded bg-rose-50/60 hover:bg-rose-100 text-stone-700 border border-rose-100 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Interactive Map Visual */}
        <div className="lg:col-span-2 h-[520px] rounded-2xl overflow-hidden border border-rose-200/80 relative bg-white">
          <LeafletMapInner
            city={selectedCity}
            showLighting={showLightingLayer}
            showHavens={showSafeHavens}
            routeType={activeRouteType}
            routeData={currentRoute}
            safeHavens={nearbyHavens}
            onSelectHaven={(haven: SafeHaven) => setActiveHavenDetail(haven)}
            onMapClick={(lat, lng) => {
              setDestInput(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
              fetchRoute(originInput, `${lat},${lng}`, selectedCity);
            }}
          />
        </div>

        {/* Side Panel: Route Metrics & Haven Spotlight */}
        <div className="space-y-4">
          
          {/* Active Route Telemetry & Night Activity Score */}
          {currentRoute && (
            <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-rose-600" />
                  <span>{currentRoute.title}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                    activeRouteType === 'safest'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  Score: {currentRoute.score}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-100">
                  <span className="text-[10px] font-mono text-stone-500 block">Estimated Time</span>
                  <span className="text-lg font-semibold text-stone-900 font-mono">
                    {currentRoute.durationMinutes} mins
                  </span>
                  <span className="text-[10px] text-stone-400 block">{currentRoute.distanceKm} km</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-100">
                  <span className="text-[10px] font-mono text-stone-500 block">Illumination</span>
                  <span className="text-lg font-semibold text-stone-900 font-mono">
                    {currentRoute.litPercentage}%
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    {activeRouteType === 'safest' ? 'CCMS Verified Lit' : '2 Dark Spots'}
                  </span>
                </div>
              </div>

              {/* Night Activity Score Breakdown */}
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between text-stone-600">
                  <span>Open places & 24/7 havens:</span>
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
                  <span>Street lighting coverage:</span>
                  <span className="font-mono font-medium">
                    {currentRoute.scoreBreakdown?.streetLighting || 23}/25
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${((currentRoute.scoreBreakdown?.streetLighting || 23) / 25) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-stone-600 pt-1">
                  <span>Main road percentage:</span>
                  <span className="font-mono font-medium">
                    {currentRoute.scoreBreakdown?.mainRoadsRatio || 23}/25
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-stone-700 h-full rounded-full"
                    style={{ width: `${((currentRoute.scoreBreakdown?.mainRoadsRatio || 23) / 25) * 100}%` }}
                  />
                </div>
              </div>

              {/* Turn-by-Turn Steps Toggle */}
              {currentRoute.steps && currentRoute.steps.length > 0 && (
                <div className="pt-2 border-t border-rose-100">
                  <button
                    onClick={() => setShowSteps(!showSteps)}
                    className="w-full flex items-center justify-between text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                  >
                    <span>View Turn Directions ({currentRoute.steps.length} steps)</span>
                    {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showSteps && (
                    <ol className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1 text-[11px] text-stone-600 list-decimal pl-4">
                      {currentRoute.steps.map((st: any, i: number) => (
                        <li key={i} className="leading-snug">
                          <span>{st.instruction}</span>
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
          <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-stone-500">
                {activeHavenDetail ? 'Selected Sanctuary' : 'Nearby Sanctuary'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified 24/7
              </span>
            </div>

            {activeHavenDetail ? (
              <div className="space-y-2 text-xs">
                <h4 className="text-sm font-semibold text-stone-900">{activeHavenDetail.name}</h4>
                <p className="text-stone-600">{activeHavenDetail.address}</p>
                
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                    <span className="text-stone-500 block text-[10px]">Type</span>
                    <strong className="text-stone-800 font-medium text-xs">
                      {activeHavenDetail.categoryLabel}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50/50 border border-rose-100">
                    <span className="text-stone-500 block text-[10px]">Staff Protocol</span>
                    <strong className="text-rose-700 font-medium text-xs">Ask for Angela</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleRouteToHaven(activeHavenDetail)}
                    className="flex-1 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Route Here</span>
                  </button>

                  <a
                    href={`tel:${activeHavenDetail.phone}`}
                    className="h-8 px-3 rounded-lg border border-rose-200 text-stone-700 hover:bg-rose-50 text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3 h-3 text-stone-500" />
                    <span>Call</span>
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
                  <span>On-duty pharmacist and direct police relay</span>
                </div>
                <p className="text-[11px] text-stone-400 pt-1">
                  Click any green shield marker on the map to inspect refuge capabilities, call directly, or recalculate a safe route to it.
                </p>
              </div>
            )}
          </div>

          {/* Recent Community Hazard Feed */}
          {recentReports.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-rose-200/80 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-stone-500 uppercase block font-medium">
                Live Community Hazard Feed
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
                <span>Community Hazard Reporting</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mt-1">Report a Street Hazard</h3>
              <p className="text-xs text-stone-500">
                Help other commuters by reporting dark spots, broken streetlights, or harassment zones.
              </p>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Hazard Category</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                >
                  <option value="broken_streetlight">Broken / Blown Streetlight</option>
                  <option value="unlit_dark_spot">Unlit Dark Stretch / Blackspot</option>
                  <option value="harassment">Harassment / Suspicious Gathering</option>
                  <option value="isolated_area">Isolated / Desolate Alley</option>
                  <option value="blocked_sidewalk">Blocked Footpath / Barrier</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Street / Landmark Address</label>
                <input
                  type="text"
                  required
                  value={reportAddress}
                  onChange={(e) => setReportAddress(e.target.value)}
                  placeholder="e.g. Near Sikanderpur Metro Pillar 42"
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Details & Evidence</label>
                <textarea
                  required
                  rows={3}
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Describe what you observed (e.g. 3 consecutive smart poles turned off after 10 PM)."
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
                <span>Submit Street Hazard Report</span>
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
                <span>Commuter Route Ground Verification</span>
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mt-1">Rate Your Route Experience</h3>
              <p className="text-xs text-stone-500">
                Did the actual street match Safie's Night Activity Score? Your rating trains our routing weights.
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Perceived Safety (1 to 5 Stars): <strong className="text-rose-600">{feedbackSafety}/5</strong>
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
                  Actual Lighting Condition: <strong className="text-rose-600">{feedbackLighting}/5</strong>
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
                <label className="block text-stone-700 font-medium mb-1">Commuter Comments</label>
                <textarea
                  rows={2}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="e.g. Well lit until the metro turn; guards were present outside the 24/7 chemist."
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
                <span>Save Route Rating</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
