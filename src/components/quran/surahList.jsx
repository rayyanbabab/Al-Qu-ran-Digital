'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SurahCard } from './surahCard';
import { SurahSearch } from './surahSearch';
import { BookMarked, ArrowRight, BookOpen } from 'lucide-react';
import { RubElHizb } from '@/components/ui/rubElHizb';

const SurahList = ({ listDisplay, titleOnly, listHeight }) => {
  const [quranData, setQuranData] = useState([]);
  const [filteredQuranData, setFilteredQuranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    // Check last read in localStorage
    try {
      const saved = localStorage.getItem('quran_last_read');
      if (saved) {
        setLastRead(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json'
        );
        const data = await response.json();
        setQuranData(data);
        setFilteredQuranData(data);
      } catch (error) {
        console.error('Error fetching Quran data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sidebar / compact drawer view
  if (titleOnly) {
    return (
      <div className="p-3 space-y-2">
        <SurahSearch
          setFilteredQuranData={setFilteredQuranData}
          quranData={quranData}
        />
        <div className={`space-y-2 ${listHeight || ''}`}>
          {filteredQuranData.map((surah) => (
            <SurahCard
              key={surah.number_of_surah}
              surah={surah}
              titleOnly={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero / Greeting & Last Read Card */}
      <div className="mb-8">
        {/* Welcome Greeting */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-base-200 to-base-100 border border-base-300 p-6 sm:p-8 mb-6">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Al-Qur&apos;anul Karim</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
                Membaca, Menghayati, & Mengamalkan
              </h1>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Teks Al-Qur&apos;an lengkap 30 Juz 114 Surah disertai terjemahan dan tafsir resmi Kementerian Agama Republik Indonesia.
              </p>
            </div>

            {/* Last read quick card */}
            {lastRead ? (
              <div className="shrink-0 p-4 rounded-xl bg-base-100/90 border border-primary/20 shadow-sm backdrop-blur-sm max-w-xs w-full">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                  <BookMarked className="w-4 h-4" />
                  <span>Terakhir Dibaca</span>
                </div>
                <h3 className="font-bold text-base text-base-content">
                  {lastRead.surahName}
                </h3>
                <p className="text-xs text-base-content/60 mb-3">
                  Ayat ke-{lastRead.ayah}
                </p>
                <Link
                  href={`/my-quran/${lastRead.surahId}#${lastRead.ayah}`}
                  className="inline-flex items-center justify-between w-full py-2 px-3 rounded-lg bg-primary text-primary-content text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>Lanjutkan Tilawah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="shrink-0 p-4 rounded-xl bg-base-100/80 border border-base-300 shadow-sm max-w-xs w-full">
                <span className="text-[11px] font-semibold text-primary block uppercase tracking-wider mb-1">
                  Mulai Dari Awal
                </span>
                <h3 className="font-bold text-base text-base-content">
                  Surah Al-Fatihah
                </h3>
                <p className="text-xs text-base-content/60 mb-3">
                  7 Ayat • Makkiyah
                </p>
                <Link
                  href="/my-quran/1"
                  className="inline-flex items-center justify-between w-full py-2 px-3 rounded-lg bg-primary text-primary-content text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>Buka Surah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search & Filter Component */}
        <SurahSearch
          setFilteredQuranData={setFilteredQuranData}
          quranData={quranData}
        />

        {/* Counter indicator */}
        <div className="flex items-center justify-between text-xs text-base-content/60 mb-4 px-1">
          <span>
            Menampilkan <strong className="font-semibold text-base-content">{filteredQuranData.length}</strong> dari 114 Surah
          </span>
        </div>
      </div>

      {/* Grid of Surah Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-base-300 bg-base-100 animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-3 w-3/4">
                <div className="w-10 h-10 rounded-lg bg-base-300/60" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-base-300/60 rounded w-1/2" />
                  <div className="h-3 bg-base-300/40 rounded w-1/3" />
                </div>
              </div>
              <div className="w-12 h-6 bg-base-300/50 rounded" />
            </div>
          ))}
        </div>
      ) : filteredQuranData.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-base-300 bg-base-200/30">
          <BookOpen className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
          <h3 className="font-semibold text-base text-base-content mb-1">
            Surah tidak ditemukan
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto mb-4">
            Tidak ada surah yang cocok dengan pencarian Anda. Coba kata kunci lain atau nomor surah (1 - 114).
          </p>
          <button
            onClick={() => setFilteredQuranData(quranData)}
            className="btn btn-sm btn-outline btn-primary"
          >
            Tampilkan Semua Surah
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredQuranData.map((surah) => (
            <SurahCard
              key={surah.number_of_surah}
              surah={surah}
              titleOnly={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SurahList;
