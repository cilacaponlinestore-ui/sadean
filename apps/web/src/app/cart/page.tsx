'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CartItem {
  productId: string;
  quantity: number;
  product: { id: string; name: string; price: number; stock: number; unit: string; image: string | null; seller: { storeName: string }; };
}

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { if (!isLoading && !isAuthenticated) router.push('/login'); }, [isLoading, isAuthenticated, router]);
  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => { try { const r = await api.get('/cart'); setItems(r.data.items || []); } catch { toast.error('Gagal memuat keranjang'); } finally { setLoading(false); } };
  const update = async (productId: string, qty: number) => { if (updating) return; setUpdating(productId); try { await api.put(`/cart/items/${productId}`, { quantity: qty }); await loadCart(); } catch { toast.error('Gagal memperbarui jumlah'); } finally { setUpdating(null); } };
  const remove = async (productId: string) => { try { await api.delete(`/cart/items/${productId}`); toast.success('Produk dihapus'); await loadCart(); } catch { toast.error('Gagal menghapus produk'); } };
  const rupiah = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  if (isLoading || loading) return <div className="min-h-screen bg-canvas"><Navbar /><main className="page-container py-20 text-center font-bold text-gray-500">Memuat keranjang...</main></div>;

  return <div className="min-h-screen bg-canvas"><Navbar />
    <main id="main-content" className="page-container py-8 sm:py-12">
      <p className="eyebrow">Siap diantar</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink">Keranjang Belanja</h1>
      {!items.length ? <div className="surface mt-8 py-16 text-center"><p className="text-xl font-black text-ink">Keranjang kosong</p><p className="mt-2 text-gray-500">Produk UMKM Cilacap menanti.</p><Link href="/products" className="focus-ring mt-6 inline-flex h-12 items-center rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800">Mulai Belanja</Link></div> : <>
        <p className="mt-5 text-sm text-gray-500">Pesanan ini diproses oleh <span className="font-bold text-ink">{items[0]?.product?.seller?.storeName || 'satu toko'}</span>.</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">{items.map((item) => <div key={item.productId} className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#eee9df]">{(item.product as any).image ? <Image src={(item.product as any).image} alt={item.product.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl">📦</div>}</div>
            <div className="min-w-0 flex-1"><p className="font-extrabold leading-5 text-ink">{item.product.name}</p><p className="mt-1 text-sm text-gray-500">{item.product.seller?.storeName}</p><p className="mt-1 font-extrabold text-primary-700">{rupiah(Number(item.product.price))}</p>{item.product.stock !== undefined && <p className="mt-2 text-xs text-gray-500">Stok tersisa: {item.product.stock}</p>}</div>
            <div className="flex items-center justify-between gap-3 sm:flex-col-reverse sm:items-end">
              <button onClick={() => remove(item.productId)} className="focus-ring rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Hapus</button>
              <div className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white p-1">
                <button aria-label="Kurangi" disabled={updating === item.productId} onClick={() => update(item.productId, Math.max(1, item.quantity - 1))} className="focus-ring h-9 w-9 rounded-lg font-bold disabled:opacity-40">−</button>
                <span className="min-w-[2rem] text-center font-bold tabular-nums">{item.quantity}</span>
                <button aria-label="Tambah" disabled={updating === item.productId || item.quantity >= (item.product.stock ?? Infinity)} onClick={() => update(item.productId, item.quantity + 1)} className="focus-ring h-9 w-9 rounded-lg font-bold disabled:opacity-40">+</button>
              </div>
            </div>
          </div>)}</div>
          <div className="surface sticky top-24 h-fit p-5">
            <h3 className="font-black text-ink">Ringkasan</h3>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal ({itemCount} barang)</span><span className="font-bold">{rupiah(total)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Ongkos kirim</span><span className="text-gray-500">Dikonfirmasi via WhatsApp</span></div>
            </div>
            <div className="my-5 border-t border-black/5 pt-4"><div className="flex justify-between font-black"><span>Total</span><span className="text-primary-700">{rupiah(total)}</span></div><p className="mt-3 text-xs leading-5 text-gray-500">Belum termasuk ongkos kirim; detail pengiriman akan dikonfirmasi toko melalui WhatsApp setelah checkout.</p></div>
            <button onClick={() => router.push('/checkout')} className="focus-ring h-12 w-full rounded-xl bg-primary-700 font-bold text-white hover:bg-primary-800">Lanjutkan Checkout</button>
          </div>
        </div>
      </>}
    </main>
  </div>;
}
