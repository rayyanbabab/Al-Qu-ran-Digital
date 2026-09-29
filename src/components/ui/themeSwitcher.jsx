'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Check, Palette, Type, Sliders, Moon, Sun, BookOpen } from 'lucide-react';

const themes = [
  {
    id: 'emerald',
    name: 'Mushaf Hijau',
    desc: 'Nuansa hijau zaitun & kertas gading',
    previewBg: 'bg-[#FAF8F5]',
    previewBorder: 'border-[#047857]',
    previewAccent: 'bg-[#047857]',
  },
  {
    id: 'midnight',
    name: 'Mushaf Malam',
    desc: 'Latar gelap sejuk nyaman untuk malam',
    previewBg: 'bg-[#0D1614]',
    previewBorder: 'border-[#10B981]',
    previewAccent: 'bg-[#10B981]',
  },
  {
    id: 'sepia',
    name: 'Kertas Kitab',
    desc: 'Warna hangat lembaran mushaf klasik',
    previewBg: 'bg-[#F5EFE1]',
    previewBorder: 'border-[#2D6A4F]',
    previewAccent: 'bg-[#2D6A4F]',
  },
];

const arabFonts = [
  {
    name: 'Amiri (Klasik Mushaf)',
    value: 'font-amiri',
    sample: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  },
  {
    name: 'Noto Sans Arabic',
    value: 'font-arabic',
    sample: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  },
  {
    name: 'IBM Plex Sans Arabic',
    value: 'fontIbm',
    sample: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  },
  {
    name: 'Noto Kufi Arabic',
    value: 'fontKufi',
    sample: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  },
];

const fontSizes = [
  { label: 'Kecil', value: 'text-2xl' },
  { label: 'Sedang', value: 'text-3xl' },
  { label: 'Besar', value: 'text-4xl' },
  { label: 'Ekstra', value: 'text-5xl' },
];

export const ThemeSwitcher = ({ isOpen, onClose }) => {
  const { theme, font, fontSize, changeTheme, changeFont, changeFontSize } = useTheme();
  const [activeTheme, setActiveTheme] = useState(theme || 'emerald');
  const [activeFont, setActiveFont] = useState(font || 'font-amiri');
  const [activeSize, setActiveSize] = useState(fontSize || 'text-3xl');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'emerald';
    const savedFont = localStorage.getItem('font') || 'font-amiri';
    const savedSize = localStorage.getItem('fontSize') || 'text-3xl';

    setActiveTheme(savedTheme);
    setActiveFont(savedFont);
    setActiveSize(savedSize);

    changeTheme(savedTheme);
    changeFont(savedFont);
    if (changeFontSize) changeFontSize(savedSize);
    document.documentElement.setAttribute('data-theme', savedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleThemeChange = (newTheme) => {
    setActiveTheme(newTheme);
    changeTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleFontChange = (newFont) => {
    setActiveFont(newFont);
    changeFont(newFont);
    localStorage.setItem('font', newFont);
  };

  const handleSizeChange = (newSize) => {
    setActiveSize(newSize);
    if (changeFontSize) changeFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
  };

  const content = (
    <div className="space-y-6">
      {/* Theme selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
            Pilihan Tema Warna
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {themes.map((t) => {
            const isSelected = activeTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                type="button"
                className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-base-200 shadow-sm'
                    : 'border-base-300 hover:border-base-content/20 bg-base-100'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`w-6 h-6 rounded-full border ${t.previewBg} ${t.previewBorder} flex items-center justify-center p-0.5`}>
                    <div className={`w-3 h-3 rounded-full ${t.previewAccent}`} />
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </div>
                <span className="font-medium text-sm text-base-content">{t.name}</span>
                <span className="text-[11px] text-base-content/60 mt-0.5 leading-snug">
                  {t.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
            Gaya Huruf Arab
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {arabFonts.map((f) => {
            const isSelected = activeFont === f.value;
            return (
              <button
                key={f.value}
                onClick={() => handleFontChange(f.value)}
                type="button"
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-base-200'
                    : 'border-base-300 hover:border-base-content/20 bg-base-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-base-content/80">{f.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className={`${f.value} text-lg text-right mt-1 text-base-content`} dir="rtl">
                  {f.sample}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Size selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold tracking-wide uppercase text-base-content/70">
            Ukuran Huruf Arab
          </h4>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {fontSizes.map((s) => {
            const isSelected = activeSize === s.value;
            return (
              <button
                key={s.value}
                onClick={() => handleSizeChange(s.value)}
                type="button"
                className={`py-2 px-3 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'border-primary bg-primary text-primary-content font-semibold shadow-sm'
                    : 'border-base-300 hover:bg-base-200 text-base-content'
                }`}
              >
                <span className="text-xs">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 rounded-xl bg-base-200/70 border border-base-300">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 block mb-2">
          Pratinjau Tampilan
        </span>
        <p className={`${activeFont} ${activeSize} text-right text-base-content leading-relaxed`} dir="rtl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="text-xs text-base-content/70 mt-2 font-normal">
          &ldquo;Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.&rdquo;
        </p>
      </div>
    </div>
  );

  // If used inside modal or drawer
  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-base-100 rounded-2xl border border-base-300 shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-base-300">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg text-base-content">
                Pengaturan Tampilan
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-base-200 text-base-content/70 hover:text-base-content transition-colors"
              aria-label="Tutup pengaturan"
            >
              ✕
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return content;
};
