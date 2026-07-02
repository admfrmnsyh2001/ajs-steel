import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Navbar } from '@/components/Navbar';

interface Service {
  id: string;
  nama_layanan: string;
  deskripsi: string | null;
  harga_dasar: number | null;
  url_gambar: string | null;
}

export const revalidate = 0;

export default async function LandingPage() {
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-orange-500/30 font-sans overflow-x-hidden transition-colors duration-300">

      <Navbar />

      <main>
        {/* ===== HERO SECTION ===== */}
        <section
          id="beranda"
          className="relative flex flex-col items-center justify-center px-6 py-32 sm:py-48 lg:px-8 min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/welder.jpg')" }}
        >
          <div className="absolute inset-0 bg-zinc-950/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-950/30 via-transparent to-transparent"></div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Spesialis Konstruksi Baja & Pengelasan
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-8 leading-tight">
              Kekuatan <span className="text-orange-500">Baja</span>,<br /> Presisi <span className="text-yellow-500">Karya</span>
            </h1>
            <p className="text-lg sm:text-xl leading-8 text-zinc-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] max-w-2xl mx-auto mb-10">
              AJS Steel adalah bengkel las profesional yang mengubah material mentah menjadi mahakarya tangguh untuk kebutuhan arsitektur dan industri Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/order" className="w-full sm:w-auto rounded-full bg-orange-600 px-8 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Mulai Proyek Anda
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link href="/portfolio" className="w-full sm:w-auto rounded-full bg-white/10 border border-white/30 px-8 py-4 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300">
                Lihat Portfolio
              </Link>
            </div>
          </div>
        </section>

        {/* ===== TENTANG KAMI ===== */}
        <section id="tentang" className="py-24 px-6 sm:px-8 lg:px-12 bg-white dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-800/50 relative overflow-hidden transition-colors duration-300">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 blur-2xl rounded-full opacity-50"></div>
              <div className="relative aspect-square md:aspect-[4/3] rounded-3xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-60 dark:opacity-40 group-hover:opacity-70 dark:group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 p-6 rounded-2xl">
                    <p className="text-orange-500 font-bold text-3xl mb-1">10+ Tahun</p>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm">Pengalaman di Industri Pengelasan</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-orange-500 font-semibold tracking-wider text-sm uppercase mb-3">Tentang AJS Steel</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">Membangun Kepercayaan Lewat Struktur yang Kokoh</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6 leading-relaxed">
                Berdiri dari dedikasi terhadap kualitas kerja, AJS Steel telah dipercaya oleh ratusan klien untuk menangani proyek konstruksi baja ringan hingga berat.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
                Dilengkapi dengan peralatan modern dan dikerjakan oleh teknisi bersertifikat, kami menjamin kepuasan pada setiap pengerjaan kanopi, pagar, tralis, hingga struktur gudang industri.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <h4 className="text-zinc-900 dark:text-white font-bold text-xl mb-1">500+</h4>
                  <p className="text-zinc-500 text-sm">Proyek Selesai</p>
                </div>
                <div>
                  <h4 className="text-zinc-900 dark:text-white font-bold text-xl mb-1">100%</h4>
                  <p className="text-zinc-500 text-sm">Garansi Kualitas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== KEUNGGULAN ===== */}
        <section id="keunggulan" className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto text-center">
          <h2 className="text-orange-500 font-semibold tracking-wider text-sm uppercase mb-3">Mengapa Memilih Kami</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-16">Standar Baru dalam Fabrikasi</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Material Premium",
                desc: "Kami menggunakan baja dan besi berkualitas tinggi berstandar SNI yang tahan terhadap cuaca ekstrem dan karat."
              },
              {
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Pengerjaan Tepat Waktu",
                desc: "Manajemen waktu adalah prioritas kami. Proyek dikerjakan secara sistematis untuk memenuhi target deadline Anda."
              },
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Tim Profesional",
                desc: "Dikerjakan oleh tukang las tersertifikasi dengan akurasi dan tingkat kerapian pengelasan yang estetis serta kuat."
              }
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-colors group shadow-sm dark:shadow-none">
                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{item.title}</h4>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LAYANAN ===== */}
        <section id="layanan" className="py-24 px-6 sm:px-8 lg:px-12 bg-white dark:bg-zinc-900/20 border-t border-zinc-200 dark:border-zinc-800/50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-orange-500 font-semibold tracking-wider text-sm uppercase mb-3">Layanan Kami</h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">Solusi Fabrikasi Kustom</h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">Daftar jasa yang kami sediakan untuk memenuhi kebutuhan konstruksi rumah dan industri Anda.</p>
            </div>

            {error && (
              <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-center max-w-2xl mx-auto">
                <p className="font-semibold">Gagal memuat layanan.</p>
                <p className="text-sm mt-2 opacity-80">{error.message}</p>
              </div>
            )}

            {!error && (!services || services.length === 0) && (
              <div className="text-center p-12 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 max-w-2xl mx-auto">
                <p className="text-zinc-400">Belum ada layanan yang ditambahkan.</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services?.map((service: Service) => (
                <div
                  key={service.id}
                  className="group relative rounded-3xl bg-white dark:bg-zinc-900/60 ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-sm dark:shadow-none overflow-hidden hover:ring-orange-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(234,88,12,0.2)] flex flex-col"
                >
                  {/* Gambar Layanan */}
                  <div className="relative h-48 bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                    {service.url_gambar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.url_gambar}
                        alt={service.nama_layanan}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs font-medium">AJS Steel</span>
                      </div>
                    )}
                    {/* Overlay gradient bawah */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>

                  {/* Konten */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold leading-7 text-zinc-900 dark:text-zinc-100 mb-3">{service.nama_layanan}</h4>
                    <p className="leading-relaxed text-zinc-500 dark:text-zinc-400 text-sm flex-grow">
                      {service.deskripsi || "Hubungi kami untuk deskripsi lebih lanjut mengenai layanan ini."}
                    </p>
                    <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Mulai Dari</p>
                        <p className="text-xl font-bold text-zinc-900 dark:text-white">
                          {service.harga_dasar ? `Rp ${service.harga_dasar.toLocaleString('id-ID')}` : 'Custom'}
                        </p>
                      </div>
                      <Link href={`/order?service_id=${service.id}`} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-orange-600 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24 px-6 sm:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-600"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Siap Membangun Proyek Anda?</h2>
            <p className="text-orange-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
              Konsultasikan kebutuhan spesifik Anda. Kami siap merancang, membuat, dan memasang konstruksi besi impian Anda dengan harga transparan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order" className="bg-zinc-950 hover:bg-zinc-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all">
                Pesan / Minta Survey Sekarang
              </Link>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="bg-orange-500 hover:bg-orange-400 border border-orange-400 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8 px-6 sm:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-white">AJS</div>
              <span className="font-bold text-xl tracking-wide text-zinc-900 dark:text-white">STEEL</span>
            </div>
            <p className="text-zinc-500 leading-relaxed max-w-sm">
              Menyediakan jasa pengelasan profesional dan konstruksi besi/baja untuk perumahan, ruko, dan industri dengan standar kualitas tinggi.
            </p>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-white font-bold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-zinc-500">
              <li><Link href="#beranda" className="hover:text-orange-500 transition-colors">Beranda</Link></li>
              <li><Link href="#tentang" className="hover:text-orange-500 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#layanan" className="hover:text-orange-500 transition-colors">Layanan</Link></li>
              <li><Link href="/portfolio" className="hover:text-orange-500 transition-colors">Galeri Portfolio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-zinc-900 dark:text-white font-bold mb-4">Kontak</h4>
            <ul className="space-y-3 text-zinc-500">
              <li className="flex gap-2">
                <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-sm">Jl. Industri Baja Raya No. 45, Jakarta Selatan</span>
              </li>
              <li className="flex gap-2 items-center">
                <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span className="text-sm">+62 812 3456 7890</span>
              </li>
              <li className="flex gap-2 items-center">
                <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="text-sm">halo@ajs-steel.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-400 text-sm">&copy; {new Date().getFullYear()} AJS Steel. Dirancang dengan presisi.</p>
          <Link href="/admin/login" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs transition-colors">Admin Login</Link>
        </div>
      </footer>
    </div>
  );
}
