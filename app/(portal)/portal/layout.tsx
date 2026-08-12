import React from 'react';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { Navbar } from '@/components/portal/Navbar';

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen bg-[#f4f6f9] flex flex-col font-sans">
        {/* Top White Navbar Shell */}
        <Navbar />

        {/* Client Portal Content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
