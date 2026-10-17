'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DZIKIR_PAGI, DZIKIR_PETANG } from '@/lib/dzikirData';
import { RubElHizb } from '@/components/ui/rubElHizb';
import {
  Sun,
  Sunset,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  Check,
  Copy,
  Share2,
  BookOpen,
  Volume2,
  Info,
} from 'lucide-react';

export default function DzikirPage() {
  const [activeTab, setActiveTab] = useState('pagi'); // 'pagi' | 'petang'
  const [counts, setCounts] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [showLatin, setShowLatin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  // Auto set tab based on current time (Pagi: 00:00 - 14:59, Petang: 15:00 - 23:59)
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 15 || hours < 4) {
      setActiveTab('petang');
    } else {
      setActiveTab('pagi');
    }
  }, []);

  const currentList = activeTab === 'pagi' ? DZIKIR_PAGI : DZIKIR_PETANG;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleIncrement = (id, targetRepeat) => {
    const current = counts[id] || 0;
    if (current < targetRepeat) {
      const next = current + 1;
      setCounts((prev) => ({ ...prev, [id]: next }));

      // Haptic feedback on mobile if supported
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          if (next === targetRepeat) {
            navigator.vibrate([40, 60, 40]); // Double buzz when completed
          } else {
            navigator.vibrate(35);
          }
        } catch (e) {}
      }
    }
  };

  const handleResetCounter = (id) => {
    setCounts((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleResetAll = () => {
    if (confirm('Reset semua hitungan dzikir untuk sesi ini?')) {
      setCounts({});
      showToast('Semua hitungan dzikir direset');
    }
  };

  const handleCopy = (item) => {
    const text = `${item.title}\n\n${item.arabic}\n\nLatin:\n${item.latin}\n\nArtinya:\n"${item.translation}"\n\n(${item.source})\nFaedah: ${item.benefit}`;
    navigator.clipboard.writeText(text);
    showToast('Teks dzikir berhasil disalin');
  };

  const handleShare = (item) => {
    const text = `${item.title}\n\n${item.arabic}\n\n"${item.translation}"\n(${item.source})`;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('Teks disalin untuk dibagikan');
    }
  };

  // Calculate completed count
  const completedCount = currentList.filter(
    (item) => (counts[item.id] || 0) >= item.repeat
  ).length;
  const progressPercent = Math.round((completedCount / currentList.length) * 100);

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
        <span className="text-base-content font-medium">Dzikir Pagi & Petang</span>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-base-100 border border-base-300 p-6 sm:p-7 mb-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sunnah Rasulullah SAW</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
              Dzikir Pagi & Petang
            </h1>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Amalan penjaga diri dan pembuka keberkahan berdasarkan hadits-hadits shahih.
              Dilengkapi counter interaktif bergetar untuk memudahkan penghitungan.
            </p>
          </div>

          {/* Quick Progress Widget */}
          <div className="p-4 rounded-xl bg-base-200/40 border border-base-300 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-medium text-base-content/70 mb-1.5">
              <span>Progres Dzikir</span>
              <strong className="text-primary font-bold">{progressPercent}%</strong>
            </div>
            <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden mb-2">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-base-content/60 text-center">
              {completedCount} dari {currentList.length} dzikir selesai
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher & Quick Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* Pagi vs Petang Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-base-200 border border-base-300 max-w-xs w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pagi')}
            type="button"
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pagi'
                ? 'bg-base-100 text-amber-600 dark:text-amber-400 shadow-sm border border-base-300/60'
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Dzikir Pagi (Subuh - Terbit)</span>
          </button>
          <button
            onClick={() => setActiveTab('petang')}
            type="button"
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'petang'
                ? 'bg-base-100 text-indigo-600 dark:text-indigo-400 shadow-sm border border-base-300/60'
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <Sunset className="w-4 h-4 text-indigo-500" />
            <span>Dzikir Petang (Ashar - Maghrib)</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowLatin(!showLatin)}
            type="button"
            className={`py-1.5 px-3 rounded-lg border transition-colors ${
              showLatin
                ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
                : 'border-base-300 text-base-content/60 hover:bg-base-200'
            }`}
          >
            Latin
          </button>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            type="button"
            className={`py-1.5 px-3 rounded-lg border transition-colors ${
              showTranslation
                ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
                : 'border-base-300 text-base-content/60 hover:bg-base-200'
            }`}
          >
            Arti
          </button>
          <button
            onClick={handleResetAll}
            type="button"
            className="flex items-center gap-1 py-1.5 px-3 rounded-lg border border-base-300 text-base-content/70 hover:text-error hover:border-error/40 transition-colors"
            title="Reset semua hitungan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Dzikir List Cards */}
      <div className="space-y-6">
        {currentList.map((item, index) => {
          const currentCount = counts[item.id] || 0;
          const isFinished = currentCount >= item.repeat;

          return (
            <article
              key={item.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-200 p-5 sm:p-7 ${
                isFinished
                  ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/10'
                  : 'border-base-300 bg-base-100 hover:border-primary/30 shadow-xs'
              }`}
            >
              {/* Card Header: Number, Title & Actions */}
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-base-200">
                <div className="flex items-center gap-3">
                  <RubElHizb
                    className="w-8 h-8 shrink-0"
                    starClassName={isFinished ? 'text-emerald-500/20' : 'text-primary/15'}
                    textClassName={`text-xs font-bold ${
                      isFinished ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
                    }`}
                  >
                    {index + 1}
                  </RubElHizb>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-base-content">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-base-content/50">
                      Dibaca {item.repeat} kali
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(item)}
                    type="button"
                    className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors"
                    title="Salin teks"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShare(item)}
                    type="button"
                    className="p-1.5 rounded-lg text-base-content/50 hover:text-primary hover:bg-base-200 transition-colors"
                    title="Bagikan"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="py-2 mb-4" dir="rtl">
                <p className="font-amiri text-2xl sm:text-3xl leading-[2.2] text-base-content select-text text-right font-medium">
                  {item.arabic}
                </p>
              </div>

              {/* Latin Transliteration */}
              {showLatin && (
                <p className="text-xs sm:text-sm text-primary/90 font-medium mb-3 italic leading-relaxed">
                  {item.latin}
                </p>
              )}

              {/* Translation */}
              {showTranslation && (
                <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed mb-4">
                  &ldquo;{item.translation}&rdquo;
                </p>
              )}

              {/* Benefit & Source Box */}
              <div className="p-3.5 rounded-xl bg-base-200/60 border border-base-300/80 mb-5 space-y-1.5 text-xs">
                <div className="flex items-start gap-2 text-base-content/75">
                  <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-base-content font-semibold">Keutamaan: </strong>
                    <span>{item.benefit}</span>
                  </div>
                </div>
                <p className="text-[11px] text-base-content/50 pl-5">
                  Sumber: {item.source}
                </p>
              </div>

              {/* Counter Action Footer */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-base-200">
                <div className="text-xs text-base-content/60">
                  {isFinished ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Check className="w-4 h-4" />
                      Selesai ({item.repeat}/{item.repeat})
                    </span>
                  ) : (
                    <span>
                      Tersisa:{' '}
                      <strong className="text-base-content">
                        {item.repeat - currentCount} kali
                      </strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentCount > 0 && (
                    <button
                      onClick={() => handleResetCounter(item.id)}
                      type="button"
                      className="p-2 rounded-xl border border-base-300 hover:bg-base-200 text-base-content/60 transition-colors"
                      title="Ulangi dzikir ini"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleIncrement(item.id, item.repeat)}
                    disabled={isFinished}
                    type="button"
                    className={`min-w-[120px] py-2.5 px-5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                      isFinished
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-primary text-primary-content hover:opacity-90 active:scale-95'
                    }`}
                  >
                    {isFinished ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Selesai</span>
                      </>
                    ) : (
                      <>
                        <span>Hitung</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/20 text-[11px]">
                          {currentCount} / {item.repeat}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
