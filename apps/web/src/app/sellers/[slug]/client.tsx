'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ProductCard } from '@/components/MarketplaceCards';

interface Seller {
  id: string; storeName: string; description: string; logo: string; address: string; phone: string; whatsapp: string;
}
interface Product {
  id: string; name: string; slug: string; price: number; images: { imageUrl: string }[]; seller: any; category: any; stock: number;
}

export function SellerDetailClient({ seller, products }: { seller: Seller | null; products: Product[] }) {
  if (!seller) return <div className="min-h-screen bg-canvas"><Navbar /><main className="page-container py-16 text-center font-black text-ink">Toko tidak ditemukan</main></div>;

  return <div className="min-h-screen bg-canvas"><Navbar />
    <main id="main-content" className="page-container py-8 sm:py-12">
      <Link href="/sellers" className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-700">← Kembali ke daftar toko</Link>

      <div className="surface overflow-hidden">
        <div className="bg-[#eee9df]/40 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-100 text-2xl font-black text-primary-800 shadow-soft">
              {seller.logo ? <img src={seller.logo} alt={seller.storeName} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : seller.storeName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="eyebrow">UMKM Terverifikasi</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">{seller.storeName}</h1>
              <p className="mt-3 leading-7 text-gray-600">{seller.description || 'Pelaku UMKM lokal dari Cilacap yang siap melayani pesanan Anda.'}</p>
              {seller.address && <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>{seller.address}</p>}
            </div>
          </div>
          {seller.whatsapp && <a href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${seller.storeName}, saya tertarik dengan produk Anda`)}`} target="_blank" rel="noopener noreferrer" className="focus-ring mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 font-bold text-sm text-white hover:bg-[#128C7E]"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.87 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.8.97h.01a7.94 7.94 0 0 0 6.86-11.9 7.9 7.9 0 0 0-1.27-1.65zM12.05 18.55h-.01a6.62 6.62 0 0 1-3.37-.93l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 0 1-1-3.46 6.64 6.64 0 0 1 6.6-6.62h.01A6.63 6.63 0 0 1 17.7 16.8a6.58 6.58 0 0 1-5.65 1.75zm3.63-4.96c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.12.13-.23.15-.43.05-.2-.1-.84-.3-1.6-.99-.59-.53-.99-1.18-1.1-1.37-.13-.2-.02-.31.08-.41.1-.09.22-.23.33-.35.1-.12.14-.2.2-.34.07-.13.04-.25-.02-.35-.05-.1-.44-1.05-.6-1.44-.16-.37-.32-.32-.44-.33-.11 0-.25-.01-.38-.01-.13 0-.34.05-.52.24-.17.2-.68.66-.68 1.62 0 .95.7 1.88.79 2.01.1.13 1.36 2.09 3.31 2.93.46.2.83.32 1.11.4.46.15.89.13 1.22.08.37-.06 1.17-.48 1.33-.95.16-.46.16-.86.12-.95-.05-.09-.17-.15-.37-.25z"/></svg>Hubungi via WhatsApp</a>}
        </div>
      </div>

      <div className="mt-12"><p className="eyebrow">Katalog</p><h2 className="section-heading mt-2">Produk dari {seller.storeName}</h2></div>
      {products.length ? <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="surface mt-6 py-16 text-center font-extrabold text-ink">Belum ada produk</div>}
    </main>
  </div>;
}
