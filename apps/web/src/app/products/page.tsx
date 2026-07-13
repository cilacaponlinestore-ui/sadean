'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { imageUrl: string }[];
  seller: { storeName: string };
  category: { name: string };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const initialLoad = useRef(true);

  const loadProducts = async (q?: string, cat?: string) => {
    try {
      setLoading(true);
      const params: any = {};
      if (q) params.search = q;
      if (cat) params.category = cat;
      const response = await api.get('/products', { params });
      setProducts(response.data.products || []);
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data || response.data);
      } catch { toast.error('Gagal memuat kategori') }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialLoad.current) { initialLoad.current = false; return }
    const t = setTimeout(() => loadProducts(search, category), 300);
    return () => clearTimeout(t);
  }, [search, category]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Produk Lokal Cilacap</h1>
          <p className="text-gray-500">Temukan produk berkualitas dari UMKM Cilacap</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex gap-4">
            <input type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <select value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Memuat produk...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden group">
                <div className="aspect-square bg-gray-100">
                  {product.images[0] ? (
                    <img src={product.images[0].imageUrl} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary-600 font-medium mb-1">{product.category?.name}</p>
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.seller?.storeName}</p>
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
