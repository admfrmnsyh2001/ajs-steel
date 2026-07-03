"use client";

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [portfolioCount, setPortfolioCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      const [{ count: sc }, { count: pc }] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('portfolios').select('*', { count: 'exact', head: true }),
      ]);
      setServiceCount(sc ?? 0);
      setPortfolioCount(pc ?? 0);
    }
    fetchCounts();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = 'sb-access-token=; path=/; max-age=0';
    document.cookie = 'sb-refresh-token=; path=/; max-age=0';
    router.push('/admin/login');
  };

  const cards = [
    {
      href: '/admin/layanan',
      label: 'Kelola Katalog Layanan',
      desc: 'Tambah, edit, atau hapus layanan yang ditampilkan di halaman utama.',
      count: serviceCount,
      countLabel: 'Layanan aktif',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      href: '/admin/portfolio',
      label: 'Kelola Portfolio',
      desc: 'Unggah dan kelola foto hasil proyek yang ditampilkan di galeri portfolio.',
      count: portfolioCount,
      countLabel: 'Foto portfolio',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Admin</h1>
            <p className="text-zinc-400 mt-1">AJS Steel — Kelola katalog & portfolio</p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start sm:self-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Quick Link to website */}
        <div className="mb-8 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
          <p className="text-zinc-400 text-sm">Lihat tampilan website publik</p>
          <Link
            href="/"
            target="_blank"
            className="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors flex items-center gap-1"
          >
            Buka Website
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/40 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(50,130,184,0.25)] flex flex-col gap-6"
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-xl bg-zinc-800 group-hover:bg-orange-600/20 flex items-center justify-center text-orange-500 transition-colors">
                  {card.icon}
                </div>
                {card.count !== null && (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{card.count}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{card.countLabel}</p>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                  {card.label}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-orange-500 text-sm font-medium mt-auto">
                Kelola Sekarang
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
