'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Compass,
  MapPin,
  Smartphone,
  ShieldAlert,
  Shield,
  Layers,
  Download,
  Menu,
  X,
  PhoneCall,
  User,
  Database,
  LogOut,
} from 'lucide-react';

interface LeftCurvedNavbarProps {
  onOpenDemo: () => void;
  onOpenAuth: () => void;
  user: any;
  onLogout?: () => void;
}

export default function LeftCurvedNavbar({
  onOpenDemo,
  onOpenAuth,
  user,
  onLogout,
}: LeftCurvedNavbarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '#hero', icon: Compass },
    { label: 'Safety Map', href: '#map', icon: MapPin },
    { label: 'Threat Response', href: '#threat-tiers', icon: ShieldAlert },
    { label: 'Safe Havens', href: '#safe-havens', icon: Shield },
    { label: 'Comparison', href: '#comparison', icon: Layers },
    { label: 'Architecture', href: '#architecture', icon: Database },
    { label: 'Download APK', href: '#download', icon: Download },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-6 left-6 z-50 md:hidden bg-rose-600 text-white w-12 h-12 rounded-full border border-rose-400 shadow-md flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Toggle Navigation"
      >
        {isMobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Desktop Left Curved Sidebar with Auto-Expand on Hover */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-40 transition-[width] duration-200 ease-out hidden md:block ${
          isHovered ? 'w-64' : 'w-18'
        }`}
        aria-label="Primary Navigation"
      >
        <div
          className={`h-auto max-h-[90vh] py-5 px-3 bg-white/95 backdrop-blur-md border-y border-r border-rose-200/70 shadow-[0_4px_20px_rgba(28,25,23,0.06)] rounded-r-3xl transition-all duration-200 flex flex-col justify-between`}
        >
          {/* Brand & Logo */}
          <div className="flex items-center gap-3 px-1.5 pb-4 border-b border-rose-100">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-rose-50 border border-rose-200 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Safie Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            {isHovered && (
              <div className="overflow-hidden whitespace-nowrap">
                <span className="font-semibold text-stone-900 text-sm tracking-tight block">safie</span>
                <span className="text-[11px] text-stone-500 block font-normal">
                  Delhi NCR Safety
                </span>
              </div>
            )}
          </div>

          {/* Top Demo Trigger Button */}
          <div className="py-3">
            <button
              onClick={onOpenDemo}
              className={`w-full h-9 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-2.5 transition-colors group cursor-pointer ${
                !isHovered ? 'justify-center' : ''
              }`}
              title="Launch Interactive Phone Demo"
            >
              <Smartphone className="w-4 h-4 flex-shrink-0 text-white" />
              {isHovered && (
                <span className="truncate flex-1 text-left flex items-center justify-between">
                  <span>Phone Demo</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-700/60 text-white">
                    LIVE
                  </span>
                </span>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 py-2 flex-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  className={`h-9 px-2.5 rounded-lg flex items-center gap-2.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-rose-50/80 transition-colors ${
                    !isHovered ? 'justify-center' : ''
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 text-stone-500" />
                  {isHovered && (
                    <span className="truncate whitespace-nowrap text-stone-700">
                      {item.label}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Citizen Account Trigger / Session Info */}
          <div className="pt-3 border-t border-rose-100">
            {user ? (
              <div className="space-y-1">
                <div
                  className={`h-9 px-2.5 rounded-lg flex items-center gap-2.5 text-xs text-stone-700 ${
                    !isHovered ? 'justify-center' : ''
                  }`}
                  title={`${user.name} (${user.phone})`}
                >
                  <User className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  {isHovered && (
                    <div className="truncate text-left flex-1">
                      <div className="font-medium text-stone-900 truncate">{user.name}</div>
                      <div className="text-[10px] font-mono text-stone-500 truncate">{user.phone}</div>
                    </div>
                  )}
                </div>
                {isHovered && onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full h-8 px-2.5 rounded-lg flex items-center gap-2 text-xs text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className={`w-full h-9 px-2.5 rounded-lg flex items-center gap-2.5 text-xs text-stone-700 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer ${
                  !isHovered ? 'justify-center' : ''
                }`}
                title="Citizen Sign In"
              >
                <User className="w-4 h-4 flex-shrink-0 text-stone-500" />
                {isHovered && (
                  <span className="truncate whitespace-nowrap font-medium">
                    Citizen Sign In
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl p-4 border border-rose-200 shadow-xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Logo */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-rose-50 border border-rose-200 flex items-center justify-center">
                  <Image src="/logo.png" alt="Safie" width={24} height={24} />
                </div>
                <div>
                  <span className="font-semibold text-stone-900 text-sm block">safie</span>
                  <span className="text-[10px] text-stone-500 block">Delhi NCR Edition</span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Demo Trigger */}
            <button
              onClick={() => {
                setIsMobileOpen(false);
                onOpenDemo();
              }}
              className="w-full h-10 px-3 rounded-lg bg-rose-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Launch Live Phone Demo</span>
            </button>

            {/* Mobile Nav Links */}
            <div className="grid grid-cols-2 gap-1.5 py-1">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="h-9 px-2.5 rounded-lg flex items-center gap-2 text-xs text-stone-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-stone-400" />
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Mobile Auth Button */}
            <div className="pt-2 border-t border-rose-100">
              {user ? (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="font-medium text-stone-900">{user.name}</div>
                      <div className="text-[10px] font-mono text-stone-500">{user.phone}</div>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileOpen(false);
                      }}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full h-9 rounded-lg border border-rose-200 text-xs text-stone-800 font-medium hover:bg-rose-50 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-stone-500" />
                  <span>Citizen Sign In / Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
