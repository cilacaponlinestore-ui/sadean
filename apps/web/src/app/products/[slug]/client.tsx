'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { favoritesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { rupiah } from '@/lib/format';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: { id: string; imageUrl: string; isPrimary: boolean }[];
  seller: {
    id: string;
    storeName: string;
    slug: string;
    whatsapp: string;
    phone: string;
  };
  category: { name: string };
}

export function ProductDetailClient({ product }: { product: Product | null }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!user || !product) return
    favoritesApi.check(product.id).then((r) => setFavorited(r.data.favorited)).catch(() => {})
  }, [user, product])

  const handleToggleFavorite = async () => {
    if (!user) { router.push('/login'); return }
    setFavLoading(true)
    try {
      const r = await favoritesApi.toggle(product!.id)
      setFavorited(r.data.favorited)
      toast.success(r.data.favorited ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit')
    } catch { toast.error('Gagal mengubah favorit') }
    finally { setFavLoading(false) }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Produk tidak ditemukan</div>
      </div>
    );
  }

  const handleAddToCart = async (): Promise<boolean> => {
    if (!user) { router.push('/login'); return false; }
    setAdding(true);
    try {
      await api.post('/cart/items', { productId: product.id, quantity });
      toast.success('Ditambahkan ke keranjang');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan ke keranjang');
      return false;
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { router.push('/login'); return; }
    const ok = await handleAddToCart();
    if (ok) router.push('/cart');
  };

  const formatPrice = (price: number) => rupiah(price);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main id="main-content" className="page-container py-6 sm:py-10">
        <Link href="/products" className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-700">← Kembali ke etalase</Link>
        <div className="surface overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[#eee9df]/50 p-4 sm:p-6">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#eee9df] group">
                  {product.images.length > 0 ? (
                    <>
                      <Image src={product.images[selectedImage]?.imageUrl} alt={product.name}
                        className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    {product.images.length > 1 && (
                      <>
                        <button aria-label="Gambar sebelumnya" onClick={() => setSelectedImage(i => (i - 1 + product.images.length) % product.images.length)}
                          className="focus-ring absolute left-2 top-1/2 z-10 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition hover:bg-white">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <button aria-label="Gambar berikutnya" onClick={() => setSelectedImage(i => (i + 1) % product.images.length)}
                          className="focus-ring absolute right-2 top-1/2 z-10 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition hover:bg-white">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {product.images.map((_, i) => (
                            <button key={i} onClick={() => setSelectedImage(i)}
                              className={`w-2 h-2 rounded-full transition ${i === selectedImage ? 'bg-white shadow' : 'bg-white/50'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><span className="text-6xl">📦</span></div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={img.id || i} onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition ${i === selectedImage ? 'border-primary-500' : 'border-transparent hover:border-gray-300'}`}>
                      <Image src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
              <div className="flex flex-col justify-center p-5 sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">{product.category?.name || 'Produk UMKM'}</p>
                  <h1 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">{product.name}</h1>
                </div>
                <button aria-label={favorited ? 'Hapus dari favorit' : 'Tambahkan ke favorit'} aria-pressed={favorited} onClick={handleToggleFavorite} disabled={favLoading}
                  className="focus-ring shrink-0 rounded-xl p-2 hover:bg-red-50">
                  <svg className={`h-7 w-7 ${favorited ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`}
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={favorited ? 'currentColor' : 'none'}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="mb-5">
                <p className="text-3xl font-extrabold text-primary-700">{formatPrice(product.price)}</p>
                <p className="mt-1 text-sm font-semibold text-gray-500">{product.stock > 0 ? `Stok tersedia: ${product.stock}` : <span className="text-red-600">Stok habis</span>}</p>
              </div>
              <div className="mb-6 leading-7 text-gray-600">
                <h3 className="mb-2 font-bold text-ink">Deskripsi</h3>
                <p className="whitespace-pre-wrap">{product.description || 'Jelajahi produk khas Cilacap ini.'}</p>
              </div>
              <div className="mb-8 rounded-2xl border border-black/5 bg-canvas p-4">
                <h3 className="mb-2 font-bold text-ink">Toko</h3>
                <Link href={`/sellers/${product.seller.slug}`} className="focus-ring inline-flex items-center gap-2 font-bold text-primary-700 hover:underline">
                  {product.seller.storeName} <span className="text-gray-400">→</span>
                </Link>
                {product.seller.phone && <p className="mt-1 text-sm text-gray-500">{product.seller.phone}</p>}
              </div>
              {product.stock > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-700">Jumlah</label>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white p-1">
                      <button aria-label="Kurangi jumlah" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="focus-ring h-10 w-10 rounded-lg text-lg font-bold hover:bg-primary-50">−</button>
                      <span className="min-w-[2.5rem] text-center font-bold tabular-nums">{quantity}</span>
                      <button aria-label="Tambah jumlah" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="focus-ring h-10 w-10 rounded-lg text-lg font-bold hover:bg-primary-50">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button onClick={() => handleAddToCart()} disabled={adding} className="focus-ring h-12 flex-1 rounded-xl border-2 border-primary-700 font-bold text-primary-700 hover:bg-primary-50 disabled:opacity-50">
                      {adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                    </button>
                    <button onClick={handleBuyNow} disabled={adding} className="focus-ring h-12 flex-1 rounded-xl bg-primary-700 font-bold text-white hover:bg-primary-800 disabled:opacity-50">
                      Beli Sekarang
                    </button>
                  </div>
                  {product.seller.whatsapp && (
                    <a href={`https://wa.me/${product.seller.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${product.name}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="focus-ring flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] font-bold text-white hover:bg-[#128C7E]">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.87 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.8.97h.01a7.94 7.94 0 0 0 6.86-11.9 7.9 7.9 0 0 0-1.27-1.65zM12.05 18.55h-.01a6.62 6.62 0 0 1-3.37-.93l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 0 1-1-3.46 6.64 6.64 0 0 1 6.6-6.62h.01A6.63 6.63 0 0 1 17.7 16.8a6.58 6.58 0 0 1-5.65 1.75zm3.63-4.96c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.12.13-.23.15-.43.05-.2-.1-.84-.3-1.6-.99-.59-.53-.99-1.18-1.1-1.37-.13-.2-.02-.31.08-.41.1-.09.22-.23.33-.35.1-.12.14-.2.2-.34.07-.13.04-.25-.02-.35-.05-.1-.44-1.05-.6-1.44-.16-.37-.32-.32-.44-.33-.11 0-.25-.01-.38-.01-.13 0-.34.05-.52.24-.17.2-.68.66-.68 1.62 0 .95.7 1.88.79 2.01.1.13 1.36 2.09 3.31 2.93.46.2.83.32 1.11.4.46.15.89.13 1.22.08.37-.06 1.17-.48 1.33-.95.16-.46.16-.86.12-.95-.05-.09-.17-.15-.37-.25z"/></svg>
                      Chat via WhatsApp
                    </a>
                  )}
                </div>
              ) : (
                <div className="surface bg-red-50 py-8 text-center text-red-700"><p className="font-black">Stok sedang habis</p><p className="mt-1 text-sm">Coba hubungi toko langsung lewat WhatsApp.</p></div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
