'use client';

import React, { useState, useEffect } from 'react';
import { numberToArabic } from 'number-to-arabic';
import { Modal } from '@/components/ui/modal';
import { AudioPlayer } from '@/components/ui/audioPlayer';
import { useTheme } from '@/hooks/useTheme';
import { RubElHizb } from '@/components/ui/rubElHizb';
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  BookOpen,
  Volume2,
  Sliders,
  Eye,
  EyeOff,
  ChevronDown,
} from 'lucide-react';

export const VerseList = ({ surah, tafsirSurah }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [copiedAyah, setCopiedAyah] = useState(null);
  const [lastReadAyah, setLastReadAyah] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Audio player state
  const [audioIndex, setAudioIndex] = useState(0);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);

  // Reading options
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState('text-3xl'); // text-2xl, text-3xl, text-4xl, text-5xl

  const { font, changeFont } = useTheme();
  const surahNumber = surah.number_of_surah;
  const isAtTawbah = surahNumber === 9;
  const isFatihah = surahNumber === 1;

  // Check last read from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_last_read');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.surahId === surahNumber) {
          setLastReadAyah(parsed.ayah);
        }
      }
      const savedFontSize = localStorage.getItem('fontSize');
      if (savedFontSize) {
        setFontSize(savedFontSize);
      }
    } catch (e) {
      console.error(e);
    }
  }, [surahNumber]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const handleBookmark = (ayahNumber) => {
    try {
      const data = {
        surahId: surahNumber,
        surahName: surah.name,
        ayah: ayahNumber,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('quran_last_read', JSON.stringify(data));
      setLastReadAyah(ayahNumber);
      window.dispatchEvent(new Event('quran_last_read_updated'));
      showToast(`Ayat ${ayahNumber} ditandai sebagai bacaan terakhir`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyAyah = (verse) => {
    const textToCopy = `${verse.text}\n\n"${verse.translation_id}"\n(QS. ${surah.name} : ${verse.number})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(verse.number);
    showToast(`Ayat ${verse.number} berhasil disalin`);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const handleOpenTafsir = (verse) => {
    setSelectedVerse(verse);
    setModalOpen(true);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  const handleJumpToAyah = (e) => {
    const target = e.target.value;
    if (target) {
      const element = document.getElementById(`ayah-${target}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 py-2.5 px-4 rounded-xl bg-primary text-primary-content text-xs font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Reading Toolbar */}
      <div className="sticky top-16 z-30 mb-8 p-3 sm:p-4 rounded-2xl border border-base-300 bg-base-100/90 backdrop-blur-md shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Audio & Jump to Ayah */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAudioPlayerOpen(!isAudioPlayerOpen)}
              type="button"
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-all ${
                isAudioPlayerOpen
                  ? 'bg-primary text-primary-content shadow-xs'
                  : 'border border-base-300 hover:border-primary/40 text-base-content/80 bg-base-100'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAudioPlayerOpen ? 'Audio Aktif' : 'Putar Surah'}</span>
            </button>

            {/* Jump to Ayah selector */}
            <div className="relative flex items-center">
              <select
                onChange={handleJumpToAyah}
                className="py-1.5 pl-2.5 pr-7 rounded-lg border border-base-300 bg-base-100 text-xs font-medium text-base-content/80 appearance-none focus:outline-none focus:border-primary cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Lompat ke Ayat...
                </option>
                {surah.verses.map((v) => (
                  <option key={v.number} value={v.number}>
                    Ayat {v.number}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-base-content/40 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* Right: Reading Adjustments */}
          <div className="flex items-center gap-2">
            {/* Toggle Translation */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              type="button"
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg border border-base-300 bg-base-100 hover:bg-base-200 text-base-content/70 transition-colors"
              title={showTranslation ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan'}
            >
              {showTranslation ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Terjemahan</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-base-content/40" />
                  <span className="hidden sm:inline">Terjemahan Mati</span>
                </>
              )}
            </button>

            {/* Font Size Buttons */}
            <div className="hidden sm:flex items-center border border-base-300 rounded-lg overflow-hidden bg-base-100">
              <button
                onClick={() => handleFontSizeChange('text-2xl')}
                type="button"
                className={`px-2 py-1 text-[11px] ${
                  fontSize === 'text-2xl' ? 'bg-primary text-primary-content font-bold' : 'hover:bg-base-200'
                }`}
              >
                A-
              </button>
              <button
                onClick={() => handleFontSizeChange('text-3xl')}
                type="button"
                className={`px-2 py-1 text-[11px] ${
                  fontSize === 'text-3xl' ? 'bg-primary text-primary-content font-bold' : 'hover:bg-base-200'
                }`}
              >
                A
              </button>
              <button
                onClick={() => handleFontSizeChange('text-4xl')}
                type="button"
                className={`px-2 py-1 text-[11px] ${
                  fontSize === 'text-4xl' ? 'bg-primary text-primary-content font-bold' : 'hover:bg-base-200'
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Bismillah Banner */}
      {!isAtTawbah && !isFatihah && (
        <div className="text-center my-10 py-8 px-4 rounded-2xl border border-base-300 bg-gradient-to-b from-base-200/50 via-base-100 to-base-200/30">
          <p
            className="font-amiri text-2xl sm:text-3xl text-base-content select-none tracking-wide"
            dir="rtl"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <span className="block text-xs text-base-content/50 mt-2 font-serif italic">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </span>
        </div>
      )}

      {/* Verses Reading Stream */}
      <div className="space-y-6 pb-28">
        {surah.verses.map((verse) => {
          const isBookmarked = lastReadAyah === verse.number;
          const isCopied = copiedAyah === verse.number;

          return (
            <article
              key={verse.number}
              id={`ayah-${verse.number}`}
              className={`relative p-5 sm:p-7 rounded-2xl border transition-all duration-300 scroll-mt-28 ${
                isBookmarked
                  ? 'border-primary ring-2 ring-primary/20 bg-base-100 shadow-md'
                  : 'border-base-300 bg-base-100/95 hover:border-primary/30 shadow-xs'
              }`}
            >
              {/* Ayah Header Row (Controls & Badges) */}
              <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-base-300/80">
                {/* Ayah number medallion */}
                <div className="flex items-center gap-2">
                  <RubElHizb
                    className="w-8 h-8"
                    starClassName="text-primary/20"
                    textClassName="text-xs font-bold text-primary"
                  >
                    {verse.number}
                  </RubElHizb>
                  <span className="text-xs font-medium text-base-content/50">
                    Ayat {verse.number}
                  </span>
                </div>

                {/* Ayah Action Icons */}
                <div className="flex items-center gap-1 text-xs">
                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleBookmark(verse.number)}
                    type="button"
                    className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                      isBookmarked
                        ? 'border-primary bg-primary text-primary-content font-medium'
                        : 'border-base-300 hover:border-primary/40 hover:bg-base-200 text-base-content/70'
                    }`}
                    title={isBookmarked ? 'Bacaan terakhir tersimpan' : 'Tandai sebagai terakhir dibaca'}
                  >
                    {isBookmarked ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Terakhir Baca</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Tandai</span>
                      </>
                    )}
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyAyah(verse)}
                    type="button"
                    className="p-1.5 rounded-lg border border-base-300 hover:border-primary/40 hover:bg-base-200 text-base-content/70 transition-colors"
                    title="Salin ayat & terjemahan"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Tafsir Button */}
                  <button
                    onClick={() => handleOpenTafsir(verse)}
                    type="button"
                    className="p-1.5 px-2.5 rounded-lg border border-base-300 hover:border-primary/40 hover:bg-base-200 text-base-content/80 font-medium flex items-center gap-1 transition-colors"
                    title="Buka Tafsir Kemenag untuk ayat ini"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px]">Tafsir</span>
                  </button>
                </div>
              </div>

              {/* Arabic Verse Text */}
              <div className="py-2 text-right">
                <p
                  className={`${font || 'font-amiri'} ${fontSize} text-base-content leading-relaxed select-text font-normal`}
                  dir="rtl"
                >
                  {verse.text}
                  <span
                    className="inline-flex items-center justify-center mx-2 px-1 text-primary/70 text-lg sm:text-xl font-normal select-none"
                    title={`Akhir ayat ${verse.number}`}
                  >
                    ۝{numberToArabic(verse.number)}
                  </span>
                </p>
              </div>

              {/* Translation */}
              {showTranslation && (
                <div className="pt-4 mt-4 border-t border-dashed border-base-300">
                  <p className="text-sm sm:text-base leading-relaxed text-base-content/85 font-normal">
                    {verse.translation_id}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Floating Audio Player */}
      <AudioPlayer
        surahName={surah.name}
        recitations={surah.recitations}
        currentReciterIndex={audioIndex}
        onReciterChange={setAudioIndex}
        isOpen={isAudioPlayerOpen}
        onClose={() => setIsAudioPlayerOpen(false)}
      />

      {/* Tafsir Modal */}
      {modalOpen && selectedVerse && (
        <Modal
          content={tafsirSurah?.text?.[selectedVerse.number] || 'Tafsir sedang tidak tersedia.'}
          innerHTML={true}
          modalOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          modalHeader={`QS. ${surah.name} : Ayat ${selectedVerse.number}`}
        />
      )}
    </div>
  );
};
