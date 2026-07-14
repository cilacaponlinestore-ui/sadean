'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthGuard } from '@/lib/useAuthGuard';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

const labels: Record<string, string> = { pending: 'Menunggu', confirmed: 'Dikonfirmasi', processing: 'Diproses', shipped: 'Dikirim', delivered: 'Diterima', completed: 'Selesai', cancelled: 'Dibatalkan' };
const colors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-green-100 text-green-700', completed: 'bg-primary-100 text-primary-700', cancelled: 'bg-red-100 text-red-700' };
const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed'];
const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const fmt = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function OrderDetailPage() {
  const router = useRouter();
  const p = useParams();
  const { isLoading, isAuthenticated } = useAuthGuard();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => { if (!isAuthenticated || !p.id) return; api.get(`/orders/${p.id}`).then((r) => setOrder(r.data)).catch(() => { toast.error('Gagal memuat pesanan'); router.push('/orders'); }).finally(() => setLoading(false)); }, [isAuthenticated, p.id]);

  const act = async (status: string) => { const fn = status === 'cancelled' ? setCancelling : setCompleting; fn(true); try { await api.put(`/orders/${order.id}/status`, { status }); toast.success('Status diperbarui'); setOrder((prev: any) => ({ ...prev, status })); } catch (e: any) { toast.error(e.response?.data?.message || 'Gagal'); } finally { fn(false); } };

  if (isLoading || loading) return <div className="min-h-screen bg-canvas"><Navbar /><main className="page-container py-20 text-center font-bold text-gray-500">Memuat pesanan...</main></div>;
  if (!order) return null;

  const idx = order.status === 'cancelled' ? -1 : steps.indexOf(order.status);

  return <div className="min-h-screen bg-canvas"><Navbar />
    <main id="main-content" className="page-container max-w-2xl py-8 sm:py-12">
      <div className="surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Detail Pesanan</p><h1 className="mt-1 text-2xl font-black tracking-tight text-ink">{order.orderNumber}</h1><p className="text-sm text-gray-500">{fmt(order.createdAt)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[order.status] || 'bg-gray-100 text-gray-700'}`}>{labels[order.status] || order.status}</span></div>
      </div>

      {order.status !== 'cancelled' && <div className="surface mt-6 p-5 sm:p-6"><h2 className="mb-4 font-black text-ink">Status Pesanan</h2><div className="flex items-center gap-1">{steps.map((s, i) => <div key={s} className="min-w-0 flex-1 flex items-center"><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= idx ? 'bg-primary-700 text-white' : 'bg-black/5 text-gray-400'}`}>{i + 1}</div>{i < steps.length - 1 && <div className={`h-1 flex-1 ${i < idx ? 'bg-primary-700' : 'bg-black/5'}`} />}</div>)}</div><div className="mt-2 flex justify-between text-[10px] font-bold tracking-wider text-gray-500">{steps.map((s) => <span key={s}>{labels[s]}</span>)}</div></div>}

      <div className="surface mt-6 p-5 sm:p-6"><h2 className="mb-4 font-black text-ink">Pengiriman</h2><div className="space-y-2 text-sm"><p><span className="font-bold text-gray-500">Nama:</span> <span className="text-ink">{order.shippingName}</span></p><p><span className="font-bold text-gray-500">Telepon:</span> <span className="text-ink">{order.shippingPhone}</span></p><p><span className="font-bold text-gray-500">Alamat:</span> <span className="text-ink">{order.shippingAddress}</span></p>{order.notes && <p><span className="font-bold text-gray-500">Catatan:</span> {order.notes}</p>}</div></div>

      <div className="surface mt-6 p-5 sm:p-6"><h2 className="mb-4 font-black text-ink">Produk</h2><div className="divide-y divide-black/5">{order.items.map((item: any) => <div key={item.id} className="flex justify-between py-3"><div><p className="font-bold text-ink">{item.productName}</p><p className="text-sm text-gray-500">{item.quantity} × {rupiah.format(item.productPrice)}</p></div><p className="font-extrabold">{rupiah.format(item.subtotal)}</p></div>)}</div><div className="mt-4 flex justify-between border-t border-black/5 pt-4"><span className="font-black text-ink">Total</span><span className="text-xl font-black text-primary-700">{rupiah.format(order.total)}</span></div></div>

      <div className="surface mt-6 p-5 sm:p-6"><h2 className="mb-3 font-black text-ink">Toko</h2><p className="font-bold text-ink">{order.seller.storeName}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {order.seller.whatsapp && <a href={`https://wa.me/${order.seller.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang pesanan ${order.orderNumber}`)}`} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white hover:bg-[#128C7E]">Chat via WhatsApp</a>}
          {order.status === 'pending' && <button onClick={() => act('cancelled')} disabled={cancelling} className="focus-ring inline-flex h-10 items-center rounded-xl border-2 border-red-300 px-4 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50">{cancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}</button>}
          {order.status === 'delivered' && <button onClick={() => act('completed')} disabled={completing} className="focus-ring inline-flex h-10 items-center rounded-xl bg-primary-700 px-4 text-sm font-bold text-white hover:bg-primary-800 disabled:opacity-50">{completing ? 'Mengonfirmasi...' : 'Pesanan Diterima'}</button>}
        </div>
      </div>
    </main>
  </div>;
}
