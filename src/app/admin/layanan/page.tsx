"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadPhoto } from '@/lib/uploadPhoto';
import Link from 'next/link';

interface Service {
  id: string;
  nama_layanan: string;
  deskripsi: string | null;
  harga_dasar: number | null;
  url_gambar: string | null;
}

export default function AdminLayananPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nama_layanan: '',
    deskripsi: '',
    harga_dasar: ''
  });
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [currentGambarUrl, setCurrentGambarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  };

  const openModalForAdd = () => {
    setEditingId(null);
    setFormData({ nama_layanan: '', deskripsi: '', harga_dasar: '' });
    setGambarFile(null);
    setCurrentGambarUrl(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openModalForEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      nama_layanan: service.nama_layanan,
      deskripsi: service.deskripsi || '',
      harga_dasar: service.harga_dasar ? service.harga_dasar.toString() : ''
    });
    setGambarFile(null);
    setCurrentGambarUrl(service.url_gambar);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg('');

    try {
      // Upload gambar baru jika ada
      let url_gambar = currentGambarUrl;
      if (gambarFile) {
        url_gambar = await uploadPhoto(gambarFile, 'services');
      }

      const payload = {
        nama_layanan: formData.nama_layanan,
        deskripsi: formData.deskripsi || null,
        harga_dasar: formData.harga_dasar ? parseInt(formData.harga_dasar) : null,
        url_gambar: url_gambar
      };

      if (editingId) {
        const { error } = await supabase.from('services').update(payload).eq('id', editingId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw new Error(error.message);
      }

      await fetchServices();
      closeModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan');
    }

    setFormLoading(false);
  };

  const handleDelete = async (id: string, nama: string) => {
    if (window.confirm(`PERINGATAN: Yakin ingin menghapus layanan "${nama}"?`)) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        alert(`Gagal menghapus layanan: ${error.message}`);
      } else {
        fetchServices();
      }
    }
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Kelola Layanan</h1>
            <p className="text-zinc-400 mt-1">Daftar jasa yang ditawarkan kepada kustomer</p>
          </div>
          <button
            onClick={openModalForAdd}
            className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
          >
            + Tambah Layanan
          </button>
        </div>

        {/* Grid Layanan dengan Gambar */}
        {loading ? (
          <div className="text-center text-zinc-500 py-20">
            <svg className="animate-spin mx-auto h-6 w-6 text-orange-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memuat daftar layanan...
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">Belum ada layanan. Tambahkan sekarang!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-orange-500/40 transition-all shadow-lg">
                {/* Gambar Layanan */}
                <div className="relative h-44 bg-zinc-800">
                  {service.url_gambar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.url_gambar}
                      alt={service.nama_layanan}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                      <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs">Belum ada gambar</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent"></div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-lg mb-1">{service.nama_layanan}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-3">{service.deskripsi || '-'}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                    <span className="text-orange-400 font-semibold text-sm">
                      {service.harga_dasar ? `Rp ${service.harga_dasar.toLocaleString('id-ID')}` : 'Hubungi Kami'}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openModalForEdit(service)}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id, service.nama_layanan)}
                        className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h2>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white transition-colors p-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Nama Layanan */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Nama Layanan <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_layanan}
                  onChange={(e) => setFormData({ ...formData, nama_layanan: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                  placeholder="Cth: Pemasangan Kanopi Minimalis"
                />
              </div>

              {/* Harga */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Harga Dasar / Estimasi (Opsional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">Rp</span>
                  <input
                    type="number"
                    value={formData.harga_dasar}
                    onChange={(e) => setFormData({ ...formData, harga_dasar: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Deskripsi (Opsional)</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors resize-none"
                  placeholder="Detail bahan, proses kerja, dll..."
                ></textarea>
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Gambar Layanan (Opsional)</label>

                {/* Preview gambar yang sudah ada */}
                {currentGambarUrl && !gambarFile && (
                  <div className="mb-3 relative rounded-xl overflow-hidden h-32 border border-zinc-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentGambarUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCurrentGambarUrl(null)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white text-xs p-1.5 rounded-lg transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Preview file baru */}
                {gambarFile && (
                  <div className="mb-3 relative rounded-xl overflow-hidden h-32 border border-orange-500/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(gambarFile)} alt="Preview baru" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-zinc-950/30 flex items-center justify-center">
                      <span className="text-xs bg-orange-600 text-white px-3 py-1 rounded-full">Gambar Baru</span>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGambarFile(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-orange-500 hover:file:bg-zinc-700 cursor-pointer transition-colors"
                />
              </div>

              {errorMsg && (
                <div className="text-red-400 text-sm bg-red-950/40 border border-red-900/50 p-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : 'Simpan Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
