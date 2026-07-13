'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type SellerStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
interface Seller {
  id: string; storeName: string; description: string | null; phone: string | null;
  whatsapp: string | null; status: SellerStatus; statusReason: string | null;
  user: { name: string; email: string }; createdAt: string;
}

const labels: Record<SellerStatus, string> = {
  PENDING: 'Menunggu', VERIFIED: 'Terverifikasi', REJECTED: 'Ditolak', SUSPENDED: 'Ditangguhkan',
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const loadSellers = async () => {
    try {
      const response = await api.get<{ sellers: Seller[] }>('/sellers', {
        params: filter === 'ALL' ? {} : { status: filter },
      });
      setSellers(response.data.sellers);
    } catch { toast.error('Gagal memuat data UMKM'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSellers(); }, [filter]);

  const moderate = async (seller: Seller, action: 'approve' | 'reject' | 'suspend' | 'activate') => {
    let reason: string | null = null;
    if (action === 'reject' || action === 'suspend') {
      reason = prompt(action === 'reject' ? 'Alasan penolakan:' : 'Alasan penangguhan:');
      if (!reason?.trim()) return;
    }
    try {
      await api.put(`/sellers/${seller.id}/${action}`, reason ? { reason: reason.trim() } : {});
      toast.success('Status UMKM diperbarui');
      loadSellers();
    } catch { toast.error('Gagal memperbarui status UMKM'); }
  };

  if (loading) return <div className="text-center py-8">Memuat data...</div>;

  return <div>
    <h1 className="text-2xl font-bold mb-6">Moderasi UMKM</h1>
    <div className="flex flex-wrap gap-2 mb-6">
      {['ALL', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'].map((status) =>
        <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 text-sm rounded-lg ${filter === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}>
          {status === 'ALL' ? 'Semua' : labels[status as SellerStatus]}
        </button>)}
    </div>
    <div className="space-y-4">{sellers.map((seller) =>
      <div key={seller.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><h3 className="font-semibold text-lg">{seller.storeName}</h3><span className="px-2 py-1 text-xs bg-gray-100 rounded">{labels[seller.status]}</span></div>
          <p className="text-gray-500 mt-1">{seller.description || 'Tidak ada deskripsi'}</p>
          <div className="mt-2 text-sm text-gray-500"><p>Pemilik: {seller.user.name} ({seller.user.email})</p><p>Telepon: {seller.phone || '-'}</p><p>WhatsApp: {seller.whatsapp || '-'}</p><p>Bergabung: {new Date(seller.createdAt).toLocaleDateString('id-ID')}</p>{seller.statusReason && <p className="text-red-600">Alasan: {seller.statusReason}</p>}</div>
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          {seller.status !== 'VERIFIED' && <button onClick={() => moderate(seller, seller.status === 'SUSPENDED' ? 'activate' : 'approve')} className="px-3 py-2 bg-green-600 text-white text-sm rounded">{seller.status === 'SUSPENDED' ? 'Aktifkan' : 'Setujui'}</button>}
          {seller.status === 'PENDING' && <button onClick={() => moderate(seller, 'reject')} className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded">Tolak</button>}
          {seller.status === 'VERIFIED' && <button onClick={() => moderate(seller, 'suspend')} className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded">Tangguhkan</button>}
        </div>
      </div>)}
      {!sellers.length && <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Tidak ada data</div>}
    </div>
  </div>;
}
