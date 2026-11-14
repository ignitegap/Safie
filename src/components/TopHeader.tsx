'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Smartphone, Download, UserCheck, LogIn, ShieldAlert, MapPin } from 'lucide-react';

interface TopHeaderProps {
  onOpenDemo: () => void;
  onOpenAuth: () => void;
  user: any;
  onLogout: () => void;
}

export default function TopHeader({ onOpenDemo, onOpenAuth, user, onLogout }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#FFF5F6]/90 border-b border-rose-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-rose-100 border border-rose-300/80 flex items-center justify-center p-1.5 shadow-sm group-hover:border-rose-500 transition-all">
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
              <span className="font-black text-2xl tracking-tight text-stone-900">safie</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-700 border border-rose-300">
                DELHI · NCR
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
              Preemptive Urban Safety & Live Route Intelligence
            </p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-600">
          <a href="#map" className="hover:text-rose-600 transition-colors flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" />
            Safety Map
          </a>
          <a href="#safe-havens" className="hover:text-rose-600 transition-colors flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Safe Havens
          </a>
          <a href="#threat-tiers" className="hover:text-rose-600 transition-colors">
            4-Tier Response
          </a>
          <a href="#comparison" className="hover:text-rose-600 transition-colors">
            Why Safie
          </a>
        </nav>

        {/* Right Action Controls: DEMO TAB + APK DOWNLOAD + AUTH */}
        <div className="flex items-center gap-3">
          
          {/* THE DEMO TAB */}
          <button
            onClick={onOpenDemo}
            id="top-demo-btn"
            className="relative px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-bold text-sm shadow-[0_4px_18px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_24px_rgba(225,29,72,0.4)] hover:scale-102 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Interactive Demo</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-white/25 text-white font-mono uppercase font-bold">
              Phone
            </span>
          </button>

          {/* Download APK Button */}
          <a
            href="/downloads/safie-release.apk"
            download="Safie-v1.0-delhi-ncr.apk"
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-sm font-semibold border border-rose-200 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-rose-600" />
            <span>Download APK</span>
          </a>

          {/* User Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-rose-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-stone-900 truncate max-w-[120px]">{user.name || 'Citizen'}</p>
                <p className="text-[10px] font-mono text-rose-600">{user.phone}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-full bg-white hover:bg-rose-100 text-stone-600 hover:text-rose-700 transition-all border border-rose-200"
                title="Sign Out"
              >
                <UserCheck className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs sm:text-sm font-semibold border border-rose-200 transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
