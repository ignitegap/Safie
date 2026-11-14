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

        localStorage.setItem('safie_token', data.token);
        localStorage.setItem('safie_user', JSON.stringify(data.user));
        setSuccess('Authentication confirmed.');
        setTimeout(() => {
          onSuccess(data.user);
          onClose();
        }, 600);
      } else {
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
        setSuccess('Profile registered on Neon PostgreSQL.');
        setTimeout(() => {
          onSuccess(data.user);
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="relative max-w-md w-full rounded-2xl bg-white border border-rose-200/80 p-6 sm:p-7 shadow-xl text-left space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safie Identity</span>
          </div>
          <h3 className="text-xl font-semibold text-stone-900 tracking-tight">
            {mode === 'login' ? 'Citizen Sign In' : 'Create Safie Account'}
          </h3>
          <p className="text-xs text-stone-500">
            {mode === 'login'
              ? 'Enter your registered mobile number and password.'
              : 'Register your mobile identity and emergency contacts on Neon PostgreSQL.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-rose-50/60 border border-rose-100 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
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
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
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
            className="w-full py-2 px-3 rounded-lg bg-rose-50/50 hover:bg-rose-50 border border-rose-100 text-xs text-stone-700 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="text-stone-600">Fill test citizen credentials</span>
            <span className="font-mono text-[10px] text-rose-700 font-medium px-2 py-0.5 rounded bg-white border border-rose-200">
              Demo Fill
            </span>
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          {mode === 'register' && (
            <div>
              <label className="block text-stone-700 font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-medium mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                type="tel"
                required
                placeholder="+919810012345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="pt-2 border-t border-rose-100 space-y-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Emergency Contact</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Guardian Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                  />
                  <input
                    type="tel"
                    placeholder="+919811001122"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 focus:outline-none focus:border-rose-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Secret Duress PIN (Covert Cancel)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={duressPin}
                  onChange={(e) => setDuressPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-rose-50/20 border border-stone-200 text-stone-900 font-mono tracking-widest text-center focus:outline-none focus:border-rose-600 text-sm"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Entering this PIN visually confirms "Cancelled" while dispatching Tier 3 SOS.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Safie' : 'Create Citizen Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
