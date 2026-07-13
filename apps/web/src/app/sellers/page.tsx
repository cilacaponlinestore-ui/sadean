'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

interface Seller {
  id: string;
  storeName: string;
  slug: string;
  description: string;
  logo: string;
  _count: { products: number };
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const response = await api.get('/sellers/public');
      setSellers(response.data);
    } catch (error) {
      console.error('Failed to load sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">UMKM Cilacap</h1>
          <p className="text-gray-500">Temukan toko lokal terpercaya</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Memuat data...</div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada toko terdaftar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <Link
                key={seller.id}
                href={`/sellers/${seller.slug}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {seller.logo ? (
                      <img src={seller.logo} alt={seller.storeName} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-2xl">🏪</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{seller.storeName}</h3>
                    <p className="text-sm text-gray-500">{seller._count?.products || 0} produk</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {seller.description || 'Tidak ada deskripsi'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}