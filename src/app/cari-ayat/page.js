'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RubElHizb } from '@/components/ui/rubElHizb';
import {
  Search,
  X,
  BookOpen,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

const POPULAR_KEYWORDS = [
  'Sabar',
  'Rezeki',
  'Surga',
  'Sholat',
  'Sedekah',
  'Orang Tua',
  'Hati',
  'Taubat',
  'Syukur',
  'Hidayah',
  'Kematian',
  'Adil',
];

export default function CariAyatPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Debounce input to prevent spamming
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch search results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/search-ayah?q=${encodeURIComponent(debouncedQuery)}&limit=50`);
        const data = await res.json();
        setResults(data.results || []);
        setTotalCount(data.total || 0);
      } catch (err) {
        console.error('Error searching verses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleCopy = (item) => {
    const text = `${item.arabic}\n\n"${item.translation}"\n(QS. ${item.surahName} : ${item.ayahNumber})`;
    navigator.clipboard.writeText(text);
    setCopiedId(`${item.surahNumber}:${item.ayahNumber}`);
    showToast('Ayat berhasil disalin');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (item) => {
    const text = `${item.arabic}\n\n"${item.translation}"\n(QS. ${item.surahName} : ${item.ayahNumber})`;
    if (navigator.share) {
      navigator.share({
        title: `QS. ${item.surahName} : ${item.ayahNumber}`,
        text,
        url: `${window.location.origin}/my-quran/${item.surahNumber}#ayah-${item.ayahNumber}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('Teks disalin untuk dibagikan');
    }
  };

  // Helper function to highlight search term in text
  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          className="bg-primary/20 text-primary font-semibold rounded px-1 py-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 py-2.5 px-4 rounded-xl bg-primary text-primary-content text-xs font-medium shadow-lg animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-base-content/60 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Al-Qur&apos;an
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-base-content font-medium">Cari Terjemahan Ayat</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-base-100 border border-base-300 p-6 sm:p-7 mb-8 shadow-2xs">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
            <Search className="w-3.5 h-3.5" />
            <span>Pencarian Kata Kunci 6.236 Ayat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
            Cari Makna & Terjemahan Ayat
          </h1>
          <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
            Temukan ayat-ayat Al-Qur&apos;an lengkap 30 Juz berdasarkan topik atau kata yang Anda
            cari (misal: <em>sabar</em>, <em>rezeki</em>, <em>surga</em>, <em>orang tua</em>).
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="space-y-3.5 mb-8">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-base-content/40 pointer-events-none">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-base-300 bg-base-100 text-sm placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            placeholder="Ketik topik atau kata kunci terjemahan (cth. sabar, rezeki, sedekah, sholat)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 p-1 rounded-full text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors"
              title="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Keyword Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-base-content/40 text-[11px] font-medium mr-1">
            Topik Populer:
          </span>
          {POPULAR_KEYWORDS.map((word) => (
            <button
              key={word}
              onClick={() => setSearchTerm(word)}
              type="button"
              className={`py-1 px-2.5 rounded-full text-[11px] font-medium transition-all border ${
                searchTerm.toLowerCase() === word.toLowerCase()
                  ? 'border-primary bg-primary text-primary-content shadow-xs'
                  : 'border-base-300 bg-base-100 hover:border-primary/40 text-base-content/70'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Counter */}
      {debouncedQuery && (
        <div className="flex items-center justify-between text-xs text-base-content/60 mb-4 px-1">
          <span>
            {isLoading ? (
              <span>Mencari ayat...</span>
            ) : (
              <span>
                Ditemukan{' '}
                <strong className="text-base-content font-bold">{totalCount}</strong>{' '}
                ayat yang mengandung kata &ldquo;
                <strong className="text-primary">{debouncedQuery}</strong>&rdquo;
              </span>
            )}
          </span>
        </div>
      )}

      {/* Results Stream */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-base-300 bg-base-100 animate-pulse space-y-3"
            >
              <div className="h-4 bg-base-300/60 rounded w-1/4" />
              <div className="h-6 bg-base-300/40 rounded w-3/4 ml-auto" />
              <div className="h-4 bg-base-300/50 rounded w-full" />
            </div>
          ))}
        </div>
      ) : debouncedQuery && results.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-200/30">
          <BookOpen className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
          <h3 className="font-semibold text-base text-base-content mb-1">
            Tidak ada ayat yang cocok
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto mb-4">
            Tidak ditemukan ayat dengan kata kunci &ldquo;{debouncedQuery}&rdquo;.
            Coba gunakan padanan kata lain dalam bahasa Indonesia.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn btn-sm btn-outline btn-primary rounded-xl"
          >
            Hapus Kata Kunci
          </button>
        </div>
      ) : !debouncedQuery ? (
        <div className="text-center py-14 px-4 rounded-3xl border border-base-300 bg-base-200/20 space-y-3">
          <Search className="w-10 h-10 text-primary/40 mx-auto" />
          <h3 className="font-semibold text-base text-base-content">
            Mulai Mencari Ayat Al-Qur&apos;an
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            Ketik kata kunci di atas atau pilih salah satu topik populer untuk melihat
            kumpulan ayat yang membahas hal tersebut.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((item) => {
            const verseKey = `${item.surahNumber}:${item.ayahNumber}`;
            const isCopied = copiedId === verseKey;

            return (
              <article
                key={verseKey}
                className="p-5 sm:p-6 rounded-2xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-xs transition-all space-y-4"
              >
                {/* Verse Header Badge & Navigation */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-base-200">
                  <div className="flex items-center gap-2.5">
                    <RubElHizb
                      className="w-7 h-7 shrink-0"
                      textClassName="text-[10px] font-bold text-primary"
                    >
                      {item.ayahNumber}
                    </RubElHizb>
                    <div>
                      <Link
                        href={`/my-quran/${item.surahNumber}`}
                        className="font-bold text-sm text-base-content hover:text-primary transition-colors"
                      >
                        QS. {item.surahName} : {item.ayahNumber}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => handleCopy(item)}
                      type="button"
                      className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors"
                      title="Salin ayat"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(item)}
                      type="button"
                      className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors"
                      title="Bagikan"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/my-quran/${item.surahNumber}#ayah-${item.ayahNumber}`}
                      className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-primary-content transition-all text-xs"
                      title="Buka ayat di surah"
                    >
                      <span>Buka Surah</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Arabic Text */}
                <div dir="rtl" className="py-1">
                  <p className="font-amiri text-2xl sm:text-3xl leading-[2.2] text-base-content text-right font-medium select-text">
                    {item.arabic}
                  </p>
                </div>

                {/* Translation with Highlight */}
                <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed italic">
                  &ldquo;{highlightText(item.translation, debouncedQuery)}&rdquo;
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
