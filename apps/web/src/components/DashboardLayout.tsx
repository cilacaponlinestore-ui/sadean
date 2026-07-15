'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { LogoutButton } from '@/components/LogoutButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Image from 'next/image';

export interface NavLink {
  href: string;
  label: string;
  icon: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  links: NavLink[];
  role: 'admin' | 'seller';
}

export default function DashboardLayout({ children, links, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuthGuard(role);

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-canvas/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3"><Image src="/logo.png" alt="SADEAN" className="h-9 w-9 rounded-xl object-cover"/><span className="text-xl font-black text-primary-600">SADEAN</span></Link>
              <span className={`px-2 py-1 text-xs font-medium rounded ${role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-800'}`}>
                {role === 'admin' ? 'Admin' : 'Seller'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm font-bold text-gray-700 sm:block">{user.name}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-72px)] w-64 border-r border-black/5 bg-white/70 md:block">
          <nav className="p-4">
            <ul className="space-y-1">
              {links.map((link) => (
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

      {/* Mobile Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label={`Navigasi ${role}`}>
        {links.slice(0, 5).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)) ? 'text-primary-700' : 'text-gray-500'}`}
          >
            <span className="text-lg leading-none">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
