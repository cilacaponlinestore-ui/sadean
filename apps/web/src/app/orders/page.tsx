'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  whatsappLink: string;
  items: {
    productName: string;
    productPrice: number;
    quantity: number;
  }[];
}

const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  confirmed: 'Dikonfirmasi',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  cancelled: 'Dibatalkan',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/my-orders?page=${page}&limit=10`);
      setOrders(response.data.orders || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Memuat pesanan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">Belum ada pesanan</p>
            <button onClick={() => router.push('/products')} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link href={`/orders/${order.id}`} className="font-semibold text-primary-600 hover:underline">{order.orderNumber}</Link>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="border-t pt-4 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.productPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  {order.whatsappLink && (
                    <a href={order.whatsappLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                      Chat Penjual
                    </a>
                  )}
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`px-3 py-1.5 border rounded-lg text-sm ${p === page ? 'bg-primary-600 text-white' : 'hover:bg-gray-50'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50">
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}