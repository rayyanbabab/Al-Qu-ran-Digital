import { NextResponse } from 'next/server';
import quranIndex from '@/data/quran_search_index.json';
import { getSurahNameId } from '@/lib/surahMeta';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const limit = parseInt(searchParams.get('limit') || '40', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!q) {
    return NextResponse.json({ total: 0, results: [] });
  }

  const queryLower = q.toLowerCase();

  // Filter verses matching translation or arabic text
  const matched = [];
  for (let i = 0; i < quranIndex.length; i++) {
    const item = quranIndex[i];
    const matchTranslation = item.t?.toLowerCase().includes(queryLower);
    const matchArabic = item.ar?.includes(q);

    if (matchTranslation || matchArabic) {
      matched.push({
        surahNumber: item.s,
        surahName: getSurahNameId(item.s) || `Surah ${item.s}`,
        ayahNumber: item.a,
        translation: item.t,
        arabic: item.ar,
      });
    }
  }

  const startIndex = (page - 1) * limit;
  const paginated = matched.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    total: matched.length,
    page,
    limit,
    query: q,
    results: paginated,
  });
}
