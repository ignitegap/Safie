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
  Radio,
  Cpu,
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-mono font-bold tracking-wider uppercase">
              <Database className="w-3.5 h-3.5" />
              <span>Full-Stack Cloud Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Production Stack Powered by Neon PostgreSQL
            </h2>
            <p className="text-base text-stone-600">
              Built to withstand real-world city infrastructure constraints: sub-100ms response times, serverless connection pooling, and multi-region fault tolerance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Neon Cloud DB */}
            <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">
                  Serverless Database
                </span>
                <h3 className="text-lg font-black text-stone-900">Neon PostgreSQL</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Stores citizen emergency contacts, hashed credentials (Bcrypt), Safe Haven spatial geometries, and real-time SOS telemetry.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1.5">
                <span>⚡ Connection Pooling · 0ms Cold Starts</span>
              </div>
            </div>

            {/* Card 2: Routing Engine */}
            <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">
                  Valhalla Pedestrian Engine
                </span>
                <h3 className="text-lg font-black text-stone-900">Multi-Objective Costing</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Applies custom cost penalties to unlit segments and secluded alleys, while factoring in proximity to 24/7 guarded locations. Maximum permitted route detour delta capped at +3 minutes.
              </p>
              <div className="pt-2 text-[11px] font-mono text-stone-500 font-semibold flex items-center gap-1.5">
                <span>GMDA CCMS Telemetry Ingestion</span>
              </div>
            </div>

            {/* Card 3: BLE Mesh Relay */}
            <div className="p-6 rounded-3xl bg-white border border-rose-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">
                  Offline Fallback
                </span>
                <h3 className="text-lg font-black text-stone-900">BLE Mesh Relay Engine</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Native Android Kotlin service implementing multi-hop Bluetooth Low Energy flooding. When phone towers are disconnected, SOS packets hop device-to-device to any phone with data connectivity.
              </p>
              <div className="pt-2 text-[11px] font-mono text-rose-600 font-semibold flex items-center gap-1.5">
                <span>Zero-Data Emergency Hop</span>
              </div>
            </div>

          </div>
        </section>

        {/* 7. Download APK Section */}
        <DownloadApkSection />

        {/* 8. Footer */}
        <footer className="border-t border-rose-200/80 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center">
                <Image src="/logo.png" alt="Safie" width={24} height={24} />
              </div>
              <div>
                <span className="font-extrabold text-stone-900 text-sm tracking-tight">safie</span>
                <p className="text-[10px] text-stone-400">
                  Preemptive Urban Safety Platform · Delhi NCR Edition
                </p>
              </div>
            </div>

            {/* Emergency Hotline Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="text-[11px] font-semibold text-stone-700">Emergency Hotlines:</span>
              <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold">
                112 (National Emergency)
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold">
                1091 (Women in Distress)
              </span>
              <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold">
                1090 (Delhi Police Helpline)
              </span>
            </div>

            {/* GitHub & Project Links */}
            <div className="flex items-center gap-4 font-medium">
              <a
                href="https://github.com/ignitegap/Safie.git"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-stone-700 hover:text-rose-600 transition-colors"
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
