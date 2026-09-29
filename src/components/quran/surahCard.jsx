'use client';

import React from 'react';
import Link from 'next/link';
import { RubElHizb } from '@/components/ui/rubElHizb';

export const SurahCard = ({ surah, titleOnly }) => {
  const isMakkiyah = surah.type === 'Makkiyah' || surah.place === 'Mecca';

  return (
    <Link
      href={`/my-quran/${surah.number_of_surah}`}
      className="group block"
    >
      <div className="relative p-4 rounded-xl border border-base-300 bg-base-100 hover:bg-base-200/50 hover:border-primary/40 hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-3">
        {/* Left: Number medallion & Surah metadata */}
        <div className="flex items-center gap-3.5 min-w-0">
          <RubElHizb
            className="w-10 h-10 shrink-0"
            starClassName="text-primary/15 group-hover:text-primary/30"
            borderClassName="stroke-primary/50"
            textClassName="text-xs font-bold text-primary"
          >
            {surah.number_of_surah}
          </RubElHizb>

          <div className="min-w-0 truncate">
            <h3 className="font-semibold text-sm sm:text-base text-base-content group-hover:text-primary transition-colors truncate">
              {surah.name}
            </h3>

            {!titleOnly && (
              <p className="text-xs text-base-content/60 truncate mt-0.5">
                {surah.name_translations?.id || surah.name_translations?.en}
              </p>
            )}

            {!titleOnly && (
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-base-content/50">
                <span
                  className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium ${
                    isMakkiyah
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {isMakkiyah ? 'Makkiyah' : 'Madaniyah'}
                </span>
                <span>•</span>
                <span>{surah.number_of_ayah} Ayat</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Arabic Name */}
        {!titleOnly && (
          <div className="text-right shrink-0 pl-2">
            <span
              className="font-amiri text-xl sm:text-2xl text-base-content/90 group-hover:text-primary transition-colors block select-none"
              dir="rtl"
            >
              {surah.name_translations?.ar || ''}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
