import Link from 'next/link';
import BannerSlider from '@/components/BannerSlider';
import Navbar from '@/components/Navbar';
import { ProductCard, SellerCard } from '@/components/MarketplaceCards';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function get(path: string, revalidate: number) {
  try {
    const response = await fetch(`${API}${path}`, { next: { revalidate } });
    return response.ok ? response.json() : null;
  } catch { return null; }
}

export default async function Home() {
  const [banners, productData, sellers] = await Promise.all([
    get('/banners', 60), get('/products?limit=8', 60), get('/sellers', 120),
  ]);
  const products = productData?.products || [];
  const sellerList = Array.isArray(sellers) ? sellers.slice(0, 4) : [];

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-black/5 bg-[#e8f5ee]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-clay-100/80 blur-3xl" />
          <div className="page-container relative grid gap-8 py-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-16">
            <div className="max-w-xl">
              <p className="eyebrow">Pasar digital Cilacap</p>
              <h1 className="mt-4 text-4xl font-black leading-[1.08] tracking-[-.04em] text-ink sm:text-5xl lg:text-6xl">Belanja dekat,<br /><span className="text-primary-700">dampaknya besar.</span></h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">Temukan rasa, karya, dan usaha terbaik dari wong Cilacap. Langsung dari UMKM lokal, tanpa ribet.</p>
              <form action="/products" className="mt-7 flex rounded-2xl border border-black/10 bg-white p-2 shadow-soft">
                <label htmlFor="home-search" className="sr-only">Cari produk lokal</label>
                <input id="home-search" name="search" placeholder="Cari lanting, batik, kerajinan..." className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none sm:text-base" />
                <button className="focus-ring rounded-xl bg-primary-700 px-5 py-3 text-sm font-bold text-white hover:bg-primary-800">Cari</button>
              </form>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-gray-600">
                <span>✓ UMKM terkurasi</span><span>✓ Kontak langsung</span><span>✓ Produk khas daerah</span>
              </div>
            </div>
            <div>{banners?.length ? <BannerSlider banners={banners} /> : <div className="surface flex min-h-[320px] items-end bg-gradient-to-br from-primary-800 via-primary-700 to-clay-600 p-8 text-white"><div><p className="text-sm font-bold uppercase tracking-[.2em] text-primary-100">Dari Cilacap untuk Indonesia</p><p className="mt-3 max-w-md text-3xl font-black">Produk lokal yang punya cerita.</p></div></div>}</div>
          </div>
        </section>

        <section className="page-container py-14 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div><p className="eyebrow">Pilihan hari ini</p><h2 className="section-heading mt-2">Produk unggulan Cilacap</h2><p className="mt-2 text-gray-500">Dikurasi dari toko lokal yang aktif.</p></div>
            <Link href="/products" className="focus-ring shrink-0 rounded-xl px-3 py-2 text-sm font-bold text-primary-700 hover:bg-primary-50">Lihat semua →</Link>
          </div>
          {products.length ? <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{products.map((product: any) => <ProductCard key={product.id} product={product} />)}</div> : <div className="surface py-14 text-center text-gray-500">Produk pilihan sedang disiapkan.</div>}
        </section>

        <section className="border-y border-black/5 bg-white/60 py-14 sm:py-20">
          <div className="page-container">
            <div className="mb-8 flex items-end justify-between gap-4"><div><p className="eyebrow">Kenal penjualnya</p><h2 className="section-heading mt-2">Toko lokal, wajah lokal</h2><p className="mt-2 text-gray-500">Belanja langsung dan tumbuh bersama pelaku usaha sekitar.</p></div><Link href="/sellers" className="focus-ring shrink-0 rounded-xl px-3 py-2 text-sm font-bold text-primary-700 hover:bg-primary-50">Jelajahi toko →</Link></div>
            {sellerList.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{sellerList.map((seller: any) => <SellerCard key={seller.id} seller={seller} />)}</div> : <div className="surface py-14 text-center text-gray-500">Toko lokal segera hadir.</div>}
          </div>
        </section>

        <section className="page-container py-14 sm:py-20">
          <div className="overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Punya usaha di Cilacap?</p><h2 className="mt-3 text-3xl font-black tracking-tight">Buka etalase digitalmu hari ini.</h2><p className="mt-3 max-w-2xl leading-7 text-white/70">Kelola produk, terima pesanan, dan lebih mudah ditemukan pembeli lokal.</p></div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0"><Link href="/seller/register" className="focus-ring rounded-xl bg-primary-500 px-6 py-3 text-center font-bold text-white hover:bg-primary-400">Daftar sebagai seller</Link><Link href="/products" className="focus-ring rounded-xl border border-white/20 px-6 py-3 text-center font-bold hover:bg-white/10">Lihat marketplace</Link></div>
          </div>
        </section>
      </main>
      <footer className="border-t border-black/5 bg-white py-8"><div className="page-container flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between"><p><strong className="text-ink">SADEAN</strong> · Dodolane Wong Cilacap</p><p>Marketplace lokal untuk ekonomi yang lebih dekat.</p></div></footer>
    </div>
  );
}
