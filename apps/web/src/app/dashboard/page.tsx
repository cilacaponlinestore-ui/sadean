'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { sellersApi, adminApi } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface AdminDashboardData {
  totalUsers: number;
  totalBuyers: number;
  totalSellers: number;
  totalUmkm: number;
  totalProducts: number;
  totalOrders: number;
  todayOrders: number;
  latestProducts: Array<{
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    seller: { storeName: string };
  }>;
  pendingSellers: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      try {
        if (user.role === 'seller') {
          const response = await sellersApi.getDashboard();
          setDashboardData(response.data);
        } else if (user.role === 'admin') {
          const response = await adminApi.getDashboard();
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success('Berhasil logout');
    router.push('/login');
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
            <div>
              <h1 className="text-2xl font-bold text-primary-600">SADEAN</h1>
              <p className="text-sm text-gray-500">Dashboard {user.role === 'seller' ? 'Penjual' : 'Admin'}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{user.name}</span>
              {user.role === 'seller' && (
                <Link href="/seller/products" className="text-sm text-primary-600 hover:text-primary-700">
                  Panel Toko
                </Link>
              )}
              {user.role === 'admin' && (
                <Link href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
                  Panel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'seller' && (
          <SellerDashboard data={dashboardData} loading={loading} />
        )}
        
        {user.role === 'admin' && (
          <AdminDashboard data={dashboardData} loading={loading} />
        )}
        
        {user.role === 'buyer' && (
          <BuyerDashboard user={user} />
        )}
      </main>
    </div>
  );
}

function SellerDashboard({ data, loading }: { data: any; loading: boolean }) {
  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Penjual</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Produk</h3>
          <p className="text-2xl font-bold text-gray-900">
            {data?.stats?.totalProducts || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Order</h3>
          <p className="text-2xl font-bold text-gray-900">
            {data?.stats?.totalOrders || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Order Baru</h3>
          <p className="text-2xl font-bold text-orange-500">
            {data?.stats?.pendingOrders || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Pendapatan</h3>
          <p className="text-2xl font-bold text-green-600">
            Rp {(data?.stats?.totalRevenue || 0).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/seller/products"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">📦</span>
            <span className="text-sm">Kelola Produk</span>
          </Link>
          <Link
            href="/seller/orders"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm">Lihat Order</span>
          </Link>
          <Link
            href="/seller/store"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">🏪</span>
            <span className="text-sm">Profil Toko</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">👤</span>
            <span className="text-sm">Profil Saya</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Order Terbaru</h3>
        {data?.recentOrders?.length > 0 ? (
          <div className="space-y-4">
            {data.recentOrders.map((order: any) => (
              <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.user.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Rp {order.total.toLocaleString('id-ID')}</p>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Belum ada order</p>
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ data, loading }: { data: AdminDashboardData | null; loading: boolean }) {
  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Dashboard Admin</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          ['Total User', data?.totalUsers],
          ['Total Buyer', data?.totalBuyers],
          ['Akun Seller', data?.totalSellers],
          ['Total UMKM', data?.totalUmkm],
          ['Total Produk', data?.totalProducts],
          ['Total Order', data?.totalOrders],
          ['Order Hari Ini', data?.todayOrders],
          ['Menunggu Verifikasi', data?.pendingSellers],
        ].map(([label, value]) => (
          <div key={String(label)} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">{label}</h3>
            <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Produk Terbaru</h3>
        {data?.latestProducts?.length ? data.latestProducts.map((product) => (
          <div key={product.id} className="flex justify-between py-3 border-b last:border-0">
            <div><p className="font-medium">{product.name}</p><p className="text-sm text-gray-500">{product.seller.storeName}</p></div>
            <div className="text-right"><p>Rp {Number(product.price).toLocaleString('id-ID')}</p><p className="text-xs text-gray-500">{product.isActive ? 'Aktif' : 'Nonaktif'}</p></div>
          </div>
        )) : <p className="text-gray-500">Belum ada produk</p>}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">👥</span>
            <span className="text-sm">Kelola User</span>
          </Link>
          <Link
            href="/admin/sellers"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">🏪</span>
            <span className="text-sm">Verifikasi UMKM</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">📦</span>
            <span className="text-sm">Kelola Produk</span>
          </Link>
          <Link
            href="/admin/banners"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
          >
            <span className="text-2xl mb-2">🖼️</span>
            <span className="text-sm">Kelola Banner</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BuyerDashboard({ user }: { user: any }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Selamat Datang, {user.name}!</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Mulai Belanja</h3>
        <p className="text-gray-500 mb-4">
          Temukan produk lokal berkualitas dari UMKM Cilacap.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Lihat Produk
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/orders"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium mb-2">📦 Pesanan Saya</h3>
          <p className="text-gray-500">Lihat riwayat pesanan</p>
        </Link>
        <Link
          href="/profile"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-medium mb-2">👤 Profil Saya</h3>
          <p className="text-gray-500">Kelola akun Anda</p>
        </Link>
      </div>
    </div>
  );
}
