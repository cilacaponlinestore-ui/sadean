'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export function useAuthGuard(requireRole?: 'admin' | 'seller') {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isLoading && isAuthenticated && requireRole && user?.role !== requireRole) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, requireRole, router]);

  return { user, isLoading, isAuthenticated };
}
