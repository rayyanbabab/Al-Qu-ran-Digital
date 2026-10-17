'use client';

import React from 'react';
import Link from 'next/link';
import { RubElHizb } from '@/components/ui/rubElHizb';
import { getSurahNameId } from '@/lib/surahMeta';
import { Play, Pause, Volume2 } from 'lucide-react';

export const SurahCard = ({
  surah,
  titleOnly,
  isPlaying,
  onTogglePlay,
}) => {
  const isMakkiyah = surah.type === 'Makkiyah' || surah.place === 'Mecca';
  const displayName = surah.name_id || getSurahNameId(surah.number_of_surah) || surah.name;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTogglePlay) {
      onTogglePlay(surah);
    }
  };

  return (
    <Link
      href={`/my-quran/${surah.number_of_surah}`}
      className="group block"
    >
      <div
        className={`relative p-4 rounded-xl border bg-base-100 transition-all duration-200 flex items-center justify-between gap-3 ${
          isPlaying
            ? 'border-primary ring-2 ring-primary/30 shadow-md bg-primary/5 -translate-y-0.5'
            : 'border-base-300 hover:border-primary/40 hover:bg-base-200/40 hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        {/* Left: Number medallion & Surah metadata */}
        <div className="flex items-center gap-3.5 min-w-0">
          <RubElHizb
            className="w-10 h-10 shrink-0"
            starClassName={
              isPlaying
                ? 'text-primary/30'
                : 'text-primary/15 group-hover:text-primary/30'
            }
            borderClassName="stroke-primary/50"
            textClassName="text-xs font-bold text-primary"
          >
            {surah.number_of_surah}
          </RubElHizb>

          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-sm sm:text-base text-base-content group-hover:text-primary transition-colors truncate">
                {displayName}
              </h3>
              {isPlaying && (
                <span className="flex items-end gap-0.5 h-3.5 shrink-0 px-1 py-0.5" title="Sedang diputar">
                  <span className="w-0.5 h-2.5 bg-primary rounded-full animate-bounce" />
                  <span className="w-0.5 h-3.5 bg-primary rounded-full animate-pulse" />
                  <span className="w-0.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </span>
              )}
            </div>

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

        {/* Right: Quick Play Button & Arabic Name */}
        {!titleOnly && (
          <div className="flex items-center gap-2.5 shrink-0 pl-2">
            {/* Quick Audio Play Button */}
            {onTogglePlay && (
              <button
                type="button"
                onClick={handlePlayClick}
                className={`p-2 rounded-lg border transition-all ${
                  isPlaying
                    ? 'border-primary bg-primary text-primary-content shadow-xs scale-105'
                    : 'border-base-300 opacity-60 group-hover:opacity-100 hover:border-primary/50 hover:bg-primary/10 hover:text-primary text-base-content/70'
                }`}
                title={isPlaying ? 'Jeda Audio Surah' : `Putar Audio Surah ${displayName}`}
                aria-label={`Putar audio ${displayName}`}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>
            )}

            <div className="text-right">
              <span
                className="font-amiri text-xl sm:text-2xl text-base-content/90 group-hover:text-primary transition-colors block select-none"
                dir="rtl"
              >
                {surah.name_translations?.ar || ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SurahCard;
