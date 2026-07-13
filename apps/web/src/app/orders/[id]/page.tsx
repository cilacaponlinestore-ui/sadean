'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  total: number;
  notes: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  cancelledReason: string | null;
  confirmedAt: string | null;
  processingAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  whatsappLink?: string;
  items: OrderItem[];
  seller: { id: string; storeName: string; whatsapp: string | null };
  user: { id: string; name: string };
}

const statusLabels: Record<string, string> = {
  pending: 'Menunggu', confirmed: 'Dikonfirmasi', processing: 'Diproses',
  shipped: 'Dikirim', delivered: 'Diterima', cancelled: 'Dibatalkan',
};

const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !params.id) return;
    loadOrder();
  }, [isAuthenticated, params.id]);

  const loadOrder = async () => {
    try {
      const response = await api.get(`/orders/${params.id}`);
      setOrder(response.data);
    } catch { toast.error('Gagal memuat detail pesanan'); router.push('/orders') }
    finally { setLoading(false) }
  };

  const handleCancel = async () => {
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;
    setCancelling(true);
    try {
      await api.put(`/orders/${order!.id}/status`, { status: 'cancelled' });
      toast.success('Pesanan dibatalkan');
      loadOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membatalkan');
    } finally { setCancelling(false) }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (isLoading || loading) {
    return <div className="min-h-screen bg-gray-50"><Navbar /><div className="max-w-3xl mx-auto px-4 py-12 text-center">Memuat detail pesanan...</div></div>;
  }

  if (!order) return null;

  const currentStep = order.status === 'cancelled' ? -1 : steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold">{order.orderNumber}</h1>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded ${
              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
              order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
              order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>{statusLabels[order.status]}</span>
          </div>
        </div>

        {order.status !== 'cancelled' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4">Status Pesanan</h2>
            <div className="flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s} className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>{i + 1}</div>
                  <div className={`h-1 flex-1 ${i < currentStep ? 'bg-primary-600' : 'bg-gray-200'}`} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Pesanan</span><span>Dikonfirmasi</span><span>Diproses</span><span>Dikirim</span><span>Diterima</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Informasi Pengiriman</h2>
          <div className="text-sm space-y-2">
            <p><span className="text-gray-500">Nama:</span> {order.shippingName}</p>
            <p><span className="text-gray-500">Telepon:</span> {order.shippingPhone}</p>
            <p><span className="text-gray-500">Alamat:</span> {order.shippingAddress}</p>
            {order.notes && <p><span className="text-gray-500">Catatan:</span> {order.notes}</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Produk</h2>
          <div className="divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between py-3">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">{item.quantity} x {formatPrice(item.productPrice)}</p>
                </div>
                <p className="font-medium">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 border-t mt-2">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg text-primary-600">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-2">Toko</h2>
          <p className="text-gray-700">{order.seller.storeName}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            {order.seller.whatsapp && (
              <a href={`https://wa.me/${order.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Halo, saya ingin bertanya tentang pesanan ${order.orderNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                Chat via WhatsApp
              </a>
            )}
            {order.status === 'pending' && (
              <button onClick={handleCancel} disabled={cancelling}
                className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50">
                {cancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
