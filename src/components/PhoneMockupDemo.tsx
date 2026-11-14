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
import { DELHI_NCR_SAFE_HAVENS } from '@/lib/data-delhi-ncr';

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
  const [timeStr, setTimeStr] = useState('23:42');

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
        message: '🚨 10s Expired! Emergency SOS Dispatched with GPS to Gurugram Police Control Room & Contacts!',
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
        message: 'Alarm Cancelled. (Deceptive display to aggressor. Covert high-priority alert sent to Police & Emergency Contacts with live GPS)',
      });
      setPinInput('');
    } else {
      setPinFeedback({
        status: 'error',
        message: 'Incorrect PIN! Try 1234 (Normal Disarm) or 9876 (Duress PIN)',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Container with control overlay */}
      <div className="relative max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-2 md:-top-3 md:-right-3 z-50 p-2.5 rounded-full bg-white text-stone-700 hover:bg-rose-600 hover:text-white transition-all border border-rose-200 shadow-xl"
          aria-label="Close interactive phone demo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================== */}
        {/* PHYSICAL PHONE SHELL (Elegantly Styled with Rose Bezel) */}
        {/* ============================================================== */}
        <div className="relative w-[340px] sm:w-[365px] h-[710px] rounded-[52px] p-3.5 bg-gradient-to-b from-[#2E1F27] via-[#1F131A] to-[#12080E] pink-phone-shadow border-[4px] border-[#5E2B47] shadow-2xl flex-shrink-0 select-none">
          
          {/* Side Buttons */}
          <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-rose-900/80 rounded-l-sm" />
          <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-rose-900/80 rounded-l-sm" />
          <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-rose-900/80 rounded-r-sm" />

          {/* Screen Area (Clean Blush & Rose Palette) */}
          <div className="relative w-full h-full bg-[#FFF5F7] rounded-[44px] overflow-hidden flex flex-col text-stone-900">
            
            {/* Dynamic Island / Status Bar */}
            <div className="h-11 px-6 pt-2 flex items-center justify-between text-xs font-semibold text-stone-700 z-30 select-none">
              <span className="font-mono text-[13px]">{timeStr}</span>
              
              {/* Dynamic Island Pill */}
              <div className="w-24 h-5 bg-stone-900 rounded-full flex items-center justify-center gap-1.5 px-2 text-white">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[9px] font-mono text-rose-300 font-bold">Safie Active</span>
              </div>

              {/* Status Icons */}
              <div className="flex items-center gap-1.5 text-stone-700">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* SCREEN BODY CONTENT SWITCHER */}
            <div className="flex-1 overflow-y-auto px-4 py-2 relative text-left">
              
              {/* ============================================================== */}
              {/* TAB 1: NAVIGATION & SMART ROUTING */}
              {/* ============================================================== */}
              {activeTab === 'navigation' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider">
                        Delhi-NCR Safe Corridor
                      </span>
                      <h3 className="text-base font-bold text-stone-900">Cyber City ➔ Sector 29</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      96% Lit
                    </span>
                  </div>

                  {/* Route Comparison Cards */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button
                      onClick={() => setSelectedRoute('safest')}
                      className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                        selectedRoute === 'safest'
                          ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-200'
                          : 'bg-rose-50/50 border-rose-200/60 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-rose-600">Safest Way</span>
                        {selectedRoute === 'safest' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                        )}
                      </div>
                      <p className="text-lg font-black text-stone-900 leading-none">14 min</p>
                      <p className="text-[10px] text-stone-500 mt-1">4.2 km · 96% Lit</p>
                      <div className="mt-1.5 text-[9px] text-emerald-700 font-semibold">
                        4 Safe Havens on route
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedRoute('fastest')}
                      className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                        selectedRoute === 'fastest'
                          ? 'bg-white border-stone-800 shadow-md'
                          : 'bg-rose-50/50 border-rose-200/60 hover:border-rose-300 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-600">Standard</span>
                        {selectedRoute === 'fastest' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <p className="text-lg font-black text-stone-900 leading-none">11 min</p>
                      <p className="text-[10px] text-stone-500 mt-1">3.8 km · 42% Lit</p>
                      <div className="mt-1.5 text-[9px] text-rose-600 font-semibold">
                        2 Dark Alleys
                      </div>
                    </button>
                  </div>

                  {/* Simulated Mini Map Visual */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-rose-100/60 border border-rose-200 p-2.5 flex flex-col justify-between">
                    <div className="relative z-10 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                        <span className="font-bold text-stone-800">Cyber City Rapid Metro</span>
                      </div>
                      
                      {/* Active Safety Route Line */}
                      <div className="ml-1.5 pl-3 border-l-2 border-rose-500 py-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-rose-700 font-semibold">
                          <Building className="w-3 h-3" />
                          <span>Apollo Pharmacy 24/7 (Refuge Zone)</span>
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Via DLF Phase 2 Lit Corridor
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                        <span className="font-bold text-stone-800">Sector 29 Leisure Valley</span>
                      </div>
                    </div>

                    <div className="relative z-10 p-2 rounded-xl bg-white/95 border border-rose-200 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-rose-600" />
                        <span className="text-[11px] font-bold text-stone-800">
                          Active Safe Corridor
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        Score: 94/100
                      </span>
                    </div>
                  </div>

                  {/* Navigation Action */}
                  <button
                    onClick={() => setIsNavigating(!isNavigating)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isNavigating
                        ? 'bg-stone-900 text-white shadow-md'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-200'
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{isNavigating ? 'End Walking Guidance' : 'Start Live Escort Walk'}</span>
                  </button>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: SAFETY HOLD (DEAD MAN'S SWITCH & DURESS PIN) */}
              {/* ============================================================== */}
              {activeTab === 'safety-hold' && (
                <div className="space-y-3 flex flex-col items-center text-center">
                  <div>
                    <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider">
                      Dead Man's Switch Engine
                    </span>
                    <h3 className="text-base font-bold text-stone-900">Safety Hold</h3>
                    <p className="text-[11px] text-stone-500 max-w-[270px] mx-auto mt-0.5 leading-snug">
                      Hold thumb down while walking. Releasing initiates an urgent 10-second countdown.
                    </p>
                  </div>

                  {/* Tactical Hold Trigger Button */}
                  {countdown === null && (
                    <div className="py-3">
                      <button
                        onMouseDown={handleTouchStart}
                        onMouseUp={handleTouchEnd}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        className={`w-36 h-36 rounded-full font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all select-none cursor-pointer ${
                          isHolding
                            ? 'bg-rose-700 text-white scale-105 shadow-[0_0_35px_rgba(225,29,72,0.8)] pink-pulse-ring'
                            : 'bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white shadow-[0_8px_30px_rgba(225,29,72,0.4)] hover:scale-102 active:scale-95'
                        }`}
                      >
                        <ShieldAlert className="w-9 h-9" />
                        <span>{isHolding ? 'HOLDING...' : 'HOLD THUMB'}</span>
                        <span className="text-[9px] font-normal normal-case opacity-90">
                          {isHolding ? 'Protected & Live' : 'Release = 10s Timer'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Urgent 10s Countdown Alert Window */}
                  {countdown !== null && (
                    <div className="w-full p-3 rounded-2xl bg-rose-600 text-white space-y-1.5 shadow-xl animate-pulse">
                      <div className="flex items-center justify-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-white" />
                        <span className="font-black text-sm tracking-wider uppercase">
                          Safety Hold Released!
                        </span>
                      </div>
                      
                      <div className="text-4xl font-black font-mono tracking-widest">
                        00:{countdown < 10 ? `0${countdown}` : countdown}
                      </div>

                      <p className="text-[10px] text-rose-100">
                        Enter PIN to cancel alert. Dispatches police SOS on 00:00.
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
                        className="w-28 text-center tracking-widest text-lg font-mono font-bold bg-white border border-rose-300 rounded-xl p-1.5 text-stone-900 focus:outline-none focus:border-rose-600"
                      />
                      <button
                        onClick={() => handlePinSubmit(pinInput)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
                      >
                        Verify
                      </button>
                    </div>

                    {/* PIN Quick Demo Buttons */}
                    <div className="flex items-center justify-center gap-2 text-[10px]">
                      <button
                        onClick={() => handlePinSubmit('1234')}
                        className="px-2 py-1 rounded-lg bg-white text-stone-700 hover:text-stone-900 border border-rose-200 font-medium"
                      >
                        Normal: <strong className="text-emerald-700 font-mono">1234</strong>
                      </button>
                      <button
                        onClick={() => handlePinSubmit('9876')}
                        className="px-2 py-1 rounded-lg bg-rose-50 text-rose-800 hover:text-rose-900 border border-rose-300 font-medium"
                      >
                        Duress: <strong className="text-rose-600 font-mono">9876</strong>
                      </button>
                    </div>

                    {/* PIN Feedback / Duress Result */}
                    {pinFeedback.message && (
                      <div
                        className={`p-2.5 rounded-xl text-[10px] text-left leading-relaxed ${
                          pinFeedback.status === 'success'
                            ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                            : pinFeedback.status === 'duress'
                            ? 'bg-rose-50 border border-rose-300 text-rose-900'
                            : 'bg-red-50 border border-red-300 text-red-800'
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
                    <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider">
                      Verified 24/7 Sanctuaries
                    </span>
                    <h3 className="text-base font-bold text-stone-900">Safe Haven Radar</h3>
                  </div>

                  {/* Ask for Angela banner */}
                  <div className="p-2.5 rounded-2xl bg-white border border-rose-200 text-left space-y-1 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                      <span>"Ask for Angela" Codeword</span>
                    </div>
                    <p className="text-[10px] text-stone-600 leading-tight">
                      Tell staff at any partner store: <em>"Can I speak with Angela?"</em> Staff discreetly escorts you to a locked employee room and calls verified escort police.
                    </p>
                  </div>

                  {/* Nearby Haven List */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {DELHI_NCR_SAFE_HAVENS.slice(0, 4).map((haven) => (
                      <div
                        key={haven.id}
                        className="p-2.5 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 transition-all flex items-start justify-between gap-2 text-left shadow-sm"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                              {haven.categoryLabel}
                            </span>
                            <span className="text-xs font-bold text-stone-900 truncate max-w-[130px]">
                              {haven.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 truncate max-w-[170px]">
                            {haven.address}
                          </p>
                          <div className="flex items-center gap-2 text-[9px] text-emerald-700 font-semibold">
                            <span>🛡️ Staff Trained</span>
                            <span>·</span>
                            <span>⚡ CCTV Monitored</span>
                          </div>
                        </div>

                        <button
                          onClick={() => alert(`Rerouting to ${haven.name} (${haven.address}). ETA 3 mins.`)}
                          className="px-2 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex-shrink-0 flex items-center gap-1 shadow-sm"
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
                    <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider">
                      Deterrence Suite
                    </span>
                    <h3 className="text-base font-bold text-stone-900">Fake Call & Offline Mesh</h3>
                  </div>

                  {/* FAKE CALL SIMULATOR */}
                  <div className="p-3 rounded-2xl bg-white border border-rose-200 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-rose-600" />
                        Fake Call Generator
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">Live Simulation</span>
                    </div>

                    {callState === 'idle' && (
                      <button
                        onClick={() => setCallState('ringing')}
                        className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Trigger Instant Incoming Call</span>
                      </button>
                    )}

                    {callState === 'ringing' && (
                      <div className="p-3 rounded-xl bg-stone-900 text-white text-center space-y-2 animate-bounce">
                        <p className="text-[11px] font-bold text-stone-400">Incoming Call</p>
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
                      <div className="p-3 rounded-xl bg-stone-900 text-white text-center space-y-2">
                        <div className="flex items-center justify-between text-xs text-rose-400">
                          <span>Connected</span>
                          <span className="font-mono">00:{callDuration < 10 ? `0${callDuration}` : callDuration}</span>
                        </div>
                        <p className="text-xs italic text-stone-300">
                          "Hey! I see you turning onto the service road on GPS. I'm right here by the car, hurry up!"
                        </p>
                        <button
                          onClick={() => setCallState('idle')}
                          className="px-3 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold"
                        >
                          End Call
                        </button>
                      </div>
                    )}
                  </div>

                  {/* OFFLINE BLE MESH RELAY */}
                  <div className="p-3 rounded-2xl bg-white border border-rose-200 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-rose-600" />
                        Zero-Data BLE Mesh
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">{meshNodes} Peer Relays</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-tight">
                      When cellular towers blackout or data is disabled, Safie broadcasts an encrypted BLE packet hopping device-to-device to any phone with internet.
                    </p>

                    <button
                      onClick={() => {
                        setMeshBroadcasting(!meshBroadcasting);
                        if (!meshBroadcasting) setMeshNodes((n) => n + 2);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        meshBroadcasting
                          ? 'bg-rose-100 text-rose-800 border border-rose-400 animate-pulse'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {meshBroadcasting ? '📡 Relaying SOS Mesh Hop...' : 'Test BLE Mesh Hop'}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM PHONE NAVIGATION TABS */}
            <div className="h-16 bg-white border-t border-rose-200 px-3 flex items-center justify-around z-30 select-none">
              
              <button
                onClick={() => setActiveTab('safety-hold')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
                  activeTab === 'safety-hold' ? 'text-rose-600 scale-105' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Safety Hold</span>
              </button>

              <button
                onClick={() => setActiveTab('navigation')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
                  activeTab === 'navigation' ? 'text-rose-600 scale-105' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>Routes</span>
              </button>

              <button
                onClick={() => setActiveTab('safe-havens')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
                  activeTab === 'safe-havens' ? 'text-rose-600 scale-105' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Havens</span>
              </button>

              <button
                onClick={() => setActiveTab('deterrence')}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-all ${
                  activeTab === 'deterrence' ? 'text-rose-600 scale-105' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Deterrence</span>
              </button>

            </div>

            {/* Home Bar Indicator */}
            <div className="h-3 bg-white flex justify-center pb-1">
              <div className="w-28 h-1 rounded-full bg-stone-300" />
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* COMPANION INSTRUCTIONS & CONTROLS */}
        {/* ============================================================== */}
        <div className="max-w-md w-full text-left space-y-4 p-5 sm:p-6 rounded-3xl bg-white border border-rose-200 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono uppercase font-bold bg-rose-100 text-rose-700 border border-rose-300">
              Interactive Simulation
            </span>
            <span className="text-xs text-stone-500 font-mono">Live Sandbox</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-stone-900">
            Test Safie Mobile Features Live in Browser
          </h2>

          <p className="text-sm text-stone-600 leading-relaxed">
            This interactive simulator reproduces the real Kotlin Android app logic directly inside your browser. Try these live interactions:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
              <strong className="text-rose-700 block font-bold">1. Hold & Release Dead Man's Switch:</strong>
              <p className="text-stone-600">
                Hold down the tactile pink button, then release it to watch the 10-second emergency countdown trigger.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
              <strong className="text-rose-700 block font-bold">2. Test Duress PIN (9876):</strong>
              <p className="text-stone-600">
                Type <code className="text-rose-700 font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200">9876</code> to see how Safie deceives an aggressor by displaying "Alarm Cancelled" while covertly transmitting high-priority red alert with live GPS to Delhi Police!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
              <strong className="text-rose-700 block font-bold">3. Safe Haven "Ask for Angela":</strong>
              <p className="text-stone-600">
                Switch to <strong>Havens</strong> to view real 24/7 verified pharmacies and metro police desks across Gurugram & South Delhi with 1-tap detour routing.
              </p>
            </div>
          </div>

          {/* Quick Action to Download Android APK */}
          <div className="pt-2 flex items-center justify-between border-t border-rose-100">
            <div>
              <p className="text-xs font-bold text-stone-900">Ready for Real Device?</p>
              <p className="text-[11px] text-stone-500">Download native Kotlin APK</p>
            </div>
            <a
              href="/downloads/safie-release.apk"
              download="Safie-v1.0-delhi-ncr.apk"
              className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
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
