import React from 'react';

interface BadgeProps {
  variant?: 'active' | 'inactive' | 'acord' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'active', children, className = '' }) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'active') {
    styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  } else if (variant === 'inactive') {
    styleClasses = 'bg-amber-50 text-amber-700 border-amber-200/80';
  } else if (variant === 'acord') {
    styleClasses = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClasses} ${className}`}
    >
      {variant === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
      {variant === 'inactive' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
      {children}
    </span>
  );
};
