'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Menu, X, HelpCircle, User as UserIcon, LogOut, FileText } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { logout } from '@/lib/auth/mockAuth';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const isCertificateActive =
    pathname === '/portal' || pathname.startsWith('/portal/certificate');
  const isHelpActive = pathname === '/portal/help';
  const isAccountActive = pathname === '/portal/account';

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="w-full px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Ewing Logo */}
        <Link href="/portal" className="flex items-center gap-2">
          <Logo variant="client" />
        </Link>

        {/* Desktop Navigation Actions matching Screenshots 1 & 2 */}
        <div className="hidden md:flex items-center gap-5">
          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Certificate Link */}
          <Link
            href="/portal"
            className={`text-sm font-semibold transition-all px-3 py-1.5 rounded-lg ${
              isCertificateActive
                ? 'bg-[#0e2a47] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Certificate
          </Link>

          {/* Help Link */}
          <Link
            href="/portal/help"
            className={`text-sm font-semibold transition-all px-3 py-1.5 rounded-lg ${
              isHelpActive
                ? 'bg-[#0e2a47] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Help
          </Link>

          {/* Account Link */}
          <Link
            href="/portal/account"
            className={`text-sm font-semibold transition-all px-3 py-1.5 rounded-lg ${
              isAccountActive
                ? 'bg-[#0e2a47] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Account
          </Link>

          {/* Sign Out Button (Red text matching Screenshots 1 & 2) */}
          <button
            onClick={handleSignOut}
            className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer ml-1"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label="Notifications"
            className="relative p-2 text-slate-500 hover:text-slate-700 rounded-full"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-4 space-y-2 shadow-lg">
          <Link
            href="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
              isCertificateActive ? 'bg-[#0e2a47] text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Certificate
          </Link>
          <Link
            href="/portal/help"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
              isHelpActive ? 'bg-[#0e2a47] text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </Link>
          <Link
            href="/portal/account"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
              isAccountActive ? 'bg-[#0e2a47] text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Account
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleSignOut();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 text-left"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};
