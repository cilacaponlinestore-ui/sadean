'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { sellersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SellerStorePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [store, setStore] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    address: '',
    phone: '',
    whatsapp: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadStore = async () => {
      try {
        const response = await sellersApi.getMyStore();
        setStore(response.data);
        setFormData({
          storeName: response.data.storeName || '',
          description: response.data.description || '',
          address: response.data.address || '',
          phone: response.data.phone || '',
          whatsapp: response.data.whatsapp || '',
        });
      } catch (error) {
        // Store not found, redirect to register
        router.push('/seller/register');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'seller') {
      loadStore();
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await sellersApi.update(store.id, formData);
      toast.success('Toko berhasil diperbarui');
      setEditing(false);
      // Reload store data
      const response = await sellersApi.getMyStore();
      setStore(response.data);
    } catch (error) {
      toast.error('Gagal memperbarui toko');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat data toko...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">Profil Toko</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Kembali
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Store Info */}
          <div className="flex items-start gap-6 mb-6 pb-6 border-b">
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.storeName}
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <span className="text-3xl">🏪</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{store.storeName}</h2>
              <p className="text-gray-500 text-sm">{store.description || 'Belum ada deskripsi'}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    store.isVerified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {store.isVerified ? '✓ Terverifikasi' : 'Menunggu Verifikasi'}
                </span>
              </div>
            </div>
          </div>

          {/* Store Form */}
          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Toko <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Toko
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Toko
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor HP Toko
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="628xxxxxxxxxx"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      storeName: store.storeName || '',
                      description: store.description || '',
                      address: store.address || '',
                      phone: store.phone || '',
                      whatsapp: store.whatsapp || '',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nama Toko
                  </label>
                  <p className="text-gray-900">{store.storeName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Deskripsi
                  </label>
                  <p className="text-gray-900">{store.description || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Alamat
                  </label>
                  <p className="text-gray-900">{store.address || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Nomor HP
                    </label>
                    <p className="text-gray-900">{store.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      WhatsApp
                    </label>
                    <p className="text-gray-900">{store.whatsapp || '-'}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Edit Profil Toko
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}