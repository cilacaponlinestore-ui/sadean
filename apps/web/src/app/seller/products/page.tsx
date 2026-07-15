'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Product { id: string; name: string; slug: string; price: number; stock: number; images: { imageUrl: string }[]; isActive: boolean; category: { name: string }; }

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProducts(); }, []);
  const loadProducts = async () => { try { const r = await api.get('/products/my-products'); setProducts(r.data); } catch { toast.error('Gagal memuat produk'); } finally { setLoading(false); } };
  const handleDelete = async (id: string) => { if (!confirm('Yakin ingin menghapus produk ini?')) return; try { await api.delete(`/products/${id}`); toast.success('Produk berhasil dihapus'); loadProducts(); } catch { toast.error('Gagal menghapus produk'); } };

  if (loading) return <div className="flex min-h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /></div>;

  return <div>
    <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-black tracking-tight text-ink">Produk Saya</h1><Link href="/seller/products/new" className="focus-ring rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-800">Tambah Produk</Link></div>
    {products.length === 0 ? (
      <div className="surface p-8 text-center"><p className="text-gray-500 mb-4">Belum ada produk</p><Link href="/seller/products/new" className="focus-ring inline-flex h-12 items-center rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800">Tambah Produk Pertama</Link></div>
    ) : (
      <div className="surface overflow-hidden"><table className="min-w-full divide-y divide-black/5"><thead className="bg-canvas"><tr>
        {['Produk', 'Harga', 'Stok', 'Status', 'Aksi'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>)}
      </tr></thead><tbody className="divide-y divide-black/5">
        {products.map((p) => <tr key={p.id} className="hover:bg-canvas">
          <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eee9df]">{p.images[0] ? <img src={p.images[0].imageUrl} alt={p.name} className="h-full w-full object-cover" /> : <span className="text-sm">📦</span>}</div><div><p className="text-sm font-extrabold text-ink">{p.name}</p><p className="text-xs text-gray-500">{p.category?.name}</p></div></div></td>
          <td className="px-4 py-3 text-sm font-bold text-ink">{rupiah.format(p.price)}</td>
          <td className="px-4 py-3 text-sm text-ink">{p.stock}</td>
          <td className="px-4 py-3"><span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${p.isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>{p.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
          <td className="px-4 py-3"><div className="flex gap-2"><Link href={`/seller/products/${p.slug}/edit`} className="focus-ring rounded-lg px-3 py-1.5 text-xs font-bold text-primary-700 hover:bg-primary-50">Edit</Link><button onClick={() => handleDelete(p.id)} className="focus-ring rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Hapus</button></div></td>
        </tr>)}
      </tbody></table></div>
    )}</div>;
}
