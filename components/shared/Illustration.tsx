import React from 'react';
import Image from 'next/image';

interface IllustrationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Illustration: React.FC<IllustrationProps> = ({ className = '', size = 'md' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Real High-Res Asset Image from assets/auth/authIllustration.png */}
      <div className="relative z-10 w-full max-w-120 aspect-4/3 flex items-center justify-center transition-transform duration-500 hover:scale-[1.02]">
        <Image
          src="/assets/auth/authIllustration.png"
          alt="Certificate of Insurance Portal Illustration"
          width={520}
          height={400}
          priority
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
};
