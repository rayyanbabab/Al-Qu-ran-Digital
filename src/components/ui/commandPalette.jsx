'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Compass,
  Navigation,
  Sun,
  ScrollText,
  Heart,
  SlidersHorizontal,
  X,
  ArrowRight,
  Layers,
  FileText,
} from 'lucide-react';
import { SURAH_NAMES_ID, isSurahMatch } from '@/lib/surahMeta';

const QUICK_ACTIONS = [
  {
    title: "Al-Qur'an 30 Juz 114 Surah",
    subtitle: 'Daftar surah dan juz Al-Qur\'an',
    href: '/',
    icon: BookOpen,
    category: 'Navigasi',
  },
  {
    title: 'Cari Makna & Terjemahan Ayat',
    subtitle: 'Cari topik kata kunci di seluruh 6.236 ayat',
    href: '/cari-ayat',
    icon: Search,
    category: 'Navigasi',
  },
  {
    title: 'Jadwal Sholat & Imsakiyah',
    subtitle: 'Waktu sholat 5 waktu & countdown adzan',
    href: '/jadwal-sholat',
    icon: Compass,
    category: 'Ibadah',
  },
  {
    title: 'Kompas Arah Kiblat',
    subtitle: 'Penunjuk arah Ka\'bah dengan sensor HP',
    href: '/kiblat',
    icon: Navigation,
    category: 'Ibadah',
  },
  {
    title: 'Dzikir Pagi & Petang',
    subtitle: 'Amalan sunnah shahih Al-Ma\'tsurat',
    href: '/dzikir',
    icon: Sun,
    category: 'Ibadah',
  },
  {
    title: 'Kumpulan Doa Harian',
    subtitle: 'Doa sehari-hari dengan teks Arab & arti',
    href: '/doa',
    icon: ScrollText,
    category: 'Ibadah',
  },
  {
    title: '99 Asmaul Husna',
    subtitle: 'Nama-nama indah Allah SWT dan maknanya',
    href: '/asmaul-husna',
    icon: Heart,
    category: 'Ibadah',
  },
];

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle Global Ctrl+K / Cmd+K and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open trigger handled by parent, but if standalone can toggle
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter surahs
  const surahResults = [];
  if (query.trim()) {
    for (let i = 1; i <= 114; i++) {
      const name = SURAH_NAMES_ID[i];
      const dummy = { number_of_surah: i, name };
      if (isSurahMatch(dummy, query)) {
        surahResults.push({
          number: i,
          name,
          href: `/my-quran/${i}`,
        });
      }
      if (surahResults.length >= 6) break;
    }
  }

  // Filter quick actions
  const actionResults = QUICK_ACTIONS.filter((act) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      act.title.toLowerCase().includes(q) ||
      act.subtitle.toLowerCase().includes(q) ||
      act.category.toLowerCase().includes(q)
    );
  });

  const allItems = [
    ...surahResults.map((s) => ({ type: 'surah', ...s })),
    ...actionResults.map((a) => ({ type: 'action', ...a })),
  ];

  // Keyboard navigation for results
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyNav = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % (allItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          handleSelect(allItems[selectedIndex]);
        } else if (query.trim()) {
          onClose();
          router.push(`/cari-ayat?q=${encodeURIComponent(query)}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [isOpen, allItems, selectedIndex, query]);

  const handleSelect = (item) => {
    onClose();
    if (item.href) {
      router.push(item.href);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-base-200">
          <Search className="w-5 h-5 text-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-sm sm:text-base text-base-content placeholder:text-base-content/40 focus:outline-none"
            placeholder="Cari surah (cth. Yasin, Al-Kahf), topik, atau fitur..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-base-content/40 hover:text-base-content"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono px-1.5 py-0.5 rounded bg-base-200 text-base-content/50 border border-base-300 ml-2">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-base-200">
          {/* Surah Matches */}
          {surahResults.length > 0 && (
            <div className="py-2">
              <span className="text-[11px] font-semibold text-base-content/40 px-3 uppercase tracking-wider block mb-1">
                Surah Al-Qur&apos;an
              </span>
              <div className="space-y-1">
                {surahResults.map((s, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <button
                      key={s.number}
                      onClick={() => handleSelect(s)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      type="button"
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                        isSelected
                          ? 'bg-primary/10 ring-1 ring-primary/30'
                          : 'hover:bg-base-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-content'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {s.number}
                        </div>
                        <span
                          className={`font-semibold text-sm transition-colors ${
                            isSelected ? 'text-primary' : 'text-base-content group-hover:text-primary'
                          }`}
                        >
                          Surah {s.name}
                        </span>
                      </div>
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-all ${
                          isSelected
                            ? 'text-primary translate-x-0.5'
                            : 'text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Action Navigation */}
          {actionResults.length > 0 && (
            <div className="py-2">
              <span className="text-[11px] font-semibold text-base-content/40 px-3 uppercase tracking-wider block mb-1">
                Fitur & Navigasi
              </span>
              <div className="space-y-1">
                {actionResults.map((act, idx) => {
                  const globalIdx = surahResults.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.href}
                      onClick={() => handleSelect(act)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      type="button"
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                        isSelected
                          ? 'bg-primary/10 ring-1 ring-primary/30'
                          : 'hover:bg-base-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-content'
                              : 'bg-base-200 text-primary group-hover:bg-primary group-hover:text-primary-content'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span
                            className={`font-medium text-xs sm:text-sm block transition-colors ${
                              isSelected
                                ? 'text-primary'
                                : 'text-base-content group-hover:text-primary'
                            }`}
                          >
                            {act.title}
                          </span>
                          <span className="text-[11px] text-base-content/50 block">
                            {act.subtitle}
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-all ${
                          isSelected
                            ? 'text-primary translate-x-0.5'
                            : 'text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fallback to verse search */}
          {query.trim() && (
            <div className="p-2">
              <button
                onClick={() => {
                  onClose();
                  router.push(`/cari-ayat?q=${encodeURIComponent(query)}`);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-content transition-all font-semibold text-xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Cari makna ayat untuk &ldquo;{query}&rdquo; di 6.236 ayat</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Empty state */}
          {allItems.length === 0 && !query.trim() && (
            <div className="py-8 text-center text-xs text-base-content/50">
              Ketik nama surah atau kata kunci untuk mulai mencari...
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-base-200/50 border-t border-base-200 flex items-center justify-between text-[11px] text-base-content/50">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-base-100 border border-base-300">↵</kbd> Buka
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-base-100 border border-base-300">ESC</kbd> Tutup
            </span>
          </div>
          <span>Al-Qur&apos;an Digital Indonesia</span>
        </div>
      </div>
    </div>
  );
};
export default CommandPalette;
