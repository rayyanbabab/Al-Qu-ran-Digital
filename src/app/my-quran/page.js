import React from 'react';
import SurahList from '@/components/quran/surahList';

export default function Page() {
  return (
    <main className="min-h-screen">
      <SurahList titleOnly={false} />
    </main>
  );
}
