'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  Sparkles,
  ExternalLink,
  Radio,
  Cpu,
  Lock,
} from 'lucide-react';

import TopHeader from '@/components/TopHeader';
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

  // Restore authenticated session from localStorage
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
    <div className="relative min-h-screen bg-[#0B0F19] text-[#F8FAFC] selection:bg-safie-crimson selection:text-white">
      
      {/* Top Header Navigation Bar with DEMO TAB */}
      <TopHeader
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Left Curved Floating Navbar with Auto-Hide */}
      <LeftCurvedNavbar
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
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
        <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Database className="w-3.5 h-3.5" />
              <span>Full-Stack Cloud Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Production Stack Powered by Neon PostgreSQL
            </h2>
            <p className="text-base text-gray-400">
              Built to withstand real-world city infrastructure constraints: sub-100ms response times, serverless connection pooling, and multi-region fault tolerance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Neon Cloud DB */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Serverless Database
                </span>
                <h3 className="text-lg font-black text-white">Neon PostgreSQL</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Integrated directly with project <code className="text-emerald-300 font-mono">noisy-shadow-23252383</code>. Stores citizen emergency contacts, hashed credentials (Argon2id/Bcrypt), Safe Haven spatial geometries, and real-time SOS telemetry.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span>⚡ Connection Pooling · 0ms Cold Starts</span>
              </div>
            </div>

            {/* Card 2: Routing Engine */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  Valhalla Pedestrian Engine
                </span>
                <h3 className="text-lg font-black text-white">Multi-Objective Costing</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Applies custom cost penalties to unlit segments and secluded alleys, while factoring in proximity to 24/7 guarded locations. Maximum permitted route detour delta capped at +3 minutes.
              </p>
              <div className="pt-2 text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
                <span>🛣️ GMDA CCMS Telemetry Ingestion</span>
              </div>
            </div>

            {/* Card 3: BLE Mesh Relay */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-safie-crimson/20 border border-safie-crimson/40 flex items-center justify-center text-safie-crimson">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-safie-crimson font-bold uppercase">
                  Offline Fallback
                </span>
                <h3 className="text-lg font-black text-white">BLE Mesh Relay Engine</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Native Android Kotlin service implementing multi-hop Bluetooth Low Energy flooding. When phone towers are disconnected, SOS packets hop device-to-device to any phone with data connectivity.
              </p>
              <div className="pt-2 text-[11px] font-mono text-safie-crimson flex items-center gap-1.5">
                <span>📡 Zero-Data Crisis Transmission</span>
              </div>
            </div>

          </div>
        </section>

        {/* 7. Download APK Section */}
        <DownloadApkSection />

        {/* 8. Footer */}
        <footer className="border-t border-white/10 bg-slate-950/80 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-400">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-safie-crimson/20 border border-safie-crimson/40 flex items-center justify-center">
                <Image src="/logo.png" alt="Safie" width={24} height={24} />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm tracking-wider">SAFIE</span>
                <p className="text-[10px] text-gray-500">
                  Preemptive Urban Safety Platform · Delhi NCR Edition
                </p>
              </div>
            </div>

            {/* Emergency Hotline Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[11px] font-semibold text-gray-300">Emergency Hotlines:</span>
              <span className="px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800 text-red-300 font-mono font-bold">
                112 (National Emergency)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 font-mono font-bold">
                1091 (Women in Distress)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800 text-blue-300 font-mono font-bold">
                1090 (Delhi Police Helpline)
              </span>
            </div>

            {/* GitHub & Project Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ignitegap/Safie.git"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
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
