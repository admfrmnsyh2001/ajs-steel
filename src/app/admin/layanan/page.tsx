"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Service {
  id: string;
  nama_layanan: string;
  deskripsi: string | null;
  harga_dasar: number | null;
}

export default function AdminLayananPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_layanan: '',
    deskripsi: '',
    harga_dasar: ''
  });

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
    setIsModalOpen(true);
  };

  const openModalForEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      nama_layanan: service.nama_layanan,
      deskripsi: service.deskripsi || '',
      harga_dasar: service.harga_dasar ? service.harga_dasar.toString() : ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      nama_layanan: formData.nama_layanan,
      deskripsi: formData.deskripsi || null,
      harga_dasar: formData.harga_dasar ? parseInt(formData.harga_dasar) : null
    };

    let opError;

    if (editingId) {
      // Update data eksisting
      const { error } = await supabase
        .from('services')
        .update(payload)
        .eq('id', editingId);
      opError = error;
    } else {
      // Tambah data baru
      const { error } = await supabase
        .from('services')
        .insert([payload]);
      opError = error;
    }
    
    if (opError) {
      alert(`Gagal menyimpan data: ${opError.message}`);
    } else {
      await fetchServices();
      closeModal();
    }
    
    setFormLoading(false);
  };

  const handleDelete = async (id: string, nama: string) => {
    if (window.confirm(`PERINGATAN: Yakin ingin menghapus layanan "${nama}"?\nJika dihapus, ini juga akan menghapus atau memutus data pesanan yang menggunakan layanan ini.`)) {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
        
      if (error) {
        alert(`Gagal menghapus layanan: ${error.message}`);
      } else {
        fetchServices();
      }
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-orange-500 hover:text-orange-400 mb-3 inline-flex items-center gap-1 transition-colors">
              <span>&larr;</span> Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">Kelola Layanan</h1>
            <p className="text-zinc-400 mt-1">Daftar jasa yang ditawarkan kepada kustomer</p>
          </div>
          <div>
            <button 
              onClick={openModalForAdd}
              className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
            >
              + Tambah Layanan
            </button>
          </div>
        </div>

        {/* Tabel Layanan */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold w-1/4">Nama Layanan</th>
                  <th className="p-4 font-semibold w-2/4">Deskripsi</th>
                  <th className="p-4 font-semibold w-1/6">Harga Dasar</th>
                  <th className="p-4 font-semibold text-right w-1/6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500">
                      <svg className="animate-spin mx-auto h-6 w-6 text-orange-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memuat daftar layanan...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500">
                      Belum ada layanan yang ditambahkan.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 font-medium text-zinc-100 align-top">
                        {service.nama_layanan}
                      </td>
                      <td className="p-4 text-sm text-zinc-400 align-top whitespace-pre-wrap">
                        {service.deskripsi || '-'}
                      </td>
                      <td className="p-4 text-sm font-semibold text-orange-400 align-top whitespace-nowrap">
                        {service.harga_dasar ? `Rp ${service.harga_dasar.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="p-4 text-right align-top whitespace-nowrap space-x-3">
                        <button 
                          onClick={() => openModalForEdit(service)}
                          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id, service.nama_layanan)}
                          className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
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
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Nama Layanan <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_layanan}
                  onChange={(e) => setFormData({...formData, nama_layanan: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                  placeholder="Cth: Pemasangan Kanopi Minimalis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Harga Dasar / Estimasi (Opsional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500">Rp</span>
                  <input
                    type="number"
                    value={formData.harga_dasar}
                    onChange={(e) => setFormData({...formData, harga_dasar: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  rows={4}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors resize-none"
                  placeholder="Detail bahan, proses kerja, dll..."
                ></textarea>
              </div>

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
                  {formLoading ? 'Menyimpan...' : 'Simpan Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
