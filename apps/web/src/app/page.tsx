import Link from 'next/link';
import BannerSlider from '@/components/BannerSlider';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchBanners() {
  try {
    const res = await fetch(`${API}/banners`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return [] }
}

async function fetchProducts() {
  try {
    const res = await fetch(`${API}/products?limit=8`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch { return [] }
}

async function fetchSellers() {
  try {
    const res = await fetch(`${API}/sellers`, { next: { revalidate: 120 } });
    if (!res.ok) return [];
    return res.json();
  } catch { return [] }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export default async function Home() {
  const [banners, products, sellers] = await Promise.all([
    fetchBanners(),
    fetchProducts(),
    fetchSellers(),
  ]);

  return (
    <main>
      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BannerSlider banners={banners} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Produk Unggulan</h2>
            <p className="text-gray-500 mt-1">Produk terbaik dari UMKM Cilacap</p>
          </div>
          <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Lihat Semua &rarr;
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Belum ada produk</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <Link key={p.id} href={`/products/${p.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="aspect-square bg-gray-100">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].imageUrl} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary-600 font-medium mb-1">{p.category?.name}</p>
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{p.seller?.storeName}</p>
                  <p className="text-lg font-bold text-primary-600">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {sellers.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">UMKM Terbaru</h2>
                <p className="text-gray-500 mt-1">Toko lokal terpercaya di Cilacap</p>
              </div>
              <Link href="/sellers" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sellers.map((s: any) => (
                <Link key={s.id} href={`/sellers/${s.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {s.logo ? (
                      <img src={s.logo} alt={s.storeName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-primary-600 font-bold">{s.storeName.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{s.storeName}</h3>
                  {s.address && <p className="text-sm text-gray-500 line-clamp-2">{s.address}</p>}
                  <p className="text-xs text-gray-400 mt-2">{s._count?.products || 0} produk</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Gabung Jadi UMKM Cilacap</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Punya usaha lokal? Kembangkan bisnismu bersama SADEAN. Daftar jadi seller dan jangkau lebih banyak pembeli.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/seller/register"
            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition">
            Daftar Jadi Seller
          </Link>
          <Link href="/products"
            className="px-8 py-3 border border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 font-medium transition">
            Mulai Belanja
          </Link>
        </div>
      </section>
    </main>
  );
}
