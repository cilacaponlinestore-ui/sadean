'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { sellersApi, adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!isLoading && !isAuthenticated) router.push('/login'); }, [isLoading, isAuthenticated, router]);
  useEffect(() => { if (!user) return; if (user.role === 'buyer') { router.replace('/'); return; } (user.role === 'seller' ? sellersApi.getDashboard() : adminApi.getDashboard()).then((r) => setData(r.data)).catch(() => toast.error('Gagal memuat dashboard')).finally(() => setLoading(false)); }, [user]);

  const handleLogout = async () => { await logout(); toast.success('Berhasil logout'); router.push('/login'); };

  if (isLoading || !user) return <div className="flex min-h-screen items-center justify-center bg-canvas"><div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /></div>;
  if (loading) return <div className="min-h-screen bg-canvas"><div className="page-container py-20 text-center font-bold text-gray-500">Memuat dashboard...</div></div>;

  return <div className="min-h-screen bg-canvas">
    <header className="sticky top-0 z-40 border-b border-black/5 bg-canvas/90 backdrop-blur-xl"><div className="page-container flex h-16 items-center justify-between"><Link href="/" className="focus-ring flex items-center gap-3"><img src="/icon.svg" alt="SADEAN" className="h-9 w-9" /><span className="text-lg font-black tracking-tight text-ink">SADEAN</span></Link><div className="flex items-center gap-3"><span className="hidden text-sm font-bold text-gray-700 sm:block">{user.name}</span><button onClick={handleLogout} className="focus-ring rounded-xl px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">Keluar</button></div></div></header>
    <main className="page-container py-8 sm:py-12">
      <p className="eyebrow">Dashboard {user.role === 'seller' ? 'Penjual' : 'Admin'}</p><h1 className="mt-2 text-3xl font-black tracking-tight text-ink">{user.role === 'seller' ? 'Toko {user.name}' : 'Panel Admin'}</h1>

      {user.role === 'seller' && <SellerDashboard data={data} />}
      {user.role === 'admin' && <AdminDashboard data={data} />}
    </main>
  </div>;
}

function StatCard({ label, value, color = 'text-ink' }: { label: string; value: string | number; color?: string }) {
  return <div className="surface p-5"><p className="text-sm font-bold text-gray-500">{label}</p><p className={`mt-2 text-2xl font-black tracking-tight ${color}`}>{value}</p></div>;
}

function SellerDashboard({ data }: { data: any }) {
  if (!data) return <div className="surface mt-8 py-14 text-center font-extrabold text-ink">Belum ada data</div>;
  return <div className="mt-8 space-y-8">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><StatCard label="Total Produk" value={data.stats?.totalProducts || 0} /><StatCard label="Total Order" value={data.stats?.totalOrders || 0} /><StatCard label="Order Baru" value={data.stats?.pendingOrders || 0} color="text-orange-600" /><StatCard label="Pendapatan" value={rupiah.format(data.stats?.totalRevenue || 0)} color="text-primary-700" /></div>
    <div className="grid gap-4 sm:grid-cols-4">{[
      { href: '/seller/products', label: 'Kelola Produk' }, { href: '/seller/orders', label: 'Lihat Order' }, { href: '/seller/store', label: 'Profil Toko' }, { href: '/profile', label: 'Profil Saya' },
    ].map((a) => <Link key={a.href} href={a.href} className="focus-ring surface flex items-center justify-center p-4 text-sm font-bold text-ink transition hover:-translate-y-1">{a.label}</Link>)}</div>
    <div className="surface p-5"><h2 className="mb-4 font-black text-ink">Order Terbaru</h2>{data.recentOrders?.length ? <div className="space-y-3">{data.recentOrders.map((o: any) => <Link key={o.id} href={`/orders/${o.id}`} className="flex items-center justify-between rounded-xl border border-black/5 p-3 transition hover:bg-canvas focus-ring"><div><p className="font-extrabold text-ink">{o.orderNumber}</p><p className="text-sm text-gray-500">{o.user?.name}</p></div><div className="text-right"><p className="font-bold">{rupiah.format(o.total)}</p><p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{o.status}</p></div></Link>)}</div> : <p className="py-6 text-center text-gray-500">Belum ada order</p>}</div>
  </div>;
}

function AdminDashboard({ data }: { data: any }) {
  if (!data) return <div className="surface mt-8 py-14 text-center font-extrabold text-ink">Belum ada data</div>;
  return <div className="mt-8 space-y-8">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Total User', data.totalUsers], ['Buyer', data.totalBuyers], ['Seller', data.totalSellers], ['UMKM', data.totalUmkm], ['Produk', data.totalProducts], ['Order', data.totalOrders], ['Order Hari Ini', data.todayOrders, 'text-primary-700'], ['Verifikasi', data.pendingSellers, 'text-orange-600']].map(([l, v, c]) => <StatCard key={String(l)} label={String(l)} value={v || 0} color={c as string || 'text-ink'} />)}</div>
    <div className="grid gap-4 sm:grid-cols-5">{[
      { href: '/admin/users', label: 'Users' }, { href: '/admin/sellers', label: 'Verifikasi UMKM' }, { href: '/admin/products', label: 'Produk' }, { href: '/admin/banners', label: 'Banner' }, { href: '/profile', label: 'Profil' },
    ].map((a) => <Link key={a.href} href={a.href} className="focus-ring surface flex items-center justify-center p-4 text-sm font-bold text-ink transition hover:-translate-y-1">{a.label}</Link>)}</div>
  </div>;
}
