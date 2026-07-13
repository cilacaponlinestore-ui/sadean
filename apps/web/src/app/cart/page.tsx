'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface CartItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    seller: { storeName: string };
  };
}

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await api.get('/cart');
      setItems(response.data.items || []);
    } catch (error) {
      toast.error('Gagal memuat keranjang');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.put(`/cart/items/${itemId}`, { quantity });
      loadCart();
    } catch (error) {
      toast.error('Gagal memperbarui jumlah');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      toast.success('Produk dihapus dari keranjang');
      loadCart();
    } catch (error) {
      toast.error('Gagal menghapus produk');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Memuat keranjang...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">Keranjang kosong</p>
            <Link href="/products" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{item.product.seller?.storeName}</p>
                      <p className="text-primary-600 font-semibold mt-1">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700 text-sm">
                        Hapus
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 border rounded hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-50">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Ringkasan</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({items.length} produk)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ongkos kirim</span>
                    <span className="text-gray-500">Dihitung via WhatsApp</span>
                  </div>
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(total)}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                  Checkout via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}