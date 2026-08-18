'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    
    setLoading(false);
    
    if (resetError) {
      setError(resetError.message);
      return;
    }

    // Navigate to OTP verification page
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 leading-tight">Reset your password</h2>
        <p className="text-xs text-slate-500 mt-1">Enter your email and we&apos;ll send you a code.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e2a47] transition-all"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            className="bg-[#0e2a47] hover:bg-[#0a1e33] py-3 text-sm font-semibold rounded-lg shadow-sm"
          >
            {loading ? 'Sending Code...' : 'Send Code'}
          </Button>
        </div>
      </form>

      {/* Footer Link matching design screenshot */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>&larr;</span>
          <span>Back to Sign In</span>
        </Link>
      </div>
    </>
  );
}
