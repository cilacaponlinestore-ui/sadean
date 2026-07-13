'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

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
  imageUrl: '',
  link: '',
  sortOrder: 0,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await api.get<Banner[]>('/banners/admin');
      setBanners(response.data);
    } catch (error) {
      console.error('Failed to load banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, link: formData.link || undefined };
      if (editingId) {
        await api.put(`/banners/${editingId}`, payload);
      } else {
        await api.post('/banners', payload);
      }
      toast.success(editingId ? 'Banner berhasil diperbarui' : 'Banner berhasil ditambahkan');
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
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
      imageUrl: banner.imageUrl,
      link: banner.link || '',
      sortOrder: banner.sortOrder,
    });
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
        <h1 className="text-2xl font-bold">Kelola Banner</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(emptyForm);
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {showForm ? 'Batal' : '+ Tambah Banner'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
          {formData.imageUrl && (
            <div className="mt-4 w-64 h-32 bg-gray-100 rounded-lg overflow-hidden">
              <img src={formData.imageUrl} alt="Preview banner" className="w-full h-full object-cover" />
            </div>
          )}
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {editingId ? 'Perbarui' : 'Simpan'}
          </button>
        </form>
      )}

      {/* Banner List */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                {banner.imageUrl && (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{banner.title}</h3>
                {banner.link && <p className="text-sm text-gray-500">{banner.link}</p>}
                <p className="text-xs text-gray-400">Urutan: {banner.sortOrder}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(banner)}
                  className={`px-3 py-1 text-sm rounded ${
                    banner.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {banner.isActive ? 'Aktif' : 'Nonaktif'}
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Belum ada banner</p>
          </div>
        )}
      </div>
    </div>
  );
}
