'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import type { ImageItem } from '@/components/ImageUploader';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string | null;
  isActive: boolean;
  sortOrder: number;
}

const emptyForm = {
  title: '',
  link: '',
  sortOrder: 0,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [uploadedImage, setUploadedImage] = useState<ImageItem[]>([]);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await api.get<Banner[]>('/banners/admin');
      setBanners(response.data);
    } catch (error) {
      toast.error('Gagal memuat banner');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImage.length === 0) {
      toast.error('Pilih gambar banner terlebih dahulu');
      return;
    }
    try {
      const payload = { ...formData, imageUrl: uploadedImage[0].url, link: formData.link || undefined };
      if (editingId) {
        await api.put(`/banners/${editingId}`, payload);
      } else {
        await api.post('/banners', payload);
      }
      toast.success(editingId ? 'Banner berhasil diperbarui' : 'Banner berhasil ditambahkan');
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      setUploadedImage([]);
      loadBanners();
    } catch (error) {
      toast.error(editingId ? 'Gagal memperbarui banner' : 'Gagal menambahkan banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus banner ini?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner berhasil dihapus');
      loadBanners();
    } catch (error) {
      toast.error('Gagal menghapus banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      link: banner.link || '',
      sortOrder: banner.sortOrder,
    });
    setUploadedImage([{ url: banner.imageUrl, isPrimary: true }]);
    setShowForm(true);
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await api.put(`/banners/${banner.id}`, { isActive: !banner.isActive });
      toast.success('Status banner diperbarui');
      loadBanners();
    } catch (error) {
      toast.error('Gagal memperbarui status');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black tracking-tight text-ink">Kelola Banner</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(emptyForm);
            setUploadedImage([]);
          }}
          className="focus-ring rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-800"
        >
          {showForm ? 'Batal' : '+ Tambah Banner'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="surface p-5 sm:p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Judul</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="focus-ring h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">URL Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="focus-ring h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Urutan</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="focus-ring h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none"
                min="0"
              />
            </div>
          </div>
          <div className="mt-4">
            <ImageUploader
              images={uploadedImage}
              onChange={setUploadedImage}
              maxImages={1}
              folder="banners"
            />
          </div>
          <button
            type="submit"
            className="focus-ring mt-4 h-12 rounded-xl bg-primary-700 px-6 font-bold text-white hover:bg-primary-800"
          >
            {editingId ? 'Perbarui' : 'Simpan'}
          </button>
        </form>
      )}

      {/* Banner List */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="surface flex items-center gap-4 p-4">
            <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-[#eee9df]">
              {banner.imageUrl && (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-ink">{banner.title}</h3>
              {banner.link && <p className="mt-0.5 truncate text-sm text-gray-500">{banner.link}</p>}
              <p className="mt-0.5 text-xs text-gray-400">Urutan: {banner.sortOrder}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => handleToggleActive(banner)}
                className={`focus-ring rounded-full px-3 py-1 text-xs font-bold ${
                  banner.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {banner.isActive ? 'Aktif' : 'Nonaktif'}
              </button>
              <button
                onClick={() => handleEdit(banner)}
                className="focus-ring rounded-xl px-3 py-1.5 text-sm font-bold text-primary-700 hover:bg-primary-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="focus-ring rounded-xl px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="surface py-14 text-center">
            <p className="font-extrabold text-ink">Belum ada banner</p>
          </div>
        )}
      </div>
    </div>
  );
}
