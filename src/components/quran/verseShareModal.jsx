'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Copy, Check, Share2 } from 'lucide-react';

const CARD_THEMES = [
  {
    id: 'emerald',
    name: 'Emerald Green',
    bg: 'from-emerald-900 to-teal-950',
    canvasBgStart: '#064e3b',
    canvasBgEnd: '#042f2e',
    textColor: '#f0fdf4',
    subColor: '#a7f3d0',
    accentColor: '#34d399',
  },
  {
    id: 'midnight',
    name: 'Midnight Navy',
    bg: 'from-slate-900 to-indigo-950',
    canvasBgStart: '#0f172a',
    canvasBgEnd: '#1e1b4b',
    textColor: '#f8fafc',
    subColor: '#c7d2fe',
    accentColor: '#818cf8',
  },
  {
    id: 'gold',
    name: 'Royal Dark Gold',
    bg: 'from-stone-900 to-amber-950',
    canvasBgStart: '#1c1917',
    canvasBgEnd: '#451a03',
    textColor: '#fef3c7',
    subColor: '#fde68a',
    accentColor: '#fbbf24',
  },
  {
    id: 'minimal',
    name: 'Minimalist Black',
    bg: 'from-neutral-900 to-neutral-950',
    canvasBgStart: '#171717',
    canvasBgEnd: '#0a0a0a',
    textColor: '#ffffff',
    subColor: '#d4d4d4',
    accentColor: '#10b981',
  },
];

export const VerseShareModal = ({ isOpen, onClose, verse, surahName, surahNumber }) => {
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const previewCardRef = useRef(null);

  if (!isOpen || !verse) return null;

  const handleDownloadImage = async () => {
    try {
      setIsGenerating(true);

      const canvas = document.createElement('canvas');
      const width = 1080;
      const height = 1350; // 4:5 aspect ratio ideal for IG & WA Story
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 1. Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, selectedTheme.canvasBgStart);
      gradient.addColorStop(1, selectedTheme.canvasBgEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Decorative frame border
      ctx.strokeStyle = selectedTheme.accentColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.3;
      ctx.strokeRect(40, 40, width - 80, height - 80);
      ctx.strokeRect(55, 55, width - 110, height - 110);
      ctx.globalAlpha = 1.0;

      // 3. Header: Bismillah / Star
      ctx.fillStyle = selectedTheme.accentColor;
      ctx.font = 'bold 34px serif';
      ctx.textAlign = 'center';
      ctx.fillText('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', width / 2, 140);

      // Surah & Ayah badge header
      ctx.font = '600 24px sans-serif';
      ctx.fillStyle = selectedTheme.subColor;
      ctx.fillText(`QS. ${surahName} : Ayat ${verse.number}`, width / 2, 200);

      // Decorative divider
      ctx.strokeStyle = selectedTheme.accentColor;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 120, 230);
      ctx.lineTo(width / 2 + 120, 230);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // 4. Arabic Verse Text (wrapped)
      ctx.fillStyle = selectedTheme.textColor;
      ctx.font = 'normal 46px "Amiri", "Scheherazade New", serif';
      ctx.textAlign = 'center';
      ctx.direction = 'rtl';

      const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = context.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            context.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, currentY);
        return currentY;
      };

      const startArabicY = 330;
      const arabicEndY = wrapText(ctx, verse.text, width / 2, startArabicY, 920, 80);

      // 5. Translation Text
      if (showTranslation && verse.translation_id) {
        ctx.direction = 'ltr';
        ctx.font = 'italic 28px sans-serif';
        ctx.fillStyle = selectedTheme.subColor;
        ctx.textAlign = 'center';

        const startTransY = Math.max(arabicEndY + 90, 720);
        wrapText(ctx, `"${verse.translation_id}"`, width / 2, startTransY, 900, 46);
      }

      // 6. Watermark Footer
      ctx.direction = 'ltr';
      ctx.font = '500 22px sans-serif';
      ctx.fillStyle = selectedTheme.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText("Al-Qur'an Digital Indonesia", width / 2, height - 90);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QS-${surahName.replace(/\s+/g, '-')}-Ayat-${verse.number}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Error generating image:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    const text = `${verse.text}\n\n"${verse.translation_id}"\n(QS. ${surahName} : ${verse.number})`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-base-100 rounded-2xl border border-base-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-base-content">
                Bagikan Ayat Sebagai Gambar
              </h3>
              <p className="text-xs text-base-content/60">
                QS. {surahName} : Ayat {verse.number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Card Preview */}
          <div
            ref={previewCardRef}
            className={`relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${selectedTheme.bg} text-white shadow-xl border border-white/10 text-center space-y-4 transition-all`}
          >
            <p className="font-serif text-amber-200/90 text-sm tracking-wider">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs">
              QS. {surahName} : {verse.number}
            </div>
            <p
              className="font-amiri text-2xl sm:text-3xl leading-relaxed py-2 text-white/95"
              dir="rtl"
            >
              {verse.text}
            </p>
            {showTranslation && (
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal italic border-t border-white/15 pt-3">
                &quot;{verse.translation_id}&quot;
              </p>
            )}
            <p className="text-[11px] text-white/50 tracking-wider pt-2">
              Al-Qur&apos;an Digital Indonesia
            </p>
          </div>

          {/* Theme selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-base-content">
              Pilih Tema Desain Kartu
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CARD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  type="button"
                  className={`p-2 rounded-xl border text-xs font-medium text-left transition-all ${
                    selectedTheme.id === theme.id
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5 text-primary'
                      : 'border-base-300 hover:border-base-content/20 text-base-content/80'
                  }`}
                >
                  <div
                    className={`w-full h-5 rounded-md bg-gradient-to-r ${theme.bg} mb-1.5`}
                  />
                  <span className="truncate block">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Options toggle */}
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTranslation}
                onChange={(e) => setShowTranslation(e.target.checked)}
                className="checkbox checkbox-xs checkbox-primary"
              />
              <span className="text-base-content/80">Sertakan Terjemahan</span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-base-300 bg-base-200/50 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleCopyText}
            type="button"
            className="btn btn-sm btn-ghost gap-1.5 text-xs"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            type="button"
            className="btn btn-sm btn-primary gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Menyiapkan...' : 'Unduh Gambar (HD)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
