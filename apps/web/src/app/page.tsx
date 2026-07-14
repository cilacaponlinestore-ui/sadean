import Link from 'next/link';
import Navbar from '@/components/Navbar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const rp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

async function get(path: string, reval: number) { try { const r = await fetch(`${API}${path}`, { next: { revalidate: reval } }); return r.ok ? r.json() : null; } catch { return null; } }

export default async function Home() {
  const [banners, productData, sellers, catData] = await Promise.all([
    get('/banners', 60), get('/products?limit=8', 60), get('/sellers/public', 120), get('/categories', 300),
  ]);
  const products = productData?.products || [];
  const sellerList = Array.isArray(sellers) ? sellers.slice(0, 6) : [];
  const categories = (catData?.data || catData || []).slice(0, 7);

  const heroBg = banners?.[0]?.imageUrl;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1918] via-[#15312b] to-[#1b4538]">
        {heroBg && <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${heroBg})` }} />}
        <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-40 w-96 rounded-full bg-clay-500/10 blur-3xl" />

        <div className="page-container relative z-10 pb-20 pt-20 sm:pb-28 sm:pt-28 lg:flex lg:items-center lg:gap-16 lg:pb-36 lg:pt-36">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-primary-300 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400" /> Pasar digital UMKM Cilacap
            </div>
            <h1 className="text-4xl font-black leading-[1.06] tracking-[-.03em] text-white sm:text-5xl lg:text-6xl">
              Belanja langsung<br />dari{' '}
              <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">tetangga sendiri.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Platform yang menghubungkan kamu dengan ratusan pelaku UMKM di Cilacap. Produk asli, harga langsung, dan cerita di balik setiap pesanan.
            </p>

            <form action="/products" className="mt-8 flex max-w-lg rounded-2xl border border-white/10 bg-white/10 p-1.5 backdrop-blur">
              <input name="search" placeholder="Cari lanting, batik, oleh-oleh khas..." className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/40 sm:text-base" />
              <button className="focus-ring rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0c1918] hover:bg-primary-50">Cari</button>
            </form>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {['UMKM terverifikasi', 'Harga langsung pengrajin', 'Cilacap asli'].map((t) => <span key={t} className="flex items-center gap-2 text-sm font-semibold text-white/80"><svg className="h-4 w-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m5 13 4 4L19 7" /></svg>{t}</span>)}
            </div>
          </div>

          {banners?.length ? (
            <div className="relative mt-12 hidden lg:block lg:mt-0 lg:w-[480px]">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
                <img src={banners[0].imageUrl} alt={banners[0].title} className="h-[420px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-black text-2xl text-white leading-tight">{banners[0].title}</p>
                  {banners[0].subtitle && <p className="mt-1 text-sm text-white/70">{banners[0].subtitle}</p>}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── KATEGORI ── */}
      {categories.length > 0 && (
        <section className="border-b border-black/5 bg-white">
          <div className="page-container py-10">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Link href="/products" className="shrink-0 rounded-xl bg-primary-700 px-4 py-3 text-sm font-bold text-white hover:bg-primary-800">Semua</Link>
              {categories.map((cat: any) => <Link key={cat.id} href={`/products?category=${cat.id}`} className="shrink-0 rounded-xl border border-black/5 bg-canvas px-4 py-3 text-sm font-semibold text-ink transition hover:border-primary-300 hover:text-primary-700">{cat.name}</Link>)}
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUK UNGGULAN ── */}
      <section className="page-container py-16 sm:py-24">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">Pilihan minggu ini</p><h2 className="mt-3 text-3xl font-black tracking-[-.02em] text-ink sm:text-4xl">Produk unggulan</h2><p className="mt-3 max-w-xl leading-7 text-gray-500">Dikurasi langsung dari toko-toko UMKM yang aktif di Cilacap.</p></div>
          <Link href="/products" className="focus-ring inline-flex items-center gap-2 rounded-xl border-2 border-ink px-5 py-3 text-sm font-bold text-ink hover:bg-ink hover:text-white transition">Lihat semua produk<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
        </div>
        {products.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p: any) => {
              const img = p.images?.[0]?.imageUrl;
              return (
                <Link key={p.id} href={`/products/${p.slug}`} className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-2xl focus-ring">
                  <div className="aspect-square overflow-hidden bg-[#eee9df]">
                    {img ? <img src={img} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-4xl opacity-30">📦</div>}
                    {p.stock > 0 && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-primary-800 shadow-sm">Stok {p.stock}</span>}
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-primary-700">{p.category?.name || 'UMKM Cilacap'}</p>
                    <h3 className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-extrabold leading-5 tracking-tight text-ink">{p.name}</h3>
                    <p className="mt-2 truncate text-xs text-gray-500">{p.seller?.storeName}</p>
                    <p className="mt-2 text-lg font-black text-primary-700">{rp.format(Number(p.price))}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : <div className="rounded-2xl border border-dashed border-black/10 bg-canvas py-20 text-center text-gray-400"><p className="font-bold">Produk pilihan sedang dikurasi.</p></div>}
      </section>

      {/* ── KENAPA SADEAN ── */}
      <section className="border-y border-black/5 bg-canvas py-16 sm:py-24">
        <div className="page-container">
          <div className="mx-auto max-w-xl text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">Kenapa belanja di sini</p><h2 className="mt-3 text-3xl font-black tracking-[-.02em] text-ink sm:text-4xl">Lebih dekat, lebih berarti.</h2></div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[{ icon: '🏪', title: 'Dari UMKM langsung', text: 'Harga tanpa rantai panjang. Yang kamu bayar langsung ke pelaku usaha lokal.' }, { icon: '🤝', title: 'Kenal penjualnya', text: 'Chat langsung via WhatsApp. Tanya produk, negosiasi, atau sekadar menyapa.' }, { icon: '📍', title: 'Cilacap banget', text: 'Setiap produk punya cerita. Dari makanan khas sampai kerajinan tangan lokal.' }].map((f) => (
              <div key={f.title} className="group rounded-2xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-4 text-lg font-extrabold text-ink">{f.title}</h3>
                <p className="mt-2 leading-7 text-gray-500">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOKO LOKAL ── */}
      {sellerList.length > 0 && (
        <section className="page-container py-16 sm:py-24">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">Kenal lebih dekat</p><h2 className="mt-3 text-3xl font-black tracking-[-.02em] text-ink sm:text-4xl">Toko andalan Cilacap</h2><p className="mt-3 max-w-xl leading-7 text-gray-500">Di balik setiap produk, ada wajah dan cerita dari wong Cilacap yang berusaha.</p></div>
            <Link href="/sellers" className="focus-ring inline-flex items-center gap-2 rounded-xl border-2 border-ink px-5 py-3 text-sm font-bold text-ink hover:bg-ink hover:text-white transition">Jelajahi toko<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sellerList.map((s: any) => (
              <Link key={s.id} href={`/sellers/${s.slug}`} className="group overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-soft focus-ring">
                <div className="flex items-start gap-5 p-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-100 text-lg font-black text-primary-800">{s.logo ? <img src={s.logo} alt={s.storeName} className="h-full w-full object-cover" /> : s.storeName.charAt(0)}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-extrabold text-ink">{s.storeName}</h3>
                    {s.address && <p className="mt-1 truncate text-xs text-gray-500">{s.address}</p>}
                    <p className="mt-2 text-sm font-semibold text-primary-700">{s._count?.products || 0} produk</p>
                  </div>
                  <svg className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition group-hover:text-primary-700 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="page-container pb-16 sm:pb-24">
        <div className="overflow-hidden rounded-[2.5rem] bg-ink px-6 py-12 sm:px-12 sm:py-20 lg:flex lg:items-center lg:justify-between lg:px-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-300">Punya usaha di Cilacap?</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-.02em] text-white sm:text-4xl">Etalase digitalmu,<br />satu klik dari pembeli.</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/55">Kelola katalog, terima pesanan langsung, dan bangun reputasi tokomu di marketplace lokal Cilacap. Gratis daftar.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link href="/seller/register" className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 font-bold text-white hover:bg-primary-400">Buka toko sekarang</Link>
            <Link href="/products" className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 font-bold text-white hover:bg-white/10">Jelajahi produk</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/5 bg-white py-10">
        <div className="page-container flex flex-col gap-4 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p><strong className="text-ink font-extrabold">SADEAN</strong> <span className="text-gray-300">·</span> Dodolane Wong Cilacap</p>
          <div className="flex gap-6">
            <Link href="/products" className="hover:text-primary-700 transition">Produk</Link>
            <Link href="/sellers" className="hover:text-primary-700 transition">Toko</Link>
            <Link href="/register" className="hover:text-primary-700 transition">Daftar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
