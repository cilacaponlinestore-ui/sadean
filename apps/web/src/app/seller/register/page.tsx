'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { sellersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import type { ImageItem } from '@/components/ImageUploader';

export default function SellerRegisterPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    address: '',
    phone: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = { ...formData };
      if (uploadedLogo.length > 0) {
        payload.logo = uploadedLogo[0].url;
      }
      await sellersApi.create(payload);
      toast.success('Toko berhasil didaftarkan!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mendaftarkan toko';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-primary-600">Daftarkan Toko Anda</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Informasi Toko</h2>
            <p className="text-sm text-gray-500">
              Lengkapi informasi toko Anda untuk mulai berjualan di SADEAN.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <ImageUploader
                  images={uploadedLogo}
                  onChange={setUploadedLogo}
                  maxImages={1}
                  folder="logos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Toko <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan nama toko"
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
                  placeholder="Ceritakan tentang toko Anda..."
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
                  placeholder="Alamat lengkap toko"
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
                    placeholder="081234567890"
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
                    placeholder="6281234567890"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 628xxxxxxxxxx
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Catatan:</strong> Toko Anda akan diverifikasi oleh admin sebelum dapat mulai berjualan.
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Mendaftarkan...' : 'Daftarkan Toko'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
