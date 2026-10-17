'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DOA_CATEGORIES, DOA_DATA } from '@/lib/doaData';
import {
  Search,
  Copy,
  Check,
  Share2,
  ChevronRight,
  BookOpen,
  ScrollText,
} from 'lucide-react';

export default function DoaPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleCopyDoa = (doa) => {
    const textToCopy = `${doa.title}\n\n${doa.arabic}\n\nLatin:\n${doa.latin}\n\nArtinya:\n"${doa.translation}"\n\n(${doa.source})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(doa.id);
    showToast('Doa berhasil disalin ke clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareDoa = (doa) => {
    const text = `${doa.title}\n\n${doa.arabic}\n\n"${doa.translation}"\n(${doa.source})`;
    if (navigator.share) {
      navigator.share({
        title: doa.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('Teks doa disalin untuk dibagikan');
    }
  };

  const filteredDoa = DOA_DATA.filter((item) => {
    const matchCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;

    if (!matchCategory) return false;

    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.translation.toLowerCase().includes(q) ||
      item.latin.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20">
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
        <span className="text-base-content font-medium">Kumpulan Doa</span>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-base-100 border border-base-300 p-6 sm:p-7 mb-8 shadow-2xs">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
            <ScrollText className="w-3.5 h-3.5" />
            <span>Doa Pilihan & Hisnul Muslim</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
            Kumpulan Doa Mustajab
          </h1>
          <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
            Doa-doa pilihan dari Al-Qur&apos;anul Karim, doa para Nabi, dan doa
            harian shahih dilengkapi teks Arab, transliterasi Latin, serta terjemahannya.
          </p>
        </div>
      </div>

      {/* Controls: Search & Category Pills */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari doa, arti, atau sumber ayat..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-base-300 bg-base-100 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DOA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              type="button"
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-content shadow-xs'
                  : 'bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List of Doa Cards */}
      <div className="space-y-4">
        {filteredDoa.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-base-300 rounded-2xl">
            <BookOpen className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
            <p className="text-xs text-base-content/60">
              Tidak ada doa yang cocok dengan pencarian Anda.
            </p>
          </div>
        ) : (
          filteredDoa.map((doa) => {
            const isCopied = copiedId === doa.id;

            return (
              <article
                key={doa.id}
                className="p-5 sm:p-7 rounded-2xl border border-base-300 bg-base-100 hover:border-primary/30 shadow-xs transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-base-300/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
                      {doa.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-base-content">
                      {doa.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyDoa(doa)}
                      type="button"
                      className="p-1.5 rounded-lg border border-base-300 hover:border-primary/40 hover:bg-base-200 text-base-content/70 transition-colors"
                      title="Salin Doa"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShareDoa(doa)}
                      type="button"
                      className="p-1.5 rounded-lg border border-base-300 hover:border-primary/40 hover:bg-base-200 text-base-content/70 transition-colors"
                      title="Bagikan Doa"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="py-2 text-right">
                  <p
                    className="font-amiri text-2xl sm:text-3xl text-base-content leading-relaxed"
                    dir="rtl"
                  >
                    {doa.arabic}
                  </p>
                </div>

                {/* Latin Transliteration */}
                <div className="bg-base-200/50 p-3 rounded-xl border border-base-300/50">
                  <p className="text-xs sm:text-sm font-medium text-primary/90 italic leading-relaxed">
                    {doa.latin}
                  </p>
                </div>

                {/* Indonesian Translation & Source */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs sm:text-sm text-base-content/85 leading-relaxed">
                    &quot;{doa.translation}&quot;
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-base-content/50 pt-2 border-t border-dashed border-base-300">
                    <span>Sumber: <strong className="font-medium text-base-content/70">{doa.source}</strong></span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
