import React from 'react';
import { Info } from 'lucide-react';

interface InfoBannerProps {
  className?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-4 flex items-start gap-3 text-emerald-950 text-xs sm:text-sm font-medium ${className}`}
    >
      <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
      <p className="leading-relaxed">
        You can update the Certificate Holder, certificate date, and Additional Insured designation. Other policy information is managed by your insurer.
      </p>
    </div>
  );
};
