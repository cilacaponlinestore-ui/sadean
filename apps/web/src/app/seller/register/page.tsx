'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { sellersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import type { ImageItem } from '@/components/ImageUploader';

const fi = 'focus-ring mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none';

export default function SellerRegisterPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [form, setForm] = useState({ storeName: '', description: '', address: '', phone: '', whatsapp: '' });
  const [saving, setSaving] = useState(false);
  const [logo, setLogo] = useState<ImageItem[]>([]);

  useEffect(() => { if (!isLoading && !isAuthenticated) router.push('/login'); }, [isLoading, isAuthenticated, router]);
  if (isLoading || !user) return <div className="flex min-h-screen items-center justify-center bg-canvas"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /></div>;

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { const payload: any = { ...form }; if (logo.length) payload.logo = logo[0].url; await sellersApi.create(payload); toast.success('Toko berhasil didaftarkan! Menunggu verifikasi admin.'); router.push('/dashboard'); } catch (err: any) { toast.error(err.response?.data?.message || 'Gagal mendaftarkan toko'); } finally { setSaving(false); } };

  return <div>
    <div className="mb-6"><p className="eyebrow">Mulai berjualan</p><h1 className="mt-2 text-2xl font-black tracking-tight text-ink">Daftarkan Toko</h1><p className="mt-2 leading-7 text-gray-500">Isi informasi tokomu. Setelah disetujui admin, produkmu langsung tampil di marketplace.</p></div>

    <form onSubmit={submit} className="surface max-w-2xl space-y-5 p-5 sm:p-6">
      <ImageUploader images={logo} onChange={setLogo} maxImages={1} folder="logos" />
      <div><label className="text-sm font-bold text-gray-700">Nama Toko <span className="text-red-500">*</span></label><input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className={fi} placeholder="Nama usaha Anda" required /></div>
      <div><label className="text-sm font-bold text-gray-700">Deskripsi Toko</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fi} py-3 min-h-[90px]`} placeholder="Ceritakan tentang produk atau layanan yang Anda tawarkan" rows={3} /></div>
      <div><label className="text-sm font-bold text-gray-700">Alamat Toko</label><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${fi} py-3 min-h-[70px]`} placeholder="Alamat lengkap toko Anda di Cilacap" rows={2} /></div>
      <div className="grid gap-4 sm:grid-cols-2"><div><label className="text-sm font-bold text-gray-700">Nomor HP Toko</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={fi} placeholder="0812..." /></div><div><label className="text-sm font-bold text-gray-700">WhatsApp <span className="font-normal text-gray-400">(utama)</span></label><input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={fi} placeholder="62812..." /><p className="mt-1.5 text-xs text-gray-400">Pembeli akan menghubungi via nomor ini.</p></div></div>

      <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm leading-6 text-primary-800"><strong>Verifikasi admin:</strong> Toko Anda akan ditinjau oleh admin SADEAN sebelum muncul di marketplace. Proses verifikasi biasanya 1-2 hari kerja.</div>

      <div className="flex gap-3"><button disabled={saving} className="focus-ring h-12 rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800 disabled:opacity-50">{saving ? 'Mendaftarkan...' : 'Daftarkan Toko'}</button><button type="button" onClick={() => router.back()} className="focus-ring h-12 rounded-xl border border-black/10 bg-white px-6 font-bold hover:bg-canvas">Batal</button></div>
    </form>
  </div>;
}
