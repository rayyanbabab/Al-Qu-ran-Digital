'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ASMAUL_HUSNA } from '@/lib/asmaulHusnaData';
import { RubElHizb } from '@/components/ui/rubElHizb';
import { Search, ChevronRight, BookOpen, Copy, Check } from 'lucide-react';

export default function AsmaulHusnaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleCopyName = (item) => {
    const text = `${item.number}. ${item.latin} (${item.arabic}) - Artinya: ${item.translation}`;
    navigator.clipboard.writeText(text);
    setCopiedNumber(item.number);
    showToast(`Asmaul Husna ${item.latin} disalin`);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredData = ASMAUL_HUSNA.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.number.toString() === q ||
      item.latin.toLowerCase().includes(q) ||
      item.translation.toLowerCase().includes(q) ||
      item.arabic.includes(searchTerm)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
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
        <span className="text-base-content font-medium">Asmaul Husna</span>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-base-100 border border-base-300 p-6 sm:p-7 mb-8 shadow-2xs">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>99 Nama-Nama Agung Allah SWT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
            Asmaul Husna
          </h1>
          <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
            &quot;Dialah Allah, tidak ada tuhan selain Dia. Dia mempunyai Asmaul Husna (nama-nama yang terbaik).&quot; (QS. Thaha: 8)
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-6">
        <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama latin, arti, atau nomor (1-99)..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-base-300 bg-base-100 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Grid of 99 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.map((item) => {
          const isCopied = copiedNumber === item.number;

          return (
            <div
              key={item.number}
              onClick={() => handleCopyName(item)}
              className="p-5 rounded-2xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer relative"
              title="Klik untuk menyalin"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <RubElHizb
                  className="w-8 h-8"
                  starClassName="text-primary/20 group-hover:text-primary/40"
                  textClassName="text-xs font-bold text-primary"
                >
                  {item.number}
                </RubElHizb>

                <button
                  type="button"
                  className="p-1 rounded-lg text-base-content/40 group-hover:text-primary hover:bg-base-200 transition-colors"
                  aria-label="Salin nama"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Arabic Name */}
              <div className="text-center py-2">
                <span
                  className="font-amiri text-3xl sm:text-4xl text-base-content group-hover:text-primary transition-colors block select-none"
                  dir="rtl"
                >
                  {item.arabic}
                </span>
              </div>

              {/* Latin & Translation */}
              <div className="text-center mt-3 pt-3 border-t border-dashed border-base-300/80">
                <h3 className="font-bold text-sm sm:text-base text-base-content group-hover:text-primary transition-colors">
                  {item.latin}
                </h3>
                <p className="text-xs text-base-content/60 mt-0.5 line-clamp-1">
                  {item.translation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-16 border border-dashed border-base-300 rounded-2xl">
          <BookOpen className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
          <p className="text-xs text-base-content/60">
            Tidak ada nama yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}
    </div>
  );
}
