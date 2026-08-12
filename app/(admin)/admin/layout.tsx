import React from 'react';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-[#f4f6f9] flex flex-col lg:flex-row font-sans">
        {/* Dark Navy Admin Sidebar Shell */}
        <Sidebar />
        
        {/* Admin Main Content Container */}
        <div className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
