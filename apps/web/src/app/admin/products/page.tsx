'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Product { id: string; name: string; slug: string; price: number; stock: number; isActive: boolean; seller: { storeName: string }; category: { name: string }; createdAt: string; }
interface ProductsResponse { products: Product[]; pagination: { page: number; totalPages: number; total: number }; }

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { loadProducts(page); }, [page]);
  const loadProducts = async (p = page) => { try { const r = await api.get<ProductsResponse>('/admin/products', { params: { page: p, limit: 20 } }); setProducts(r.data.products); setTotalPages(r.data.pagination.totalPages); } catch { toast.error('Gagal memuat produk'); } finally { setLoading(false); } };

  const handleToggleActive = async (id: string) => { try { const r = await api.patch<Pick<Product, 'id' | 'isActive'>>(`/admin/products/${id}/toggle-active`); setProducts((c) => c.map((p) => p.id === r.data.id ? { ...p, isActive: r.data.isActive } : p)); toast.success('Status diperbarui'); } catch { toast.error('Gagal memperbarui'); } };

  const handleDelete = async (id: string) => { if (!confirm('Yakin ingin menghapus produk ini?')) return; try { await api.delete(`/admin/products/${id}`); toast.success('Produk dihapus'); if (products.length === 1 && page > 1) setPage(page - 1); else loadProducts(); } catch { toast.error('Gagal menghapus produk'); } };

  if (loading) return <div className="flex min-h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /></div>;

  return <div>
    <h1 className="text-2xl font-black tracking-tight text-ink mb-6">Kelola Produk</h1>
    <div className="surface overflow-hidden"><table className="min-w-full divide-y divide-black/5"><thead className="bg-canvas"><tr>
      {['Produk', 'Toko', 'Harga', 'Stok', 'Status', 'Aksi'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>)}
    </tr></thead><tbody className="divide-y divide-black/5">
      {products.map((p) => <tr key={p.id} className="hover:bg-canvas">
        <td className="px-4 py-3"><div><p className="text-sm font-extrabold text-ink">{p.name}</p><p className="text-xs text-gray-500">{p.category?.name}</p></div></td>
        <td className="px-4 py-3 text-sm text-gray-500">{p.seller?.storeName}</td>
        <td className="px-4 py-3 text-sm font-bold text-ink">{rupiah.format(p.price)}</td>
        <td className="px-4 py-3 text-sm">{p.stock}</td>
        <td className="px-4 py-3"><span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${p.isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>{p.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
        <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleToggleActive(p.id)} className={`focus-ring rounded-lg px-3 py-1.5 text-xs font-bold ${p.isActive ? 'text-red-600 hover:bg-red-50' : 'text-primary-700 hover:bg-primary-50'}`}>{p.isActive ? 'Nonaktifkan' : 'Aktifkan'}</button><button onClick={() => handleDelete(p.id)} className="focus-ring rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Hapus</button></div></td>
      </tr>)}
    </tbody></table></div>
    {totalPages > 1 && <div className="mt-4 flex items-center justify-end gap-3">
      <button disabled={page === 1} onClick={() => setPage(page - 1)} className="focus-ring rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold disabled:opacity-30">Sebelumnya</button>
      <span className="text-sm text-gray-500">Hal {page} / {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="focus-ring rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold disabled:opacity-30">Berikutnya</button>
    </div>}
  </div>;
}
