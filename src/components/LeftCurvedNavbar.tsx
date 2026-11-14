'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Compass,
  MapPin,
  Smartphone,
  ShieldAlert,
  Layers,
  Download,
  Menu,
  X,
  PhoneCall,
  User,
} from 'lucide-react';

interface LeftCurvedNavbarProps {
  onOpenDemo: () => void;
  onOpenAuth: () => void;
  user: any;
}

export default function LeftCurvedNavbar({ onOpenDemo, onOpenAuth, user }: LeftCurvedNavbarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '#hero', icon: Compass },
    { label: 'Safety Map', href: '#map', icon: MapPin },
    {
      label: 'Live Phone Demo',
      action: onOpenDemo,
      icon: Smartphone,
      highlight: true,
      badge: 'LIVE',
    },
    { label: 'Safe Havens', href: '#safe-havens', icon: ShieldAlert },
    { label: '4-Tier Response', href: '#threat-tiers', icon: PhoneCall },
    { label: 'Comparison', href: '#comparison', icon: Layers },
    { label: 'Download APK', href: '#download', icon: Download },
  ];

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-6 left-6 z-50 md:hidden bg-rose-600 text-white p-3.5 rounded-full shadow-2xl border border-rose-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        aria-label="Toggle Navigation"
      >
        {isMobileOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Curved Floating Sidebar with Auto-Hide */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-1/2 -translate-y-1/2 left-0 z-40 transition-all duration-300 ease-out hidden md:block ${
          isHovered ? 'w-64' : 'w-16'
        }`}
      >
        <div
          className={`h-auto max-h-[85vh] py-6 px-3 bg-white/95 backdrop-blur-xl border-y border-r border-rose-200/80 shadow-[0_12px_36px_rgba(225,29,72,0.12)] rounded-r-[32px] transition-all duration-300 flex flex-col justify-between ${
            isHovered ? 'shadow-[0_20px_50px_rgba(225,29,72,0.18)]' : ''
          }`}
        >
          {/* Header Brand */}
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-rose-100 border border-rose-300 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Safie Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            {isHovered && (
              <div className="overflow-hidden whitespace-nowrap transition-opacity duration-200">
                <span className="font-black text-stone-900 text-base tracking-tight block">safie</span>
                <span className="text-[10px] text-rose-600 uppercase tracking-wider block font-bold">
                  Safety System
                </span>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5 flex-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return item.action ? (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all text-left group relative ${
                    item.highlight
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md shadow-rose-200'
                      : 'text-stone-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${item.highlight ? 'text-white' : 'text-stone-500 group-hover:text-rose-600'}`} />
                  {isHovered && (
                    <span className="text-xs font-semibold whitespace-nowrap flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/30 text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              ) : (
                <a
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-stone-600 hover:bg-rose-50 hover:text-rose-700 transition-all group"
                  title={item.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 text-stone-500 group-hover:text-rose-600 transition-colors" />
                  {isHovered && (
                    <span className="text-xs font-semibold whitespace-nowrap text-stone-700 group-hover:text-rose-700">
                      {item.label}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Bottom Profile / Quick Action */}
          <div className="pt-4 border-t border-rose-100 mt-4 px-1">
            <button
              onClick={user ? undefined : onOpenAuth}
              className="w-full flex items-center gap-3 py-2 rounded-xl text-stone-600 hover:text-rose-700 transition-colors"
              title={user ? user.name : 'Sign In'}
            >
              <User className="w-5 h-5 flex-shrink-0 text-rose-500" />
              {isHovered && (
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-bold text-stone-800 truncate">
                    {user ? user.name : 'Citizen Sign In'}
                  </p>
                  <p className="text-[10px] text-stone-400 font-mono">
                    {user ? user.phone : 'Neon Sync'}
                  </p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-3xl p-5 border border-rose-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Safie" width={28} height={28} />
                <span className="font-black text-stone-900">safie</span>
              </div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Delhi · NCR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {navItems.map((item, idx) => (
                item.action ? (
                  <button
                    key={idx}
                    onClick={() => {
                      item.action!();
                      setIsMobileOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Phone Demo</span>
                  </button>
                ) : (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="p-3 rounded-2xl bg-rose-50/60 hover:bg-rose-100 text-stone-700 flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4 text-rose-600" />
                    <span>{item.label}</span>
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
