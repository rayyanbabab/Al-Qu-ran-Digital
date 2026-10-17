'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SurahCard } from './surahCard';
import { SurahSearch } from './surahSearch';
import { JuzList } from './juzList';
import { getSurahNameId } from '@/lib/surahMeta';
import {
  BookMarked,
  ArrowRight,
  BookOpen,
  Layers,
  Book,
  Play,
  Pause,
  Volume2,
  X,
  Compass,
  Navigation,
  Sun,
  Search,
  ScrollText,
  Heart,
} from 'lucide-react';

const QUICK_FEATURES = [
  {
    title: 'Dzikir Pagi & Petang',
    desc: 'Al-Ma\'tsurat & Tasbih',
    icon: Sun,
    href: '/dzikir',
  },
  {
    title: 'Arah Kiblat',
    desc: 'Kompas Ka\'bah Akurat',
    icon: Navigation,
    href: '/kiblat',
  },
  {
    title: 'Cari Makna Ayat',
    desc: '6.236 Ayat Seluruh Quran',
    icon: Search,
    href: '/cari-ayat',
  },
  {
    title: 'Jadwal Sholat',
    desc: 'Waktu Sholat & Adzan',
    icon: Compass,
    href: '/jadwal-sholat',
  },
  {
    title: 'Kumpulan Doa',
    desc: 'Doa Harian Mustajab',
    icon: ScrollText,
    href: '/doa',
  },
  {
    title: '99 Asmaul Husna',
    desc: 'Nama Indah Allah SWT',
    icon: Heart,
    href: '/asmaul-husna',
  },
];

const SurahList = ({ listDisplay, titleOnly, listHeight }) => {
  const [quranData, setQuranData] = useState([]);
  const [filteredQuranData, setFilteredQuranData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRead, setLastRead] = useState(null);
  const [activeTab, setActiveTab] = useState('surah'); // 'surah' | 'juz'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  // Audio preview state
  const [activeAudioSurah, setActiveAudioSurah] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioPlayerRef = useRef(null);

  // Time-based Islamic Greeting
  const [greeting, setGreeting] = useState("Assalamu'alaikum");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) {
      setGreeting("Assalamu'alaikum, Selamat Pagi");
    } else if (hour >= 11 && hour < 15) {
      setGreeting("Assalamu'alaikum, Selamat Siang");
    } else if (hour >= 15 && hour < 18) {
      setGreeting("Assalamu'alaikum, Selamat Sore");
    } else {
      setGreeting("Assalamu'alaikum, Selamat Malam");
    }
  }, []);

  useEffect(() => {
    const updateLastRead = () => {
      try {
        const saved = localStorage.getItem('quran_last_read');
        if (saved) {
          setLastRead(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateLastRead();
    window.addEventListener('quran_last_read_updated', updateLastRead);

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/penggguna/QuranJSON/master/quran.json'
        );
        const data = await response.json();
        setQuranData(data);
        setFilteredQuranData(data);
      } catch (error) {
        console.error('Error fetching Quran data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener('quran_last_read_updated', updateLastRead);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  // Audio Play Preview Toggle Handler
  const handleTogglePlaySurah = (surah) => {
    const surahNum = surah.number_of_surah;
    const displayName = surah.name_id || getSurahNameId(surahNum) || surah.name;
    const recitationUrl =
      surah.recitation ||
      `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(
        surahNum
      ).padStart(3, '0')}.mp3`;

    if (activeAudioSurah?.number === surahNum) {
      if (isAudioPlaying) {
        audioPlayerRef.current?.pause();
        setIsAudioPlaying(false);
      } else {
        audioPlayerRef.current?.play();
        setIsAudioPlaying(true);
      }
      return;
    }

    // Stop current audio if playing
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const audio = new Audio(recitationUrl);
    audioPlayerRef.current = audio;
    setActiveAudioSurah({
      number: surahNum,
      name: displayName,
      arabicName: surah.name_translations?.ar || '',
      url: recitationUrl,
    });
    setIsAudioPlaying(true);
    setAudioProgress(0);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      setIsAudioPlaying(false);
      setAudioProgress(0);
    };

    audio.onerror = () => {
      setIsAudioPlaying(false);
      setActiveAudioSurah(null);
    };

    audio.play().catch(() => {
      setIsAudioPlaying(false);
    });
  };

  const handleStopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsAudioPlaying(false);
    setActiveAudioSurah(null);
    setAudioProgress(0);
  };

  // Sidebar / compact drawer view
  if (titleOnly) {
    return (
      <div className="p-3 space-y-2">
        <SurahSearch
          setFilteredQuranData={setFilteredQuranData}
          quranData={quranData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        <div className={`space-y-2 ${listHeight || ''}`}>
          {filteredQuranData.map((surah) => (
            <SurahCard
              key={surah.number_of_surah}
              surah={surah}
              titleOnly={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero / Greeting & Last Read Card */}
      <div className="mb-8">
        {/* Welcome Greeting Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-base-100 border border-base-300 p-6 sm:p-7 mb-6 shadow-2xs">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{greeting}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
                Al-Qur&apos;an Digital Indonesia
              </h1>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Teks lengkap 30 Juz 114 Surah disertai terjemahan dan tafsir resmi
                Kementerian Agama RI, audio murottal merdu, pencarian makna ayat, dan panduan ibadah.
              </p>
            </div>

            {/* Last read quick card */}
            {lastRead ? (
              <div className="shrink-0 p-4 rounded-xl bg-base-200/40 border border-base-300 max-w-xs w-full">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
                  <BookMarked className="w-4 h-4" />
                  <span>Terakhir Dibaca</span>
                </div>
                <h3 className="font-bold text-base text-base-content">
                  {lastRead.surahName}
                </h3>
                <p className="text-xs text-base-content/60 mb-3">
                  Ayat ke-{lastRead.ayah}
                </p>
                <Link
                  href={`/my-quran/${lastRead.surahId}#ayah-${lastRead.ayah}`}
                  className="inline-flex items-center justify-between w-full py-2 px-3 rounded-lg bg-primary text-primary-content text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>Lanjutkan Tilawah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="shrink-0 p-4 rounded-xl bg-base-200/40 border border-base-300 max-w-xs w-full">
                <span className="text-[11px] font-semibold text-primary block uppercase tracking-wider mb-1">
                  Mulai Tilawah
                </span>
                <h3 className="font-bold text-base text-base-content">
                  Surah Al-Fatihah
                </h3>
                <p className="text-xs text-base-content/60 mb-3">
                  7 Ayat • Makkiyah
                </p>
                <Link
                  href="/my-quran/1"
                  className="inline-flex items-center justify-between w-full py-2 px-3 rounded-lg bg-primary text-primary-content text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  <span>Buka Surah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Quick Features Strip */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
              Menu Utama & Fitur Ibadah
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {QUICK_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={feat.href}
                  href={feat.href}
                  className="group p-3 rounded-xl border border-base-300 bg-base-100 hover:border-primary/40 hover:bg-base-200/40 transition-all flex flex-col justify-between"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 border border-primary/20 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-base-content group-hover:text-primary transition-colors line-clamp-1">
                      {feat.title}
                    </h4>
                    <p className="text-[10px] text-base-content/50 line-clamp-1 mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher: Surah vs Juz */}
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-6 p-1 rounded-2xl bg-base-200 border border-base-300 max-w-xs">
          <button
            onClick={() => setActiveTab('surah')}
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'surah'
                ? 'bg-base-100 text-primary shadow-xs border border-base-300/60'
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <Book className="w-3.5 h-3.5" />
            <span>114 Surah</span>
          </button>
          <button
            onClick={() => setActiveTab('juz')}
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'juz'
                ? 'bg-base-100 text-primary shadow-xs border border-base-300/60'
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>30 Juz</span>
          </button>
        </div>

        {/* Tab Content: Surah View */}
        {activeTab === 'surah' && (
          <>
            {/* Search & Filter Component */}
            <SurahSearch
              setFilteredQuranData={setFilteredQuranData}
              quranData={quranData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />

            {/* Counter indicator */}
            <div className="flex items-center justify-between text-xs text-base-content/60 mb-4 px-1">
              <span>
                Menampilkan{' '}
                <strong className="font-semibold text-base-content">
                  {filteredQuranData.length}
                </strong>{' '}
                dari 114 Surah
              </span>
              <span className="hidden sm:inline text-[11px] text-base-content/40">
                Klik tombol play pada kartu untuk mendengarkan audio murottal
              </span>
            </div>
          </>
        )}
      </div>

      {/* Main Tab Render */}
      {activeTab === 'juz' ? (
        <JuzList />
      ) : (
        /* Grid of Surah Cards */
        isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-base-300 bg-base-100 animate-pulse flex items-center justify-between"
              >
                <div className="flex items-center gap-3 w-3/4">
                  <div className="w-10 h-10 rounded-xl bg-base-300/60" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-base-300/60 rounded w-1/2" />
                    <div className="h-3 bg-base-300/40 rounded w-1/3" />
                  </div>
                </div>
                <div className="w-12 h-6 bg-base-300/50 rounded" />
              </div>
            ))}
          </div>
        ) : filteredQuranData.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-200/30">
            <BookOpen className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
            <h3 className="font-semibold text-base text-base-content mb-1">
              Surah tidak ditemukan
            </h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto mb-4">
              Tidak ada surah yang cocok dengan pencarian Anda. Coba kata kunci
              lain atau nomor surah (1 - 114).
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('ALL');
              }}
              className="btn btn-sm btn-outline btn-primary rounded-xl"
            >
              Tampilkan Semua Surah
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredQuranData.map((surah) => (
              <SurahCard
                key={surah.number_of_surah}
                surah={surah}
                titleOnly={false}
                isPlaying={
                  activeAudioSurah?.number === surah.number_of_surah &&
                  isAudioPlaying
                }
                onTogglePlay={handleTogglePlaySurah}
              />
            ))}
          </div>
        )
      )}

      {/* Floating Bottom Quick Audio Bar (When audio is active) */}
      {activeAudioSurah && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-50 animate-in slide-in-from-bottom-4 duration-200">
          <div className="relative overflow-hidden rounded-2xl bg-base-100/95 border border-primary/30 shadow-2xl backdrop-blur-md p-3.5 flex items-center justify-between gap-3">
            {/* Audio Progress Track at the very top */}
            <div className="absolute top-0 inset-x-0 h-1 bg-base-300">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${audioProgress}%` }}
              />
            </div>

            {/* Surah info & soundwave indicator */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {activeAudioSurah.number}
              </div>
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-base-content truncate">
                    Surah {activeAudioSurah.name}
                  </h4>
                  <span className="text-[10px] text-base-content/50 font-amiri" dir="rtl">
                    {activeAudioSurah.arabicName}
                  </span>
                </div>
                <p className="text-[11px] text-primary flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  <span>Misyari Rasyid Al-Afasy</span>
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isAudioPlaying) {
                    audioPlayerRef.current?.pause();
                    setIsAudioPlaying(false);
                  } else {
                    audioPlayerRef.current?.play();
                    setIsAudioPlaying(true);
                  }
                }}
                className="p-2 rounded-xl bg-primary text-primary-content hover:opacity-90 transition-opacity shadow-xs"
                title={isAudioPlaying ? 'Jeda' : 'Putar'}
              >
                {isAudioPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
              </button>

              {/* Buka Surah Button */}
              <Link
                href={`/my-quran/${activeAudioSurah.number}`}
                className="py-1.5 px-2.5 rounded-xl border border-base-300 hover:border-primary/40 bg-base-200/50 hover:bg-base-200 text-xs font-semibold text-base-content transition-colors flex items-center gap-1"
              >
                <span>Buka</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleStopAudio}
                className="p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors"
                title="Tutup pemutar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurahList;
