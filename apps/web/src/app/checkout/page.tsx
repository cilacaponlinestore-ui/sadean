'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface CartItem {
  productId: string;
  quantity: number;
  product: { name: string; price: number; stock: number };
}

interface Cart {
  items: CartItem[];
  sellerId: string | null;
  total: number;
}

const inputCls = 'focus-ring h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const focused = useRef(false);
  const [form, setForm] = useState({ shippingName: '', shippingPhone: '', shippingAddress: '', notes: '' });

  useEffect(() => {
    setForm(prev => ({
      shippingName: prev.shippingName || user?.name || '',
      shippingPhone: prev.shippingPhone || user?.phone || '',
      shippingAddress: prev.shippingAddress,
      notes: prev.notes,
    }));
    if (!focused.current) { focused.current = true; }
    api.get<Cart>('/cart')
      .then(({ data }) => {
        if (!data.items.length || !data.sellerId) router.replace('/cart');
        else setCart(data);
      })
      .catch(() => router.replace('/login'));
  }, [router, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!cart?.sellerId || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        sellerId: cart.sellerId,
        items: cart.items.map(({ productId, quantity }) => ({ productId, quantity })),
        ...form,
      });
      toast.success('Pesanan berhasil dibuat');
      router.replace(`/orders/${data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout gagal');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart) return <><Navbar /><main className="p-12 text-center font-bold text-gray-500">Memuat checkout...</main></>;

  const rupiah = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <main id="main-content" className="page-container py-8 sm:py-12">
        <p className="eyebrow">Langkah terakhir</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">Konfirmasi Pesanan</h1>

        <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="surface p-5 sm:p-6">
            <h2 className="mb-5 font-black text-ink">Detail Pengiriman</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="text-sm font-bold text-gray-700">Nama penerima</label>
                <input id="name" autoComplete="name" required value={form.shippingName} onChange={(e) => setForm({ ...form, shippingName: e.target.value })} className={`${inputCls} mt-2`} placeholder="Nama lengkap penerima" />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-bold text-gray-700">Nomor WhatsApp</label>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" required value={form.shippingPhone} onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })} className={`${inputCls} mt-2`} placeholder="0812..." />
              </div>
              <div>
                <label htmlFor="address" className="text-sm font-bold text-gray-700">Alamat lengkap</label>
                <textarea id="address" autoComplete="street-address" required value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} className={`${inputCls} min-h-[100px] py-3 mt-2`} placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota, kode pos" rows={4} />
              </div>
              <div>
                <label htmlFor="notes" className="text-sm font-bold text-gray-700">Catatan <span className="font-normal text-gray-400">(opsional)</span></label>
                <textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputCls} min-h-[80px] py-3 mt-2`} placeholder="Tolong dipacking terpisah, warna harus sesuai..." rows={2} />
              </div>
            </div>
          </div>

          <div className="surface sticky top-24 h-fit p-5">
            <h3 className="font-black text-ink">Pesanan</h3>
            <div className="mt-4 space-y-2 text-sm">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">{item.product.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="shrink-0 font-bold">{rupiah(Number(item.product.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="my-5 border-t border-black/5 pt-4">
              <div className="flex justify-between font-black"><span>Total</span><span className="text-primary-700">{rupiah(Number(cart.total))}</span></div>
              <p className="mt-3 text-xs leading-5 text-gray-500">Belum termasuk ongkos kirim. Detail pengiriman akan dikonfirmasi toko melalui WhatsApp setelah pesanan dibuat.</p>
            </div>
            <button disabled={submitting} className="focus-ring h-12 w-full rounded-xl bg-primary-700 font-bold text-white hover:bg-primary-800 disabled:opacity-50">
              {submitting ? 'Membuat pesanan...' : 'Buat Pesanan'}
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">Setelah checkout, kamu akan diarahkan ke halaman pesanan untuk lanjut chat WhatsApp.</p>
          </div>
        </form>
      </main>
    </div>
  );
}
