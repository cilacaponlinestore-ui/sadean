'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import toast from 'react-hot-toast';

interface Category { id: string; name: string }
interface ImageItem { url: string; isPrimary: boolean }

const fi = 'focus-ring mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', unit: 'pcs', categoryId: '' });
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => { api.get('/categories').then((r) => setCategories(r.data.data || r.data)).catch(() => toast.error('Gagal memuat kategori')); }, []);

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { const r = await api.post('/products', { ...form, price: parseInt(form.price), stock: parseInt(form.stock) }); for (const img of images) await api.post(`/products/${r.data.id}/images`, { imageUrl: img.url, isPrimary: img.isPrimary }); toast.success('Produk ditambahkan'); router.push('/seller/products'); } catch (e: any) { toast.error(e.response?.data?.message || 'Gagal menambahkan produk'); } finally { setLoading(false); } };

  return <div className="max-w-2xl"><h1 className="text-2xl font-black tracking-tight text-ink mb-6">Tambah Produk Baru</h1>
    <form onSubmit={submit} className="surface p-5 sm:p-6 space-y-5">
      <div><label className="text-sm font-bold text-gray-700">Nama Produk <span className="text-red-500">*</span></label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fi} required /></div>
      <div><label className="text-sm font-bold text-gray-700">Deskripsi</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fi} py-3 min-h-[100px]`} rows={4} /></div>
      <div className="grid grid-cols-3 gap-4"><div><label className="text-sm font-bold text-gray-700">Harga (Rp) <span className="text-red-500">*</span></label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={fi} min="0" required /></div><div><label className="text-sm font-bold text-gray-700">Stok <span className="text-red-500">*</span></label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={fi} min="0" required /></div><div><label className="text-sm font-bold text-gray-700">Satuan</label><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={fi} /></div></div>
      <div><label className="text-sm font-bold text-gray-700">Kategori <span className="text-red-500">*</span></label><select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={fi} required><option value="">Pilih Kategori</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <ImageUploader images={images} onChange={setImages} />
      <div className="flex gap-3 pt-2"><button disabled={loading} className="focus-ring h-12 rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800 disabled:opacity-50">{loading ? 'Menyimpan...' : 'Simpan Produk'}</button><button type="button" onClick={() => router.back()} className="focus-ring h-12 rounded-xl border border-black/10 bg-white px-6 font-bold hover:bg-canvas">Batal</button></div>
    </form>
  </div>;
}
