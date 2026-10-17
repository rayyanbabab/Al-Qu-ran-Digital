'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBookmarks, removeBookmarkById, clearAllBookmarks } from '@/lib/bookmarkStorage';
import { Bookmark, X, Trash2, ArrowUpRight, BookOpen } from 'lucide-react';
import { RubElHizb } from '@/components/ui/rubElHizb';

export const BookmarkDrawer = ({ isOpen, onClose }) => {
  const [bookmarks, setBookmarks] = useState([]);

  const syncBookmarks = () => {
    setBookmarks(getBookmarks());
  };

  useEffect(() => {
    syncBookmarks();
    window.addEventListener('quran_bookmarks_updated', syncBookmarks);
    return () => {
      window.removeEventListener('quran_bookmarks_updated', syncBookmarks);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-base-100 border-l border-base-300 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-base-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Bookmark className="w-4 h-4 fill-primary" />
              </div>
              <div>
                <h2 className="font-bold text-base text-base-content">
                  Ayat Tersimpan
                </h2>
                <p className="text-xs text-base-content/60">
                  {bookmarks.length} ayat dalam daftar favorit
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {bookmarks.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Hapus semua ayat yang tersimpan?')) {
                      clearAllBookmarks();
                    }
                  }}
                  type="button"
                  className="p-2 text-xs text-error hover:bg-error/10 rounded-lg transition-colors flex items-center gap-1"
                  title="Hapus semua"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bersihkan</span>
                </button>
              )}
              <button
                onClick={onClose}
                type="button"
                className="p-2 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded-lg transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of bookmarks */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {bookmarks.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3 text-base-content/40">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm text-base-content mb-1">
                  Belum ada ayat tersimpan
                </h3>
                <p className="text-xs text-base-content/60 max-w-xs mx-auto">
                  Tekan ikon bookmark pada ayat yang ingin Anda simpan saat membaca untuk melihatnya kembali di sini.
                </p>
              </div>
            ) : (
              bookmarks.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-base-300 bg-base-100 hover:border-primary/30 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <RubElHizb
                        className="w-7 h-7"
                        starClassName="text-primary/20"
                        textClassName="text-[10px] font-bold text-primary"
                      >
                        {item.ayahNumber}
                      </RubElHizb>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-base-content">
                          {item.surahName} : Ayat {item.ayahNumber}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/my-quran/${item.surahId}#ayah-${item.ayahNumber}`}
                        onClick={onClose}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-content transition-colors"
                        title="Buka Ayat"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => removeBookmarkById(item.id)}
                        type="button"
                        className="p-1.5 rounded-lg text-base-content/40 hover:text-error hover:bg-error/10 transition-colors"
                        title="Hapus dari tersimpan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic text preview */}
                  <p
                    className="font-amiri text-base text-base-content/90 line-clamp-2 text-right pt-1"
                    dir="rtl"
                  >
                    {item.arabicText}
                  </p>

                  {/* Translation preview */}
                  <p className="text-xs text-base-content/70 line-clamp-2 italic border-t border-dashed border-base-300/60 pt-2">
                    &quot;{item.translation}&quot;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
