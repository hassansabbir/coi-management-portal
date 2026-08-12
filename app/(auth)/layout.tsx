import React from 'react';
import { Logo } from '@/components/shared/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col justify-between overflow-x-hidden relative font-sans">
      {/* Background Decorative Concentric Colored Circles matching Design Specs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Top-Left Concentric Circle Bands */}
        <div className="absolute -top-85 -left-85 w-212.5 h-212.5 rounded-full bg-[#e2e7ed]/60 flex items-center justify-center">
          <div className="w-165 h-165 rounded-full bg-[#eaf0f5]/80 flex items-center justify-center">
            <div className="w-117.5 h-117.5 rounded-full bg-[#f3f6f9]/90 flex items-center justify-center">
              <div className="w-70 h-70 rounded-full bg-white/95" />
            </div>
          </div>
        </div>

        {/* Bottom-Right Concentric Circle Bands */}
        <div className="absolute -bottom-95 -right-80 w-237.5 h-237.5 rounded-full bg-[#e2e7ed]/60 flex items-center justify-center">
          <div className="w-180 h-180 rounded-full bg-[#eaf0f5]/80 flex items-center justify-center">
            <div className="w-125 h-125 rounded-full bg-[#f3f6f9]/90 flex items-center justify-center">
              <div className="w-75 h-75 rounded-full bg-[#f8fafc]/95" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Centered Content Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="w-full max-w-md flex flex-col items-center justify-center mx-auto">
          {/* Shared Agency Logo Header */}
          <div className="mb-6">
            <Logo variant="login" />
          </div>

          {/* Page Card Content Wrapper */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 transition-all">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
