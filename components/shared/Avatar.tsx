import React from 'react';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs font-bold',
    lg: 'w-12 h-12 text-sm font-bold',
  };

  return (
    <div
      className={`rounded-full bg-[#0e2a47] text-white flex items-center justify-center font-semibold shrink-0 shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
};
