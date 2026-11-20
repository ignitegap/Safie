'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  Shield,
  ShieldAlert,
  PhoneCall,
  Volume2,
  VolumeX,
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
  Clock,
  Zap,
  Activity,
  Sparkles,
  Users,
  Heart,
  Share2,
  MapPin,
  Eye,
  Bell,
  AlertOctagon,
} from 'lucide-react';
import { DELHI_NCR_SAFE_HAVENS, SafeHaven } from '@/lib/data-delhi-ncr';
import { useLanguage } from '@/lib/i18n';

interface PhoneMockupDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

type DemoTab = 'safety-hold' | 'guardian' | 'fake-call' | 'panic' | 'walk-sim' | 'havens';

interface CallPersona {
  id: string;
  name: string;
  nameHi: string;
  role: string;
  roleHi: string;
  speechTextEn: string;
  speechTextHi: string;
}

const CALL_PERSONAS: CallPersona[] = [
  {
    id: 'bhaiya',
    name: 'Bhaiya (Brother)',
    nameHi: 'भैया (भाई)',
    role: 'Waiting outside with car',
    roleHi: 'कार लेकर बाहर खड़ा है',
    speechTextEn: "Hey! I can see your live location on the map. I'm right outside by the main road waiting with the car running, hurry up!",
    speechTextHi: "अरे कहाँ पहुँची? मैं मेन रोड पर ही गाड़ी स्टार्ट करके खड़ा हूँ, जल्दी आ, मैं देख रहा हूँ तुझे!",
  },
  {
    id: 'mom',
    name: 'Mom',
    nameHi: 'मम्मी',
    role: 'Front gate standby',
    roleHi: 'गेट पर इंतज़ार कर रही हैं',
    speechTextEn: "Beta, are you near the metro? Papa is standing at the building gate right now to walk you in.",
    speechTextHi: "बेटा, तू मेट्रो के पास पहुँच गई? तेरे पापा नीचे गेट पर ही खड़े हैं, सीधे अंदर आजा।",
  },
  {
    id: 'cab',
    name: 'Cab Driver (Verified)',
    nameHi: 'कैब ड्राइवर (जाँचा हुआ)',
    role: 'Hazard lights flashing',
    roleHi: 'गाड़ी की लाइट जलाकर खड़ा है',
    speechTextEn: "Madam, I have arrived at your pickup spot. White Swift Dzire with hazard lights on. I am waiting.",
    speechTextHi: "मैडम, मैं आपके पिकअप पॉइंट पर आ गया हूँ। सफेद स्विफ्ट, इंडिकेटर ऑन है, बाहर ही हूँ।",
  },
  {
    id: 'safie-desk',
    name: 'Safie Safety Desk',
    nameHi: 'सेफ़ी सुरक्षा कंट्रोल रूम',
    role: '24/7 Monitored Dispatch',
    roleHi: '24/7 लाइव मॉनिटरिंग',
    speechTextEn: "Safie Monitoring Center. We are tracking your walking corridor. Your beacon is active. Stay on the illuminated path.",
    speechTextHi: "सेफ़ी सुरक्षा केंद्र। हम आपके रास्ते की लाइव निगरानी कर रहे हैं। रोशनी वाली मुख्य सड़क पर ही रहिए।",
  },
];

interface GuardianContact {
  id: string;
  name: string;
  nameHi: string;
  relation: string;
  relationHi: string;
  status: 'watching' | 'idle';
  battery: number;
  lastPing: string;
}

const INITIAL_GUARDIANS: GuardianContact[] = [
  {
    id: 'g-1',
    name: 'Rajesh Sharma (Dad)',
    nameHi: 'राजेश शर्मा (पापा)',
    relation: 'Primary Guardian',
    relationHi: 'मुख्य संरक्षक',
    status: 'watching',
    battery: 84,
    lastPing: '2s ago',
  },
  {
    id: 'g-2',
    name: 'Priya (Sister)',
    nameHi: 'प्रिया (बहन)',
    relation: 'Emergency Circle',
    relationHi: 'इमरजेंसी सर्कल',
    status: 'watching',
    battery: 92,
    lastPing: '5s ago',
  },
  {
    id: 'g-3',
    name: 'Aanya (Roommate)',
    nameHi: 'आन्या (रूममेट)',
    relation: 'Emergency Circle',
    relationHi: 'इमरजेंसी सर्कल',
    status: 'idle',
    battery: 61,
    lastPing: '1m ago',
  },
];

export default function PhoneMockupDemo({ isOpen, onClose }: PhoneMockupDemoProps) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<DemoTab>('safety-hold');

  // Safety Hold State
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinFeedback, setPinFeedback] = useState<{
    status: 'idle' | 'success' | 'duress' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  // Guardian Circle State
  const [guardians, setGuardians] = useState<GuardianContact[]>(INITIAL_GUARDIANS);
  const [guardianPingRate, setGuardianPingRate] = useState<'30s' | '5s'>('30s');
  const [guardianNotification, setGuardianNotification] = useState<string>('');

  // Enhanced Fake Call State
  const [callPersona, setCallPersona] = useState<CallPersona>(CALL_PERSONAS[0]);
  const [callAudioMode, setCallAudioMode] = useState<'speaker' | 'earpiece'>('speaker');
  const [callState, setCallState] = useState<'idle' | 'scheduled' | 'ringing' | 'active'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [scheduledCountdown, setScheduledCountdown] = useState(0);

  // "Watch Over Me" Journey Timer
  const [journeyTimerActive, setJourneyTimerActive] = useState(false);
  const [journeyMinutesLeft, setJourneyMinutesLeft] = useState(15);
  const [journeySecondsLeft, setJourneySecondsLeft] = useState(0);
  const [journeyTimerStatus, setJourneyTimerStatus] = useState<string>('');

  // Panic Strobe & Siren State
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [strobeFlash, setStrobeFlash] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Stealth Shake SOS
  const [stealthSosActive, setStealthSosActive] = useState(false);
  const [stealthSosMsg, setStealthSosMsg] = useState('');

  // Walk Sim State
  const [isWalking, setIsWalking] = useState(false);
  const [walkStepIndex, setWalkStepIndex] = useState(0);
  const [simUnexpectedStop, setSimUnexpectedStop] = useState(false);
  const [simDeviationAlert, setSimDeviationAlert] = useState(false);

  // Clock
  const [timeStr, setTimeStr] = useState('23:42');

  const walkCorridorSteps = [
    {
      title: 'DLF Cyber City Metro Exit',
      titleHi: 'डीएलएफ साइबर सिटी मेट्रो निकास',
      details: '24/7 CCTV coverage · CISF Security Kiosk',
      detailsHi: '24/7 सीसीटीवी कवरेज · सीआईएसएफ सुरक्षा चौकी',
      distance: 'Start',
      lit: '100% Lit',
      tag: 'Safe Hub',
    },
    {
      title: 'Passing Apollo Pharmacy 24/7',
      titleHi: 'अपोलो फार्मेसी 24/7 के पास',
      details: 'Certified Safe Haven · Ask for Angela',
      detailsHi: 'प्रमाणित सुरक्षित ठिकाना · आस्क फॉर एंजेला',
      distance: '350m',
      lit: '98% Lit',
      tag: 'Sanctuary',
    },
    {
      title: 'MG Road Main Lit Arterial',
      titleHi: 'एमजी रोड मुख्य रोशनी वाला मार्ग',
      details: 'GMDA CCMS Smart Poles · Active traffic flow',
      detailsHi: 'जीएमडीए स्मार्ट पोल्स · सक्रिय यातायात व दुकानें',
      distance: '850m',
      lit: '95% Lit',
      tag: 'Corridor',
    },
    {
      title: 'Leisure Valley Road Turn',
      titleHi: 'लेज़र वैली रोड मोड़',
      details: 'Well-lit pedestrian sidewalk · Guard present',
      detailsHi: 'रोशन फुटपाथ · सुरक्षा गार्ड तैनात',
      distance: '1.2 km',
      lit: '92% Lit',
      tag: 'Corridor',
    },
    {
      title: 'Arrival at Sector 29 Market',
      titleHi: 'सेक्टर 29 मार्केट सुरक्षित पहुँचे',
      details: 'Commercial hub · Destination achieved',
      detailsHi: 'व्यावसायिक क्षेत्र · यात्रा सुरक्षित पूरी',
      distance: 'Arrived',
      lit: '100% Lit',
      tag: 'Destination',
    },
  ];

  // Clock update
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

  // Step advancement during active simulated walk
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWalking && !simUnexpectedStop && !simDeviationAlert) {
      interval = setInterval(() => {
        setWalkStepIndex((prev) => (prev + 1) % walkCorridorSteps.length);
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isWalking, simUnexpectedStop, simDeviationAlert, walkCorridorSteps.length]);

  // Safety Hold countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setPinFeedback({
        status: 'duress',
        message:
          lang === 'hi'
            ? '10 सेकंड पूरे: पुलिस कंट्रोल रूम (112) और संरक्षक संपर्कों को लाइव लोकेशन के साथ संकट अलर्ट भेजा गया।'
            : '10s Window Expired: Emergency SOS packet dispatched with live GPS to Police Control Room (112) & registered emergency contacts.',
      });
    }
    return () => clearTimeout(timer);
  }, [countdown, lang]);

  // Scheduled Call Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'scheduled') {
      if (scheduledCountdown > 0) {
        timer = setTimeout(() => {
          setScheduledCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        setCallState('ringing');
      }
    }
    return () => clearTimeout(timer);
  }, [callState, scheduledCountdown]);

  // Fake Call active timer and speech deterrence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'active') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const speechText = lang === 'hi' ? callPersona.speechTextHi : callPersona.speechTextEn;
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
          utterance.volume = callAudioMode === 'speaker' ? 1.0 : 0.4;
          utterance.rate = 0.95;
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
  }, [callState, callPersona, callAudioMode, lang]);

  // Watch Over Me Journey Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (journeyTimerActive) {
      interval = setInterval(() => {
        if (journeySecondsLeft > 0) {
          setJourneySecondsLeft((prev) => prev - 1);
        } else if (journeyMinutesLeft > 0) {
          setJourneyMinutesLeft((prev) => prev - 1);
          setJourneySecondsLeft(59);
        } else {
          setJourneyTimerActive(false);
          setJourneyTimerStatus(
            lang === 'hi'
              ? 'यात्रा समय समाप्त! आपातकालीन संपर्कों को अंतिम ज्ञात जीपीएस के साथ संकट संदेश भेजा गया।'
              : 'Journey Timer Expired! SOS alert with last GPS breadcrumb sent to your trusted contacts.'
          );
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [journeyTimerActive, journeyMinutesLeft, journeySecondsLeft, lang]);

  // Strobe visual flashing effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSirenActive) {
      interval = setInterval(() => {
        setStrobeFlash((prev) => !prev);
      }, 120);
    } else {
      setStrobeFlash(false);
    }
    return () => clearInterval(interval);
  }, [isSirenActive]);

  // Siren Audio synthesis (Web Audio API)
  const startSirenAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      let freq = 800;
      let goingUp = true;
      const sirenModulator = setInterval(() => {
        if (goingUp) {
          freq += 80;
          if (freq >= 1400) goingUp = false;
        } else {
          freq -= 80;
          if (freq <= 700) goingUp = true;
        }
        try {
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
        } catch (e) {
          clearInterval(sirenModulator);
        }
      }, 50);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscillatorRef.current = osc;
    } catch (e) {
      console.warn('Web Audio Siren error', e);
    }
  };

  const stopSirenAudio = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleSiren = () => {
    if (isSirenActive) {
      setIsSirenActive(false);
      stopSirenAudio();
    } else {
      setIsSirenActive(true);
      startSirenAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopSirenAudio();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Safety Hold Handlers
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

  const handlePinSubmit = (pin: string) => {
    if (pin === '1234') {
      setCountdown(null);
      setPinFeedback({
        status: 'success',
        message: lang === 'hi' ? 'सब ठीक है। सुरक्षा होल्ड सुरक्षित बंद कर दिया गया।' : 'All clear. Safety hold disarmed safely.',
      });
      setPinInput('');
    } else if (pin === '9876') {
      setCountdown(null);
      setPinFeedback({
        status: 'duress',
        message:
          lang === 'hi'
            ? 'अलार्म बंद हुआ। (धोखा देने वाली स्क्रीन सक्रिय। गुप्त उच्च-प्राथमिकता वाला पुलिस अलर्ट 28.4958° N, 77.0895° E के साथ 112 और परिवार को भेजा गया)'
            : 'Alarm Cancelled. (Deceptive display confirmed. Covert red alert dispatched with live GPS coordinates: 28.4958° N, 77.0895° E to Gurugram Police 112 & family)',
      });
      setPinInput('');
    } else {
      setPinFeedback({
        status: 'error',
        message: lang === 'hi' ? 'गलत पिन। 1234 (सामान्य) या 9876 (गुप्त पिन) डालें।' : 'Incorrect PIN. Try 1234 (Normal Disarm) or 9876 (Duress PIN).',
      });
    }
  };

  // Guardian Circle Actions
  const handleSendUneasyAlert = () => {
    setGuardianPingRate('5s');
    setGuardianNotification(
      lang === 'hi'
        ? 'असहज अलर्ट भेजा गया! पापा व प्रिया को हाई-प्रायोरिटी अलर्ट मिला। जीपीएस ट्रैकिंग 5s गति पर सक्रिय।'
        : "Uneasy Ping Broadcast! Rajesh & Priya received priority alert. Location tracking frequency accelerated to 5 seconds."
    );
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const handleConfirmArrival = () => {
    setGuardianPingRate('30s');
    setGuardianNotification(
      lang === 'hi'
        ? 'सुरक्षित आगमन संदेश भेजा गया! संरक्षक सर्कल को सूचित कर दिया गया है।'
        : 'Safe Arrival Broadcast! Your Guardian Circle has been notified that you reached safely.'
    );
  };

  // Stealth Shake SOS
  const triggerStealthSos = () => {
    setStealthSosActive(true);
    setStealthSosMsg(
      lang === 'hi'
        ? 'शेक अलर्ट सक्रिय: फोन कंपन + मूक आपातकालीन अलर्ट 112 और 3 पंजीकृत संपर्कों को भेजा गया।'
        : 'Stealth Shake Detected: Haptic pulse + Silent emergency packet transmitted to 112 & emergency contacts.'
    );
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }
    setTimeout(() => {
      setStealthSosActive(false);
    }, 4000);
  };

  // 1-Click Guided Scenario Launcher (for Sandbox Companion)
  const launchScenario = (scenarioKey: string) => {
    if (scenarioKey === 'duress') {
      setActiveTab('safety-hold');
      setCountdown(null);
      setIsHolding(false);
      setPinFeedback({
        status: 'duress',
        message:
          lang === 'hi'
            ? 'डेमो 9876 गुप्त पिन सक्रिय: हमलावर के सामने "अलार्म रद्द" दिखता है, जबकि 112 पुलिस को गुप्त रेड अलर्ट जाता है।'
            : 'Duress PIN (9876) Activated: Displays fake "Alarm Cancelled" to an aggressor while transmitting high-priority red alert with live GPS to 112 Police.',
      });
    } else if (scenarioKey === 'fake-call') {
      setActiveTab('fake-call');
      setCallPersona(CALL_PERSONAS[0]); // Bhaiya
      setCallState('ringing');
    } else if (scenarioKey === 'siren') {
      setActiveTab('panic');
      if (!isSirenActive) {
        setIsSirenActive(true);
        startSirenAudio();
      }
    } else if (scenarioKey === 'unexpected-stop') {
      setActiveTab('walk-sim');
      setIsWalking(true);
      setSimUnexpectedStop(true);
      setSimDeviationAlert(false);
    } else if (scenarioKey === 'guardian') {
      setActiveTab('guardian');
      handleSendUneasyAlert();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/50 backdrop-blur-xs overflow-y-auto">
      {/* Container */}
      <div className="relative max-w-5xl w-full flex flex-col lg:flex-row items-center justify-center gap-6 py-4">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-2 lg:-top-3 lg:-right-3 z-50 p-2 rounded-full bg-white text-stone-700 hover:bg-stone-100 transition-colors border border-rose-200 shadow-md cursor-pointer"
          aria-label="Close phone simulator"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================== */}
        {/* PHYSICAL PHONE SHELL */}
        {/* ============================================================== */}
        <div className="relative w-[340px] sm:w-[360px] h-[710px] rounded-[48px] p-3 bg-stone-900 border-[3px] border-stone-800 shadow-2xl flex-shrink-0 select-none">
          {/* Side Hardware Buttons */}
          <div className="absolute -left-[5px] top-28 w-[2px] h-10 bg-stone-700 rounded-l-sm" />
          <div className="absolute -left-[5px] top-42 w-[2px] h-12 bg-stone-700 rounded-l-sm" />
          <div className="absolute -right-[5px] top-32 w-[2px] h-16 bg-stone-700 rounded-r-sm" />

          {/* Screen Area */}
          <div
            className={`relative w-full h-full rounded-[40px] overflow-hidden flex flex-col text-stone-900 transition-colors duration-100 ${
              isSirenActive
                ? strobeFlash
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-stone-900'
                : 'bg-[#FFF5F6]'
            }`}
          >
            {/* Dynamic Island / Status Bar */}
            <div className="h-10 px-5 pt-2 flex items-center justify-between text-xs font-medium z-30 select-none">
              <span className="font-mono text-[12px]">{timeStr}</span>

              {/* Dynamic Island Pill */}
              <div className="w-22 h-4.5 bg-stone-900 rounded-full flex items-center justify-center gap-1.5 px-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
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
              {/* TAB 1: SAFETY HOLD */}
              {activeTab === 'safety-hold' && (
                <div className="space-y-3 flex flex-col items-center text-center">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      {lang === 'hi' ? 'डेड मैन्स स्विच' : "Dead Man's Switch"}
                    </span>
                    <h3 className="text-sm font-semibold text-stone-900">
                      {lang === 'hi' ? 'सुरक्षा होल्ड बटन' : 'Safety Hold Switch'}
                    </h3>
                    <p className="text-[11px] text-stone-500 max-w-[240px] mx-auto mt-0.5 leading-snug">
                      {lang === 'hi'
                        ? 'चलते समय अंगूठा दबाकर रखें। हाथ छूटते ही 10 सेकंड का आपातकालीन टाइमर शुरू होगा।'
                        : 'Hold thumb down while walking. Releasing initiates a 10-second countdown.'}
                    </p>
                  </div>

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
                        <span>{isHolding ? (lang === 'hi' ? 'दबा रखा है' : 'Holding') : (lang === 'hi' ? 'अंगूठा दबाएं' : 'Hold Thumb')}</span>
                        <span className="text-[9px] opacity-80 font-normal">
                          {isHolding
                            ? lang === 'hi' ? 'लाइव मॉनिटरिंग' : 'Monitoring live'
                            : lang === 'hi' ? 'छोड़ते ही 10s टाइमर' : 'Release = 10s Timer'}
                        </span>
                      </button>
                    </div>
                  )}

                  {countdown !== null && (
                    <div className="w-full p-3 rounded-xl bg-rose-600 text-white space-y-1 animate-pulse">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                        <AlertTriangle className="w-4 h-4 text-white" />
                        <span>{lang === 'hi' ? 'हाथ छूटा: अलार्म सक्रिय' : 'Safety Hold Released'}</span>
                      </div>
                      <div className="text-3xl font-semibold font-mono tracking-widest tabular-nums">
                        00:{countdown < 10 ? `0${countdown}` : countdown}
                      </div>
                      <p className="text-[10px] text-rose-100">
                        {lang === 'hi'
                          ? 'रद्द करने के लिए पिन डालें। 00:00 होते ही पुलिस को अलर्ट जाएगा।'
                          : 'Enter PIN to cancel alert. Dispatches police SOS on 00:00.'}
                      </p>
                    </div>
                  )}

                  <div className="w-full max-w-[240px] space-y-2">
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
                        {lang === 'hi' ? 'पुष्टि' : 'Verify'}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px]">
                      <button
                        onClick={() => handlePinSubmit('1234')}
                        className="px-2 py-1 rounded bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 cursor-pointer"
                      >
                        {lang === 'hi' ? 'सामान्य:' : 'Normal:'} <span className="font-mono text-emerald-700 font-medium">1234</span>
                      </button>
                      <button
                        onClick={() => handlePinSubmit('9876')}
                        className="px-2 py-1 rounded bg-rose-50 text-stone-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
                      >
                        {lang === 'hi' ? 'गुप्त पिन:' : 'Duress:'} <span className="font-mono text-rose-700 font-medium">9876</span>
                      </button>
                    </div>

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

              {/* TAB 2: GUARDIAN CIRCLE (LIVE TRUSTED CONTACTS) */}
              {activeTab === 'guardian' && (
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-stone-500 uppercase">
                        {lang === 'hi' ? 'लाइव जर्नी मॉनिटरिंग' : 'Live Journey Sharing'}
                      </span>
                      <h3 className="text-sm font-semibold text-stone-900">
                        {lang === 'hi' ? 'गार्जियन सर्कल (संरक्षक)' : 'Guardian Circle (3 Active)'}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Ping: {guardianPingRate}
                    </span>
                  </div>

                  {/* 1-Tap Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={handleSendUneasyAlert}
                      className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-left transition-colors cursor-pointer flex flex-col justify-between h-18 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono uppercase bg-white/20 px-1 rounded">Fast 5s Ping</span>
                      </div>
                      <div>
                        <strong className="block text-[11px] leading-snug">
                          {lang === 'hi' ? 'असहज लग रहा है' : "I'm Feeling Uneasy"}
                        </strong>
                        <span className="text-[9px] opacity-90 block">
                          {lang === 'hi' ? 'परिवार को सतर्क करें' : 'Alert circle discreetly'}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={handleConfirmArrival}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-left transition-colors cursor-pointer flex flex-col justify-between h-18 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono uppercase bg-white/20 px-1 rounded">All Clear</span>
                      </div>
                      <div>
                        <strong className="block text-[11px] leading-snug">
                          {lang === 'hi' ? 'सुरक्षित पहुँची' : 'Confirm Safe Arrival'}
                        </strong>
                        <span className="text-[9px] opacity-90 block">
                          {lang === 'hi' ? 'सर्कल को सूचित करें' : 'Broadcast arrival'}
                        </span>
                      </div>
                    </button>
                  </div>

                  {guardianNotification && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-[10.5px] text-rose-900 leading-snug">
                      {guardianNotification}
                    </div>
                  )}

                  {/* Trusted Contacts List */}
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
                    {guardians.map((g) => (
                      <div
                        key={g.id}
                        className="p-2.5 rounded-xl bg-white border border-rose-100 flex items-center justify-between text-xs shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-stone-900">
                              {lang === 'hi' ? g.nameHi : g.name}
                            </span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-stone-100 text-stone-600 font-mono">
                              {lang === 'hi' ? g.relationHi : g.relation}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-stone-500">
                            <span className="flex items-center gap-1">
                              <Battery className="w-3 h-3 text-emerald-600" />
                              <span>{g.battery}%</span>
                            </span>
                            <span>·</span>
                            <span>Ping: {g.lastPing}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                            g.status === 'watching'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {g.status === 'watching' ? (lang === 'hi' ? 'लाइव निगरानी' : 'Live') : (lang === 'hi' ? 'स्टैंडबाय' : 'Standby')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FAKE CALL SUITE */}
              {activeTab === 'fake-call' && (
                <div className="space-y-3 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      {lang === 'hi' ? 'बहाने के लिए फर्जी कॉल' : 'Audio Escape Deterrent'}
                    </span>
                    <h3 className="text-sm font-semibold text-stone-900">
                      {lang === 'hi' ? 'फर्जी कॉल सुइट (आवाज़ के साथ)' : 'Voice Fake Call Suite'}
                    </h3>
                  </div>

                  {callState === 'idle' && (
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-white border border-rose-100 space-y-1.5">
                        <label className="text-[10px] font-mono text-stone-500 uppercase block font-medium">
                          {lang === 'hi' ? 'कॉल करने वाले का चयन करें:' : 'Select Caller Persona:'}
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CALL_PERSONAS.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setCallPersona(p)}
                              className={`p-1.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                                callPersona.id === p.id
                                  ? 'bg-rose-50 border-rose-500 text-rose-900 font-semibold'
                                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                              }`}
                            >
                              <div className="font-medium truncate">{lang === 'hi' ? p.nameHi : p.name}</div>
                              <div className="text-[9px] text-stone-400 truncate">{lang === 'hi' ? p.roleHi : p.role}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-white border border-rose-100 space-y-1">
                          <label className="text-[10px] font-mono text-stone-500 block">
                            {lang === 'hi' ? 'ऑडियो मोड:' : 'Audio Mode:'}
                          </label>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setCallAudioMode('speaker')}
                              className={`flex-1 py-1 rounded text-[10px] font-medium cursor-pointer ${
                                callAudioMode === 'speaker'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {lang === 'hi' ? 'लाउडस्पीकर' : 'Speaker'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setCallAudioMode('earpiece')}
                              className={`flex-1 py-1 rounded text-[10px] font-medium cursor-pointer ${
                                callAudioMode === 'earpiece'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {lang === 'hi' ? 'ईयरपीस' : 'Earpiece'}
                            </button>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-white border border-rose-100 space-y-1">
                          <label className="text-[10px] font-mono text-stone-500 block">
                            {lang === 'hi' ? 'कॉल समय:' : 'Trigger Timer:'}
                          </label>
                          <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
                            <button
                              type="button"
                              onClick={() => setCallState('ringing')}
                              className="py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 cursor-pointer font-semibold"
                            >
                              {lang === 'hi' ? 'तुरंत' : 'Now'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setScheduledCountdown(15);
                                setCallState('scheduled');
                              }}
                              className="py-1 rounded bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 cursor-pointer"
                            >
                              15s
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setScheduledCountdown(30);
                                setCallState('scheduled');
                              }}
                              className="py-1 rounded bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 cursor-pointer"
                            >
                              30s
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setCallState('ringing')}
                        className="w-full h-9 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'तुरंत फर्जी कॉल शुरू करें' : 'Trigger Incoming Fake Call'}</span>
                      </button>
                    </div>
                  )}

                  {callState === 'scheduled' && (
                    <div className="p-4 rounded-xl bg-stone-900 text-white text-center space-y-2">
                      <span className="text-[10px] font-mono uppercase text-amber-400">
                        {lang === 'hi' ? 'शेड्यूल कॉल सक्रिय' : 'Scheduled Call Armed'}
                      </span>
                      <h4 className="text-sm font-semibold">
                        {lang === 'hi' ? callPersona.nameHi : callPersona.name}
                      </h4>
                      <div className="text-3xl font-mono font-bold text-rose-400">
                        00:{scheduledCountdown < 10 ? `0${scheduledCountdown}` : scheduledCountdown}
                      </div>
                      <p className="text-[10px] text-stone-400">
                        {lang === 'hi'
                          ? 'जैसे ही समय समाप्त होगा, फोन जोर से बजेगा।'
                          : 'Phone will ring automatically when timer reaches zero.'}
                      </p>
                      <button
                        onClick={() => setCallState('idle')}
                        className="px-3 py-1 rounded bg-stone-800 text-white text-xs hover:bg-stone-700 cursor-pointer"
                      >
                        {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                      </button>
                    </div>
                  )}

                  {callState === 'ringing' && (
                    <div className="p-4 rounded-xl bg-stone-900 text-white text-center space-y-3 animate-pulse">
                      <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                        {lang === 'hi' ? 'आने वाली कॉल' : 'Incoming Call'}
                      </p>
                      <div>
                        <h4 className="text-base font-semibold text-white">
                          {lang === 'hi' ? callPersona.nameHi : callPersona.name}
                        </h4>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {lang === 'hi' ? 'लाइव जीपीएस कनेक्टेड' : 'Live GPS Location Connected'}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-6 pt-2">
                        <button
                          onClick={() => setCallState('idle')}
                          className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-md"
                          title="Decline"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCallState('active')}
                          className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-md animate-bounce"
                          title="Accept"
                        >
                          <PhoneCall className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {callState === 'active' && (
                    <div className="p-4 rounded-xl bg-stone-900 text-white text-center space-y-3">
                      <div className="flex items-center justify-between text-xs text-rose-400">
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{callAudioMode === 'speaker' ? (lang === 'hi' ? 'लाउडस्पीकर पर आवाज़...' : 'Speaking on Speaker...') : (lang === 'hi' ? 'ईयरपीस आवाज़...' : 'Earpiece Audio...')}</span>
                        </span>
                        <span className="font-mono tabular-nums">
                          00:{callDuration < 10 ? `0${callDuration}` : callDuration}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-stone-800/80 border border-stone-700 text-left">
                        <p className="text-xs italic text-stone-200 leading-relaxed">
                          "{lang === 'hi' ? callPersona.speechTextHi : callPersona.speechTextEn}"
                        </p>
                      </div>

                      <button
                        onClick={() => setCallState('idle')}
                        className="h-8 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium cursor-pointer"
                      >
                        {lang === 'hi' ? 'कॉल समाप्त करें' : 'End Call'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PANIC TOOLS */}
              {activeTab === 'panic' && (
                <div className="space-y-3 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">
                      {lang === 'hi' ? 'आपातकालीन ढाल' : 'Emergency Shield Tools'}
                    </span>
                    <h3 className="text-sm font-semibold text-stone-900">
                      {lang === 'hi' ? 'सायरन, यात्रा टाइमर व शेक एसओएस' : 'Siren, Journey Timer & Stealth SOS'}
                    </h3>
                  </div>

                  {/* Siren Button */}
                  <div className="p-3 rounded-xl bg-white border border-rose-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-stone-900 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>{t('toolSirenTitle')}</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-50 text-purple-800">
                        Web Audio
                      </span>
                    </div>
                    <button
                      onClick={toggleSiren}
                      className={`w-full h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        isSirenActive
                          ? 'bg-purple-700 text-white animate-pulse'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {isSirenActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSirenActive ? (lang === 'hi' ? 'सायरन बंद करें' : 'Stop Siren') : (lang === 'hi' ? 'सायरन व फ्लैश चालू करें' : 'Trigger Panic Siren & Strobe')}</span>
                    </button>
                  </div>

                  {/* Watch Over Me */}
                  <div className="p-3 rounded-xl bg-white border border-rose-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-stone-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('toolTimerTitle')}</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800">
                        Auto SOS
                      </span>
                    </div>

                    {!journeyTimerActive ? (
                      <div className="flex items-center gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setJourneyMinutesLeft(15);
                            setJourneySecondsLeft(0);
                            setJourneyTimerActive(true);
                            setJourneyTimerStatus('');
                          }}
                          className="flex-1 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-[11px] cursor-pointer"
                        >
                          15 Mins
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setJourneyMinutesLeft(0);
                            setJourneySecondsLeft(15);
                            setJourneyTimerActive(true);
                            setJourneyTimerStatus('');
                          }}
                          className="flex-1 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[11px] border border-emerald-200 cursor-pointer"
                        >
                          15s (Demo)
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-1">
                        <div className="text-2xl font-mono font-bold text-stone-900">
                          {journeyMinutesLeft < 10 ? `0${journeyMinutesLeft}` : journeyMinutesLeft}:
                          {journeySecondsLeft < 10 ? `0${journeySecondsLeft}` : journeySecondsLeft}
                        </div>
                        <button
                          onClick={() => {
                            setJourneyTimerActive(false);
                            setJourneyTimerStatus(lang === 'hi' ? 'सुरक्षित चेक-इन: टाइमर बंद।' : 'Safe arrival confirmed. Timer cancelled.');
                          }}
                          className="h-7 px-3 rounded bg-emerald-700 text-white text-[10px] font-medium cursor-pointer"
                        >
                          {lang === 'hi' ? 'सुरक्षित पहुँचा (रद्द करें)' : "I'm Safe (Disarm)"}
                        </button>
                      </div>
                    )}
                    {journeyTimerStatus && (
                      <div className="p-1 rounded bg-stone-100 text-[10px] text-stone-800 font-medium">
                        {journeyTimerStatus}
                      </div>
                    )}
                  </div>

                  {/* Stealth Shake SOS */}
                  <div className="p-3 rounded-xl bg-white border border-rose-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-stone-900 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-rose-600" />
                        <span>{lang === 'hi' ? 'मूक शेक एसओएस' : 'Stealth Shake SOS'}</span>
                      </span>
                      <span className="text-[9px] font-mono text-stone-400">Accelerometer</span>
                    </div>
                    <button
                      onClick={triggerStealthSos}
                      className="w-full h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === 'hi' ? 'फोन शेक का परीक्षण करें' : 'Simulate Phone Shake / 3-Tap'}</span>
                    </button>
                    {stealthSosMsg && (
                      <div className="p-1 rounded bg-rose-50 border border-rose-200 text-[10px] text-rose-900">
                        {stealthSosMsg}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: INTERACTIVE SIMULATED LIVE WALK */}
              {activeTab === 'walk-sim' && (
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-stone-500 uppercase">
                        {lang === 'hi' ? 'लाइव वॉक सिमुलेशन' : 'Simulated Live Walk'}
                      </span>
                      <h3 className="text-sm font-semibold text-stone-900">
                        Cyber City ➔ Sector 29
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      96% Lit Corridor
                    </span>
                  </div>

                  {/* Interactive Simulation Triggers Toolbar */}
                  <div className="p-2.5 rounded-xl bg-stone-900 text-white space-y-1.5">
                    <span className="text-[9px] font-mono uppercase text-rose-400 block font-medium">
                      {lang === 'hi' ? 'सिमुलेशन ट्रिगर्स टेस्ट करें:' : 'Inject Simulator Anomaly:'}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <button
                        onClick={() => {
                          setSimUnexpectedStop(true);
                          setSimDeviationAlert(false);
                        }}
                        className="py-1 px-1.5 rounded bg-amber-500/80 hover:bg-amber-600 text-white font-medium text-left cursor-pointer truncate"
                      >
                        ⚠️ {lang === 'hi' ? 'अनपेक्षित ठहराव (3m)' : '3m Stationary Stop'}
                      </button>
                      <button
                        onClick={() => {
                          setSimDeviationAlert(true);
                          setSimUnexpectedStop(false);
                        }}
                        className="py-1 px-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-medium text-left cursor-pointer truncate"
                      >
                        🚨 {lang === 'hi' ? 'गलत मोड़ (भटकाव)' : 'Off-Route (>50m)'}
                      </button>
                    </div>
                  </div>

                  {/* Unexpected Stop Prompt Modal inside Screen */}
                  {simUnexpectedStop && (
                    <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-400 text-stone-900 space-y-2 animate-bounce">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>{lang === 'hi' ? 'क्या आप ठीक हैं? (ठहराव दर्ज)' : 'Are you okay? Prolonged Stop'}</span>
                      </div>
                      <p className="text-[10px] text-stone-700 leading-snug">
                        {lang === 'hi'
                          ? 'आप पिछले 3 मिनट से एक अंधेरे मोड़ के पास रुके हुए हैं। क्या आपको मदद चाहिए?'
                          : 'You have been stationary for 3 minutes near an unlit alley. Confirm status:'}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => setSimUnexpectedStop(false)}
                          className="flex-1 py-1 rounded bg-stone-900 text-white font-medium cursor-pointer"
                        >
                          {lang === 'hi' ? 'मैं ठीक हूँ (रद्द)' : "I'm Safe"}
                        </button>
                        <button
                          onClick={() => {
                            setSimUnexpectedStop(false);
                            setActiveTab('safety-hold');
                            setCountdown(0); // Trigger SOS
                          }}
                          className="flex-1 py-1 rounded bg-red-600 text-white font-medium cursor-pointer"
                        >
                          {lang === 'hi' ? 'मदद चाहिए (SOS)' : 'Trigger SOS'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Route Deviation Banner inside Screen */}
                  {simDeviationAlert && (
                    <div className="p-3 rounded-xl bg-red-600 text-white space-y-1.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs flex items-center gap-1">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'सुरक्षित मार्ग से भटकाव!' : 'Off-Route Deviation Alert'}</span>
                        </strong>
                        <span className="text-[9px] font-mono bg-white/20 px-1 rounded">70m Away</span>
                      </div>
                      <p className="text-[10px] text-red-100 leading-snug">
                        {lang === 'hi'
                          ? 'आप रोशनी वाले मुख्य मार्ग से हटकर अंधेरी गली की तरफ चले गए हैं। नजदीकी सुरक्षित शरण: अपोलो फार्मेसी (250m)'
                          : 'You deviated into an unlit back stretch. Nearest certified refuge: Apollo Pharmacy 24/7 (250m).'}
                      </p>
                      <button
                        onClick={() => {
                          setSimDeviationAlert(false);
                          setWalkStepIndex(1); // reroute to Apollo
                        }}
                        className="w-full py-1 rounded bg-white text-red-700 font-semibold text-[10px] cursor-pointer"
                      >
                        {lang === 'hi' ? 'अपोलो फार्मेसी पर री-रूट करें' : 'Reroute to Apollo Pharmacy'}
                      </button>
                    </div>
                  )}

                  {/* Visual Step Timeline */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-rose-600" />
                        <span>{lang === 'hi' ? 'वर्तमान कदम' : 'Current Waypoint'}</span>
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {walkStepIndex + 1}/{walkCorridorSteps.length}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-100">
                          {walkCorridorSteps[walkStepIndex].tag}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                          {walkCorridorSteps[walkStepIndex].lit}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-stone-900">
                        {lang === 'hi' ? walkCorridorSteps[walkStepIndex].titleHi : walkCorridorSteps[walkStepIndex].title}
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        {lang === 'hi' ? walkCorridorSteps[walkStepIndex].detailsHi : walkCorridorSteps[walkStepIndex].details}
                      </p>
                    </div>
                  </div>

                  {/* Walk Toggle */}
                  <button
                    onClick={() => setIsWalking(!isWalking)}
                    className={`w-full h-8 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isWalking ? 'bg-stone-900 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {isWalking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isWalking ? (lang === 'hi' ? 'सिमुलेशन रोकें' : 'Pause Live Escort Walk') : (lang === 'hi' ? 'लाइव वॉक शुरू करें' : 'Start Live Escort Walk')}</span>
                  </button>
                </div>
              )}

              {/* TAB 6: SAFE HAVENS */}
              {activeTab === 'havens' && (
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
                            setActiveTab('walk-sim');
                            setIsWalking(true);
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
            </div>

            {/* BOTTOM PHONE NAVIGATION TABS (6 TABS) */}
            <div className="h-14 bg-white border-t border-rose-100 px-1 flex items-center justify-around z-30 select-none">
              <button
                onClick={() => setActiveTab('safety-hold')}
                className={`flex flex-col items-center gap-0.5 text-[8.5px] transition-colors cursor-pointer ${
                  activeTab === 'safety-hold' ? 'text-rose-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'होल्ड' : 'Hold'}</span>
              </button>

              <button
                onClick={() => setActiveTab('guardian')}
                className={`flex flex-col items-center gap-0.5 text-[8.5px] transition-colors cursor-pointer ${
                  activeTab === 'guardian' ? 'text-rose-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'सर्कल' : 'Circle'}</span>
              </button>

              <button
                onClick={() => setActiveTab('fake-call')}
                className={`flex flex-col items-center gap-0.5 text-[8.5px] transition-colors cursor-pointer ${
                  activeTab === 'fake-call' ? 'text-rose-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'कॉल' : 'Call'}</span>
              </button>

              <button
                onClick={() => setActiveTab('panic')}
                className={`flex flex-col items-center gap-0.5 text-[8.5px] transition-colors cursor-pointer ${
                  activeTab === 'panic' ? 'text-rose-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'सायरन' : 'Panic'}</span>
              </button>

              <button
                onClick={() => setActiveTab('walk-sim')}
                className={`flex flex-col items-center gap-0.5 text-[8.5px] transition-colors cursor-pointer ${
                  activeTab === 'walk-sim' ? 'text-rose-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'वॉक' : 'Walk'}</span>
              </button>

              <button
                onClick={() => setActiveTab('havens')}
                className={`flex flex-col items-center gap-0.5 text-[8.5px] transition-colors cursor-pointer ${
                  activeTab === 'havens' ? 'text-rose-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'ठिकाने' : 'Havens'}</span>
              </button>
            </div>

            {/* Home Bar Indicator */}
            <div className="h-2.5 bg-white flex justify-center pb-1">
              <div className="w-24 h-1 rounded-full bg-stone-300" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COMPANION INSTRUCTIONS & 1-CLICK QUICK SCENARIOS */}
        {/* ============================================================== */}
        <div className="max-w-md w-full text-left space-y-4 p-5 sm:p-6 rounded-2xl bg-white border border-rose-200/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-50 text-rose-700 border border-rose-200 font-medium">
              Simulation Sandbox
            </span>
            <span className="text-[11px] text-stone-400 font-mono">Live in-browser</span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            {lang === 'hi' ? 'इंटरैक्टिव डेमो सिनेरियो' : 'Interactive Demo Scenarios'}
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed font-normal">
            {lang === 'hi'
              ? 'जजों या उपयोगकर्ताओं को दिखाने के लिए नीचे दिए गए 1-क्लिक बटनों से किसी भी सुरक्षा स्थिति का तुरंत अनुभव लें:'
              : 'Click any scenario below to trigger live simulation flows directly inside the virtual smartphone:'}
          </p>

          {/* 5 Scenario Buttons */}
          <div className="space-y-2 text-xs">
            {/* Scenario 1: Dead Man's Switch */}
            <button
              onClick={() => launchScenario('duress')}
              className="w-full p-2.5 rounded-xl border border-rose-200 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50 text-left transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div>
                <strong className="text-stone-900 group-hover:text-rose-700 block font-medium">
                  {lang === 'hi' ? '1. डेड मैन्स स्विच और गुप्त पिन (9876)' : "1. Dead Man's Switch & Duress (9876)"}
                </strong>
                <p className="text-[11px] text-stone-500">
                  {lang === 'hi' ? 'हमलावर के सामने नकली अलार्म कैंसल' : 'Deceptive cancel display + silent police SOS'}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            </button>

            {/* Scenario 2: Fake Brother Call */}
            <button
              onClick={() => launchScenario('fake-call')}
              className="w-full p-2.5 rounded-xl border border-blue-200 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 text-left transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div>
                <strong className="text-stone-900 group-hover:text-blue-700 block font-medium">
                  {lang === 'hi' ? '2. भैया की असली आवाज़ वाली फर्जी कॉल' : '2. Escape Stalker via Bhaiya Fake Call'}
                </strong>
                <p className="text-[11px] text-stone-500">
                  {lang === 'hi' ? 'स्पीकर पर आवाज़: "मैं बाहर कार में खड़ा हूँ..."' : 'Real speech: "Waiting outside with car running..."'}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            </button>

            {/* Scenario 3: Unexpected Stop */}
            <button
              onClick={() => launchScenario('unexpected-stop')}
              className="w-full p-2.5 rounded-xl border border-amber-200 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50 text-left transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div>
                <strong className="text-stone-900 group-hover:text-amber-800 block font-medium">
                  {lang === 'hi' ? '3. अंधेरे में 3 मिनट रुकने का अलर्ट' : '3. Unexpected Stop near Dark Spot'}
                </strong>
                <p className="text-[11px] text-stone-500">
                  {lang === 'hi' ? 'अनपेक्षित ठहराव पर "क्या आप ठीक हैं?" चेक' : 'Automatic "Are you OK?" prompt after 3m'}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            </button>

            {/* Scenario 4: Acoustic Siren */}
            <button
              onClick={() => launchScenario('siren')}
              className="w-full p-2.5 rounded-xl border border-purple-200 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50 text-left transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div>
                <strong className="text-stone-900 group-hover:text-purple-800 block font-medium">
                  {lang === 'hi' ? '4. तेज़ सायरन और चमकती लाल स्क्रीन' : '4. Acoustic Siren & Flashing Strobe'}
                </strong>
                <p className="text-[11px] text-stone-500">
                  {lang === 'hi' ? 'हमलावर को भगाने और भीड़ जुटाने के लिए' : 'Web Audio police siren + 10Hz screen strobe'}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            </button>

            {/* Scenario 5: Guardian Circle */}
            <button
              onClick={() => launchScenario('guardian')}
              className="w-full p-2.5 rounded-xl border border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div>
                <strong className="text-stone-900 group-hover:text-emerald-800 block font-medium">
                  {lang === 'hi' ? '5. गार्जियन सर्कल: "असहज लग रहा है"' : '5. Guardian Circle: "Feeling Uneasy"'}
                </strong>
                <p className="text-[11px] text-stone-500">
                  {lang === 'hi' ? 'पापा व बहन को तुरंत 5s जीपीएस पिंग' : 'Broadcast alert to Dad & Sister; 5s fast ping'}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            </button>
          </div>

          {/* Quick Action to Download Android APK */}
          <div className="pt-2 flex items-center justify-between border-t border-rose-100">
            <div>
              <p className="text-xs font-medium text-stone-900">
                {lang === 'hi' ? 'असली फोन में चलाना है?' : 'Physical Android Device?'}
              </p>
              <p className="text-[11px] text-stone-500">
                {lang === 'hi' ? 'एंड्रॉइड एपीके डाउनलोड करें' : 'Download Release APK'}
              </p>
            </div>
            <a
              href="https://github.com/ignitegap/Safie/releases/download/v1.0.0-delhi/safie-v1.0.0-delhi-ncr.apk"
              download="Safie-v1.0-delhi-ncr.apk"
              className="h-8 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
            >
              <span>{lang === 'hi' ? 'एपीके डाउनलोड' : 'Download APK'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}