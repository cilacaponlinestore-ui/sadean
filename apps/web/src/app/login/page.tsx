'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submit = async (event: React.FormEvent) => { event.preventDefault(); clearError(); try { await login(form.email, form.password); toast.success('Selamat datang kembali'); router.push('/dashboard'); } catch {} };
  const google = async () => {
    setGoogleLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
    if (oauthError) { toast.error('Google login belum tersedia'); setGoogleLoading(false); }
  };

  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-primary-500/25 blur-3xl" /><div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-clay-500/20 blur-3xl" />
        <Link href="/" className="relative flex items-center gap-3 font-black"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500">S</span><span>SADEAN</span></Link>
        <div className="relative max-w-xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Dodolane Wong Cilacap</p><h1 className="mt-5 text-5xl font-black leading-tight tracking-[-.04em]">Satu akun untuk belanja dan bertumbuh bersama Cilacap.</h1><p className="mt-6 text-lg leading-8 text-white/65">Temukan produk khas, dukung tetangga, dan kelola usaha lokal dari satu tempat.</p></div>
        <p className="relative text-sm text-white/45">Marketplace digital UMKM Cilacap</p>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-700">← Kembali ke marketplace</Link>
          <p className="eyebrow">Selamat datang</p><h2 className="mt-3 text-3xl font-black tracking-tight text-ink">Masuk ke SADEAN</h2><p className="mt-2 text-gray-500">Lanjutkan belanja atau kelola tokomu.</p>
          <button onClick={google} disabled={googleLoading} className="focus-ring mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3.5 font-bold shadow-sm hover:bg-gray-50 disabled:opacity-60"><svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 01-2 3.02v2.55h3.24c1.9-1.75 2.98-4.33 2.98-7.42z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.55c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.63A10 10 0 0012 22z"/><path fill="#FBBC05" d="M6.39 13.85A6.02 6.02 0 016.08 12c0-.64.11-1.27.31-1.85V7.52H3.04A10 10 0 002 12c0 1.61.38 3.14 1.04 4.48l3.35-2.63z"/><path fill="#EA4335" d="M12 6.02c1.47 0 2.78.5 3.82 1.49l2.86-2.87A9.6 9.6 0 0012 2a10 10 0 00-8.96 5.52l3.35 2.63C7.18 7.78 9.39 6.02 12 6.02z"/></svg>{googleLoading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}</button>
          <div className="my-7 flex items-center gap-4"><span className="h-px flex-1 bg-black/10"/><span className="text-xs font-bold uppercase tracking-widest text-gray-400">atau email</span><span className="h-px flex-1 bg-black/10"/></div>
          <form onSubmit={submit} className="space-y-5">
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
            <div><label htmlFor="email" className="text-sm font-bold text-gray-700">Email</label><input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@email.com" className="focus-ring mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none" /></div>
            <div><label htmlFor="password" className="text-sm font-bold text-gray-700">Password</label><div className="relative mt-2"><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Masukkan password" className="focus-ring h-12 w-full rounded-xl border border-black/10 bg-white px-4 pr-16 outline-none"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-700">{showPassword ? 'Tutup' : 'Lihat'}</button></div></div>
            <button disabled={isLoading} className="focus-ring h-12 w-full rounded-xl bg-primary-700 font-bold text-white hover:bg-primary-800 disabled:opacity-50">{isLoading ? 'Memproses...' : 'Masuk'}</button>
          </form>
          <p className="mt-7 text-center text-sm text-gray-500">Belum punya akun? <Link href="/register" className="font-bold text-primary-700 hover:underline">Daftar sekarang</Link></p>
        </div>
      </section>
    </main>
  );
}
