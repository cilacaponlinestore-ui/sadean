'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const closeAll = () => { setMobileOpen(false); setDropdownOpen(false) };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">SADEAN</span>
            <span className="hidden sm:block text-xs text-gray-500">Dodolane Wong Cilacap</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-gray-600 hover:text-primary-600" onClick={closeAll}>Produk</Link>
            <Link href="/sellers" className="text-gray-600 hover:text-primary-600" onClick={closeAll}>Toko</Link>
            {isAuthenticated && user?.role === 'buyer' && (
              <Link href="/orders" className="text-gray-600 hover:text-primary-600" onClick={closeAll}>Pesanan</Link>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 hover:text-primary-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                {user.role === 'buyer' && (
                  <>
                    <Link href="/favorites" className="text-gray-600 hover:text-red-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </Link>
                    <Link href="/cart" className="text-gray-600 hover:text-primary-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </Link>
                  </>
                )}
                <div className="relative">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-primary-600">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="hidden sm:block">{user.name}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Favorit</Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Pesanan</Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Profil Saya</Link>
                      {user.role === 'seller' && (
                        <>
                          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                          <Link href="/seller/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Produk Saya</Link>
                          <Link href="/seller/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Pesanan Masuk</Link>
                          <Link href="/seller/store" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Profil Toko</Link>
                        </>
                      )}
                      {user.role === 'admin' && (
                        <>
                          <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                          <Link href="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Kelola User</Link>
                          <Link href="/admin/sellers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Moderasi UMKM</Link>
                          <Link href="/admin/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Kelola Produk</Link>
                          <Link href="/admin/banners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Kelola Banner</Link>
                        </>
                      )}
                      <button onClick={() => { setDropdownOpen(false); handleLogout() }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Keluar</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700">Masuk</Link>
                <Link href="/register" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">Daftar</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link href="/" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Beranda</Link>
          <Link href="/products" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Produk</Link>
          <Link href="/sellers" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Toko</Link>
          {isAuthenticated && user ? (
            <>
              <hr />
              <Link href="/favorites" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Favorit</Link>
              <Link href="/orders" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Pesanan</Link>
              <Link href="/profile" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Profil Saya</Link>
              {user.role === 'buyer' && <Link href="/cart" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Keranjang</Link>}
              {user.role === 'seller' && (
                <>
                  <Link href="/dashboard" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Dashboard</Link>
                  <Link href="/seller/products" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Produk Saya</Link>
                  <Link href="/seller/orders" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Pesanan Masuk</Link>
                  <Link href="/seller/store" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Profil Toko</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link href="/dashboard" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Dashboard</Link>
                  <Link href="/admin/users" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Kelola User</Link>
                  <Link href="/admin/sellers" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Moderasi UMKM</Link>
                  <Link href="/admin/products" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Kelola Produk</Link>
                  <Link href="/admin/banners" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Kelola Banner</Link>
                </>
              )}
              <hr />
              <button onClick={() => { closeAll(); handleLogout() }} className="w-full text-left text-red-600 hover:text-red-700">Keluar</button>
            </>
          ) : (
            <>
              <hr />
              <Link href="/login" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Masuk</Link>
              <Link href="/register" className="block text-gray-700 hover:text-primary-600" onClick={closeAll}>Daftar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
