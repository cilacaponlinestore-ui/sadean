'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import toast from 'react-hot-toast';

interface Category { id: string; name: string }
interface ImageItem { url: string; isPrimary: boolean }

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', unit: 'pcs', categoryId: '',
  });
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => { loadCategories() }, []);

  const loadCategories = async () => {
    try {
      const r = await api.get('/categories');
      setCategories(r.data.data || r.data);
    } catch { toast.error('Gagal memuat kategori') }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const r = await api.post('/products', {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      });
      const productId = r.data.id;

      for (const img of images) {
        await api.post(`/products/${productId}/images`, {
          imageUrl: img.url,
          isPrimary: img.isPrimary,
        });
      }

      toast.success('Produk berhasil ditambahkan');
      router.push('/seller/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan produk');
    } finally { setLoading(false) }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk <span className="text-red-500">*</span></label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows={4} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) <span className="text-red-500">*</span></label>
            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" min="0" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stok <span className="text-red-500">*</span></label>
            <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" min="0" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
            <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
          <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required>
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>

        <ImageUploader images={images} onChange={setImages} />

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
        </div>
      </form>
    </div>
  );
}
