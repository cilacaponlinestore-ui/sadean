'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { favoritesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface FavoriteItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image: string | null;
    seller: { id: string; storeName: string; slug: string };
  };
}

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) load()
    else { setLoading(false) }
  }, [user]);

  const load = async () => {
    try {
      const r = await favoritesApi.list()
      setItems(r.data)
    } catch { toast.error('Gagal memuat favorit') }
    finally { setLoading(false) }
  };

  const handleRemove = async (productId: string) => {
    try {
      await favoritesApi.toggle(productId)
      setItems((prev) => prev.filter((i) => i.productId !== productId))
      toast.success('Dihapus dari favorit')
    } catch { toast.error('Gagal menghapus') }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Favorit Saya</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat...</div>
        ) : !user ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Silakan login untuk melihat favorit</p>
            <Link href="/login" className="text-primary-600 hover:underline">Login</Link>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Belum ada produk favorit</p>
            <Link href="/products" className="text-primary-600 hover:underline">Jelajahi Produk</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden relative group">
                <Link href={`/products/${item.product.slug}`}>
                  <div className="aspect-square bg-gray-100">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><span className="text-4xl">📦</span></div>
                    )}
                  </div>
                </Link>
                <button onClick={() => handleRemove(item.productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <div className="p-4">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 hover:text-primary-600">{item.product.name}</h3>
                  </Link>
                  <p className="text-lg font-bold text-primary-600 mb-1">{formatPrice(item.product.price)}</p>
                  <Link href={`/sellers/${item.product.seller.slug}`} className="text-sm text-gray-500 hover:text-primary-600">
                    {item.product.seller.storeName}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
