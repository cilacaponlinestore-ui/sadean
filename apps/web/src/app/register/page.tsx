'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const input = 'focus-ring mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none';

export default function RegisterPage() {
  const router = useRouter();
  const { register, completeGoogleLogin, error, clearError } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'buyer' });
  const mismatch = Boolean(form.confirmPassword && form.password !== form.confirmPassword);

  const submit = async (event: React.FormEvent) => { event.preventDefault(); clearError(); if (mismatch) return; if (form.password.length < 8) { toast.error('Password minimal 8 karakter'); return; } setLoading(true); try { await register({ name: form.name, email: form.email, phone: form.phone || undefined, password: form.password, role: form.role }); toast.success('Akun berhasil dibuat'); if (form.role === 'buyer') router.push('/'); else router.push('/dashboard'); } catch {} finally { setLoading(false); } };

  const handleGoogle = async () => { setGoogleLoading(true); try { const { data, error: supabaseError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } }); if (supabaseError) throw supabaseError; } catch (err: any) { toast.error(err.message || 'Gagal login Google'); } finally { setGoogleLoading(false); } };

  return <main className="min-h-screen overflow-hidden bg-canvas px-4 py-10 sm:py-14">
    <div className="pointer-events-none fixed -right-24 top-0 h-80 w-80 rounded-full bg-primary-200/50 blur-3xl"/><div className="pointer-events-none fixed -bottom-24 -left-24 h-80 w-80 rounded-full bg-clay-100 blur-3xl"/>
    <div className="relative mx-auto w-full max-w-2xl"><Link href="/" className="focus-ring mb-8 inline-flex items-center gap-3 rounded-xl"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-lg font-black text-white">S</span><span className="font-black text-ink">SADEAN</span></Link>

      <div className="surface p-5 sm:p-8"><p className="eyebrow">Mulai dari sini</p><h1 className="mt-3 text-3xl font-black tracking-tight text-ink">Buat akun SADEAN</h1><p className="mt-2 text-gray-500">Belanja lokal atau bawa usahamu ditemukan lebih banyak orang.</p>

        {/* Google Button */}
        <button onClick={handleGoogle} disabled={googleLoading} className="focus-ring mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3.5 font-bold shadow-sm hover:bg-gray-50 disabled:opacity-60">
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 01-2 3.02v2.55h3.24c1.9-1.75 2.98-4.33 2.98-7.42z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.55c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.63A10 10 0 0012 22z"/><path fill="#FBBC05" d="M6.39 13.85A6.02 6.02 0 016.08 12c0-.64.11-1.27.31-1.85V7.52H3.04A10 10 0 002 12c0 1.61.38 3.14 1.04 4.48l3.35-2.63z"/><path fill="#EA4335" d="M12 6.02c1.47 0 2.78.5 3.82 1.49l2.86-2.87A9.6 9.6 0 0012 2a10 10 0 00-8.96 5.52l3.35 2.63C7.18 7.78 9.39 6.02 12 6.02z"/></svg>
          {googleLoading ? 'Menghubungkan...' : 'Daftar dengan Google'}
        </button>

        <div className="my-7 flex items-center gap-4"><span className="h-px flex-1 bg-black/10"/><span className="text-xs font-bold uppercase tracking-widest text-gray-400">atau email</span><span className="h-px flex-1 bg-black/10"/></div>

        <form onSubmit={submit} className="space-y-6">{error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
          <fieldset><legend className="text-sm font-bold text-gray-700">Saya ingin bergabung sebagai</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{[{ value: 'buyer', title: 'Pembeli', text: 'Temukan dan pesan produk lokal.' }, { value: 'seller', title: 'Pelaku UMKM', text: 'Buka toko setelah akun dibuat.' }].map((role) => <label key={role.value} className={`cursor-pointer rounded-2xl border p-4 transition ${form.role === role.value ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-black/10 bg-white hover:border-primary-300'}`}><input type="radio" name="role" value={role.value} checked={form.role === role.value} onChange={(e) => setForm({ ...form, role: e.target.value })} className="sr-only"/><span className="block font-black text-ink">{role.title}</span><span className="mt-1 block text-sm text-gray-500">{role.text}</span></label>)}</div></fieldset>
          <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="name" className="text-sm font-bold text-gray-700">Nama lengkap</label><input id="name" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="Nama Anda"/></div><div><label htmlFor="phone" className="text-sm font-bold text-gray-700">Nomor HP <span className="font-normal text-gray-400">(opsional)</span></label><input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} placeholder="0812..."/></div></div>
          <div><label htmlFor="email" className="text-sm font-bold text-gray-700">Email</label><input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} placeholder="nama@email.com"/></div>
          <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="password" className="text-sm font-bold text-gray-700">Password</label><div className="relative"><input id="password" type={show ? 'text' : 'password'} autoComplete="new-password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`${input} pr-16`} placeholder="Minimal 8 karakter"/><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-xs font-bold text-primary-700">{show ? 'Tutup' : 'Lihat'}</button></div></div><div><label htmlFor="confirm" className="text-sm font-bold text-gray-700">Ulangi password</label><input id="confirm" type={show ? 'text' : 'password'} autoComplete="new-password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className={`${input} ${mismatch ? 'border-red-400' : ''}`} placeholder="Password yang sama"/>{mismatch && <p className="mt-2 text-xs font-semibold text-red-600">Password belum sama.</p>}</div></div>
          {form.role === 'seller' && <div className="rounded-2xl bg-clay-50 p-4 text-sm leading-6 text-clay-600"><strong>Langkah berikutnya:</strong> setelah akun dibuat, lengkapi nama toko, alamat, dan kontak untuk proses verifikasi UMKM.</div>}
          <button disabled={loading || mismatch} className="focus-ring h-12 w-full rounded-xl bg-primary-700 font-bold text-white hover:bg-primary-800 disabled:opacity-50">{loading ? 'Membuat akun...' : 'Buat akun'}</button>
        </form><p className="mt-7 text-center text-sm text-gray-500">Sudah punya akun? <Link href="/login" className="font-bold text-primary-700 hover:underline">Masuk</Link></p>
      </div>
    </div>
  </main>;
}
