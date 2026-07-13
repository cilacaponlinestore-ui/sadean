'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  seller: { storeName: string };
  category: { name: string };
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: { page: number; totalPages: number; total: number };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const loadProducts = async (currentPage = page) => {
    try {
      const response = await api.get<ProductsResponse>('/admin/products', {
        params: { page: currentPage, limit: 20 },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (productId: string) => {
    try {
      const response = await api.patch<Pick<Product, 'id' | 'isActive'>>(
        `/admin/products/${productId}/toggle-active`,
      );
      setProducts((current) =>
        current.map((product) =>
          product.id === response.data.id
            ? { ...product, isActive: response.data.isActive }
            : product,
        ),
      );
      toast.success('Status produk diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui status');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Produk berhasil dihapus');
      if (products.length === 1 && page > 1) setPage(page - 1);
      else loadProducts();
    } catch (error) {
      toast.error('Produk tidak dapat dihapus');
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
      <h1 className="text-2xl font-bold mb-6">Kelola Produk</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Produk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Toko
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
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category?.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{product.seller?.storeName}</td>
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
                  <button
                    onClick={() => handleToggleActive(product.id)}
                    className={`px-3 py-1 text-sm rounded ${
                      product.isActive
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {product.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-4">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Sebelumnya</button>
          <span className="text-sm text-gray-600">Halaman {page} dari {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Berikutnya</button>
        </div>
      )}
    </div>
  );
}
