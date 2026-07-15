'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Seller { id: string; storeName: string; slug: string; phone: string; logo?: string; status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED'; createdAt: string; _count: { products: number }; }

const statusLabel: Record<string, string> = { PENDING: 'Menunggu', VERIFIED: 'Terverifikasi', REJECTED: 'Ditolak', SUSPENDED: 'Dinonaktifkan' };
const statusColor: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-700', VERIFIED: 'bg-primary-100 text-primary-700', REJECTED: 'bg-red-100 text-red-700', SUSPENDED: 'bg-gray-100 text-gray-700' };
const filt = ['all', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'];

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => { try { const r = await api.get<{ sellers: Seller[] }>('/sellers'); setSellers(r.data.sellers); } catch { toast.error('Gagal memuat data'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const moderate = async (id: string, action: 'approve' | 'reject' | 'suspend') => {
    const confirmMsg = { approve: 'Setujui toko ini?', reject: 'Tolak toko ini?', suspend: 'Tangguhkan toko ini?' };
    if (!confirm(confirmMsg[action])) return;
    try { await api.put(`/sellers/${id}/${action}`); toast.success('Status diperbarui'); load(); } catch { toast.error('Gagal memperbarui status'); }
  };

  const filtered = filter === 'all' ? sellers : sellers.filter((s) => s.status === filter);

  if (loading) return <div className="flex min-h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /></div>;

  return <div>
    <h1 className="text-2xl font-black tracking-tight text-ink mb-6">Verifikasi UMKM</h1>
    <div className="mb-6 flex flex-wrap gap-2">{filt.map((s) => <button key={s} onClick={() => setFilter(s)} className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold transition ${filter === s ? 'bg-primary-700 text-white' : 'border border-black/10 bg-white text-ink hover:bg-canvas'}`}>{s === 'all' ? 'Semua' : statusLabel[s]}</button>)}</div>
    {filtered.length === 0 ? <div className="surface p-8 text-center text-gray-500">Belum ada data</div> : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => <div key={s.id} className="surface p-5">
          <div className="mb-4 flex items-start gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-100 text-lg font-black text-primary-800">{s.logo ? <img src={s.logo} alt="" className="h-full w-full object-cover" /> : s.storeName[0]}</div><div className="min-w-0 flex-1"><p className="font-extrabold text-ink truncate">{s.storeName}</p><span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusColor[s.status]}`}>{statusLabel[s.status]}</span></div></div>
          <div className="mb-4 flex gap-4 text-sm"><span className="text-gray-500">{s._count?.products || 0} produk</span><span className="text-gray-400">{new Date(s.createdAt).toLocaleDateString('id-ID')}</span></div>
        </div>)}
      </div>
    )}</div>;
}
