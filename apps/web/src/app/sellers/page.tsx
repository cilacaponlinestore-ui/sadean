'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { SellerCard } from '@/components/MarketplaceCards';
import toast from 'react-hot-toast';

export default function SellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => { api.get('/sellers/public').then((res) => setSellers(res.data)).catch(() => toast.error('Gagal memuat toko')).finally(() => setLoading(false)); }, []);
  const filtered = sellers.filter((seller) => `${seller.storeName} ${seller.description || ''} ${seller.address || ''}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="min-h-screen bg-canvas"><Navbar /><main id="main-content" className="page-container py-10 sm:py-14">
    <div className="grid gap-7 lg:grid-cols-[1fr_420px] lg:items-end"><div><p className="eyebrow">Kenal lebih dekat</p><h1 className="section-heading mt-3">UMKM pilihan Cilacap</h1><p className="mt-3 max-w-2xl leading-7 text-gray-500">Di balik setiap produk ada tetangga, keluarga, dan cerita usaha lokal yang layak tumbuh.</p></div><label className="surface relative block p-2"><span className="sr-only">Cari toko</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama toko atau lokasi..." className="focus-ring h-12 w-full rounded-xl bg-canvas px-4 outline-none" /></label></div>
    <div className="mt-10">{loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-black/5" />)}</div> : filtered.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((seller) => <SellerCard key={seller.id} seller={seller} />)}</div> : <div className="surface py-16 text-center"><p className="text-xl font-black">Toko belum ditemukan</p><p className="mt-2 text-gray-500">Coba nama atau lokasi yang berbeda.</p></div>}</div>
  </main></div>;
}
