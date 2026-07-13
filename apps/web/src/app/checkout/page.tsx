'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface CartItem {
  productId: string;
  quantity: number;
  product: { name: string; price: number };
}

interface Cart {
  items: CartItem[];
  sellerId: string | null;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ shippingName: '', shippingPhone: '', shippingAddress: '', notes: '' });

  useEffect(() => {
    api.get<Cart>('/cart')
      .then(({ data }) => {
        if (!data.items.length || !data.sellerId) router.replace('/cart');
        else setCart(data);
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!cart?.sellerId) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        sellerId: cart.sellerId,
        items: cart.items.map(({ productId, quantity }) => ({ productId, quantity })),
        ...form,
      });
      await api.delete('/cart');
      toast.success('Pesanan berhasil dibuat');
      if (data.whatsappLink) window.open(data.whatsappLink, '_blank', 'noopener,noreferrer');
      router.replace('/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Checkout gagal');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart) return <><Navbar /><main className="p-12 text-center">Memuat checkout...</main></>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-6 shadow">
          <input required placeholder="Nama penerima" value={form.shippingName} onChange={(e) => setForm({ ...form, shippingName: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          <input required placeholder="Nomor WhatsApp" value={form.shippingPhone} onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          <textarea required placeholder="Alamat lengkap" value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} className="w-full rounded-lg border px-3 py-2" rows={4} />
          <textarea placeholder="Catatan (opsional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-lg border px-3 py-2" rows={2} />
          <div className="border-t pt-4">
            {cart.items.map((item) => <p key={item.productId} className="text-sm">{item.product.name} x{item.quantity}</p>)}
            <p className="mt-3 font-bold">Total: Rp{Number(cart.total).toLocaleString('id-ID')}</p>
          </div>
          <button disabled={submitting} className="w-full rounded-lg bg-primary-600 px-6 py-3 font-medium text-white disabled:opacity-50">
            {submitting ? 'Memproses...' : 'Buat Pesanan & Buka WhatsApp'}
          </button>
        </form>
      </main>
    </div>
  );
}
