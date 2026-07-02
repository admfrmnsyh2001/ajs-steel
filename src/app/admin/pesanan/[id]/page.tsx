"use client";

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { uploadPhoto } from '@/lib/uploadPhoto';

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [progressPhotos, setProgressPhotos] = useState<FileList | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        services ( nama_layanan ),
        order_photos ( id, url_foto, tipe )
      `)
      .eq('id', id)
      .single();

    if (!error && data) {
      setOrder(data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatusUpdating(true);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Gagal mengubah status: ' + error.message);
    } else {
      setOrder({ ...order, status: newStatus });
    }
    setStatusUpdating(false);
  };

  const handleUploadProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressPhotos || progressPhotos.length === 0) return;

    setUploadingPhoto(true);
    setErrorMsg('');

    try {
      const uploadPromises = Array.from(progressPhotos).map(async (file) => {
        const publicUrl = await uploadPhoto(file, 'orders');
        
        const { error: photoError } = await supabase
          .from('order_photos')
          .insert({
            order_id: id,
            url_foto: publicUrl,
            tipe: 'progress'
          });

        if (photoError) throw new Error(photoError.message);
      });

      await Promise.all(uploadPromises);
      
      // Reset input & refetch
      setProgressPhotos(null);
      (document.getElementById('progressFotos') as HTMLInputElement).value = '';
      fetchOrderDetails();
      
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengupload foto progress');
    }
    
    setUploadingPhoto(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-orange-500">Memuat detail pesanan...</div>;
  }

  if (!order) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-500">Pesanan tidak ditemukan.</div>;
  }

  const refPhotos = order.order_photos.filter((p: any) => p.tipe === 'referensi');
  const progPhotos = order.order_photos.filter((p: any) => p.tipe === 'progress');

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-orange-500 hover:text-orange-400 mb-3 inline-flex items-center gap-1 transition-colors">
              <span>&larr;</span> Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">Detail Pesanan</h1>
            <p className="text-zinc-500 font-mono text-sm mt-1">{order.id}</p>
          </div>
          <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 flex items-center gap-3">
            <span className="text-sm text-zinc-400">Update Status:</span>
            <select
              value={order.status}
              disabled={statusUpdating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:ring-orange-500 focus:border-orange-500 outline-none disabled:opacity-50"
            >
              <option value="pending">Pending (Menunggu)</option>
              <option value="survey">Survey</option>
              <option value="dikerjakan">Dikerjakan</option>
              <option value="selesai">Selesai</option>
            </select>
            {statusUpdating && <span className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Kustomer */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
              <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-4 mb-6">Informasi Pelanggan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Nama</p>
                  <p className="mt-1 text-base text-zinc-200">{order.nama_customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500">No. HP / WA</p>
                  <p className="mt-1 text-base text-zinc-200">
                    <a href={`https://wa.me/${order.no_hp.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">
                      {order.no_hp}
                    </a>
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-zinc-500">Alamat</p>
                  <p className="mt-1 text-base text-zinc-200">{order.alamat || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
              <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-4 mb-6">Detail Layanan</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-zinc-500">Layanan Dipesan</p>
                  <p className="mt-1 text-base font-semibold text-white">{order.services?.nama_layanan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500">Deskripsi / Catatan Kustomer</p>
                  <p className="mt-1 text-base text-zinc-300 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 whitespace-pre-wrap">{order.deskripsi}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Foto-foto */}
          <div className="space-y-8">
            
            {/* Foto Progress */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Foto Progress</h2>
              
              {/* Form Upload */}
              <form onSubmit={handleUploadProgress} className="mb-6 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                <label className="block text-xs text-zinc-400 mb-2">Upload Update Progress Baru</label>
                <input 
                  type="file" 
                  id="progressFotos"
                  multiple 
                  accept="image/*"
                  onChange={(e) => setProgressPhotos(e.target.files)}
                  className="block w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-zinc-800 file:text-orange-500 hover:file:bg-zinc-700 cursor-pointer mb-3"
                />
                {errorMsg && <p className="text-red-400 text-xs mb-2">{errorMsg}</p>}
                <button
                  type="submit"
                  disabled={uploadingPhoto || !progressPhotos || progressPhotos.length === 0}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold py-2 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {uploadingPhoto ? 'Mengupload...' : 'Upload Foto Progress'}
                </button>
              </form>

              {/* Grid Progress */}
              {progPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {progPhotos.map((photo: any) => (
                    <a key={photo.id} href={photo.url_foto} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden border border-zinc-800 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url_foto} alt="Progress" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 text-center py-4 border border-dashed border-zinc-800 rounded-xl">Belum ada foto progress</p>
              )}
            </div>

            {/* Foto Referensi */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Foto Referensi (Dari Kustomer)</h2>
              {refPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {refPhotos.map((photo: any) => (
                    <a key={photo.id} href={photo.url_foto} target="_blank" rel="noreferrer" className="aspect-square rounded-lg overflow-hidden border border-zinc-800 block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url_foto} alt="Referensi" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 text-center py-4 border border-dashed border-zinc-800 rounded-xl">Tidak ada foto referensi</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
