'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Navigation,
  Shield,
  ShieldAlert,
  PhoneCall,
  Volume2,
  Radio,
  X,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  ArrowRight,
  Lock,
  Unlock,
  Building,
  UserCheck,
  ChevronRight,
  PhoneForwarded,
  Signal,
  Wifi,
  Battery,
  MessageSquare,
  Play,
  Square,
} from 'lucide-react';
import { DELHI_NCR_SAFE_HAVENS, SafeHaven } from '@/lib/data-delhi-ncr';

interface PhoneMockupDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type DemoTab = 'navigation' | 'safety-hold' | 'safe-havens' | 'deterrence';

export default function PhoneMockupDemo({ isOpen, onClose }: PhoneMockupDemoProps) {
  const [activeTab, setActiveTab] = useState<DemoTab>('safety-hold');
  
  // Navigation State
  const [selectedRoute, setSelectedRoute] = useState<'safest' | 'fastest'>('safest');
  const [isNavigating, setIsNavigating] = useState(false);
  const [navStepIndex, setNavStepIndex] = useState(0);

  // Safety Hold State
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinFeedback, setPinFeedback] = useState<{
    status: 'idle' | 'success' | 'duress' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  // Fake Call State
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'active'>('idle');
  const [callDuration, setCallDuration] = useState(0);

  // Mesh State
  const [meshNodes, setMeshNodes] = useState(7);
  const [meshBroadcasting, setMeshBroadcasting] = useState(false);
  const [meshLogs, setMeshLogs] = useState<string[]>([]);

  // Clock
  const [timeStr, setTimeStr] = useState('23:42');

  const navigationSteps = [
    { text: 'Start at DLF Cyber City Rapid Metro', distance: '100m' },
    { text: 'Turn right onto DLF Phase 2 Illuminated Corridor', distance: '350m' },
    { text: 'Passing 24/7 Apollo Pharmacy Sanctuary on your left', distance: '400m' },
    { text: 'Continue straight along MG Road Main Arterial', distance: '1.2 km' },
    { text: 'Turn left toward Sector 29 Leisure Valley Corridor', distance: '800m' },
    { text: 'Arrive safely at Sector 29 Market', distance: 'Destination' },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Step advancement during active navigation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isNavigating) {
      interval = setInterval(() => {
        setNavStepIndex((prev) => (prev + 1) % navigationSteps.length);
      }, 4000);
    } else {
      setNavStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isNavigating]);

  // Safety Hold countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Countdown expired: Auto-trigger Level 3 SOS
      setPinFeedback({
        status: 'duress',
        message: '10s Window Expired: Emergency SOS packet dispatched with live GPS to Police Control Room (112) & registered emergency contacts.',
      });
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Fake Call active timer and speech deterrence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'active') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Play real audio voice deterrence through speech synthesis if available
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(
            "Hey! I can see your location on the map, I'm right outside waiting with the car, hurry up!"
          );
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn('Speech synthesis error', e);
        }
      }
    } else {
      setCallDuration(0);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Handle Safety Hold Release
  const handleTouchStart = () => {
    setIsHolding(true);
    setCountdown(null);
    setPinFeedback({ status: 'idle', message: '' });
    setPinInput('');
  };

  const handleTouchEnd = () => {
    if (isHolding) {
      setIsHolding(false);
      setCountdown(10);
    }
  };

  // Handle PIN Submission
  const handlePinSubmit = (pin: string) => {
    if (pin === '1234') {
      // Normal PIN
      setCountdown(null);
      setPinFeedback({
        status: 'success',
        message: 'All clear. Safety hold disarmed safely.',
      });
      setPinInput('');
    } else if (pin === '9876') {
      // Duress PIN (Covert escalation)
      setCountdown(null);
      setPinFeedback({
        status: 'duress',
        message: 'Alarm Cancelled. (Deceptive display confirmed. Covert red alert dispatched with live GPS coordinates: 28.4958° N, 77.0895° E to Gurugram Police 112 & family)',
      });
      setPinInput('');
    } else {
      setPinFeedback({
        status: 'error',
        message: 'Incorrect PIN. Try 1234 (Normal Disarm) or 9876 (Duress PIN).',
      });
    }
  };

  const triggerMeshRelay = () => {
    setMeshBroadcasting(true);
    setMeshLogs(['Broadcasting encrypted SOS packet via BLE...']);
    setTimeout(() => {
      setMeshLogs((prev) => [...prev, 'Node 1 (Galaxy S23, 12m away) relayed packet']);
    }, 800);
    setTimeout(() => {
      setMeshLogs((prev) => [...prev, 'Node 2 (iPhone 14, 45m away) forwarded to 5G Cell']);
      setMeshNodes((n) => n + 2);
    }, 1600);
    setTimeout(() => {
      setMeshLogs((prev) => [...prev, 'SOS Delivered to 112 Gateway over zero mobile data']);
      setMeshBroadcasting(false);
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      
      {/* Container */}
      <div className="relative max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-2 md:-top-3 md:-right-3 z-50 p-2 rounded-full bg-white text-stone-700 hover:bg-stone-100 transition-colors border border-rose-200 shadow-md cursor-pointer"
          aria-label="Close phone simulator"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================== */}
        {/* PHYSICAL PHONE SHELL (Calm, Matte Bezel) */}
        {/* ============================================================== */}
        <div className="relative w-[340px] sm:w-[360px] h-[690px] rounded-[48px] p-3 bg-stone-900 border-[3px] border-stone-800 shadow-2xl flex-shrink-0 select-none">
          
          {/* Side Hardware Buttons */}
          <div className="absolute -left-[5px] top-28 w-[2px] h-10 bg-stone-700 rounded-l-sm" />
          <div className="absolute -left-[5px] top-42 w-[2px] h-12 bg-stone-700 rounded-l-sm" />
          <div className="absolute -right-[5px] top-32 w-[2px] h-16 bg-stone-700 rounded-r-sm" />

          {/* Screen Area */}
          <div className="relative w-full h-full bg-[#FFF5F6] rounded-[40px] overflow-hidden flex flex-col text-stone-900">
            
            {/* Dynamic Island / Status Bar */}
            <div className="h-10 px-5 pt-2 flex items-center justify-between text-xs font-medium text-stone-600 z-30 select-none">
              <span className="font-mono text-[12px]">{timeStr}</span>
              
              {/* Dynamic Island Pill */}
              <div className="w-22 h-4.5 bg-stone-900 rounded-full flex items-center justify-center gap-1.5 px-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-[9px] font-mono text-stone-300">Safie Active</span>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-stone-600">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>

            {/* SCREEN BODY CONTENT SWITCHER */}
            <div className="flex-1 overflow-y-auto px-4 py-2 relative text-left">
              
              {/* TAB 1: NAVIGATION & SMART ROUTING */}
              {activeTab === 'navigation' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-stone-500 uppercase">
                        Delhi-NCR Safe Corridor
                      </span>
                      <h3 className="text-sm font-semibold text-stone-900">Cyber City to Sector 29</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      96% Lit
                    </span>
                  </div>

                  {/* Route Comparison Cards */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button
                      onClick={() => setSelectedRoute('safest')}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        selectedRoute === 'safest'
                          ? 'bg-white border-rose-600 ring-1 ring-rose-200'
                          : 'bg-rose-50/30 border-rose-100 hover:border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-rose-700">Safest</span>
                        {selectedRoute === 'safest' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                        )}
                      </div>
                      <p className="text-base font-semibold text-stone-900 font-mono">14 min</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">4.2 km · 96% Lit</p>
                      <div className="mt-1 text-[9px] text-emerald-700 font-medium">
                        4 havens on route
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedRoute('fastest')}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        selectedRoute === 'fastest'
                          ? 'bg-white border-stone-800 ring-1 ring-stone-200'
                          : 'bg-rose-50/30 border-rose-100 hover:border-rose-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-stone-600">Standard</span>
                        {selectedRoute === 'fastest' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-stone-700" />
                        )}
                      </div>
                      <p className="text-base font-semibold text-stone-900 font-mono">11 min</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">3.8 km · 42% Lit</p>
                      <div className="mt-1 text-[9px] text-stone-500">
                        2 unlit segments
                      </div>
                    </button>
                  </div>

                  {/* Live Escort Navigation Feed */}
                  <div className="p-3 rounded-xl bg-white border border-rose-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-rose-600" />
                        <span>Live Escort Step</span>
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        Step {navStepIndex + 1}/{navigationSteps.length}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-xs">
                      <p className="font-medium text-stone-900">
                        {navigationSteps[navStepIndex].text}
                      </p>
                      <span className="text-[10px] text-rose-600 font-mono block mt-0.5">
                        Distance remaining: {navigationSteps[navStepIndex].distance}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Action */}
                  <button
                    onClick={() => setIsNavigating(!isNavigating)}
                    className={`w-full h-9 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isNavigating
                        ? 'bg-stone-900 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {isNavigating ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isNavigating ? 'Stop Escort Walk' : 'Start Live Escort Walk'}</span>
                  </button>
                </div>
              )}

              {/* TAB 2: SAFETY HOLD */}
              {activeTab === 'safety-hold' && (
                <div className="space-y-3 flex flex-col items-center text-center">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      Dead Man's Switch Engine
                    </span>
                    <h3 className="text-sm font-semibold text-stone-900">Safety Hold</h3>
                    <p className="text-[11px] text-stone-500 max-w-[240px] mx-auto mt-0.5 leading-snug">
                      Hold thumb down while walking. Releasing initiates a 10-second countdown.
                    </p>
                  </div>

                  {/* Tactile Hold Trigger Button */}
                  {countdown === null && (
                    <div className="py-2">
                      <button
                        onMouseDown={handleTouchStart}
                        onMouseUp={handleTouchEnd}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        className={`w-32 h-32 rounded-full font-semibold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors select-none cursor-pointer ${
                          isHolding
                            ? 'bg-rose-800 text-white ring-4 ring-rose-200'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                        }`}
                      >
                        <ShieldAlert className="w-8 h-8 text-white" />
                        <span>{isHolding ? 'Holding' : 'Hold Thumb'}</span>
                        <span className="text-[9px] opacity-80 font-normal">
                          {isHolding ? 'Monitoring live' : 'Release = 10s Timer'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* 10s Countdown Alert Window */}
                  {countdown !== null && (
                    <div className="w-full p-3 rounded-xl bg-rose-600 text-white space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                        <AlertTriangle className="w-4 h-4 text-white" />
                        <span>Safety Hold Released</span>
                      </div>
                      
                      <div className="text-3xl font-semibold font-mono tracking-widest tabular-nums">
                        00:{countdown < 10 ? `0${countdown}` : countdown}
                      </div>

                      <p className="text-[10px] text-rose-100">
                        Enter PIN to cancel alert. Dispatches police SOS on 00:00.
                      </p>
                    </div>
                  )}

                  {/* PIN Input Keypad */}
                  <div className="w-full max-w-[220px] space-y-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="w-24 text-center tracking-widest text-base font-mono bg-white border border-rose-200 rounded-lg p-1.5 text-stone-900 focus:outline-none focus:border-rose-600"
                      />
                      <button
                        onClick={() => handlePinSubmit(pinInput)}
                        className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>

                    {/* PIN Quick Demo Buttons */}
                    <div className="flex items-center justify-center gap-2 text-[10px]">
                      <button
                        onClick={() => handlePinSubmit('1234')}
                        className="px-2 py-1 rounded bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 cursor-pointer"
                      >
                        Normal: <span className="font-mono text-emerald-700 font-medium">1234</span>
                      </button>
                      <button
                        onClick={() => handlePinSubmit('9876')}
                        className="px-2 py-1 rounded bg-rose-50 text-stone-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
                      >
                        Duress: <span className="font-mono text-rose-700 font-medium">9876</span>
                      </button>
                    </div>

                    {/* Feedback */}
                    {pinFeedback.message && (
                      <div
                        className={`p-2 rounded-lg text-[10px] text-left leading-normal ${
                          pinFeedback.status === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : pinFeedback.status === 'duress'
                            ? 'bg-rose-50 border border-rose-200 text-rose-900'
                            : 'bg-stone-100 border border-stone-200 text-stone-800'
                        }`}
                      >
                        {pinFeedback.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SAFE HAVENS */}
              {activeTab === 'safe-havens' && (
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      Physical Sanctuaries
                    </span>
                    <h3 className="text-sm font-semibold text-stone-900">Safe Haven Radar</h3>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-rose-200/80 text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-stone-900">
                      <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                      <span>Codeword: "Ask for Angela"</span>
                    </div>
                    <p className="text-[10px] text-stone-600 leading-snug">
                      Tell staff: <em>"Can I speak with Angela?"</em> Staff discreetly escorts you to a locked employee room and summons police backup.
                    </p>
                  </div>

                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-0.5">
                    {DELHI_NCR_SAFE_HAVENS.slice(0, 5).map((haven) => (
                      <div
                        key={haven.id}
                        className="p-2.5 rounded-xl bg-white border border-rose-100 hover:border-rose-200 transition-colors flex items-start justify-between gap-2 text-left"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] px-1 py-0.2 rounded font-mono uppercase bg-rose-50 text-rose-700 border border-rose-200">
                              {haven.categoryLabel}
                            </span>
                            <span className="text-xs font-medium text-stone-900 truncate max-w-[120px]">
                              {haven.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 truncate max-w-[160px]">
                            {haven.address}
                          </p>
                          <div className="text-[9px] text-emerald-700">
                            <span>Trained staff · CCTV monitored</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveTab('navigation');
                            setIsNavigating(true);
                          }}
                          className="h-7 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-medium flex-shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Reroute</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DETERRENCE */}
              {activeTab === 'deterrence' && (
                <div className="space-y-3 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      Deterrence Suite
                    </span>
                    <h3 className="text-sm font-semibold text-stone-900">Fake Call & Offline Mesh</h3>
                  </div>

                  {/* Fake Call Generator with Real Speech Synthesis */}
                  <div className="p-3 rounded-xl bg-white border border-rose-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-stone-900 flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-stone-500" />
                        Fake Call Audio Deterrent
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">Speech Audio</span>
                    </div>

                    {callState === 'idle' && (
                      <button
                        onClick={() => setCallState('ringing')}
                        className="w-full h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Trigger Incoming Call</span>
                      </button>
                    )}

                    {callState === 'ringing' && (
                      <div className="p-3 rounded-xl bg-stone-900 text-white text-center space-y-2">
                        <p className="text-[10px] text-stone-400">Incoming Call</p>
                        <p className="text-xs font-medium text-white">Dad (Live Location Connected)</p>
                        <div className="flex items-center justify-center gap-3 pt-1">
                          <button
                            onClick={() => setCallState('idle')}
                            className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCallState('active')}
                            className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center cursor-pointer"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {callState === 'active' && (
                      <div className="p-3 rounded-xl bg-stone-900 text-white text-center space-y-2">
                        <div className="flex items-center justify-between text-xs text-rose-400">
                          <span>Speaking via Device Speaker...</span>
                          <span className="font-mono tabular-nums">00:{callDuration < 10 ? `0${callDuration}` : callDuration}</span>
                        </div>
                        <p className="text-xs italic text-stone-300">
                          "Hey! I can see your location on the map, I'm right outside waiting with the car, hurry up!"
                        </p>
                        <button
                          onClick={() => setCallState('idle')}
                          className="h-7 px-3 rounded-lg bg-rose-600 text-white text-[10px] font-medium cursor-pointer"
                        >
                          End Call
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Offline BLE Mesh */}
                  <div className="p-3 rounded-xl bg-white border border-rose-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-stone-900 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-stone-500" />
                        Zero-Data BLE Mesh
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700">{meshNodes} Peer Relays</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-snug">
                      When cellular towers blackout or data is disconnected, Safie broadcasts an encrypted packet hopping device-to-device to any phone with data.
                    </p>

                    <button
                      onClick={triggerMeshRelay}
                      disabled={meshBroadcasting}
                      className={`w-full h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        meshBroadcasting
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-rose-50/60 hover:bg-rose-100 text-stone-800 border border-rose-200'
                      }`}
                    >
                      {meshBroadcasting ? 'Relaying SOS Mesh Hop...' : 'Test BLE Mesh Hop'}
                    </button>

                    {meshLogs.length > 0 && (
                      <div className="p-2 rounded-lg bg-stone-900 text-stone-300 font-mono text-[10px] space-y-1">
                        {meshLogs.map((log, lIdx) => (
                          <div key={lIdx} className="flex items-center gap-1.5">
                            <span className="text-emerald-400">➔</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM PHONE NAVIGATION TABS */}
            <div className="h-14 bg-white border-t border-rose-100 px-3 flex items-center justify-around z-30 select-none">
              
              <button
                onClick={() => setActiveTab('safety-hold')}
                className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors cursor-pointer ${
                  activeTab === 'safety-hold' ? 'text-rose-600 font-medium' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Safety Hold</span>
              </button>

              <button
                onClick={() => setActiveTab('navigation')}
                className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors cursor-pointer ${
                  activeTab === 'navigation' ? 'text-rose-600 font-medium' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>Routes</span>
              </button>

              <button
                onClick={() => setActiveTab('safe-havens')}
                className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors cursor-pointer ${
                  activeTab === 'safe-havens' ? 'text-rose-600 font-medium' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Havens</span>
              </button>

              <button
                onClick={() => setActiveTab('deterrence')}
                className={`flex flex-col items-center gap-0.5 text-[10px] transition-colors cursor-pointer ${
                  activeTab === 'deterrence' ? 'text-rose-600 font-medium' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Deterrence</span>
              </button>

            </div>

            {/* Home Bar Indicator */}
            <div className="h-2.5 bg-white flex justify-center pb-1">
              <div className="w-24 h-1 rounded-full bg-stone-300" />
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* COMPANION INSTRUCTIONS & CONTROLS */}
        {/* ============================================================== */}
        <div className="max-w-md w-full text-left space-y-4 p-5 sm:p-6 rounded-2xl bg-white border border-rose-200/80 shadow-md">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-50 text-rose-700 border border-rose-200 font-medium">
              Simulation Sandbox
            </span>
            <span className="text-[11px] text-stone-400 font-mono">Live in-browser</span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Interactive mobile application simulator
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            This simulator reproduces the core Kotlin Android application logic in your browser. Test these real-world flows:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 space-y-1">
              <strong className="text-stone-900 block font-medium">1. Hold & Release Dead Man's Switch:</strong>
              <p className="text-stone-600">
                Hold the rose button with your mouse/touch, then release it to watch the 10-second emergency countdown trigger.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 space-y-1">
              <strong className="text-stone-900 block font-medium">2. Test Duress PIN (9876):</strong>
              <p className="text-stone-600">
                Type <code className="text-rose-700 font-mono px-1 py-0.5 rounded bg-white border border-rose-200">9876</code> to see how Safie deceives an aggressor by displaying "Alarm Cancelled" while covertly transmitting a high-priority red alert to Delhi Police.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 space-y-1">
              <strong className="text-stone-900 block font-medium">3. Audio Fake Call Deterrent:</strong>
              <p className="text-stone-600">
                Under <strong>Deterrence</strong>, click "Trigger Incoming Call" and accept it to hear real spoken reassurance through your device speaker.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-100 space-y-1">
              <strong className="text-stone-900 block font-medium">4. Safe Haven "Ask for Angela":</strong>
              <p className="text-stone-600">
                Switch to <strong>Havens</strong> to inspect real 24/7 verified pharmacies and metro police desks across Gurugram and South Delhi with 1-tap detour routing.
              </p>
            </div>
          </div>

          {/* Quick Action to Download Android APK */}
          <div className="pt-2 flex items-center justify-between border-t border-rose-100">
            <div>
              <p className="text-xs font-medium text-stone-900">Physical Android Device?</p>
              <p className="text-[11px] text-stone-500">Sideload release APK</p>
            </div>
            <a
              href="/downloads/safie-release.apk"
              download="Safie-v1.0-delhi-ncr.apk"
              className="h-8 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Download APK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
