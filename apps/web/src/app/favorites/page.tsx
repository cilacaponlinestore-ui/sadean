'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { favoritesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface FavoriteItem {
  id: string; productId: string;
  product: { id: string; name: string; slug: string; price: number; stock: number; image: string | null; seller: { id: string; storeName: string; slug: string } };
}

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) load(); else setLoading(false) }, [user]);
  const load = async () => { try { setLoading(true); const r = await favoritesApi.list(); setItems(r.data); } catch { toast.error('Gagal memuat favorit'); } finally { setLoading(false); } };
  const remove = async (productId: string) => { try { await favoritesApi.toggle(productId); setItems((p) => p.filter((i) => i.productId !== productId)); toast.success('Dihapus dari favorit'); } catch { toast.error('Gagal menghapus'); } };

  return <div className="min-h-screen bg-canvas"><Navbar />
    <main id="main-content" className="page-container py-8 sm:py-12">
      <p className="eyebrow">Koleksi pribadi</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink">Favorit Saya</h1>
      {loading ? <div className="mt-10 text-center font-bold text-gray-500">Memuat favorit...</div> : !user ? <div className="surface mt-10 py-16 text-center"><p className="font-extrabold text-ink">Silakan login</p><p className="mt-2 text-gray-500">Favorit tersimpan setelah masuk.</p><Link href="/login" className="focus-ring mt-5 inline-flex h-12 items-center rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800">Masuk ke SADEAN</Link></div>
      : !items.length ? <div className="surface mt-10 py-16 text-center"><p className="font-extrabold text-ink">Belum ada favorit</p><p className="mt-2 text-gray-500">Simpan produk yang kamu suka saat belanja.</p><Link href="/products" className="focus-ring mt-5 inline-flex h-12 items-center rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800">Jelajahi Produk</Link></div>
      : <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{items.map((item) => <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-soft">
        <Link href={`/products/${item.product.slug}`} className="focus-ring block"><div className="aspect-square overflow-hidden bg-[#eee9df]">{item.product.image ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <div className="flex h-full items-center justify-center text-4xl opacity-30">📦</div>}</div></Link>
        <button aria-label="Hapus dari favorit" onClick={() => remove(item.productId)} className="focus-ring absolute right-2 top-2 z-10 rounded-full bg-white/95 p-2 shadow-sm opacity-100 transition hover:bg-red-50 md:opacity-0 md:group-hover:opacity-100"><svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></button>
        <div className="p-3.5 sm:p-4"><p className="text-[11px] font-bold uppercase tracking-wider text-primary-700">{item.product.seller.storeName}</p><Link href={`/products/${item.product.slug}`} className="focus-ring block"><h3 className="mt-1 line-clamp-2 min-h-10 font-extrabold leading-5 text-ink">{item.product.name}</h3></Link><p className="mt-3 text-lg font-black text-primary-700">{rupiah.format(Number(item.product.price))}</p></div>
      </div>)}</div>}
    </main>
  </div>;
}
