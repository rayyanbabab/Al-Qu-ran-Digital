'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookMarked, SlidersHorizontal, BookOpen } from 'lucide-react';
import { RubElHizb } from './rubElHizb';
import { ThemeSwitcher } from './themeSwitcher';

export const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    const updateLastRead = () => {
      try {
        const saved = localStorage.getItem('quran_last_read');
        if (saved) {
          setLastRead(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Error reading last read:', e);
      }
    };

    updateLastRead();
    window.addEventListener('storage', updateLastRead);
    window.addEventListener('quran_last_read_updated', updateLastRead);

    return () => {
      window.removeEventListener('storage', updateLastRead);
      window.removeEventListener('quran_last_read_updated', updateLastRead);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-base-100/90 backdrop-blur-md border-b border-base-300 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
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

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Last read quick button */}
            {lastRead && (
              <Link
                href={`/my-quran/${lastRead.surahId}#${lastRead.ayah}`}
                className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
                title="Lanjutkan bacaan terakhir"
              >
                <BookMarked className="w-3.5 h-3.5 text-primary" />
                <span>
                  Terakhir: <strong className="font-semibold">{lastRead.surahName} : {lastRead.ayah}</strong>
                </span>
              </Link>
            )}

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              type="button"
              className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border border-base-300 hover:border-base-content/20 hover:bg-base-200 text-base-content/80 transition-colors"
              aria-label="Buka Pengaturan Tampilan"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Tampilan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <ThemeSwitcher isOpen={true} onClose={() => setShowSettings(false)} />
      )}
    </>
  );
};
