'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/mockAuth';
import { UserRole } from '@/types';

interface AuthGuardProps {
  requiredRole?: UserRole;
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ requiredRole, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (user.role === 'client') {
        router.replace('/portal');
      } else {
        router.replace('/login');
      }
      return;
    }

    setIsAuthorized(true);
  }, [pathname, requiredRole, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#0e2a47] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
