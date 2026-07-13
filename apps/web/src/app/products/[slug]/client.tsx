'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { favoritesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Produk tidak ditemukan</div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) { router.push('/login'); return; }
    setAdding(true);
    try {
      await api.post('/cart/items', { productId: product.id, quantity });
      toast.success('Produk ditambahkan ke keranjang');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan ke keranjang');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { router.push('/login'); return; }
    await handleAddToCart();
    router.push('/cart');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg mb-4 group">
                {product.images.length > 0 ? (
                  <>
                    <img src={product.images[selectedImage].imageUrl} alt={product.name}
                      className="w-full h-full object-cover rounded-lg" />
                    {product.images.length > 1 && (
                      <>
                        <button onClick={() => setSelectedImage(i => (i - 1 + product.images.length) % product.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <button onClick={() => setSelectedImage(i => (i + 1) % product.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-white">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span className="text-sm text-gray-500">{product.category?.name}</span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
                </div>
                <button onClick={handleToggleFavorite} disabled={favLoading}
                  className="p-2 rounded-full hover:bg-gray-100 transition shrink-0">
                  <svg className={`w-7 h-7 ${favorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={favorited ? 'currentColor' : 'none'}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <p className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</p>
                <p className="text-sm text-gray-500 mt-1">Stok: {product.stock > 0 ? product.stock : 'Habis'}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{product.description || 'Tidak ada deskripsi'}</p>
              </div>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Toko</h3>
                <Link href={`/sellers/${product.seller.slug}`} className="text-primary-600 hover:underline">
                  {product.seller.storeName}
                </Link>
              </div>
              {product.stock > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 border rounded-lg hover:bg-gray-50">-</button>
                      <input type="number" value={quantity} onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-20 text-center border rounded-lg py-2" min="1" max={product.stock} />
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 border rounded-lg hover:bg-gray-50">+</button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleAddToCart} disabled={adding}
                      className="flex-1 px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 disabled:opacity-50 font-medium">
                      {adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                    </button>
                    <button onClick={handleBuyNow} disabled={adding}
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium">
                      Beli Sekarang
                    </button>
                  </div>
                  {product.seller.whatsapp && (
                    <a href={`https://wa.me/${product.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Halo, saya tertarik dengan produk ${product.name}`}
                      target="_blank" rel="noopener noreferrer"
                      className="block w-full px-6 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium">
                      Chat via WhatsApp
                    </a>
                  )}
                </div>
              )}
              {product.stock === 0 && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">Stok habis</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
