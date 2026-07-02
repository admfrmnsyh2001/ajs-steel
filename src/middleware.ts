import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Ambil token dari cookie yang diset saat login
  const token = req.cookies.get('sb-access-token')?.value;

  // Cek apakah request menuju halaman admin (selain halaman login)
  if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
    // Jika tidak ada token login, redirect ke halaman login
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah login atau akses rute non-admin, biarkan lewat
  return NextResponse.next();
}

// Konfigurasi route mana saja yang perlu dicek oleh middleware ini
export const config = {
  matcher: ['/admin/:path*'],
};
