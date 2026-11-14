'use client';

import React, { useState } from 'react';
import {
  X,
  Phone,
  Lock,
  User,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('Mom / Family Guardian');
  const [contactPhone, setContactPhone] = useState('+91-9811001122');
  const [duressPin, setDuressPin] = useState('9876');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  // Auto-fill demo credentials
  const fillDemoAccount = () => {
    setPhone('+919810012345');
    setPassword('SafieDelhi2026!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to login');
        }

        // Store session
        localStorage.setItem('safie_token', data.token);
        localStorage.setItem('safie_user', JSON.stringify(data.user));
        setSuccess('Authentication successful! Welcome back.');
        setTimeout(() => {
          onSuccess(data.user);
          onClose();
        }, 800);
      } else {
        // Register
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            password,
            name,
            emergencyContacts: [
              { name: contactName, phone: contactPhone, relation: 'Emergency Contact' },
            ],
            duressPin: duressPin || '9876',
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to register');
        }

        localStorage.setItem('safie_token', data.token);
        localStorage.setItem('safie_user', JSON.stringify(data.user));
        setSuccess('Safie profile registered successfully!');
        setTimeout(() => {
          onSuccess(data.user);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-md w-full rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 shadow-2xl text-left space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-safie-crimson/20 border border-safie-crimson/40 text-safie-crimson text-[11px] font-mono font-bold uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safie Secure Authentication</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Citizen Sign In' : 'Create Safie Account'}
          </h3>
          <p className="text-xs text-gray-400">
            {mode === 'login'
              ? 'Enter your registered phone number and password to access telemetry.'
              : 'Register your mobile identity and emergency contacts on Neon PostgreSQL.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-safie-crimson text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-safie-crimson text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Register Profile
          </button>
        </div>

        {/* Demo Fast Fill Pill */}
        {mode === 'login' && (
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-gray-300 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Use Pre-configured Demo Citizen</span>
            </div>
            <span className="font-mono text-[11px] text-amber-300 font-bold">1-Click Fill</span>
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {mode === 'register' && (
            <div>
              <label className="block text-gray-300 font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-safie-crimson"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-300 font-medium mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="tel"
                required
                placeholder="+91-9810023456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-safie-crimson"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-safie-crimson"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <span className="text-[10px] font-mono text-safie-crimson uppercase font-bold block">
                Emergency Escort Setup
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Guardian Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5">Guardian Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] text-gray-400">Duress PIN (Coerced Cancel)</label>
                  <span className="text-[10px] font-mono text-safie-crimson font-bold">Covert 9876</span>
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={duressPin}
                  onChange={(e) => setDuressPin(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-safie-crimson text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-safie-crimson" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-safie-crimson hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Authenticate Profile' : 'Register Citizen Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[10px] text-gray-500 font-mono">
          Secured with Argon2id/Bcrypt · Neon Cloud PostgreSQL · 256-bit AES
        </div>

      </div>
    </div>
  );
}
