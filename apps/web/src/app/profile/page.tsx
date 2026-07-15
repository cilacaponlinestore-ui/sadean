'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import type { ImageItem } from '@/components/ImageUploader';
import Image from 'next/image';

const inputCls = 'focus-ring mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none';
const labelCls = 'text-sm font-bold text-gray-700';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, loadUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<ImageItem[]>([]);

  useEffect(() => { if (!isLoading && !isAuthenticated) router.push('/login'); }, [isLoading, isAuthenticated, router]);
  useEffect(() => { if (user) setForm({ name: user.name || '', phone: user.phone || '' }); }, [user]);

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { const payload: any = { ...form }; if (avatar.length > 0) payload.avatar = avatar[0].url; await usersApi.updateProfile(payload); await loadUser(); setEditing(false); setAvatar([]); toast.success('Profil diperbarui'); } catch { toast.error('Gagal memperbarui profil'); } finally { setSaving(false); } };

  if (isLoading || !user) return <div className="flex min-h-screen items-center justify-center bg-canvas"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /></div>;

  const roleLabel: Record<string, string> = { buyer: 'Pembeli', seller: 'Penjual', admin: 'Admin' };

  return <div className="min-h-screen bg-canvas">
    <header className="sticky top-0 z-40 border-b border-black/5 bg-canvas/90 backdrop-blur-xl"><div className="page-container flex h-16 items-center justify-between"><Link href={user.role === 'buyer' ? '/' : '/dashboard'} className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-700">← Kembali</Link><h1 className="text-lg font-black tracking-tight text-ink">Profil Saya</h1><div className="w-16" /></div></header>
    <main className="page-container max-w-2xl py-8 sm:py-12">
      <div className="surface p-5 sm:p-8">
        <div className="flex items-center gap-5 border-b border-black/5 pb-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-100 text-2xl font-black text-primary-800">{user.avatar ? <Image src={user.avatar} alt={user.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : user.name.charAt(0).toUpperCase()}</div>
          <div className="min-w-0"><h2 className="truncate text-xl font-extrabold text-ink">{user.name}</h2><p className="truncate text-sm text-gray-500">{user.email}</p><span className="mt-1.5 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-800">{roleLabel[user.role] || user.role}</span></div>
        </div>

        {editing ? <form onSubmit={submit} className="mt-7 space-y-6">
          <ImageUploader images={avatar} onChange={setAvatar} maxImages={1} folder="avatars" />
          <div><label className={labelCls}>Nama Lengkap</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} required /></div>
          <div><label className={labelCls}>Email</label><input value={user.email} disabled className={`${inputCls} bg-canvas text-gray-400`} /><p className="mt-1 text-xs text-gray-400">Email tidak dapat diubah</p></div>
          <div><label className={labelCls}>Nomor HP</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="0812..." /></div>
          <div className="flex gap-3"><button disabled={saving} className="focus-ring h-12 rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button><button type="button" onClick={() => { setEditing(false); setAvatar([]); setForm({ name: user.name || '', phone: user.phone || '' }); }} className="focus-ring h-12 rounded-xl border border-black/10 bg-white px-6 font-bold hover:bg-canvas">Batal</button></div>
        </form> : <div className="mt-7 space-y-5">
          {[{ label: 'Nama Lengkap', value: user.name }, { label: 'Email', value: user.email }, { label: 'Nomor HP', value: user.phone || '-' }].map((f) => <div key={f.label}><p className="text-xs font-bold uppercase tracking-wider text-gray-400">{f.label}</p><p className="mt-1 font-bold text-ink">{f.value}</p></div>)}
          <button onClick={() => { setEditing(true); if (user.avatar) setAvatar([{ url: user.avatar, isPrimary: true }]); }} className="focus-ring mt-4 h-12 rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800">Edit Profil</button>
        </div>}
      </div>
    </main>
  </div>;
}
