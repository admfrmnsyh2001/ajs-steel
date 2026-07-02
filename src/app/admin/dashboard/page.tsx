"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  nama_customer: string;
  no_hp: string;
  status: string;
  created_at: string;
  services: { nama_layanan: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('id, nama_customer, no_hp, status, created_at, services(nama_layanan)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // @ts-ignore
      setOrders(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = 'sb-access-token=; path=/; max-age=0';
    document.cookie = 'sb-refresh-token=; path=/; max-age=0';
    router.push('/admin/login');
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending</span>;
      case 'survey': return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Survey</span>;
      case 'dikerjakan': return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">Dikerjakan</span>;
      case 'selesai': return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Selesai</span>;
      default: return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">{status}</span>;
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Admin</h1>
            <p className="text-zinc-400 mt-1">Kelola semua pesanan masuk AJS Steel</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/layanan" className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Kelola Layanan
            </Link>
            <Link href="/admin/portfolio" className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Kelola Portfolio
            </Link>
            <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-zinc-400">Filter Status:</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:ring-orange-500 focus:border-orange-500 outline-none"
          >
            <option value="all">Semua Pesanan</option>
            <option value="pending">Pending</option>
            <option value="survey">Survey</option>
            <option value="dikerjakan">Dikerjakan</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        {/* Tabel Pesanan */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Tanggal Masuk</th>
                  <th className="p-4 font-semibold">Pelanggan</th>
                  <th className="p-4 font-semibold">No. HP</th>
                  <th className="p-4 font-semibold">Layanan</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-500">
                      <svg className="animate-spin mx-auto h-6 w-6 text-orange-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-500">
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => router.push(`/admin/pesanan/${order.id}`)}
                      className="hover:bg-zinc-800/30 cursor-pointer transition-colors group"
                    >
                      <td className="p-4 text-sm text-zinc-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-4 text-sm font-medium text-zinc-100 whitespace-nowrap">
                        {order.nama_customer}
                      </td>
                      <td className="p-4 text-sm text-zinc-300 whitespace-nowrap">
                        {order.no_hp}
                      </td>
                      <td className="p-4 text-sm text-zinc-300 whitespace-nowrap">
                        {order.services?.nama_layanan}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <span className="text-orange-500 text-sm font-medium group-hover:text-orange-400 transition-colors">Lihat Detail &rarr;</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
