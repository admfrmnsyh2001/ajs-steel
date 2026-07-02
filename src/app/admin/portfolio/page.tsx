"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadPhoto } from '@/lib/uploadPhoto';
import Link from 'next/link';

interface Portfolio {
  id: string;
  judul: string;
  url_foto: string;
  created_at: string;
}

export default function AdminPortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  // State modal tambah
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [judul, setJudul] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPortfolios(data);
    setLoading(false);
  };

  const openModal = () => {
    setJudul('');
    setFotoFile(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoFile) {
      setErrorMsg('Harap pilih file foto terlebih dahulu.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const publicUrl = await uploadPhoto(fotoFile, 'portfolios');
      const { error } = await supabase
        .from('portfolios')
        .insert({ judul, url_foto: publicUrl });

      if (error) throw new Error(error.message);

      await fetchPortfolios();
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menambah portfolio');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string, judul: string) => {
    if (!window.confirm(`Hapus item portfolio "${judul}"?`)) return;
    const { error } = await supabase.from('portfolios').delete().eq('id', id);
    if (error) alert('Gagal menghapus: ' + error.message);
    else fetchPortfolios();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-orange-500 hover:text-orange-400 mb-3 inline-flex items-center gap-1 transition-colors">
              <span>&larr;</span> Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">Kelola Portfolio</h1>
            <p className="text-zinc-400 mt-1">Tambah dan hapus foto galeri hasil kerja</p>
          </div>
          <button
            onClick={openModal}
            className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
          >
            + Tambah Portfolio
          </button>
        </div>

        {/* Grid Portfolio */}
        {loading ? (
          <div className="text-center text-zinc-500 py-20">
            <svg className="animate-spin mx-auto h-8 w-8 text-orange-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memuat portfolio...
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed border-zinc-800 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Belum Ada Portfolio</h3>
            <p className="text-zinc-500 text-sm mb-6">Tambahkan foto hasil pengerjaan untuk ditampilkan di halaman publik.</p>
            <button onClick={openModal} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
              + Tambah Foto Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {portfolios.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 shadow-lg bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url_foto} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-sm leading-tight mb-3">{item.judul}</h3>
                  <button
                    onClick={() => handleDelete(item.id, item.judul)}
                    className="w-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Tambah Foto Portfolio</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Judul / Keterangan Proyek <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Cth: Kanopi Minimalis Rumah Pak Budi"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  File Foto <span className="text-orange-500">*</span>
                </label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => setFotoFile(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-zinc-800 file:text-orange-500 hover:file:bg-zinc-700 cursor-pointer"
                />
              </div>

              {errorMsg && (
                <div className="text-red-400 text-sm bg-red-950/40 border border-red-900/50 p-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl disabled:opacity-50 transition-colors">
                  {isSubmitting ? 'Mengupload...' : 'Simpan Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
