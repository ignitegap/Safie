'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Smartphone,
  Shield,
  ShieldAlert,
  Database,
  Layers,
  MapPin,
  Download,
  Github,
  PhoneCall,
  Radio,
  Cpu,
} from 'lucide-react';

import LeftCurvedNavbar from '@/components/LeftCurvedNavbar';
import HeroSection from '@/components/HeroSection';
import InteractiveSafetyMap from '@/components/InteractiveSafetyMap';
import ThreatEscalationSection from '@/components/ThreatEscalationSection';
import SafeHavenSection from '@/components/SafeHavenSection';
import ComparisonSection from '@/components/ComparisonSection';
import DownloadApkSection from '@/components/DownloadApkSection';
import PhoneMockupDemo from '@/components/PhoneMockupDemo';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('safie_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('safie_token');
    localStorage.removeItem('safie_user');
    setUser(null);
  };

  return (
    <div className="relative min-h-screen bg-[#FFF5F6] text-stone-900 selection:bg-rose-500 selection:text-white">
      
      {/* Single Left Curved Navbar with Auto-Hide & Safie Brand Logo */}
      <LeftCurvedNavbar
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Page Content */}
      <main className="pl-0 md:pl-16">
        
        {/* 1. Hero Section */}
        <HeroSection
          onOpenDemo={() => setIsDemoOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {/* 2. Interactive Delhi-Gurugram Map */}
        <InteractiveSafetyMap />

        {/* 3. 4-Tier Threat Escalation & Duress PIN */}
        <ThreatEscalationSection onOpenDemo={() => setIsDemoOpen(true)} />

        {/* 4. "Ask for Angela" Safe Haven Network */}
        <SafeHavenSection />

        {/* 5. Architectural Comparison Matrix */}
        <ComparisonSection />

        {/* 6. System Architecture & Neon Cloud Section */}
        <section id="architecture" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200/80 text-rose-700 text-xs font-mono">
              <Database className="w-3.5 h-3.5" />
              <span>Full-Stack Cloud Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
              Production stack powered by Neon PostgreSQL
            </h2>
            <p className="text-sm text-stone-600">
              Designed for real-world municipal infrastructure constraints: sub-100ms response times, serverless connection pooling, and multi-region fault tolerance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Neon Cloud DB */}
            <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-700 uppercase font-medium">
                  Serverless Database
                </span>
                <h3 className="text-base font-semibold text-stone-900">Neon PostgreSQL</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Persists citizen emergency contacts, bcrypt hashed credentials, safe haven spatial points, and live SOS telemetry.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 flex items-center gap-1.5">
                <span>Connection pooling active</span>
              </div>
            </div>

            {/* Card 2: Routing Engine */}
            <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-700 uppercase font-medium">
                  Pedestrian Costing Engine
                </span>
                <h3 className="text-base font-semibold text-stone-900">Multi-Objective Router</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Penalizes unlit segments and secluded alleys, factoring in proximity to 24/7 guarded locations. Maximum permitted route detour delta capped at +2.5 minutes.
              </p>
              <div className="pt-2 text-[11px] font-mono text-stone-500 flex items-center gap-1.5">
                <span>GMDA CCMS telemetry ingestion</span>
              </div>
            </div>

            {/* Card 3: BLE Mesh Relay */}
            <div className="p-5 rounded-2xl bg-white border border-rose-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-700 uppercase font-medium">
                  Offline Fallback
                </span>
                <h3 className="text-base font-semibold text-stone-900">BLE Mesh Relay Engine</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                Native Android Kotlin service implementing multi-hop Bluetooth Low Energy flooding. When cell towers are disconnected, SOS packets hop device-to-device to any phone with data connectivity.
              </p>
              <div className="pt-2 text-[11px] font-mono text-stone-500 flex items-center gap-1.5">
                <span>Zero-data emergency hop</span>
              </div>
            </div>

          </div>
        </section>

        {/* 7. Download APK Section */}
        <DownloadApkSection />

        {/* 8. Footer */}
        <footer className="border-t border-rose-200/70 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Image src="/logo.png" alt="Safie" width={20} height={20} />
              </div>
              <div>
                <span className="font-semibold text-stone-900 text-xs tracking-tight">safie</span>
                <span className="text-[11px] text-stone-400 ml-1.5">Delhi NCR Urban Safety Platform</span>
              </div>
            </div>

            {/* Emergency Hotline Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] text-stone-600">Emergency Hotlines:</span>
              <span className="px-2.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[11px]">
                112 (National)
              </span>
              <span className="px-2.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[11px]">
                1091 (Women Helpline)
              </span>
              <span className="px-2.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 font-mono text-[11px]">
                1090 (Delhi Police)
              </span>
            </div>

            {/* GitHub & Project Links */}
            <div className="flex items-center gap-3 font-medium">
              <a
                href="https://github.com/ignitegap/Safie.git"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-stone-600 hover:text-rose-600 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>ignitegap/Safie</span>
              </a>
              <span>·</span>
              <span>Deployable to Vercel</span>
            </div>

          </div>
        </footer>

      </main>

      {/* ============================================================== */}
      {/* INTERACTIVE PHONE MOCKUP MODAL / SANDBOX */}
      {/* ============================================================== */}
      <PhoneMockupDemo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* ============================================================== */}
      {/* AUTHENTICATION MODAL */}
      {/* ============================================================== */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />

    </div>
  );
}
