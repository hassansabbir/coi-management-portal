'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { getCurrentUser, logout } from '@/lib/auth/mockAuth';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin User',
    email: 'admin@coiplatform.com',
    avatarInitials: 'AU',
  });

  React.useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser({
        name: user.name,
        email: user.email,
        avatarInitials: user.avatarInitials || 'AU',
      });
    }
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Clients', href: '/admin/clients', icon: Users },
    { label: 'Certificates', href: '/admin/certificates', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full justify-between bg-[#0e2a47] text-white p-5 w-64 select-none">
      <div>
        {/* Logo Section */}
        <div className="pb-6 border-b border-white/10">
          <Logo variant="admin" />
        </div>

        {/* Navigation Heading */}
        <div className="mt-6 mb-3">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Navigation
          </span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1b3f66] text-white shadow-inner font-semibold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {/* Image 2 style white pill/dot on active item */}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-white shadow-sm shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-white/20 shrink-0">
            {currentUser.avatarInitials || 'AU'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-xs font-semibold px-1 py-1.5 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex shrink-0 h-screen sticky top-0">
        {SidebarContent}
      </aside>

      {/* Mobile Bar & Overlay Drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0e2a47] text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
        <Logo variant="admin" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-white/10 text-slate-200"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full w-64 shadow-2xl">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
