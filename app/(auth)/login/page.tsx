'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { login, getUserRole } from '@/lib/auth/mockAuth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const role = await getUserRole(email, password);
      
      if (!role) {
        setError('Invalid credentials or unauthorized email address.');
        setLoading(false);
        return;
      }

      const user = await login(email, password);
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/portal');
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: 'admin' | 'client') => {
    if (role === 'admin') {
      setEmail('admin@coiplatform.com');
      setPassword('password123');
    } else {
      setEmail('jordan@riverside.com');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 leading-tight">Welcome back</h2>
        <p className="text-xs text-slate-500 mt-1">Sign in to access your certificate portal.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47] transition-all"
            />
          </div>
        </div>

        {/* Password Field with Show/Hide Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#0e2a47] focus:ring-[#0e2a47]"
            />
            <span>Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-teal-600 font-semibold hover:text-teal-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            className="bg-[#0e2a47] hover:bg-[#0a1e33] py-3 text-sm font-semibold rounded-lg shadow-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>

      {/* Demo Account Fill Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center uppercase tracking-wider">
          Test Accounts (Frontend Demo)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('admin')}
            className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Admin Portal</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('client')}
            className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Client Portal</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </div>
    </>
  );
}
