'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { sellersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import type { ImageItem } from '@/components/ImageUploader';

const fi = 'focus-ring mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none';

export default function SellerStorePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ storeName: '', description: '', address: '', phone: '', whatsapp: '' });
  const [logo, setLogo] = useState<ImageItem[]>([]);

  useEffect(() => { if (!isLoading && !isAuthenticated) router.push('/login'); }, [isLoading, isAuthenticated, router]);

  const load = async () => { try { const r = await sellersApi.getMyStore(); setStore(r.data); setForm({ storeName: r.data.storeName || '', description: r.data.description || '', address: r.data.address || '', phone: r.data.phone || '', whatsapp: r.data.whatsapp || '' }); if (r.data.logo) setLogo([{ url: r.data.logo, isPrimary: true }]); } catch { toast.error('Toko belum didaftarkan'); router.push('/seller/register'); } finally { setLoading(false); } };
  useEffect(() => { if (user) load(); }, [user]);

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { const payload: any = { ...form }; if (logo.length) payload.logo = logo[0].url; await sellersApi.update(store.id, payload); toast.success('Toko diperbarui'); await load(); setEditing(false); } catch (err: any) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); } finally { setSaving(false); } };

  if (isLoading || loading || !user) return <div className="flex min-h-screen items-center justify-center bg-canvas"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /></div>;
  if (!store) return <div className="surface mx-auto mt-20 max-w-sm py-14 text-center"><p className="font-black text-ink">Toko belum terdaftar</p><p className="mt-2 text-sm text-gray-500">Daftarkan tokomu untuk mulai berjualan.</p></div>;

  const statusLabel: Record<string, string> = { PENDING: 'Menunggu Verifikasi', VERIFIED: 'Terverifikasi', REJECTED: 'Ditolak', SUSPENDED: 'Dinonaktifkan' };
  const statusColor: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-700', VERIFIED: 'bg-primary-100 text-primary-700', REJECTED: 'bg-red-100 text-red-700', SUSPENDED: 'bg-gray-100 text-gray-700' };

  return <div>
    <div className="mb-6"><p className="eyebrow">Profil Toko</p><h1 className="mt-2 text-2xl font-black tracking-tight text-ink">Pengaturan Toko</h1></div>

    <div className="surface p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-start gap-5"><div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-100 text-2xl font-black text-primary-800">{store.logo ? <img src={store.logo} alt={store.storeName} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : store.storeName?.charAt(0)}</div><div><h2 className="text-xl font-extrabold text-ink">{store.storeName}</h2><span className={`mt-1.5 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusColor[store.status] || ''}`}>{statusLabel[store.status] || store.status}</span>{store.statusReason && <p className="mt-2 text-sm text-gray-500">{store.statusReason}</p>}</div></div>

      {editing ? <form onSubmit={submit} className="space-y-5">
        <ImageUploader images={logo} onChange={setLogo} maxImages={1} folder="logos" />
        <div><label className="text-sm font-bold text-gray-700">Nama Toko *</label><input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className={fi} required /></div>
        <div><label className="text-sm font-bold text-gray-700">Deskripsi</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fi} py-3 min-h-[100px]`} rows={4} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><label className="text-sm font-bold text-gray-700">Alamat</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={fi} /></div><div><label className="text-sm font-bold text-gray-700">Telepon</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={fi} /></div></div>
        <div><label className="text-sm font-bold text-gray-700">WhatsApp</label><input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={fi} placeholder="62812..." /></div>
        <div className="flex gap-3"><button disabled={saving} className="focus-ring h-12 rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button><button type="button" onClick={() => { setEditing(false); setLogo(store.logo ? [{ url: store.logo, isPrimary: true }] : []); }} className="focus-ring h-12 rounded-xl border border-black/10 bg-white px-6 font-bold hover:bg-canvas">Batal</button></div>
      </form> : <div className="space-y-5">
        {[{ l: 'Nama Toko', v: store.storeName }, { l: 'Deskripsi', v: store.description || '-' }, { l: 'Alamat', v: store.address || '-' }, { l: 'Telepon', v: store.phone || '-' }, { l: 'WhatsApp', v: store.whatsapp || '-' }].map((f) => <div key={f.l}><p className="text-xs font-bold uppercase tracking-wider text-gray-400">{f.l}</p><p className="mt-1 font-bold text-ink">{f.v}</p></div>)}
        <button onClick={() => setEditing(true)} className="focus-ring mt-2 h-12 rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800">Edit Toko</button>
      </div>}
    </div>
  </div>;
}
