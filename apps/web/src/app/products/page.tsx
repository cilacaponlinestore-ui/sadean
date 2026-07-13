'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { ProductCard } from '@/components/MarketplaceCards';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    setSearch(new URLSearchParams(window.location.search).get('search') || '');
    api.get('/categories').then((res) => setCategories(res.data.data || res.data)).catch(() => toast.error('Gagal memuat kategori'));
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get('/products', { params: { ...(search && { search }), ...(category && { category }) } });
        setProducts(response.data.products || []);
      } catch { toast.error('Gagal memuat produk'); } finally { setLoading(false); }
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="min-h-screen bg-canvas"><Navbar />
      <main id="main-content" className="page-container py-10 sm:py-14">
        <div className="max-w-2xl"><p className="eyebrow">Etalase Cilacap</p><h1 className="section-heading mt-3">Produk lokal, pilihan lebih dekat</h1><p className="mt-3 leading-7 text-gray-500">Jelajahi makanan, kerajinan, dan karya UMKM dari berbagai sudut Cilacap.</p></div>
        <div className="surface my-8 grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_240px] sm:p-4">
          <label className="relative"><span className="sr-only">Cari produk</span><svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /></svg><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk khas Cilacap..." className="focus-ring h-12 w-full rounded-xl border border-black/10 bg-canvas pl-12 pr-4 outline-none" /></label>
          <label><span className="sr-only">Pilih kategori</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="focus-ring h-12 w-full rounded-xl border border-black/10 bg-canvas px-4 font-semibold text-gray-700 outline-none"><option value="">Semua kategori</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        </div>
        <div className="mb-5 flex items-center justify-between"><p className="text-sm font-semibold text-gray-500">{loading ? 'Mencari produk...' : `${products.length} produk ditemukan`}</p>{(search || category) && <button onClick={() => { setSearch(''); setCategory(''); }} className="focus-ring rounded-lg px-3 py-2 text-sm font-bold text-primary-700 hover:bg-primary-50">Bersihkan filter</button>}</div>
        {loading ? <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="overflow-hidden rounded-2xl border border-black/5 bg-white"><div className="aspect-square animate-pulse bg-black/5"/><div className="space-y-3 p-4"><div className="h-3 w-20 animate-pulse rounded bg-black/5"/><div className="h-5 animate-pulse rounded bg-black/5"/><div className="h-5 w-28 animate-pulse rounded bg-black/5"/></div></div>)}</div> : products.length ? <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="surface py-16 text-center"><p className="text-xl font-black text-ink">Belum ketemu produknya</p><p className="mt-2 text-gray-500">Coba kata kunci lain atau lihat semua kategori.</p></div>}
      </main>
    </div>
  );
}
