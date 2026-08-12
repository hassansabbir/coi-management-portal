import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'login' | 'admin' | 'client';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'login', className = '' }) => {
  if (variant === 'admin') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1 shadow-sm shrink-0 overflow-hidden">
          <Image
            src="/assets/auth/ewingAgencyLogo.png"
            alt="The Ewing Agency Logo"
            width={36}
            height={36}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight tracking-tight">COI Manager</h1>
          <p className="text-slate-400 text-xs font-normal">Admin Portal</p>
        </div>
      </div>
    );
  }

  if (variant === 'client') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="h-10 w-auto flex items-center justify-center shrink-0">
          <Image
            src="/assets/auth/ewingAgencyLogo.png"
            alt="The Ewing Agency"
            width={120}
            height={40}
            className="h-9 w-auto object-contain"
          />
        </div>
        <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />
        <span className="text-slate-700 text-sm font-semibold hidden sm:inline-block">Portal</span>
      </div>
    );
  }

  // Default Login variant (Matches Image 3 exact logo display)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Real Agency Logo Image from Assets */}
      <div className="relative mb-3 w-44 h-16 flex items-center justify-center">
        <Image
          src="/assets/auth/ewingAgencyLogo.png"
          alt="The Ewing Agency Inc."
          width={220}
          height={80}
          priority
          className="w-full h-full object-contain drop-shadow-xs"
        />
      </div>
      <h1 className="text-[#0e2a47] text-2xl font-bold tracking-tight">The Ewing Agency Inc.</h1>
      <p className="text-slate-500 text-sm font-normal mt-0.5">Certificate of Insurance Management</p>
    </div>
  );
};
