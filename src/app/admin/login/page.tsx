"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error('Email atau password salah');
      }

      if (data.session) {
        // Set cookie manual agar terbaca oleh middleware Next.js
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax`;
        document.cookie = `sb-refresh-token=${data.session.refresh_token}; path=/; max-age=${data.session.expires_in}; SameSite=Lax`;
        
        // Redirect ke dashboard admin
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat login');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-orange-500/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Ikon/Logo */}
        <div className="mx-auto h-16 w-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center rounded-2xl shadow-[0_0_15px_rgba(50,130,184,0.2)] mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Login Admin</h2>
        <p className="mt-2 text-sm text-zinc-400">
          AJS Steel Management Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900/50 border border-zinc-800 py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 backdrop-blur-sm">
          {errorMsg && (
            <div className="mb-6 rounded-xl bg-red-950/50 p-4 border border-red-900/50">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-400">{errorMsg}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                placeholder="admin@ajs-steel.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-orange-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  'Masuk Dashboard'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
