'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  calculateQiblaDirection,
  calculateDistanceToKaaba,
  getCompassDirectionName,
  POPULAR_INDONESIA_CITIES,
} from '@/lib/qiblaApi';
import {
  Compass,
  MapPin,
  Navigation,
  ChevronRight,
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function KiblatPage() {
  const [selectedCityId, setSelectedCityId] = useState(POPULAR_INDONESIA_CITIES[0].id);
  const [locationName, setLocationName] = useState(POPULAR_INDONESIA_CITIES[0].name);
  const [coords, setCoords] = useState({
    lat: POPULAR_INDONESIA_CITIES[0].lat,
    lng: POPULAR_INDONESIA_CITIES[0].lng,
  });

  const [heading, setHeading] = useState(0); // device heading from north (0 - 360)
  const [isCompassActive, setIsCompassActive] = useState(false);
  const [compassError, setCompassError] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Calculate Qibla bearing and distance
  const qiblaAngle = calculateQiblaDirection(coords.lat, coords.lng);
  const distanceKm = calculateDistanceToKaaba(coords.lat, coords.lng);
  const directionName = getCompassDirectionName(qiblaAngle);

  // Difference between current device heading and Qibla angle
  // When difference is close to 0 (e.g. within ±3 deg), user is facing Kaaba!
  const angleDiff = Math.abs((heading - qiblaAngle + 540) % 360 - 180);
  const isFacingQibla = isCompassActive && angleDiff <= 4;

  // Handle City Change
  const handleCityChange = (e) => {
    const city = POPULAR_INDONESIA_CITIES.find((c) => c.id === e.target.value);
    if (city) {
      setSelectedCityId(city.id);
      setLocationName(city.name);
      setCoords({ lat: city.lat, lng: city.lng });
    }
  };

  // Handle GPS Auto Detect
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung fitur Geolocation.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationName(`Lokasi GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`);
      },
      (err) => {
        setIsGpsLoading(false);
        alert('Gagal mendeteksi lokasi GPS: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Start Device Orientation (Compass)
  const startCompass = async () => {
    // iOS 13+ requires explicit permission request
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response !== 'granted') {
          setCompassError('Izin akses sensor kompas ditolak.');
          return;
        }
      } catch (err) {
        setCompassError('Gagal meminta izin sensor kompas.');
        return;
      }
    }

    const handleOrientation = (e) => {
      let compassHeading = 0;
      if (e.webkitCompassHeading !== undefined) {
        // iOS
        compassHeading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android / standard (alpha is degrees from 0 to 360)
        compassHeading = 360 - e.alpha;
      }

      setHeading(Math.round(compassHeading));
      setIsCompassActive(true);

      // Haptic feedback when aligned
      const diff = Math.abs((compassHeading - qiblaAngle + 540) % 360 - 180);
      if (diff <= 3 && 'vibrate' in navigator) {
        try {
          navigator.vibrate(30);
        } catch (e) {}
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      setIsCompassActive(true);
      setCompassError('');
    } else {
      setCompassError('Perangkat ini tidak memiliki sensor magnetometer / kompas.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-base-content/60 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Al-Qur&apos;an
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/jadwal-sholat" className="hover:text-primary transition-colors">
          Jadwal Sholat
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-base-content font-medium">Arah Kiblat</span>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-base-200 to-base-100 border border-base-300 p-6 sm:p-8 mb-8">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Penunjuk Arah Sholat Presisi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
            Kompas Arah Kiblat
          </h1>
          <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
            Menentukan sudut derajat arah Ka&apos;bah di Masjidil Haram Makkah secara akurat
            dari lokasi Anda. Dilengkapi sensor kompas interaktif untuk smartphone.
          </p>
        </div>
      </div>

      {/* Location Bar */}
      <div className="p-4 rounded-2xl bg-base-100 border border-base-300 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-base-content/50 block">
              Lokasi Saat Ini
            </span>
            <span className="text-sm font-bold text-base-content">
              {locationName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* City select dropdown */}
          <select
            value={selectedCityId}
            onChange={handleCityChange}
            className="select select-sm select-bordered rounded-xl text-xs flex-1 sm:flex-initial"
          >
            {POPULAR_INDONESIA_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* GPS button */}
          <button
            onClick={handleUseGps}
            disabled={isGpsLoading}
            type="button"
            className="btn btn-sm btn-outline btn-primary rounded-xl text-xs gap-1.5"
            title="Deteksi lokasi via GPS"
          >
            <Navigation className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-spin' : ''}`} />
            <span>GPS</span>
          </button>
        </div>
      </div>

      {/* Compass Interactive Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-10">
        {/* Left: Visual Compass Dial (7 cols) */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl bg-base-200/40 border border-base-300 relative">
          {/* Facing Kiblat Alert Badge */}
          {isFacingQibla && (
            <div className="absolute top-4 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg animate-bounce flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Tepat Menghadap Kiblat!</span>
            </div>
          )}

          {/* Compass Dial Outer Ring */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-base-300 shadow-xl flex items-center justify-center bg-base-100">
            {/* Compass degree markings / ticks */}
            <div
              className="absolute inset-2 rounded-full border border-dashed border-base-300 transition-transform duration-200"
              style={{
                transform: `rotate(${isCompassActive ? -heading : 0}deg)`,
              }}
            >
              {/* Cardinal directions */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500">
                U (0°)
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold text-base-content/60">
                S (180°)
              </span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-base-content/60">
                T (90°)
              </span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-base-content/60">
                B (270°)
              </span>
            </div>

            {/* Qibla Direction Needle / Pointer */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 pointer-events-none"
              style={{
                transform: `rotate(${isCompassActive ? qiblaAngle - heading : qiblaAngle}deg)`,
              }}
            >
              {/* The Needle pointer to Kaaba */}
              <div className="w-1.5 h-1/2 bg-gradient-to-t from-primary to-emerald-400 rounded-t-full shadow-md relative -translate-y-1/2">
                {/* Kaaba Icon at the tip */}
                <div className="absolute -top-6 -left-3.5 w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg border-2 border-white dark:border-base-100 text-xs font-bold">
                  🕋
                </div>
              </div>
            </div>

            {/* Compass Center Hub */}
            <div className="z-10 w-14 h-14 rounded-full bg-base-200 border-2 border-base-300 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[10px] font-bold text-primary">
                {qiblaAngle.toFixed(0)}°
              </span>
              <span className="text-[9px] text-base-content/50 uppercase">
                Kiblat
              </span>
            </div>
          </div>

          {/* Compass Control Button */}
          <div className="mt-6 text-center space-y-2">
            {!isCompassActive ? (
              <button
                onClick={startCompass}
                type="button"
                className="btn btn-sm btn-primary rounded-xl px-5 text-xs font-semibold gap-2 shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Aktifkan Kompas Sensor HP</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Sensor HP Aktif: {heading}° dari Utara</span>
              </div>
            )}

            {compassError && (
              <p className="text-xs text-error font-medium">{compassError}</p>
            )}

            <p className="text-[11px] text-base-content/50 max-w-xs">
              Pada smartphone, gerakkan perangkat membentuk pola angka 8 untuk mengkalibrasi sensor.
            </p>
          </div>
        </div>

        {/* Right: Info Cards & Summary (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Main Bearing Card */}
          <div className="p-5 rounded-2xl bg-base-100 border border-primary/20 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold">
              <Navigation className="w-4 h-4" />
              <span>Sudut Derajat Kiblat</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-base-content tracking-tight">
                {qiblaAngle.toFixed(2)}°
              </span>
              <span className="text-sm font-semibold text-primary">
                {directionName}
              </span>
            </div>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Dari arah Utara searah jarum jam, hadapkan tubuh Anda ke sudut{' '}
              <strong>{qiblaAngle.toFixed(1)}°</strong> (arah barat condong ke utara).
            </p>
          </div>

          {/* Distance to Kaaba Card */}
          <div className="p-5 rounded-2xl bg-base-100 border border-base-300 shadow-xs space-y-1">
            <span className="text-xs font-medium text-base-content/60 block">
              Jarak Garis Lurus ke Ka&apos;bah
            </span>
            <div className="text-2xl font-bold text-base-content">
              {distanceKm.toLocaleString('id-ID')} km
            </div>
            <span className="text-[11px] text-base-content/50 block">
              Masjidil Haram, Makkah Al-Mukarramah
            </span>
          </div>

          {/* Practical Tips Card */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-base-content">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Panduan Praktis di Indonesia</span>
            </div>
            <ul className="list-disc list-inside text-base-content/70 space-y-1 leading-relaxed text-[11px]">
              <li>Di sebagian besar Indonesia, arah kiblat berada di antara <strong>290° - 295°</strong> (Barat Laut).</li>
              <li>Jauhkan HP dari benda logam, magnet, atau speaker saat menggunakan kompas sensor.</li>
              <li>Letakkan smartphone di permukaan datar untuk akurasi optimal.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
