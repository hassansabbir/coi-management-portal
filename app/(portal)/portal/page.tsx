'use client';

import React from 'react';
import { CertificateSummaryCard } from '@/components/portal/CertificateSummaryCard';
import { InfoBanner } from '@/components/portal/InfoBanner';
import { Illustration } from '@/components/shared/Illustration';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';
import { getCurrentUser } from '@/lib/auth/mockAuth';

export default function ClientPortalHomePage() {
  const [clientName, setClientName] = React.useState('Jordan');
  const [businessName, setBusinessName] = React.useState('Riverside Contractors Inc.');

  React.useEffect(() => {
    const user = getCurrentUser();
    if (user?.name) setClientName(user.name);
    if (user?.businessName) setBusinessName(user.businessName);
  }, []);

  // Client's certificate (COI-2025-00847 matching Image 1)
  const certificate = INITIAL_CERTIFICATES[0];

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header matching Image 1 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {clientName}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {businessName} · Certificate portal
        </p>
      </div>

      {/* Main Grid Layout matching Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary Card + Info Banner (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CertificateSummaryCard certificate={certificate} />
          <InfoBanner />
        </div>

        {/* Right Column: Decorative Vector Laptop Graphic matching Image 1 (5 cols) */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center p-2 pt-6">
          <Illustration size="lg" />
        </div>
      </div>
    </main>
  );
}
