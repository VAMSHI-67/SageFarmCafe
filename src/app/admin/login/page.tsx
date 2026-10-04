'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if session is already valid on load
  useEffect(() => {
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.replace('/admin');
        } else {
          setCheckingSession(false);
        }
      })
      .catch(() => setCheckingSession(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator passcode');
      }

      router.replace('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error occurred');
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#163126] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C96A49]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#272820] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7A8D70]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C96A49]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Icon Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-[#163126] text-[#FFFDF8] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck className="w-8 h-8 text-[#C96A49]" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#C96A49] uppercase">
            Sage Farm Cafe
          </span>
          <h2 className="mt-1 text-3xl font-serif font-bold text-[#163126]">
            Staff Portal Access
          </h2>
          <p className="mt-2 text-xs text-[#6E6A61] max-w-xs mx-auto">
            Authorized cafe management and kitchen operations only.
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-[#FFFDF8] py-8 px-6 sm:px-10 shadow-lg rounded-3xl border border-[#DED8CB]">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#6E6A61] uppercase tracking-wider mb-2">
                Administrator Keycode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-[#7A8D70]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  className="block w-full pl-10 pr-10 py-3 bg-[#F7F4EC] border border-[#DED8CB] rounded-xl text-sm text-[#272820] placeholder-[#6E6A61]/60 focus:outline-none focus:border-[#7A8D70] focus:ring-2 focus:ring-[#7A8D70]/20 min-h-[48px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6E6A61] hover:text-[#272820]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#163126] hover:bg-[#163126]/90 text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 min-h-[48px]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Enter Admin Portal</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#DED8CB]/60 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#6E6A61] hover:text-[#163126] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
