'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string; phone: string };
  items: { product: { name: string }; quantity: number; price: number }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Menunggu',
  confirmed: 'Dikonfirmasi',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  cancelled: 'Dibatalkan',
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders/seller-orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Status pesanan diperbarui');
      loadOrders();
    } catch (error) {
      toast.error('Gagal memperbarui status');
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

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pesanan Masuk</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {status === 'all' ? 'Semua' : statusLabels[status]}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.user.name}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="border-t pt-4 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  {order.user.phone && (
                    <a
                      href={`https://wa.me/${order.user.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Hubungi via WhatsApp
                    </a>
                  )}
                </div>
                <p className="font-semibold text-lg">{formatPrice(order.total)}</p>
              </div>

              {/* Status Actions */}
              {order.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Konfirmasi
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Tolak
                  </button>
                </div>
              )}
              {order.status === 'confirmed' && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'processing')}
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                  >
                    Mulai Proses
                  </button>
                </div>
              )}
              {order.status === 'processing' && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'shipped')}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                  >
                    Tandai Dikirim
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}