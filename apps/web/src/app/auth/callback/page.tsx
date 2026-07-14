'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const completeGoogleLogin = useAuthStore((state) => state.completeGoogleLogin);

  useEffect(() => {
    let active = true;
    const complete = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) throw error || new Error('Sesi Google tidak ditemukan');
        await completeGoogleLogin(data.session.access_token);
        await supabase.auth.signOut();
        if (active) { toast.success('Selamat datang di SADEAN'); const role = useAuthStore.getState().user?.role; router.replace(role === 'buyer' || !role ? '/' : '/dashboard'); }
      } catch {
        await supabase.auth.signOut();
        if (active) { toast.error('Login Google gagal'); router.replace('/login'); }
      }
    };
    complete();
    return () => { active = false; };
  }, [completeGoogleLogin, router]);

  return <main className="flex min-h-screen items-center justify-center bg-canvas"><div role="status" className="surface px-8 py-7 text-center"><div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /><p className="font-bold">Menyiapkan akun Google...</p></div></main>;
}
