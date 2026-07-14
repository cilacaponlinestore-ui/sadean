'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import ImageUploader, { type ImageItem } from '@/components/ImageUploader';
import toast from 'react-hot-toast';

interface Category { id: string; name: string }

const fi = 'focus-ring mt-2 h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none';

export default function EditProductPage() {
  const router = useRouter();
  const p = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productId, setProductId] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', unit: 'pcs', categoryId: '' });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  useEffect(() => { load(); api.get('/categories').then((r) => setCategories(r.data.data || r.data)).catch(() => {}); }, []);

  const load = async () => { try { const r = await api.get(`/products/slug/${p.slug}`); const d = r.data; setProductId(d.id); setForm({ name: d.name, description: d.description || '', price: d.price.toString(), stock: d.stock.toString(), unit: d.unit || 'pcs', categoryId: d.categoryId || '' }); if (d.images?.length) setImages(d.images.map((i: any) => ({ id: i.id, url: i.url, isPrimary: i.isPrimary }))); } catch { toast.error('Gagal memuat produk'); router.push('/seller/products'); } finally { setLoading(false); } };

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { for (const id of deletedIds) await api.delete(`/products/${productId}/images/${id}`); await api.put(`/products/${productId}`, { ...form, price: parseInt(form.price), stock: parseInt(form.stock) }); for (const img of images) { if (!img.id) await api.post(`/products/${productId}/images`, { imageUrl: img.url, isPrimary: img.isPrimary }); } toast.success('Produk diperbarui'); router.push('/seller/products'); } catch (e: any) { toast.error(e.response?.data?.message || 'Gagal memperbarui produk'); } finally { setSaving(false); } };

  if (loading) return <div className="py-14 text-center font-bold text-gray-500">Memuat produk...</div>;

  return <div className="max-w-2xl"><h1 className="text-2xl font-black tracking-tight text-ink mb-6">Edit Produk</h1>
    <form onSubmit={submit} className="surface p-5 sm:p-6 space-y-5">
      <div><label className="text-sm font-bold text-gray-700">Nama Produk <span className="text-red-500">*</span></label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fi} required /></div>
      <div><label className="text-sm font-bold text-gray-700">Deskripsi</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fi} py-3 min-h-[100px]`} rows={4} /></div>
      <div className="grid grid-cols-3 gap-4"><div><label className="text-sm font-bold text-gray-700">Harga (Rp) <span className="text-red-500">*</span></label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={fi} min="0" required /></div><div><label className="text-sm font-bold text-gray-700">Stok <span className="text-red-500">*</span></label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={fi} min="0" required /></div><div><label className="text-sm font-bold text-gray-700">Satuan</label><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={fi} /></div></div>
      <div><label className="text-sm font-bold text-gray-700">Kategori <span className="text-red-500">*</span></label><select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={fi} required><option value="">Pilih Kategori</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <ImageUploader images={images} onChange={setImages} onDeleteExisting={(id) => setDeletedIds((p) => [...p, id])} />
      <div className="flex gap-3 pt-2"><button disabled={saving} className="focus-ring h-12 rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button><button type="button" onClick={() => router.back()} className="focus-ring h-12 rounded-xl border border-black/10 bg-white px-6 font-bold hover:bg-canvas">Batal</button></div>
    </form>
  </div>;
}
