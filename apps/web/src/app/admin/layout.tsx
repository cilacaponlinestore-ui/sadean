'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

const adminLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/sellers', label: 'UMKM', icon: '🏪' },
  { href: '/admin/products', label: 'Produk', icon: '📦' },
  { href: '/admin/banners', label: 'Banner', icon: '🖼️' },
  { href: '/profile', label: 'Profil Saya', icon: '👤' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleLogout = async () => {
    await logout();
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
    <div className="min-h-screen bg-canvas">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-canvas/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                SADEAN
              </Link>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{user.name}</span>
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-72px)] w-64 border-r border-black/5 bg-white/70 md:block">
          <nav className="p-4">
            <ul className="space-y-1">
              {adminLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 pb-24 sm:p-6 md:pb-6">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Navigasi admin">{adminLinks.slice(0, 5).map((link) => <Link key={link.href} href={link.href} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)) ? 'text-primary-700' : 'text-gray-500'}`}><span className="text-lg leading-none">{link.icon}</span>{link.label}</Link>)}</nav>
    </div>
  );
}
