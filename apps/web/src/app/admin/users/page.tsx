'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User { id: string; name: string; email: string; phone: string; role: string; isActive: boolean; createdAt: string; }

const roleLabel: Record<string, string> = { buyer: 'Pembeli', seller: 'Penjual', admin: 'Admin', super_admin: 'Super Admin' };
const filters = ['all', 'buyer', 'seller', 'admin', 'super_admin'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadUsers = async () => { try { const r = await api.get<{ users: User[] }>('/users'); setUsers(r.data.users); } catch { toast.error('Gagal memuat pengguna'); } finally { setLoading(false); } };
  useEffect(() => { loadUsers(); }, []);

  const handleToggleActive = async (userId: string) => { try { const r = await api.patch<Pick<User, 'id' | 'isActive'>>(`/users/${userId}/toggle-active`); setUsers((c) => c.map((u) => u.id === r.data.id ? { ...u, isActive: r.data.isActive } : u)); toast.success('Status diperbarui'); } catch { toast.error('Gagal memperbarui status'); } };

  const filteredUsers = filter === 'all' ? users : users.filter((u) => u.role === filter);

  if (loading) return <div className="flex min-h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" /></div>;

  return <div>
    <h1 className="text-2xl font-black tracking-tight text-ink mb-6">Kelola Users</h1>
    <div className="mb-6 flex flex-wrap gap-2">{filters.map((role) => <button key={role} onClick={() => setFilter(role)} className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold transition ${filter === role ? 'bg-primary-700 text-white' : 'border border-black/10 bg-white text-ink hover:bg-canvas'}`}>{role === 'all' ? 'Semua' : roleLabel[role] || role}</button>)}</div>
    <div className="surface overflow-hidden"><table className="min-w-full divide-y divide-black/5"><thead className="bg-canvas"><tr>
      {['User', 'Role', 'Status', 'Tanggal', 'Aksi'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>)}
    </tr></thead><tbody className="divide-y divide-black/5">
      {filteredUsers.map((user) => <tr key={user.id} className="hover:bg-canvas">
        <td className="px-4 py-3"><div><p className="text-sm font-extrabold text-ink">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div></td>
        <td className="px-4 py-3"><span className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-gray-100 text-gray-700">{roleLabel[user.role] || user.role}</span></td>
        <td className="px-4 py-3"><span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${user.isActive ? 'bg-primary-100 text-primary-700' : 'bg-red-100 text-red-700'}`}>{user.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
        <td className="px-4 py-3 text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        <td className="px-4 py-3"><button onClick={() => handleToggleActive(user.id)} className={`focus-ring rounded-lg px-3 py-1.5 text-xs font-bold ${user.isActive ? 'text-red-600 hover:bg-red-50' : 'text-primary-700 hover:bg-primary-50'}`}>{user.isActive ? 'Nonaktifkan' : 'Aktifkan'}</button></td>
      </tr>)}</tbody></table></div>
  </div>;
}
