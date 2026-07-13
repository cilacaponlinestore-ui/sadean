import Link from 'next/link';

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function ProductCard({ product }: { product: any }) {
  const image = product.images?.[0]?.imageUrl;
  return (
    <Link href={`/products/${product.slug}`} className="group overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:-translate-y-1 hover:shadow-soft focus-ring">
      <div className="relative aspect-square overflow-hidden bg-[#eee9df]">
        {image ? <img src={image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : (
          <div className="flex h-full items-center justify-center text-primary-700"><span className="rounded-full bg-white/70 px-4 py-2 text-xs font-bold">Produk lokal</span></div>
        )}
        {product.stock > 0 && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-primary-800">Tersedia</span>}
      </div>
      <div className="p-3.5 sm:p-4">
        <p className="eyebrow mb-2 truncate">{product.category?.name || 'Produk UMKM'}</p>
        <h3 className="line-clamp-2 min-h-10 font-bold leading-5 text-ink">{product.name}</h3>
        <p className="mt-2 truncate text-sm text-gray-500">{product.seller?.storeName || 'UMKM Cilacap'}</p>
        <p className="mt-3 text-lg font-extrabold text-primary-700">{rupiah.format(Number(product.price))}</p>
      </div>
    </Link>
  );
}

export function SellerCard({ seller }: { seller: any }) {
  return (
    <Link href={`/sellers/${seller.slug}`} className="group rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-1 hover:shadow-soft focus-ring">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-100 text-xl font-extrabold text-primary-800">
          {seller.logo ? <img src={seller.logo} alt={seller.storeName} className="h-full w-full object-cover" /> : seller.storeName.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2"><h3 className="truncate font-extrabold text-ink">{seller.storeName}</h3>{seller.isVerified && <span title="Terverifikasi" className="text-primary-600">✓</span>}</div>
          <p className="mt-1 text-sm text-gray-500">{seller._count?.products || 0} produk lokal</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-600">{seller.description || seller.address || 'Temukan produk khas pilihan dari UMKM Cilacap.'}</p>
      <p className="mt-4 text-sm font-bold text-primary-700">Kunjungi toko →</p>
    </Link>
  );
}
