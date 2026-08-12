'use client';

import React from 'react';
import Link from 'next/link';

export default function PasswordChangedPage() {
  return (
    <div className="flex flex-col items-center text-center py-2">
      {/* Celebration Checkmark Circle with Confetti Graphic matching Image 4 */}
      <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
        {/* SVG Confetti Particles */}
        <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full">
          {/* Confetti rectangles and diamonds */}
          <rect x="25" y="40" width="8" height="5" rx="1" fill="#3b82f6" transform="rotate(15 25 40)" />
          <rect x="125" y="30" width="9" height="5" rx="1" fill="#f97316" transform="rotate(-25 125 30)" />
          <rect x="40" y="115" width="8" height="5" rx="1" fill="#10b981" transform="rotate(-40 40 115)" />
          <rect x="115" y="115" width="8" height="5" rx="1" fill="#3b82f6" transform="rotate(30 115 115)" />
          
          <polygon points="68,22 74,22 71,28" fill="#3b82f6" />
          <polygon points="92,30 98,30 95,36" fill="#f59e0b" />
          <polygon points="20,80 25,75 25,85" fill="#f59e0b" />
          <polygon points="135,78 142,75 140,84" fill="#3b82f6" />

          <circle cx="65" cy="130" r="3" fill="#10b981" />
          <circle cx="95" cy="125" r="3" fill="#f59e0b" />
          <circle cx="35" cy="98" r="3.5" fill="#06b6d4" />
          <circle cx="128" cy="95" r="3" fill="#06b6d4" />

          <path d="M 45 42 Q 52 30 50 20" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 110 25 Q 118 35 122 45" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 125 125 Q 132 135 128 142" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 38 128 Q 30 138 35 145" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>

        {/* Center Blue Circle with White Checkmark */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">
        Password changed!
      </h2>
      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
        Your password has been updated successfully. You can now sign in securely
      </p>

      {/* Footer Link */}
      <div className="w-full pt-4 border-t border-slate-100">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>&larr;</span>
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
