'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 text-sm text-red-600 hover:text-red-700 ${className}`}
    >
      Keluar
    </button>
  );
}
