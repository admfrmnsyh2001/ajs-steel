"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadPhoto } from '@/lib/uploadPhoto';

export default function OrderPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [formData, setFormData] = useState({
    nama_customer: '',
    no_hp: '',
    alamat: '',
    service_id: '',
    deskripsi: '',
  });
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch daftar layanan dari Supabase
  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('id, nama_layanan')
        .order('nama_layanan');
      
      if (data) {
        setServices(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, service_id: data[0].id }));
        }
      }
      setLoadingServices(false);
    }
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Generate UUID di client supaya kita tahu ID-nya (karena RLS public tidak mengizinkan SELECT)
      const orderId = crypto.randomUUID();

      // 2. Insert ke tabel orders
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          nama_customer: formData.nama_customer,
          no_hp: formData.no_hp,
          alamat: formData.alamat,
          deskripsi: formData.deskripsi,
          service_id: formData.service_id,
        });

      if (orderError) throw new Error(orderError.message);

      // 3. Jika ada foto, upload dan insert ke tabel order_photos
      if (photos && photos.length > 0) {
        // Upload secara paralel untuk mempercepat proses
        const uploadPromises = Array.from(photos).map(async (file) => {
          const publicUrl = await uploadPhoto(file, 'orders');
          
          const { error: photoError } = await supabase
            .from('order_photos')
            .insert({
              order_id: orderId,
              url_foto: publicUrl,
              tipe: 'referensi'
            });

          if (photoError) throw new Error(`Gagal menyimpan foto referensi: ${photoError.message}`);
        });

        await Promise.all(uploadPromises);
      }

      // 4. Redirect ke halaman status
      router.push(`/status/${orderId}`);

    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses pesanan.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 py-20 px-6 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Mulai Proyek Anda</h1>
          <p className="text-zinc-400">Silakan isi formulir di bawah ini dengan lengkap. Tim AJS Steel akan segera memproses dan menghubungi Anda.</p>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/50 border border-red-900/80 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl space-y-6">
          
          {/* Pilihan Layanan */}
          <div>
            <label htmlFor="service_id" className="block text-sm font-medium text-zinc-300 mb-2">Jenis Layanan <span className="text-orange-500">*</span></label>
            <select
              id="service_id"
              name="service_id"
              required
              disabled={loadingServices}
              value={formData.service_id}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 disabled:opacity-50 transition-colors"
            >
              {loadingServices ? (
                <option value="">Memuat layanan...</option>
              ) : services.length === 0 ? (
                <option value="">Tidak ada layanan tersedia</option>
              ) : (
                services.map(s => (
                  <option key={s.id} value={s.id}>{s.nama_layanan}</option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Customer */}
            <div>
              <label htmlFor="nama_customer" className="block text-sm font-medium text-zinc-300 mb-2">Nama Lengkap <span className="text-orange-500">*</span></label>
              <input
                type="text"
                id="nama_customer"
                name="nama_customer"
                required
                placeholder="Contoh: Budi Santoso"
                value={formData.nama_customer}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              />
            </div>

            {/* No HP */}
            <div>
              <label htmlFor="no_hp" className="block text-sm font-medium text-zinc-300 mb-2">No. HP / WhatsApp <span className="text-orange-500">*</span></label>
              <input
                type="tel"
                id="no_hp"
                name="no_hp"
                required
                placeholder="0812xxxxxx"
                value={formData.no_hp}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-zinc-300 mb-2">Alamat Lengkap <span className="text-orange-500">*</span></label>
            <textarea
              id="alamat"
              name="alamat"
              required
              rows={3}
              placeholder="Detail alamat pemasangan / pengerjaan..."
              value={formData.alamat}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors resize-none"
            ></textarea>
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-zinc-300 mb-2">Detail Kebutuhan <span className="text-orange-500">*</span></label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              required
              rows={4}
              placeholder="Jelaskan kebutuhan Anda secara spesifik (ukuran, model, dll)..."
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors resize-none"
            ></textarea>
          </div>

          {/* Upload Foto */}
          <div>
            <label htmlFor="fotos" className="block text-sm font-medium text-zinc-300 mb-2">
              Foto Referensi (Opsional)
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                id="fotos"
                name="fotos"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-orange-500 hover:file:bg-zinc-700 transition-colors cursor-pointer"
              />
              <p className="text-xs text-zinc-500">Anda dapat memilih lebih dari satu foto.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || loadingServices}
              className="w-full relative flex justify-center items-center rounded-xl bg-orange-600 px-4 py-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses Pesanan...
                </>
              ) : (
                "Kirim Pesanan"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
