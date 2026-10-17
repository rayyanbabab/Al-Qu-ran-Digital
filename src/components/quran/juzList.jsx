'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { JUZ_DATA } from '@/lib/juzData';
import { RubElHizb } from '@/components/ui/rubElHizb';
import { Search, ArrowRight, BookOpen } from 'lucide-react';

export const JuzList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJuz = JUZ_DATA.filter((j) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      j.name.toLowerCase().includes(q) ||
      j.juz.toString() === q ||
      j.start.surahName.toLowerCase().includes(q) ||
      j.end.surahName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Input for Juz */}
      <div className="relative max-w-md mx-auto sm:mx-0">
        <Search className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari Juz 1 - 30 atau nama Surah..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-sm placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Grid of Juz Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredJuz.map((juz) => (
          <Link
            key={juz.juz}
            href={`/my-quran/${juz.start.surahId}#ayah-${juz.start.verse}`}
            className="group block"
          >
            <div className="relative p-4 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200/50 hover:border-primary/40 hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-3">
              {/* Left: Medallion & Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <RubElHizb
                  className="w-10 h-10 shrink-0"
                  starClassName="text-primary/15 group-hover:text-primary/30"
                  textClassName="text-xs font-bold text-primary"
                >
                  {juz.juz}
                </RubElHizb>

                <div className="min-w-0 truncate">
                  <h3 className="font-semibold text-sm sm:text-base text-base-content group-hover:text-primary transition-colors truncate">
                    {juz.name}
                  </h3>

                  <p className="text-xs text-base-content/70 truncate mt-0.5">
                    Mulai: <span className="font-medium text-base-content">{juz.start.surahName} : {juz.start.verse}</span>
                  </p>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-base-content/50">
                    <span className="truncate">Sampai: {juz.end.surahName} : {juz.end.verse}</span>
                    <span>•</span>
                    <span className="shrink-0">{juz.verseCount} Ayat</span>
                  </div>
                </div>
              </div>

              {/* Right: Arabic & Action Icon */}
              <div className="text-right shrink-0 pl-2 flex flex-col items-end gap-1">
                <span
                  className="font-amiri text-lg sm:text-xl text-base-content/80 group-hover:text-primary transition-colors block select-none"
                  dir="rtl"
                >
                  {juz.arabic}
                </span>
                <span className="text-[11px] text-primary inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  Buka <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredJuz.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-base-300">
          <BookOpen className="w-8 h-8 text-base-content/30 mx-auto mb-2" />
          <p className="text-xs text-base-content/60">Tidak ada Juz yang cocok dengan pencarian.</p>
        </div>
      )}
    </div>
  );
};
