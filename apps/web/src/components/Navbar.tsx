'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, loadUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const links = [{ href: '/products', label: 'Produk' }, { href: '/sellers', label: 'Toko Lokal' }];
  const active = (href: string) => pathname.startsWith(href);

  useEffect(() => { loadUser(); }, [loadUser]);

  const handleLogout = async () => { await logout(); router.push('/login'); };
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-canvas/90 backdrop-blur-xl">
      <nav className="page-container flex h-[72px] items-center justify-between gap-4" aria-label="Navigasi utama">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-lg font-black text-white">S</span>
          <span><span className="block text-lg font-black leading-none tracking-tight text-ink">SADEAN</span><span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[.16em] text-gray-500 sm:block">Dodolane Wong Cilacap</span></span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">{links.map((link) => <Link key={link.href} href={link.href} className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold ${active(link.href) ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-white hover:text-ink'}`}>{link.label}</Link>)}</div>
        <div className="hidden items-center gap-2 md:flex">
          {isLoading ? <div className="h-10 w-24 animate-pulse rounded-xl bg-black/5" /> : isAuthenticated && user ? <>
            {user.role === 'buyer' && <Link href="/cart" aria-label="Keranjang" className="focus-ring rounded-xl border border-black/10 bg-white p-2.5 text-gray-600 hover:text-primary-700"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 2h12m-8 4a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg></Link>}
            <Link href={user.role === 'buyer' ? '/profile' : '/dashboard'} className="focus-ring flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-bold"><span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-primary-100 text-primary-800">{user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user.name.charAt(0)}</span><span className="max-w-28 truncate">{user.name}</span></Link>
            <button onClick={handleLogout} className="focus-ring rounded-xl px-3 py-2 text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600">Keluar</button>
          </> : <><Link href="/login" className="focus-ring rounded-xl px-4 py-2.5 text-sm font-bold text-primary-800 hover:bg-primary-50">Masuk</Link><Link href="/register" className="focus-ring rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-primary-800">Daftar</Link></>}
        </div>
        <button aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(!open)} className="focus-ring rounded-xl border border-black/10 bg-white p-2.5 text-ink md:hidden"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg></button>
      </nav>
      {open && <div className="border-t border-black/5 bg-white p-4 md:hidden"><div className="page-container space-y-1">{[{ href: '/', label: 'Beranda' }, ...links].map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-bold text-gray-700 hover:bg-primary-50">{link.label}</Link>)}{isAuthenticated && user ? <>{user.role === 'buyer' && <><Link href="/cart" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-bold text-gray-700">Keranjang</Link><Link href="/orders" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-bold text-gray-700">Pesanan</Link></>}<Link href={user.role === 'buyer' ? '/profile' : '/dashboard'} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-bold text-gray-700">Akun saya</Link><button onClick={handleLogout} className="w-full rounded-xl px-4 py-3 text-left font-bold text-red-600">Keluar</button></> : <div className="grid grid-cols-2 gap-2 pt-3"><Link href="/login" className="rounded-xl border border-black/10 px-4 py-3 text-center font-bold">Masuk</Link><Link href="/register" className="rounded-xl bg-ink px-4 py-3 text-center font-bold text-white">Daftar</Link></div>}</div></div>}
    </header>
  );
}
