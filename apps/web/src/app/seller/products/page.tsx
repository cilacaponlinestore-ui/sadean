'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  images: { imageUrl: string }[];
  isActive: boolean;
  category: { name: string };
}

export default function SellerProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products/my-products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success('Produk berhasil dihapus');
      loadProducts();
    } catch (error) {
      toast.error('Gagal menghapus produk');
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
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produk Saya</h1>
        <Link
          href="/seller/products/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Tambah Produk
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada produk</p>
          <Link
            href="/seller/products/new"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Tambah Produk Pertama
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.images[0] ? (
                          <img
                            src={product.images[0].imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        product.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/seller/products/${product.slug}/edit`}
                        className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}