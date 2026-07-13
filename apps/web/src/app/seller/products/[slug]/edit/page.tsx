'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import ImageUploader, { type ImageItem } from '@/components/ImageUploader';
import toast from 'react-hot-toast';

interface Category { id: string; name: string }

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productId, setProductId] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', unit: 'pcs', categoryId: '',
  });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/slug/${params.slug}`);
      const product = response.data;
      setProductId(product.id);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        unit: product.unit || 'pcs',
        categoryId: product.categoryId || '',
      });
      if (product.images?.length) {
        setImages(product.images.map((img: any) => ({
          id: img.id,
          url: img.url,
          isPrimary: img.isPrimary,
        })));
      }
    } catch (error) {
      toast.error('Gagal memuat produk');
      router.push('/seller/products');
    } finally { setLoading(false) }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data);
    } catch { toast.error('Gagal memuat kategori') }
  };

  const handleDeleteExisting = useCallback((imageId: string) => {
    setDeletedImageIds((prev) => [...prev, imageId]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const id of deletedImageIds) {
        await api.delete(`/products/${productId}/images/${id}`);
      }

      await api.put(`/products/${productId}`, {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
      });

      for (const img of images) {
        if (!img.id) {
          await api.post(`/products/${productId}/images`, {
            imageUrl: img.url,
            isPrimary: img.isPrimary,
          });
        }
      }

      toast.success('Produk berhasil diperbarui');
      router.push('/seller/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui produk');
    } finally { setSaving(false) }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>
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

        <ImageUploader images={images} onChange={setImages} onDeleteExisting={handleDeleteExisting} />

        <div className="flex gap-4 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
        </div>
      </form>
    </div>
  );
}
