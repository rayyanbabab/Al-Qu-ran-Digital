import React from 'react';
import Link from 'next/link';
import { RubElHizb } from './rubElHizb';
import { BookOpen } from 'lucide-react';

const popularSurahs = [
  { id: 1, name: 'Al-Fatihah' },
  { id: 18, name: 'Al-Kahf' },
  { id: 36, name: 'Yasin' },
  { id: 55, name: 'Ar-Rahman' },
  { id: 56, name: "Al-Waqi'ah" },
  { id: 67, name: 'Al-Mulk' },
];

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-base-300 bg-base-200/50 text-base-content/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Verse */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <RubElHizb className="w-7 h-7" textClassName="text-primary text-xs">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              </RubElHizb>
              <span className="font-semibold text-base text-base-content">
                Al-Qur&apos;an Digital
              </span>
            </div>
            <p className="text-xs text-base-content/70 italic leading-relaxed">
              &ldquo;Dan Kami turunkan dari Al-Qur&apos;an suatu yang menjadi penawar
              dan rahmat bagi orang-orang yang beriman...&rdquo;
            </p>
            <span className="text-[11px] font-medium text-primary block">
              — QS. Al-Isra&apos; : 82
            </span>
          </div>

          {/* Quick Menu */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3">
              Fitur Aplikasi
            </h4>
            <div className="flex flex-col gap-1.5 text-xs">
              <Link href="/" className="hover:text-primary transition-colors py-0.5">
                Al-Qur&apos;an (114 Surah & 30 Juz)
              </Link>
              <Link
                href="/cari-ayat"
                className="hover:text-primary transition-colors py-0.5"
              >
                Cari Makna & Ayat
              </Link>
              <Link
                href="/jadwal-sholat"
                className="hover:text-primary transition-colors py-0.5"
              >
                Jadwal Sholat & Imsakiyah
              </Link>
              <Link
                href="/kiblat"
                className="hover:text-primary transition-colors py-0.5"
              >
                Kompas Arah Kiblat
              </Link>
              <Link
                href="/dzikir"
                className="hover:text-primary transition-colors py-0.5"
              >
                Dzikir Pagi & Petang
              </Link>
              <Link
                href="/doa"
                className="hover:text-primary transition-colors py-0.5"
              >
                Kumpulan Doa Harian
              </Link>
              <Link
                href="/asmaul-husna"
                className="hover:text-primary transition-colors py-0.5"
              >
                99 Asmaul Husna
              </Link>
            </div>
          </div>

          {/* Surah Populer */}
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
              Teks Arab & Terjemahan:{' '}
              <strong className="text-base-content/90 font-medium">
                Kementerian Agama RI
              </strong>
            </p>
            <p>
              Tafsir Lengkap:{' '}
              <strong className="text-base-content/90 font-medium">
                Tafsir Kemenag RI
              </strong>
            </p>
            <p>
              Audio Murattal:{' '}
              <strong className="text-base-content/90 font-medium">
                EveryAyah & QuranicAudio
              </strong>
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/50">
          <p>
            © {new Date().getFullYear()} Al-Qur&apos;an Digital Indonesia. Didesain
            untuk kenyamanan tilawah.
          </p>
          <p className="flex items-center gap-1">
            Dibuat dengan dedikasi untuk memudahkan ibadah sehari-hari.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
