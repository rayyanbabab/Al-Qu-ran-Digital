import React from 'react';
import Link from 'next/link';
import { RubElHizb } from './rubElHizb';
import { BookOpen, Heart } from 'lucide-react';

const popularSurahs = [
  { id: 1, name: 'Al-Fatihah' },
  { id: 18, name: 'Al-Kahf' },
  { id: 36, name: 'Yasin' },
  { id: 55, name: 'Ar-Rahman' },
  { id: 56, name: 'Al-Waqi\'ah' },
  { id: 67, name: 'Al-Mulk' },
];

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-base-300 bg-base-200/50 text-base-content/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand & Verse */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RubElHizb className="w-7 h-7" textClassName="text-primary text-xs">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              </RubElHizb>
              <span className="font-semibold text-base text-base-content">Al-Qur&apos;an Digital</span>
            </div>
            <p className="text-xs text-base-content/70 italic leading-relaxed">
              &ldquo;Dan Kami turunkan dari Al-Qur&apos;an suatu yang menjadi penawar dan rahmat bagi orang-orang yang beriman...&rdquo;
            </p>
            <span className="text-[11px] font-medium text-primary block">
              — QS. Al-Isra&apos; : 82
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
              Surah Populer
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {popularSurahs.map((surah) => (
                <Link
                  key={surah.id}
                  href={`/my-quran/${surah.id}`}
                  className="hover:text-primary transition-colors py-0.5"
                >
                  {surah.id}. {surah.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Information & Attribution */}
          <div className="space-y-2 text-xs text-base-content/70">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
              Sumber Data
            </h4>
            <p>
              Teks Arab & Terjemahan: <strong className="text-base-content/90 font-medium">Kementerian Agama RI</strong>
            </p>
            <p>
              Tafsir Lengkap: <strong className="text-base-content/90 font-medium">Tafsir Kemenag RI</strong>
            </p>
            <p>
              Audio Murattal: <strong className="text-base-content/90 font-medium">QuranicAudio</strong> (Misyari Rasyid, Sudais, Ghamdi)
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/50">
          <p>© {new Date().getFullYear()} Al-Qur&apos;an Digital. Didesain untuk kenyamanan tilawah.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan rasa hormat & dedikasi untuk umat.
          </p>
        </div>
      </div>
    </footer>
  );
};
