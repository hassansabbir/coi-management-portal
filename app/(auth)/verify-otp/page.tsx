'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { createClient } from '@/lib/supabase/client';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // 6 digits for Supabase
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length !== 6 || !email) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    // Navigate to set new password page
    router.push('/reset-password');
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 leading-tight">Verify reset password</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter the 6-digit code sent to {email || 'your email'} to reset your password
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 6-Digit OTP Code Inputs */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 py-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e2a47] shadow-xs transition-all"
            />
          ))}
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            className="bg-[#0e2a47] hover:bg-[#0a1e33] py-3 text-sm font-semibold rounded-lg shadow-sm"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
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
