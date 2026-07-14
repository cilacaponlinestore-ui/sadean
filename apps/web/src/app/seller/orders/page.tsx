'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string; orderNumber: string; total: number; status: string; createdAt: string;
  user: { name: string; phone: string }; items: { product: { name: string }; quantity: number; price: number }[];
}

const colors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', completed: 'bg-primary-100 text-primary-700', cancelled: 'bg-red-100 text-red-700' };
const labels: Record<string, string> = { pending: 'Menunggu', confirmed: 'Dikonfirmasi', processing: 'Diproses', shipped: 'Dikirim', delivered: 'Diterima', completed: 'Selesai', cancelled: 'Dibatalkan' };
const filters = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { load(); }, [page, filter]);

  const load = async () => { setLoading(true); try { const r = await api.get(`/orders/seller-orders?page=${page}&limit=10${filter !== 'all' ? `&status=${filter}` : ''}`); setOrders(r.data.orders || []); setTotalPages(r.data.pagination?.totalPages || 1); } catch { toast.error('Gagal memuat pesanan'); } finally { setLoading(false); } };
  const updateStatus = async (id: string, s: string) => { try { await api.put(`/orders/${id}/status`, { status: s }); toast.success('Status diperbarui'); load(); } catch { toast.error('Gagal memperbarui status'); } };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return <div>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><h1 className="text-2xl font-black tracking-tight text-ink">Pesanan Masuk</h1></div>

    <div className="mb-6 flex gap-2 overflow-x-auto pb-1">{filters.map((s) => <button key={s} onClick={() => { setFilter(s); setPage(1); }} className={`focus-ring shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition ${filter === s ? 'bg-primary-700 text-white' : 'border border-black/10 bg-white text-gray-600 hover:bg-canvas'}`}>{s === 'all' ? 'Semua' : labels[s]}</button>)}</div>

    {loading ? <div className="py-14 text-center font-bold text-gray-500">Memuat pesanan...</div> : !filtered.length ? <div className="surface py-16 text-center"><p className="font-extrabold text-ink">Tidak ada pesanan</p></div> : <div className="space-y-4">
      {filtered.map((order) => <div key={order.id} className="surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={`/orders/${order.id}`} className="font-extrabold text-ink hover:underline">{order.orderNumber}</Link><p className="text-sm text-gray-500">{order.user.name}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[order.status] || 'bg-gray-100 text-gray-700'}`}>{labels[order.status] || order.status}</span></div>
        <div className="mt-4 space-y-1.5 border-t border-black/5 pt-4">{order.items.map((item, i) => <div key={i} className="flex justify-between text-sm"><span>{item.product.name} ×{item.quantity}</span><span className="font-bold">{rupiah.format(item.price * item.quantity)}</span></div>)}</div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-4"><p className="text-sm text-gray-500">{fmtDate(order.createdAt)}</p><p className="text-lg font-extrabold text-primary-700">{rupiah.format(order.total)}</p></div>

        {order.status === 'pending' && <div className="mt-4 flex gap-2 border-t border-black/5 pt-4"><button onClick={() => updateStatus(order.id, 'confirmed')} className="focus-ring rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700">Konfirmasi</button><button onClick={() => updateStatus(order.id, 'cancelled')} className="focus-ring rounded-xl bg-red-100 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-200">Tolak</button></div>}
        {order.status === 'confirmed' && <div className="mt-4 border-t border-black/5 pt-4"><button onClick={() => updateStatus(order.id, 'processing')} className="focus-ring rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-800">Proses Pesanan</button></div>}
        {order.status === 'processing' && <div className="mt-4 border-t border-black/5 pt-4"><button onClick={() => updateStatus(order.id, 'shipped')} className="focus-ring rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">Tandai Dikirim</button></div>}

        {order.user.phone && <div className="mt-3"><a href={`https://wa.me/${order.user.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:bg-[#128C7E]">Chat via WhatsApp</a></div>}
      </div>)}

      {totalPages > 1 && <div className="flex items-center justify-center gap-2 pt-4">{Array.from({ length: totalPages }, (_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`focus-ring flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${page === i + 1 ? 'bg-primary-700 text-white' : 'border border-black/10 bg-white hover:bg-canvas'}`}>{i + 1}</button>)}</div>}
    </div>}
  </div>;
}
