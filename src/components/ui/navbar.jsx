'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookMarked,
  SlidersHorizontal,
  BookOpen,
  Compass,
  ScrollText,
  Heart,
  Menu,
  X,
  Bookmark,
  Sun,
  Navigation,
  Search,
} from 'lucide-react';
import { RubElHizb } from './rubElHizb';
import { ThemeSwitcher } from './themeSwitcher';
import { BookmarkDrawer } from '@/components/quran/bookmarkDrawer';
import { CommandPalette } from './commandPalette';
import { getBookmarks } from '@/lib/bookmarkStorage';

export const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastRead, setLastRead] = useState(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const pathname = usePathname();

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  useEffect(() => {
    const updateStorageData = () => {
      try {
        const saved = localStorage.getItem('quran_last_read');
        if (saved) {
          setLastRead(JSON.parse(saved));
        }
        setBookmarkCount(getBookmarks().length);
      } catch (e) {
        console.error('Error reading storage:', e);
      }
    };

    updateStorageData();
    window.addEventListener('storage', updateStorageData);
    window.addEventListener('quran_last_read_updated', updateStorageData);
    window.addEventListener('quran_bookmarks_updated', updateStorageData);

    return () => {
      window.removeEventListener('storage', updateStorageData);
      window.removeEventListener('quran_last_read_updated', updateStorageData);
      window.removeEventListener('quran_bookmarks_updated', updateStorageData);
    };
  }, []);

  const navLinks = [
    { href: '/', label: "Al-Qur'an", icon: BookOpen },
    { href: '/jadwal-sholat', label: 'Jadwal Sholat', icon: Compass },
    { href: '/kiblat', label: 'Arah Kiblat', icon: Navigation },
    { href: '/dzikir', label: 'Dzikir', icon: Sun },
    { href: '/cari-ayat', label: 'Cari Ayat', icon: Search },
    { href: '/doa', label: 'Doa', icon: ScrollText },
    { href: '/asmaul-husna', label: 'Asmaul Husna', icon: Heart },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-base-100/90 backdrop-blur-md border-b border-base-300 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <RubElHizb
              className="w-9 h-9"
              starClassName="text-primary/20 group-hover:text-primary/30"
              textClassName="text-primary font-bold text-sm"
            >
              <BookOpen className="w-4 h-4 text-primary" />
            </RubElHizb>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base sm:text-lg tracking-tight text-base-content group-hover:text-primary transition-colors">
                  Al-Qur&apos;an Digital
                </span>
                <span className="hidden xs:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  Kemenag
                </span>
              </div>
              <p className="text-[11px] text-base-content/50 leading-none">
                30 Juz • 114 Surah • Terjemahan & Tafsir
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname.startsWith('/my-quran')
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/70 hover:text-base-content hover:bg-base-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Command Palette Button */}
            <button
              onClick={() => setShowCommandPalette(true)}
              type="button"
              className="flex items-center gap-2 py-1.5 px-2.5 sm:px-3 rounded-lg border border-base-300 bg-base-200/50 hover:bg-base-200 hover:border-primary/40 text-xs text-base-content/70 hover:text-base-content transition-all shadow-2xs group whitespace-nowrap"
              title="Cari Cepat (Ctrl+K)"
              aria-label="Buka Pencarian Cepat"
            >
              <Search className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden xl:inline text-base-content/60">Cari surah...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-base-100 border border-base-300 text-base-content/60 shrink-0">
                Ctrl K
              </kbd>
            </button>

            {/* Bookmark Drawer trigger */}
            <button
              onClick={() => setShowBookmarks(true)}
              type="button"
              className="relative p-2 rounded-lg border border-base-300 hover:border-primary/40 hover:bg-base-200 text-base-content/80 transition-colors shrink-0"
              title="Ayat Tersimpan"
              aria-label="Buka Ayat Tersimpan"
            >
              <Bookmark className="w-4 h-4 text-primary" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-content text-[10px] font-bold flex items-center justify-center">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              )}
            </button>

            {/* Last read quick button */}
            {lastRead && (
              <Link
                href={`/my-quran/${lastRead.surahId}#ayah-${lastRead.ayah}`}
                className="hidden 2xl:flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-colors shrink-0"
                title="Lanjutkan bacaan terakhir"
              >
                <BookMarked className="w-3.5 h-3.5 text-primary" />
                <span className="truncate max-w-[130px]">
                  Terakhir: <strong>{lastRead.surahName}</strong>
                </span>
              </Link>
            )}

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              type="button"
              className="flex items-center gap-1.5 py-2 px-2.5 sm:px-3 rounded-lg text-xs font-medium border border-base-300 hover:border-base-content/20 hover:bg-base-200 text-base-content/80 transition-colors shrink-0"
              aria-label="Buka Pengaturan Tampilan"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Tampilan</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 rounded-lg border border-base-300 hover:bg-base-200 text-base-content/80"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-base-300 bg-base-100 px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {/* Quick Search in Mobile Menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowCommandPalette(true);
              }}
              type="button"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-base-200/80 text-base-content/80 hover:bg-base-200 mb-2 border border-base-300"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-primary" />
                <span>Cari Cepat (Surah, Ayat, Fitur)...</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-base-100 border border-base-300 text-base-content/60">
                Ctrl K
              </span>
            </button>

            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname.startsWith('/my-quran')
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-content'
                      : 'text-base-content/70 hover:bg-base-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {lastRead && (
              <Link
                href={`/my-quran/${lastRead.surahId}#ayah-${lastRead.ayah}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary mt-2"
              >
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4" />
                  <span>Lanjutkan: {lastRead.surahName} (Ayat {lastRead.ayah})</span>
                </div>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <ThemeSwitcher isOpen={true} onClose={() => setShowSettings(false)} />
      )}

      {/* Bookmark Drawer */}
      <BookmarkDrawer
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
      />

      {/* Global Command Palette / Spotlight Search */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </>
  );
};
export default Navbar;
