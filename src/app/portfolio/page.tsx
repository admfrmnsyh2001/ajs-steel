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
          <a href="https://wa.me/6288210596563?text=Halo%20AJS%20Steel%2C%20saya%20ingin%20konsultasi%20proyek." target="_blank" rel="noreferrer" className="bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5">
            Hubungi Kami
          </a>
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
                    className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-zinc-800 hover:border-orange-500/50 shadow-lg hover:shadow-[0_8px_30px_rgba(50,130,184,0.2)] transition-all duration-500"
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
             <a href="https://wa.me/6288210596563?text=Halo%20AJS%20Steel%2C%20saya%20ingin%20konsultasi%20proyek." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(15,76,117,0.4)] hover:shadow-[0_0_30px_rgba(15,76,117,0.6)] hover:-translate-y-1 transition-all duration-300">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
               Konsultasi & Pesan via WhatsApp
             </a>
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
