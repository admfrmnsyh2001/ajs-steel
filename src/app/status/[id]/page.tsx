import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0; // Jangan di-cache, selalu fetch data terbaru

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Fetch order beserta relasi ke services dan order_photos
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      services ( nama_layanan ),
      order_photos ( id, url_foto, tipe )
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-xl font-bold text-white mb-2">Pesanan Tidak Ditemukan</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Kami tidak dapat menemukan pesanan dengan ID tersebut, atau akses ditolak karena pengaturan privasi (RLS).
          </p>
          <Link href="/" className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-full transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  // Definisi tahapan status
  const steps = [
    { id: 'pending', label: 'Menunggu Konfirmasi' },
    { id: 'survey', label: 'Survey' },
    { id: 'dikerjakan', label: 'Dikerjakan' },
    { id: 'selesai', label: 'Selesai' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);

  // Pisahkan foto
  const referensiPhotos = order.order_photos?.filter((p: any) => p.tipe === 'referensi') || [];
  const progressPhotos = order.order_photos?.filter((p: any) => p.tipe === 'progress') || [];

  // Helper untuk format tanggal
  const formattedDate = new Date(order.created_at).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 py-16 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
          <div>
            <Link href="/" className="text-sm text-orange-500 hover:text-orange-400 mb-4 inline-flex items-center gap-1 transition-colors">
              <span>&larr;</span> Beranda
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight">Detail Pesanan</h1>
            <p className="text-zinc-500 font-mono text-sm mt-2">ID: {order.id}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-zinc-400">Dibuat pada</p>
            <p className="font-medium text-zinc-300">{formattedDate}</p>
          </div>
        </div>

        {/* Stepper Status */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl mb-8 backdrop-blur-sm shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-8">Status Pengerjaan</h2>
          <div className="relative">
            {/* Garis background stepper */}
            <div className="absolute top-5 left-0 w-full h-1 bg-zinc-800 rounded-full" aria-hidden="true"></div>
            {/* Garis progress stepper */}
            <div 
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-500" 
              style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` }}
              aria-hidden="true"
            ></div>
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300 ${
                      isCompleted ? 'bg-orange-600 border-orange-600 text-white' : 
                      isCurrent ? 'bg-zinc-900 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(50,130,184,0.5)]' : 
                      'bg-zinc-950 border-zinc-800 text-zinc-600'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <p className={`mt-3 text-xs sm:text-sm font-medium text-center absolute top-12 w-24 -ml-12 left-1/2 ${
                      isCompleted || isCurrent ? 'text-zinc-200' : 'text-zinc-500'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-16"></div> {/* Spacer untuk text absolute */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Customer & Pesanan */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-4 mb-6">Informasi Pelanggan</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Nama Lengkap</dt>
                  <dd className="mt-1 text-base text-zinc-200 font-medium">{order.nama_customer}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-zinc-500">No. HP / WhatsApp</dt>
                  <dd className="mt-1 text-base text-zinc-200">{order.no_hp}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-zinc-500">Alamat Pemasangan</dt>
                  <dd className="mt-1 text-base text-zinc-200 leading-relaxed">{order.alamat || '-'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-4 mb-6">Detail Layanan</h2>
              <dl className="space-y-6">
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Jenis Layanan</dt>
                  <dd className="mt-1 text-base text-zinc-200 font-medium">{order.services?.nama_layanan}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-zinc-500">Deskripsi Kebutuhan</dt>
                  <dd className="mt-1 text-base text-zinc-200 leading-relaxed whitespace-pre-wrap">{order.deskripsi}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Galeri Foto */}
          <div className="space-y-8">
            {/* Foto Progress (Diutamakan jika ada) */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                Foto Progress
              </h2>
              {progressPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {progressPhotos.map((photo: any) => (
                    <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url_foto} alt="Progress" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 p-4 border border-dashed border-zinc-800 rounded-xl text-center">
                  Belum ada foto progress pengerjaan.
                </p>
              )}
            </div>

            {/* Foto Referensi */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                Foto Referensi
              </h2>
              {referensiPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {referensiPhotos.map((photo: any) => (
                    <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url_foto} alt="Referensi" className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 p-4 border border-dashed border-zinc-800 rounded-xl text-center">
                  Tidak ada foto referensi.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
