'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  INDONESIA_CITIES,
  PRAYER_NAMES,
  fetchPrayerTimesByCity,
  fetchPrayerTimesByCoords,
  getNextPrayer,
} from '@/lib/prayerApi';
import {
  Compass,
  MapPin,
  Clock,
  Navigation,
  Calendar,
  BookOpen,
  ChevronRight,
  Sun,
  Moon,
  Sunset,
  Sunrise,
} from 'lucide-react';

const PRAYER_ICONS = {
  Imsak: Moon,
  Fajr: Sunrise,
  Sunrise: Sun,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

export default function JadwalSholatPage() {
  const [selectedCity, setSelectedCity] = useState(INDONESIA_CITIES[0].id);
  const [cityNameDisplay, setCityNameDisplay] = useState(INDONESIA_CITIES[0].name);
  const [prayerData, setPrayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayerInfo, setNextPrayerInfo] = useState(null);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch prayer data on city change
  useEffect(() => {
    const loadPrayerTimes = async () => {
      setIsLoading(true);
      const data = await fetchPrayerTimesByCity(selectedCity);
      if (data) {
        setPrayerData(data);
        setNextPrayerInfo(getNextPrayer(data.timings));
      }
      setIsLoading(false);
    };

    loadPrayerTimes();
  }, [selectedCity]);

  // Update countdown every 10 seconds
  useEffect(() => {
    if (prayerData) {
      setNextPrayerInfo(getNextPrayer(prayerData.timings));
    }
  }, [currentTime, prayerData]);

  // Handle GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const data = await fetchPrayerTimesByCoords(latitude, longitude);
        if (data) {
          setPrayerData(data);
          setNextPrayerInfo(getNextPrayer(data.timings));
          setCityNameDisplay('Lokasi Saya (GPS)');
        }
        setIsGpsLoading(false);
      },
      (err) => {
        console.error(err);
        alert('Gagal mendeteksi lokasi GPS. Pastikan izin lokasi aktif.');
        setIsGpsLoading(false);
      }
    );
  };

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-base-content/60 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Al-Qur&apos;an
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-base-content font-medium">Jadwal Sholat</span>
      </div>

      {/* Hero Card & Next Prayer Countdown */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white p-6 sm:p-8 mb-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Kementerian Agama RI & Aladhan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Jadwal Sholat & Waktu Imsakiyah
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/70 leading-relaxed">
              Waktu sholat akurat untuk wilayah Indonesia dengan countdown adzan
              real-time dan panduan arah kiblat.
            </p>

            <div className="flex items-center gap-4 text-xs pt-1 text-emerald-200/90 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {prayerData?.date?.hijri
                  ? `${prayerData.date.hijri.day} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year} H`
                  : formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-mono text-white text-sm font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Next Prayer Highlight Card */}
          {nextPrayerInfo && (
            <div className="shrink-0 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-xs w-full text-center space-y-2 shadow-inner">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-300">
                Waktu Sholat Berikutnya
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {nextPrayerInfo.name}
              </h2>
              <div className="text-3xl font-mono font-bold text-amber-300">
                {nextPrayerInfo.time}
              </div>
              <p className="text-xs text-white/80">
                Tersisa:{' '}
                <strong className="text-emerald-300 font-semibold">
                  {nextPrayerInfo.countdownStr}
                </strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* City Selector & GPS Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 p-3 sm:p-4 rounded-2xl border border-base-300 bg-base-100">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <div className="relative flex-1 sm:w-64">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                const found = INDONESIA_CITIES.find((c) => c.id === e.target.value);
                if (found) setCityNameDisplay(found.name);
              }}
              className="w-full py-2 pl-3 pr-8 rounded-xl border border-base-300 bg-base-100 text-xs font-semibold text-base-content focus:outline-none focus:border-primary cursor-pointer"
            >
              {INDONESIA_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleUseCurrentLocation}
            disabled={isGpsLoading}
            type="button"
            className="w-full sm:w-auto btn btn-sm btn-outline btn-primary gap-1.5 text-xs font-semibold"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>
              {isGpsLoading ? 'Mencari Lokasi...' : 'Gunakan Lokasi GPS'}
            </span>
          </button>

          <Link
            href="/kiblat"
            className="w-full sm:w-auto btn btn-sm btn-primary gap-1.5 text-xs font-semibold"
            title="Buka Kompas Arah Kiblat"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Arah Kiblat</span>
          </Link>
        </div>
      </div>

      {/* Main Prayer Times Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-base-300 bg-base-100 animate-pulse space-y-3 text-center"
            >
              <div className="w-8 h-8 rounded-full bg-base-300 mx-auto" />
              <div className="h-4 bg-base-300 rounded w-1/2 mx-auto" />
              <div className="h-6 bg-base-300 rounded w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      ) : prayerData ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {PRAYER_NAMES.map((prayer) => {
            const time = prayerData.timings[prayer.key] || '--:--';
            const isNext = nextPrayerInfo?.key === prayer.key;
            const Icon = PRAYER_ICONS[prayer.key] || Clock;

            return (
              <div
                key={prayer.key}
                className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-3 ${
                  isNext
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md'
                    : 'border-base-300 bg-base-100 hover:border-primary/30'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isNext
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200 text-base-content/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="font-bold text-sm text-base-content">
                    {prayer.name}
                  </h3>
                  <p className="text-[10px] text-base-content/50 mt-0.5 truncate">
                    {prayer.desc}
                  </p>
                </div>

                <div className="text-xl sm:text-2xl font-mono font-bold text-base-content">
                  {time}
                </div>

                {isNext ? (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-content text-[10px] font-semibold">
                    Berikutnya
                  </span>
                ) : (
                  <div className="h-4" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-base-300 rounded-2xl">
          <p className="text-sm text-base-content/60">
            Gagal memuat jadwal sholat. Silakan periksa koneksi internet Anda.
          </p>
        </div>
      )}

      {/* Kiblat and Hadits Information Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Qibla Direction Guide */}
        <div className="p-5 rounded-2xl border border-base-300 bg-base-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-base-content">
              Panduan Arah Kiblat Indonesia
            </h4>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Arah kiblat untuk wilayah Indonesia rata-rata berkisar antara{' '}
              <strong className="text-primary font-semibold">
                290° hingga 295°
              </strong>{' '}
              dari arah Utara searah jarum jam (Barat Laut / Baratlaut condong ke barat).
            </p>
          </div>
        </div>

        {/* Sholat Reminder Card */}
        <div className="p-5 rounded-2xl border border-base-300 bg-base-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-base-content">
              Keutamaan Menjaga Sholat
            </h4>
            <p className="text-xs text-base-content/70 leading-relaxed italic">
              &quot;Amalan yang pertama kali dihisab dari seorang hamba pada hari
              kiamat adalah sholat. Jika sholatnya baik, maka sungguh ia telah
              beruntung.&quot; (HR. Tirmidzi)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
