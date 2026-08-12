'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/mockAuth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (user?.role === 'admin') {
      router.replace('/admin/dashboard');
    } else if (user?.role === 'client') {
      router.replace('/portal');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-[#0e2a47] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
