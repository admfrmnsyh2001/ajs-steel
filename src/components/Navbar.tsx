"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
          : "bg-transparent backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="#beranda" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center font-bold text-lg text-white group-hover:bg-orange-500 transition-colors shadow-[0_0_15px_rgba(234,88,12,0.4)]">
            AJS
          </div>
          <span
            className={`font-bold text-xl tracking-wide hidden sm:block transition-colors duration-300 ${
              scrolled ? "text-zinc-900 dark:text-white" : "text-white"
            }`}
          >
            STEEL
          </span>
        </Link>

        {/* Menu */}
        <div
          className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300 ${
            scrolled
              ? "text-zinc-600 dark:text-zinc-400"
              : "text-white/90"
          }`}
        >
          <Link href="#beranda" className={`hover:text-orange-500 transition-colors`}>Beranda</Link>
          <Link href="#tentang" className={`hover:text-orange-500 transition-colors`}>Tentang Kami</Link>
          <Link href="#keunggulan" className={`hover:text-orange-500 transition-colors`}>Keunggulan</Link>
          <Link href="#layanan" className={`hover:text-orange-500 transition-colors`}>Layanan</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* ThemeToggle adaptif */}
          <div
            className={`transition-colors duration-300 ${
              scrolled
                ? "[&_button]:border-zinc-200 dark:[&_button]:border-zinc-700 [&_button]:bg-zinc-100 dark:[&_button]:bg-zinc-800 [&_button]:text-zinc-700 dark:[&_button]:text-zinc-200"
                : "[&_button]:border-white/20 [&_button]:bg-white/10 [&_button]:text-white"
            }`}
          >
            <ThemeToggle />
          </div>

          {/* Order Button */}
          <Link
            href="/order"
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg ${
              scrolled
                ? "bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/20"
                : "bg-zinc-100 hover:bg-white text-zinc-950 shadow-white/10"
            }`}
          >
            Order Online
          </Link>
        </div>
      </div>
    </nav>
  );
}
