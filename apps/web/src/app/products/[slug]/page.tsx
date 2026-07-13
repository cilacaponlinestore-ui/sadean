'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
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
  images: { imageUrl: string }[];
  seller: {
    id: string;
    storeName: string;
    slug: string;
    whatsapp: string;
    phone: string;
  };
  category: { name: string };
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [params.slug]);

  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/slug/${params.slug}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setAdding(true);
    try {
      await api.post('/cart/items', {
        productId: product!.id,
        quantity,
      });
      toast.success('Produk ditambahkan ke keranjang');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menambahkan ke keranjang';
      toast.error(message);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    await handleAddToCart();
    router.push('/cart');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Memuat produk...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">Produk tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                {product.images[0] ? (
                  <img
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded">
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="mb-4">
                <span className="text-sm text-gray-500">{product.category?.name}</span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Stok: {product.stock > 0 ? product.stock : 'Habis'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {product.description || 'Tidak ada deskripsi'}
                </p>
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
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 border rounded-lg hover:bg-gray-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))
                        }
                        className="w-20 text-center border rounded-lg py-2"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 border rounded-lg hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="flex-1 px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 disabled:opacity-50 font-medium"
                    >
                      {adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={adding}
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
                    >
                      Beli Sekarang
                    </button>
                  </div>

                  {product.seller.whatsapp && (
                    <a
                      href={`https://wa.me/${product.seller.whatsapp.replace(/[^0-9]/g, '')}?text=Halo, saya tertarik dengan produk ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-6 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium"
                    >
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