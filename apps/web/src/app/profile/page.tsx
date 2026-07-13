'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import type { ImageItem } from '@/components/ImageUploader';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, loadUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadedAvatar, setUploadedAvatar] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: any = { ...formData };
      if (uploadedAvatar.length > 0) {
        payload.avatar = uploadedAvatar[0].url;
      }
      await usersApi.updateProfile(payload);
      await loadUser();
      setEditing(false);
      setUploadedAvatar([]);
      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui profil');
    } finally {
      setSaving(false);
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">Profil Saya</h1>
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
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-6 border-b">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl text-primary-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                {user.role === 'seller' ? 'Penjual' : user.role === 'admin' ? 'Admin' : 'Pembeli'}
              </span>
            </div>
          </div>

          {/* Profile Form */}
          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <ImageUploader
                    images={uploadedAvatar}
                    onChange={setUploadedAvatar}
                    maxImages={1}
                    folder="avatars"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor HP
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="081234567890"
                  />
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
                    setUploadedAvatar([]);
                    setFormData({
                      name: user.name || '',
                      phone: user.phone || '',
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
                    Nama Lengkap
                  </label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nomor HP
                  </label>
                  <p className="text-gray-900">{user.phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Role
                  </label>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditing(true);
                  if (user.avatar) {
                    setUploadedAvatar([{ url: user.avatar, isPrimary: true }]);
                  }
                }}
                className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Edit Profil
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}