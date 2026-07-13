'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

interface Seller {
  id: string;
  storeName: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  whatsapp: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
}

export default function SellerDetailPage() {
  const params = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeller();
  }, [params.slug]);

  const loadSeller = async () => {
    try {
      const response = await api.get(`/sellers/${params.slug}`);
      setSeller(response.data.seller);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to load seller:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Memuat data...</div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Toko tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              {seller.logo ? (
                <img src={seller.logo} alt={seller.storeName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-4xl">🏪</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{seller.storeName}</h1>
              <p className="text-gray-500 mt-1">{seller.description || 'Tidak ada deskripsi'}</p>
              {seller.address && <p className="text-sm text-gray-500 mt-2">{seller.address}</p>}
            </div>
          </div>
          {seller.whatsapp && (
            <a
              href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Hubungi via WhatsApp
            </a>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Produk dari {seller.storeName}</h2>
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Belum ada produk</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="aspect-square bg-gray-100">
                  {product.images[0] ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                  <p className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}