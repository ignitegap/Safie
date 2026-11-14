'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Lock,
  Unlock,
  Building,
  UserCheck,
  ChevronRight,
  PhoneForwarded,
  Signal,
  Wifi,
  Battery,
} from 'lucide-react';
import { DELHI_NCR_SAFE_HAVENS, DELHI_NCR_ROAD_SEGMENTS, ROUTE_CANDIDATES } from '@/lib/data-delhi-ncr';

interface PhoneMockupDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type DemoTab = 'navigation' | 'safety-hold' | 'safe-havens' | 'deterrence';

export default function PhoneMockupDemo({ isOpen, onClose }: PhoneMockupDemoProps) {
  const [activeTab, setActiveTab] = useState<DemoTab>('navigation');
  
  // Navigation State
  const [selectedRoute, setSelectedRoute] = useState<'safest' | 'fastest'>('safest');
  const [isNavigating, setIsNavigating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

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

  // Clock
  const [timeStr, setTimeStr] = useState('11:42');

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

  // Safety Hold countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Countdown expired: Auto-trigger Level 3 SOS!
      setPinFeedback({
        status: 'duress',
        message: '🚨 10s Expired! Level 3 Police & Emergency SOS Dispatched with GPS!',
      });
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Fake Call active timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'active') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
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
      // Start 10 second countdown!
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
        message: 'Verification Successful. (Covert Red SOS secretly transmitted to Gurugram Police Control Room & Contacts)',
      });
      setPinInput('');
    } else {
      setPinFeedback({
        status: 'error',
        message: 'Incorrect PIN! Try 1234 (Normal) or 9876 (Duress PIN)',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Container with control overlay */}
      <div className="relative max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-2 md:-top-3 md:-right-3 z-50 p-2.5 rounded-full bg-slate-800/90 text-white hover:bg-safie-crimson transition-all border border-white/20 shadow-2xl"
          aria-label="Close interactive phone demo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================== */}
        {/* PHYSICAL PHONE SHELL (iPhone 15 Pro / Pixel 9 Style) */}
        {/* ============================================================== */}
        <div className="relative w-[340px] sm:w-[370px] h-[720px] rounded-[52px] p-3.5 bg-gradient-to-b from-[#2A2E39] via-[#1A1D24] to-[#0E1015] phone-shadow border-[4px] border-[#3F4452] shadow-2xl flex-shrink-0 select-none">
          
          {/* Side Buttons (Physical details) */}
          <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-zinc-600 rounded-l-sm" />
          <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-zinc-600 rounded-l-sm" />
          <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-zinc-600 rounded-r-sm" />

          {/* OLED Screen Area */}
          <div className="relative w-full h-full bg-[#0A0D14] rounded-[44px] overflow-hidden flex flex-col border border-white/10 text-white">
            
            {/* Dynamic Island / Status Bar */}
            <div className="h-11 px-6 pt-2 flex items-center justify-between text-xs font-semibold text-gray-200 z-30 select-none">
              <span className="font-mono text-[13px]">{timeStr}</span>
              
              {/* Dynamic Island Pill */}
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 border border-white/10 shadow-inner px-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-400">Safie Active</span>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-gray-300">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* SCREEN BODY CONTENT SWITCHER */}
            <div className="flex-1 overflow-y-auto px-4 py-2 relative text-left">
              
              {/* ============================================================== */}
              {/* TAB 1: NAVIGATION & SMART ROUTING */}
              {/* ============================================================== */}
              {activeTab === 'navigation' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-safie-crimson font-bold uppercase tracking-wider">
                        Delhi-NCR Intelligent Routing
                      </span>
                      <h3 className="text-base font-bold text-white">Cyber City ➔ Sector 29</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                      GMDA Lit
                    </span>
                  </div>

                  {/* Route Comparison Cards */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button
                      onClick={() => setSelectedRoute('safest')}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        selectedRoute === 'safest'
                          ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-emerald-400">🛡️ Safest Way</span>
                        {selectedRoute === 'safest' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-lg font-black text-white leading-none">14 min</p>
                      <p className="text-[10px] text-gray-400 mt-1">4.2 km · 96% Lit</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[9px] text-emerald-300 font-medium">
                        <span>4 Safe Havens</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedRoute('fastest')}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        selectedRoute === 'fastest'
                          ? 'bg-red-950/40 border-safie-crimson shadow-[0_0_15px_rgba(229,57,53,0.25)]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-rose-400">⚡ Standard</span>
                        {selectedRoute === 'fastest' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-safie-crimson" />
                        )}
                      </div>
                      <p className="text-lg font-black text-white leading-none">11 min</p>
                      <p className="text-[10px] text-gray-400 mt-1">3.8 km · 42% Lit</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[9px] text-rose-300 font-medium">
                        <span>2 Dark Alleys</span>
                      </div>
                    </button>
                  </div>

                  {/* Simulated Mini Map Visual */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2.5 flex flex-col justify-between">
                    {/* Simulated road grid visual */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* Road line overlay */}
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
                        <span className="font-semibold text-gray-200">Cyber City Rapid Metro</span>
                      </div>
                      
                      {/* Active Safety Route Line */}
                      <div className="ml-1.5 pl-3 border-l-2 border-emerald-400 py-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                          <Building className="w-3 h-3" />
                          <span>Passes Apollo Pharmacy 24/7 (Refuge Zone)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <span>Via DLF Phase 2 Lit Corridor</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-gray-200">Sector 29 Leisure Valley</span>
                      </div>
                    </div>

                    {/* Live safety banner */}
                    <div className="relative z-10 p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-[11px] font-semibold text-white">
                          Safe Route Active
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        Score: 94/100
                      </span>
                    </div>
                  </div>

                  {/* Navigation Action */}
                  <button
                    onClick={() => setIsNavigating(!isNavigating)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isNavigating
                        ? 'bg-rose-950 text-rose-300 border border-rose-600'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{isNavigating ? 'Stop Turn-by-Turn' : 'Start Live Escort Navigation'}</span>
                  </button>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: SAFETY HOLD (DEAD MAN'S SWITCH & DURESS PIN) */}
              {/* ============================================================== */}
              {activeTab === 'safety-hold' && (
                <div className="space-y-3 flex flex-col items-center text-center">
                  <div>
                    <span className="text-[10px] font-mono text-safie-crimson font-bold uppercase tracking-wider">
                      Dead Man's Switch Engine
                    </span>
                    <h3 className="text-base font-bold text-white">Noonlight Safety Hold</h3>
                    <p className="text-[11px] text-gray-400 max-w-[280px] mx-auto mt-0.5">
                      Press & hold your thumb while feeling uncomfortable. Release starts a 10s countdown.
                    </p>
                  </div>

                  {/* Tactical Hold Trigger Button */}
                  {countdown === null && (
                    <div className="py-4">
                      <button
                        onMouseDown={handleTouchStart}
                        onMouseUp={handleTouchEnd}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        className={`w-36 h-36 rounded-full font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all select-none cursor-pointer ${
                          isHolding
                            ? 'bg-emerald-600 text-white scale-105 shadow-[0_0_40px_rgba(16,185,129,0.8)] safe-pulse-ring'
                            : 'bg-gradient-to-tr from-safie-crimson to-red-600 text-white shadow-[0_0_30px_rgba(229,57,53,0.5)] hover:scale-102 active:scale-95'
                        }`}
                      >
                        <ShieldAlert className="w-9 h-9" />
                        <span>{isHolding ? 'HOLDING...' : 'HOLD THUMB'}</span>
                        <span className="text-[9px] font-normal normal-case opacity-80">
                          {isHolding ? 'Safe & Monitored' : 'Release = 10s Timer'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Urgent 10s Countdown Alert Window */}
                  {countdown !== null && (
                    <div className="w-full p-3.5 rounded-2xl bg-red-950/60 border border-safie-crimson text-white space-y-2 animate-pulse">
                      <div className="flex items-center justify-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-safie-crimson" />
                        <span className="font-extrabold text-sm text-safie-crimson tracking-wider uppercase">
                          Safety Hold Released!
                        </span>
                      </div>
                      
                      <div className="text-4xl font-black font-mono text-white tracking-widest">
                        00:{countdown < 10 ? `0${countdown}` : countdown}
                      </div>

                      <p className="text-[10px] text-gray-300">
                        Enter PIN to cancel alert. Dispatches Level 3 SOS on 00:00!
                      </p>
                    </div>
                  )}

                  {/* PIN Input Keypad */}
                  <div className="w-full max-w-[240px] space-y-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="w-28 text-center tracking-widest text-lg font-mono font-bold bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none focus:border-safie-crimson"
                      />
                      <button
                        onClick={() => handlePinSubmit(pinInput)}
                        className="px-3 py-1.5 rounded-lg bg-safie-crimson text-white text-xs font-bold hover:bg-red-700"
                      >
                        Verify
                      </button>
                    </div>

                    {/* PIN Quick Demos */}
                    <div className="flex items-center justify-center gap-2 text-[10px]">
                      <button
                        onClick={() => handlePinSubmit('1234')}
                        className="px-2 py-1 rounded bg-slate-800 text-gray-300 hover:text-white border border-slate-700"
                      >
                        Test PIN: <strong className="text-emerald-400">1234</strong> (Clear)
                      </button>
                      <button
                        onClick={() => handlePinSubmit('9876')}
                        className="px-2 py-1 rounded bg-slate-800 text-gray-300 hover:text-white border border-slate-700"
                      >
                        Duress PIN: <strong className="text-safie-crimson">9876</strong> (Covert)
                      </button>
                    </div>

                    {/* PIN Feedback / Duress Result */}
                    {pinFeedback.message && (
                      <div
                        className={`p-2 rounded-xl text-[10px] text-left leading-relaxed ${
                          pinFeedback.status === 'success'
                            ? 'bg-emerald-950/60 border border-emerald-600 text-emerald-300'
                            : pinFeedback.status === 'duress'
                            ? 'bg-rose-950/70 border border-safie-crimson text-rose-200'
                            : 'bg-red-950/40 border border-red-700 text-red-300'
                        }`}
                      >
                        {pinFeedback.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: SAFE HAVENS ("Ask for Angela") */}
              {/* ============================================================== */}
              {activeTab === 'safe-havens' && (
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      Verified 24/7 Sanctuaries
                    </span>
                    <h3 className="text-base font-bold text-white">Safe Haven Radar</h3>
                  </div>

                  {/* Ask for Angela banner */}
                  <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-left space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>"Ask for Angela" Codeword</span>
                    </div>
                    <p className="text-[10px] text-purple-200 leading-tight">
                      Tell staff at any partner store: <em>"Can I speak with Angela?"</em> Staff discreetly escorts you to a secure staff room, locks doors, and summons verified police.
                    </p>
                  </div>

                  {/* Nearby Haven List (Delhi-NCR) */}
                  <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
                    {DELHI_NCR_SAFE_HAVENS.slice(0, 4).map((haven) => (
                      <div
                        key={haven.id}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-start justify-between gap-2 text-left"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {haven.categoryLabel}
                            </span>
                            <span className="text-xs font-bold text-white truncate max-w-[130px]">
                              {haven.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 truncate max-w-[170px]">
                            {haven.address}
                          </p>
                          <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-medium">
                            <span>🛡️ Staff Trained</span>
                            <span>·</span>
                            <span>⚡ CCTV Monitored</span>
                          </div>
                        </div>

                        <button
                          onClick={() => alert(`Rerouting to ${haven.name} (${haven.address}). ETA 3 mins.`)}
                          className="px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex-shrink-0 flex items-center gap-1"
                        >
                          <span>Reroute</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: DETERRENCE & MESH */}
              {/* ============================================================== */}
              {activeTab === 'deterrence' && (
                <div className="space-y-3 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-safie-crimson font-bold uppercase tracking-wider">
                      Deterrence Suite
                    </span>
                    <h3 className="text-base font-bold text-white">Fake Call & Offline Mesh</h3>
                  </div>

                  {/* FAKE CALL SIMULATOR */}
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                        Fake Call Generator
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">Pre-Recorded Escort</span>
                    </div>

                    {callState === 'idle' && (
                      <button
                        onClick={() => setCallState('ringing')}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Trigger Instant Incoming Call</span>
                      </button>
                    )}

                    {callState === 'ringing' && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/50 text-center space-y-2 animate-bounce">
                        <p className="text-[11px] font-bold text-gray-300">Incoming Escort Call</p>
                        <p className="text-sm font-black text-white">Dad (Live Location Connected)</p>
                        <div className="flex items-center justify-center gap-4 pt-1">
                          <button
                            onClick={() => setCallState('idle')}
                            className="p-2.5 rounded-full bg-red-600 text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCallState('active')}
                            className="p-2.5 rounded-full bg-emerald-600 text-white animate-pulse"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {callState === 'active' && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500 text-center space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400">
                          <span>Connected</span>
                          <span className="font-mono">00:{callDuration < 10 ? `0${callDuration}` : callDuration}</span>
                        </div>
                        <p className="text-xs italic text-gray-300">
                          "Hey! I see you turning onto the service road on GPS. I'm waiting right here by the car, hurry up!"
                        </p>
                        <button
                          onClick={() => setCallState('idle')}
                          className="px-3 py-1 rounded bg-red-600 text-white text-[10px] font-bold"
                        >
                          End Call
                        </button>
                      </div>
                    )}
                  </div>

                  {/* OFFLINE BLE MESH RELAY */}
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-safie-crimson" />
                        Zero-Data BLE Mesh
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">{meshNodes} Peer Relays</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-tight">
                      When cellular towers blackout or data is disabled, Safie broadcasts an encrypted BLE packet hopping device-to-device to any phone with active internet.
                    </p>

                    <button
                      onClick={() => {
                        setMeshBroadcasting(!meshBroadcasting);
                        if (!meshBroadcasting) setMeshNodes((n) => n + 2);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        meshBroadcasting
                          ? 'bg-rose-950 text-rose-300 border border-safie-crimson animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {meshBroadcasting ? '📡 Relaying SOS Mesh Hop (Simulated)...' : 'Test BLE Mesh Hop'}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM PHONE NAVIGATION TABS */}
            <div className="h-16 bg-[#0E121B] border-t border-white/10 px-3 flex items-center justify-around z-30 select-none">
              
              <button
                onClick={() => setActiveTab('navigation')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
                  activeTab === 'navigation' ? 'text-safie-crimson scale-105' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate</span>
              </button>

              <button
                onClick={() => setActiveTab('safety-hold')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
                  activeTab === 'safety-hold' ? 'text-safie-crimson scale-105' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Safety Hold</span>
              </button>

              <button
                onClick={() => setActiveTab('safe-havens')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
                  activeTab === 'safe-havens' ? 'text-safie-crimson scale-105' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Havens</span>
              </button>

              <button
                onClick={() => setActiveTab('deterrence')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-all ${
                  activeTab === 'deterrence' ? 'text-safie-crimson scale-105' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Deterrence</span>
              </button>

            </div>

            {/* Home Bar Indicator */}
            <div className="h-3 bg-[#0E121B] flex justify-center pb-1">
              <div className="w-28 h-1 rounded-full bg-white/30" />
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE COMPANION INSTRUCTIONS & CONTROLS */}
        {/* ============================================================== */}
        <div className="max-w-md w-full text-left space-y-4 text-white p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono uppercase font-bold bg-safie-crimson/20 text-safie-crimson border border-safie-crimson/40">
              Interactive Simulation
            </span>
            <span className="text-xs text-gray-400 font-mono">Live Sandbox</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            Test Safie Mobile Features Live in Browser
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed">
            This interactive simulator reproduces the real Kotlin Android app logic directly inside your browser. Try these live safety interactions:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-emerald-400 block font-bold">1. Hold & Release Dead Man's Switch:</strong>
              <p className="text-gray-400">
                Click on the <strong>Safety Hold</strong> tab below the phone. Hold down the red button, then release it to watch the 10-second emergency countdown trigger.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-safie-crimson block font-bold">2. Test Duress PIN (9876):</strong>
              <p className="text-gray-400">
                Type <code className="text-white font-mono bg-slate-800 px-1 rounded">9876</code> to see how Safie deceives an aggressor by displaying "Verification Successful" while covertly transmitting high-priority red alert with live GPS to Delhi Police!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-purple-400 block font-bold">3. Safe Haven "Ask for Angela":</strong>
              <p className="text-gray-400">
                Switch to <strong>Havens</strong> to view real 24/7 verified pharmacies and metro police desks across Gurugram & South Delhi with 1-tap detour routing.
              </p>
            </div>
          </div>

          {/* Quick Action to Download Android APK */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Ready for Real Device?</p>
              <p className="text-[11px] text-gray-400">Download native Kotlin APK</p>
            </div>
            <a
              href="/downloads/safie-release.apk"
              download="Safie-v1.0-delhi-ncr.apk"
              className="px-4 py-2 rounded-xl bg-safie-crimson hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
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
