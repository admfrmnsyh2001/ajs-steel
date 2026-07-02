import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Portfolio {
  id: string;
  judul: string;
  url_foto: string;
  created_at: string;
}

export const revalidate = 0;

export default async function PortfolioPage() {
  const { data: portfolios, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-orange-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-orange-500 transition-colors">
              AJS
            </div>
            <span className="font-bold text-xl tracking-wide hidden sm:block">STEEL</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <Link href="/#tentang" className="hover:text-white transition-colors">Tentang Kami</Link>
            <Link href="/#layanan" className="hover:text-white transition-colors">Layanan</Link>
            <Link href="/portfolio" className="text-orange-400">Portfolio</Link>
          </div>
          <Link href="/order" className="bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5">
            Order Online
          </Link>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative py-24 px-6 sm:px-8 overflow-hidden border-b border-zinc-800/50">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-900/20 via-zinc-950 to-zinc-950"></div>
          <div className="max-w-7xl mx-auto">
            <p className="text-orange-500 font-semibold tracking-wider text-sm uppercase mb-3">Galeri Karya</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">Portfolio Proyek AJS Steel</h1>
            <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
              Setiap foto adalah bukti nyata. Kami bangga dengan setiap proyek yang telah kami selesaikan — dari pagar minimalis hingga konstruksi gudang berskala besar.
            </p>
          </div>
        </section>

        {/* Galeri Grid */}
        <section className="py-20 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto">
            {error && (
              <div className="p-6 rounded-2xl bg-red-950/30 border border-red-900/50 text-red-400 text-center max-w-2xl mx-auto">
                <p className="font-semibold">Gagal memuat data portfolio.</p>
                <p className="text-sm mt-2 opacity-80">{error.message}</p>
              </div>
            )}

            {!error && (!portfolios || portfolios.length === 0) && (
              <div className="text-center py-24 rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Galeri Masih Kosong</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">Admin belum menambahkan foto portfolio. Silakan cek kembali nanti!</p>
              </div>
            )}

            {portfolios && portfolios.length > 0 && (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {portfolios.map((item: Portfolio) => (
                  <div 
                    key={item.id} 
                    className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 shadow-lg hover:shadow-[0_8px_30px_rgba(234,88,12,0.2)] transition-all duration-500"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.url_foto} 
                      alt={item.judul} 
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    {/* Overlay Judul */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-5 w-full">
                        <h3 className="text-white font-bold text-base leading-tight">{item.judul}</h3>
                        <p className="text-zinc-400 text-xs mt-1">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Bawah */}
        <section className="py-20 px-6 sm:px-8 border-t border-zinc-800/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Tertarik Membuat Proyek Serupa?</h2>
            <p className="text-zinc-400 mb-8">Ceritakan kebutuhan Anda dan kami akan mewujudkannya dengan material terbaik.</p>
            <Link href="/order" className="inline-block bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] hover:-translate-y-1 transition-all duration-300">
              Konsultasi & Pesan Sekarang
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-8 px-6 text-center text-zinc-500 text-sm">
        <p>&copy; {new Date().getFullYear()} AJS Steel. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
