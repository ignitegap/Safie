'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Smartphone, Download, UserCheck, LogIn, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

interface TopHeaderProps {
  onOpenDemo: () => void;
  onOpenAuth: () => void;
  user: any;
  onLogout: () => void;
}

export default function TopHeader({ onOpenDemo, onOpenAuth, user, onLogout }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#0B0F19]/80 border-b border-white/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-safie-crimson/10 border border-safie-crimson/30 flex items-center justify-center p-1.5 shadow-lg group-hover:border-safie-crimson/60 transition-all">
            <Image
              src="/logo.png"
              alt="Safie Logo"
              width={40}
              height={40}
              className="object-contain transform group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-wider text-white">SAFIE</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-safie-crimson/20 text-safie-crimson border border-safie-crimson/40">
                DELHI · NCR
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
              Preemptive Urban Safety & Live Route Intelligence
            </p>
          </div>
        </Link>

        {/* Center / Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#map" className="hover:text-white transition-colors flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-safie-crimson" />
            Delhi-Gurugram Map
          </a>
          <a href="#safe-havens" className="hover:text-white transition-colors flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            Safe Havens
          </a>
          <a href="#threat-tiers" className="hover:text-white transition-colors">
            4-Tier Threat Matrix
          </a>
          <a href="#comparison" className="hover:text-white transition-colors">
            Why Safie
          </a>
        </nav>

        {/* Right Action Controls: DEMO TAB + APK DOWNLOAD + AUTH */}
        <div className="flex items-center gap-3">
          
          {/* THE DEMO TAB AS REQUESTED */}
          <button
            onClick={onOpenDemo}
            id="top-demo-btn"
            className="relative group overflow-hidden px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-safie-crimson to-rose-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(229,57,53,0.45)] hover:shadow-[0_0_35px_rgba(229,57,53,0.7)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 border border-red-400/40"
          >
            <span className="absolute -inset-x-2 -top-10 h-24 w-1/3 bg-white/25 rotate-12 group-hover:translate-x-48 transition-transform duration-700 pointer-events-none"></span>
            <Smartphone className="w-4 h-4 animate-bounce" />
            <span className="tracking-wide">Demo App</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-black/30 text-white font-mono uppercase tracking-wider">
              Phone
            </span>
          </button>

          {/* Download APK Button */}
          <a
            href="/downloads/safie-release.apk"
            download="Safie-v1.0-delhi-ncr.apk"
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 hover:border-slate-500 transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-safie-crimson" />
            <span>Download APK</span>
          </a>

          {/* User Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-white truncate max-w-[110px]">{user.name || 'Citizen'}</p>
                <p className="text-[10px] font-mono text-gray-400">{user.phoneNumber}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-full bg-slate-800 hover:bg-red-950 text-gray-300 hover:text-red-400 transition-all border border-slate-700"
                title="Sign Out"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-gray-200 text-xs sm:text-sm font-semibold border border-slate-700 hover:border-slate-500 transition-all"
            >
              <LogIn className="w-4 h-4 text-safie-crimson" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
