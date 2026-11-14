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
  User,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  PhoneCall,
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
    { label: 'Delhi/GGM Map', href: '#map', icon: MapPin },
    {
      label: 'Live Phone Demo',
      action: onOpenDemo,
      icon: Smartphone,
      highlight: true,
      badge: 'LIVE',
    },
    { label: 'Safe Havens', href: '#safe-havens', icon: ShieldAlert },
    { label: '4-Tier SOS', href: '#threat-tiers', icon: PhoneCall },
    { label: 'Architecture', href: '#architecture', icon: Layers },
    { label: 'Download APK', href: '#download', icon: Download },
  ];

  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-6 left-6 z-50 md:hidden bg-safie-charcoal text-white p-3.5 rounded-full shadow-2xl border border-white/20 flex items-center justify-center"
        aria-label="Toggle Navigation"
      >
        {isMobileOpen ? <X className="w-6 h-6 text-safie-crimson" /> : <Menu className="w-6 h-6" />}
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
          className={`h-auto max-h-[85vh] py-6 px-3 bg-safie-charcoal/95 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] rounded-r-[32px] transition-all duration-300 flex flex-col justify-between ${
            isHovered ? 'shadow-[0_20px_60px_rgba(229,57,53,0.18)]' : ''
          }`}
        >
          {/* Header Brand */}
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-safie-crimson/10 border border-safie-crimson/30 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Safie Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            {isHovered && (
              <div className="overflow-hidden whitespace-nowrap transition-opacity duration-200">
                <span className="font-extrabold text-white text-lg tracking-wider block">SAFIE</span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest block font-medium">
                  Safety OS
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
                      ? 'bg-gradient-to-r from-safie-crimson/20 to-safie-crimson/5 border border-safie-crimson/40 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      item.highlight ? 'text-safie-crimson' : 'text-white/70 group-hover:text-white'
                    }`}
                  />
                  {isHovered && (
                    <span className="whitespace-nowrap text-sm font-medium flex items-center justify-between flex-1">
                      {item.label}
                      {item.badge && (
                        <span className="bg-safie-crimson text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  )}
                  {!isHovered && item.highlight && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-safie-crimson rounded-full animate-ping" />
                  )}
                </button>
              ) : (
                <a
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-all text-white/70 hover:text-white hover:bg-white/10 group"
                >
                  <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 text-white/70 group-hover:text-white" />
                  {isHovered && (
                    <span className="whitespace-nowrap text-sm font-medium">{item.label}</span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* User Account / Profile Footer */}
          <div className="pt-4 border-t border-white/10 mt-4">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-3.5 px-2 py-2 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 transition-all w-full text-left"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                <User className="w-4 h-4 text-white" />
              </div>
              {isHovered && (
                <div className="overflow-hidden whitespace-nowrap">
                  <span className="text-xs font-semibold block text-white">
                    {user ? user.name : 'Sign In / Register'}
                  </span>
                  <span className="text-[10px] text-white/50 block">
                    {user ? user.phone : 'Neon DB Sync'}
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Collapsed Pill Indicator on right edge */}
          {!isHovered && (
            <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-10 bg-safie-crimson/80 rounded-r-md flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white -ml-0.5" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="w-72 h-full bg-safie-charcoal p-6 flex flex-col justify-between border-r border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Image src="/images/logo.png" alt="Logo" width={36} height={36} />
                <div>
                  <span className="font-extrabold text-white text-xl block">SAFIE</span>
                  <span className="text-xs text-white/50 uppercase tracking-widest block">
                    Delhi NCR Urban Safety
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return item.action ? (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action?.();
                        setIsMobileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-safie-crimson text-white font-medium text-sm"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-white text-safie-crimson text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ) : (
                    <a
                      key={idx}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 font-medium text-sm"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white font-medium text-sm border border-white/20"
              >
                <User className="w-4 h-4" />
                <span>{user ? user.name : 'Sign In / Register'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

