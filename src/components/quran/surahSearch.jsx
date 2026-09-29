'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

const quickShortcuts = [
  'Al-Fatihah',
  'Al-Baqarah',
  'Al-Kahf',
  'Yasin',
  'Ar-Rahman',
  'Al-Waqi\'ah',
  'Al-Mulk',
];

export const SurahSearch = ({ quranData, setFilteredQuranData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'Makkiyah' | 'Madaniyah'

  useEffect(() => {
    if (!quranData || !Array.isArray(quranData)) return;

    const filtered = quranData.filter((surah) => {
      // Filter by type (Makkiyah / Madaniyah)
      if (selectedType === 'Makkiyah') {
        const isMakkiyah = surah.type === 'Makkiyah' || surah.place === 'Mecca';
        if (!isMakkiyah) return false;
      } else if (selectedType === 'Madaniyah') {
        const isMadaniyah = surah.type === 'Madaniyah' || surah.place === 'Medina';
        if (!isMadaniyah) return false;
      }

      // Filter by search query
      if (!searchTerm.trim()) return true;

      const searchLower = searchTerm.toLowerCase().trim();
      const nameMatch = surah.name?.toLowerCase().includes(searchLower);
      const numberMatch = surah.number_of_surah?.toString() === searchLower || surah.number_of_surah?.toString().includes(searchLower);
      const translationMatch = Object.values(surah.name_translations || {}).some((t) =>
        t?.toLowerCase().includes(searchLower)
      );

      return nameMatch || numberMatch || translationMatch;
    });

    setFilteredQuranData(filtered);
  }, [searchTerm, selectedType, quranData, setFilteredQuranData]);

  const handleClear = () => {
    setSearchTerm('');
  };

  const handleShortcutClick = (surahName) => {
    if (searchTerm === surahName) {
      setSearchTerm('');
    } else {
      setSearchTerm(surahName);
    }
  };

  return (
    <div className="space-y-3.5 mb-6">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-base-content/40 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-base-300 bg-base-100 text-sm placeholder:text-base-content/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
          placeholder="Cari nama surah (cth. Al-Kahf, Yasin), nomor surah, atau arti..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors"
            title="Hapus pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs and Quick Shortcuts */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-base-200 border border-base-300">
          <button
            type="button"
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              selectedType === 'ALL'
                ? 'bg-base-100 text-primary shadow-sm font-semibold'
                : 'text-base-content/70 hover:text-base-content'
            }`}
          >
            Semua (114)
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('Makkiyah')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              selectedType === 'Makkiyah'
                ? 'bg-base-100 text-amber-700 dark:text-amber-400 shadow-sm font-semibold'
                : 'text-base-content/70 hover:text-base-content'
            }`}
          >
            Makkiyah (86)
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('Madaniyah')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              selectedType === 'Madaniyah'
                ? 'bg-base-100 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-base-content/70 hover:text-base-content'
            }`}
          >
            Madaniyah (28)
          </button>
        </div>

        {/* Quick Surah Shortcuts */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-base-content/40 text-[11px] font-medium mr-0.5">
            Sering dibaca:
          </span>
          {quickShortcuts.map((s) => {
            const isActive = searchTerm.toLowerCase() === s.toLowerCase();
            return (
              <button
                key={s}
                onClick={() => handleShortcutClick(s)}
                type="button"
                className={`py-1 px-2.5 rounded-full text-[11px] font-medium transition-all border ${
                  isActive
                    ? 'border-primary bg-primary text-primary-content shadow-xs'
                    : 'border-base-300 bg-base-100 hover:border-base-content/30 text-base-content/70'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
