'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface Order { id: string; orderNumber: string; status: string; total: number; createdAt: string; items: { productName: string; quantity: number }[]; }

const labels: Record<string, string> = { pending: 'Menunggu', confirmed: 'Dikonfirmasi', processing: 'Diproses', shipped: 'Dikirim', delivered: 'Diterima', completed: 'Selesai', cancelled: 'Dibatalkan' };
const colors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', completed: 'bg-primary-100 text-primary-700', cancelled: 'bg-red-100 text-red-700' };

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { if (!isLoading && !isAuthenticated) router.push('/login'); }, [isLoading, isAuthenticated, router]);
  useEffect(() => { load(); }, [page]);

  const load = async () => { setLoading(true); try { const r = await api.get(`/orders/my-orders?page=${page}&limit=10`); setOrders(r.data.orders || []); setTotalPages(r.data.pagination?.totalPages || 1); } catch { toast.error('Gagal memuat pesanan'); } finally { setLoading(false); } };

  if (isLoading || loading) return <div className="min-h-screen bg-canvas"><Navbar /><main className="page-container py-20 text-center font-bold text-gray-500">Memuat pesanan...</main></div>;

  return <div className="min-h-screen bg-canvas"><Navbar />
    <main id="main-content" className="page-container py-8 sm:py-12">
      <p className="eyebrow">Riwayat pembelian</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink">Pesanan Saya</h1>

      {!orders.length ? <div className="surface mt-8 py-16 text-center"><p className="font-extrabold text-ink">Belum ada pesanan</p><p className="mt-2 text-gray-500">Mulai jelajahi produk dari UMKM Cilacap.</p><Link href="/products" className="focus-ring mt-5 inline-flex h-12 items-center rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800">Jelajahi Produk</Link></div> : <div className="mt-8 space-y-4">
        {orders.map((order) => <Link key={order.id} href={`/orders/${order.id}`} className="surface block p-5 transition hover:-translate-y-1 focus-ring">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-extrabold text-ink">{order.orderNumber}</p><p className="text-sm text-gray-500">{fmt(order.createdAt)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[order.status] || 'bg-gray-100 text-gray-700'}`}>{labels[order.status] || order.status}</span></div>
          <div className="mt-3 space-y-1 text-sm text-gray-600">{order.items.slice(0, 3).map((item, i) => <p key={i} className="truncate">{item.productName} ×{item.quantity}</p>)}{order.items.length > 3 && <p className="text-xs text-gray-400">+{order.items.length - 3} produk lainnya</p>}</div>
          <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3"><span className="text-xs text-gray-500">Lihat detail →</span><span className="text-lg font-extrabold text-primary-700">{rupiah.format(order.total)}</span></div>
        </Link>)}

        {totalPages > 1 && <div className="flex items-center justify-center gap-2 pt-4">{Array.from({ length: totalPages }, (_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`focus-ring flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${page === i + 1 ? 'bg-primary-700 text-white' : 'border border-black/10 bg-white hover:bg-canvas'}`}>{i + 1}</button>)}</div>}
      </div>}
    </main>
  </div>;
}
