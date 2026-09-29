import { notFound } from 'next/navigation';
import { VerseList } from '@/components/quran/verseList';
import { RubElHizb } from '@/components/ui/rubElHizb';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

export const dynamicParams = true;

export async function getStaticParams() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json'
    );
    const allSurah = await res.json();

    return allSurah.map((surah) => ({
      id: surah.number_of_surah.toString(),
    }));
  } catch (e) {
    return [];
  }
}

async function getAllSurahs() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

async function getSurah(id) {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/penggguna/QuranJSON/master/surah/${id}.json`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      notFound();
    }

    return res.json();
  } catch (e) {
    notFound();
  }
}

export async function generateMetadata({ params }) {
  const surah = await getSurah(params.id);
  if (!surah) return { title: "Surah Tidak Ditemukan" };
  return {
    title: `Surah ${surah.name} (${surah.name_translations?.ar || ''}) - Al-Qur'an Digital`,
    description: `Baca Surah ${surah.name} (${surah.name_translations?.id || ''}) lengkap ayat Arab, terjemahan Indonesia & tafsir resmi Kemenag RI.`,
  };
}

export default async function Page({ params }) {
  const surahNumber = +params.id;
  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound();
  }

  const [surah, allSurahs] = await Promise.all([
    getSurah(params.id),
    getAllSurahs(),
  ]);

  const surahNext =
    surahNumber < 114
      ? allSurahs.find((s) => s.number_of_surah === surahNumber + 1)
      : null;
  const surahPrev =
    surahNumber > 1
      ? allSurahs.find((s) => s.number_of_surah === surahNumber - 1)
      : null;
  const tafsirSurah = surah.tafsir?.id?.kemenag;
  const isMakkiyah = surah.type === 'Makkiyah' || surah.place === 'Mecca';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-base-300">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-base-content/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Daftar Surah</span>
        </Link>

        {/* Prev & Next Quick Links */}
        <div className="flex items-center gap-2 text-xs">
          {surahPrev && (
            <Link
              href={`/my-quran/${surahNumber - 1}`}
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg border border-base-300 hover:border-primary/40 bg-base-100 text-base-content/80 hover:text-primary transition-colors"
              title={`Ke Surah ${surahPrev.name}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{surahPrev.name}</span>
            </Link>
          )}

          {surahNext && (
            <Link
              href={`/my-quran/${surahNumber + 1}`}
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg border border-base-300 hover:border-primary/40 bg-base-100 text-base-content/80 hover:text-primary transition-colors"
              title={`Ke Surah ${surahNext.name}`}
            >
              <span className="hidden sm:inline">{surahNext.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Traditional Surah Header Banner (Islamic Cartouche) */}
      <header className="relative text-center overflow-hidden rounded-2xl border border-base-300 bg-gradient-to-b from-primary/10 via-base-200/60 to-base-100 p-6 sm:p-10 mb-8">
        {/* Subtle decorative background elements */}
        <div className="relative z-10 space-y-3">
          {/* Rub-el-Hizb Badge */}
          <RubElHizb
            className="w-12 h-12 mx-auto"
            starClassName="text-primary/25"
            borderClassName="stroke-primary/60"
            textClassName="text-sm font-bold text-primary"
          >
            {surah.number_of_surah}
          </RubElHizb>

          {/* Arabic Surah Name */}
          <h2
            className="font-amiri text-4xl sm:text-5xl text-base-content font-bold mb-1 select-none"
            dir="rtl"
          >
            {surah.name_translations?.ar || ''}
          </h2>

          {/* Latin Name & Meaning */}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
            Surah {surah.name}
          </h1>

          <p className="text-xs sm:text-sm text-base-content/70 italic font-serif">
            &ldquo;{surah.name_translations?.id || surah.name_translations?.en}&rdquo;
          </p>

          {/* Meta Info Badges */}
          <div className="flex items-center justify-center gap-2 pt-2 text-xs">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full font-medium ${
                isMakkiyah
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {isMakkiyah ? 'Makkiyah' : 'Madaniyah'}
            </span>
            <span className="text-base-content/40">•</span>
            <span className="text-base-content/70 font-medium">
              {surah.number_of_ayah} Ayat
            </span>
          </div>
        </div>
      </header>

      {/* Main Verse Stream */}
      <VerseList surah={surah} tafsirSurah={tafsirSurah} />
    </div>
  );
}
