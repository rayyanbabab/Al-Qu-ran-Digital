export const INDONESIA_CITIES = [
  { id: 'Jakarta', name: 'DKI Jakarta', lat: -6.2088, lng: 106.8456 },
  { id: 'Bandung', name: 'Bandung, Jawa Barat', lat: -6.9175, lng: 107.6191 },
  { id: 'Surabaya', name: 'Surabaya, Jawa Timur', lat: -7.2575, lng: 112.7521 },
  { id: 'Medan', name: 'Medan, Sumatera Utara', lat: 3.5952, lng: 98.6722 },
  { id: 'Semarang', name: 'Semarang, Jawa Tengah', lat: -6.9667, lng: 110.4167 },
  { id: 'Yogyakarta', name: 'D.I. Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { id: 'Makassar', name: 'Makassar, Sulawesi Selatan', lat: -5.1477, lng: 119.4327 },
  { id: 'Denpasar', name: 'Denpasar, Bali', lat: -8.6705, lng: 115.2126 },
  { id: 'Palembang', name: 'Palembang, Sumatera Selatan', lat: -2.9761, lng: 104.7754 },
  { id: 'Padang', name: 'Padang, Sumatera Barat', lat: -0.9471, lng: 100.4172 },
  { id: 'Banda Aceh', name: 'Banda Aceh, Aceh', lat: 5.5483, lng: 95.3238 },
  { id: 'Balikpapan', name: 'Balikpapan, Kalimantan Timur', lat: -1.2379, lng: 116.8289 },
  { id: 'Banjarmasin', name: 'Banjarmasin, Kalimantan Selatan', lat: -3.3167, lng: 114.5901 },
  { id: 'Pontianak', name: 'Pontianak, Kalimantan Barat', lat: -0.0263, lng: 109.3425 },
  { id: 'Manado', name: 'Manado, Sulawesi Utara', lat: 1.4748, lng: 124.8421 },
  { id: 'Jayapura', name: 'Jayapura, Papua', lat: -2.5916, lng: 140.669 },
  { id: 'Bogor', name: 'Bogor, Jawa Barat', lat: -6.5971, lng: 106.806 },
  { id: 'Malang', name: 'Malang, Jawa Timur', lat: -7.9797, lng: 112.6304 },
];

export const PRAYER_NAMES = [
  { key: 'Imsak', name: 'Imsak', desc: 'Menahan makan & minum' },
  { key: 'Fajr', name: 'Subuh', desc: 'Fajar shadiq' },
  { key: 'Sunrise', name: 'Terbit', desc: 'Matahari terbit' },
  { key: 'Dhuhr', name: 'Dzuhur', desc: 'Matahari tergelincir' },
  { key: 'Asr', name: 'Ashar', desc: 'Bayangan menyamai benda' },
  { key: 'Maghrib', name: 'Maghrib', desc: 'Matahari terbenam' },
  { key: 'Isha', name: 'Isya', desc: 'Hilangnya mega merah' },
];

export async function fetchPrayerTimesByCoords(lat, lng) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=20`
    );
    if (!res.ok) throw new Error('Failed to fetch prayer times');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching prayer times by coords:', error);
    return null;
  }
}

export async function fetchPrayerTimesByCity(cityName = 'Jakarta') {
  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
        cityName
      )}&country=Indonesia&method=20`
    );
    if (!res.ok) throw new Error('Failed to fetch prayer times');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching prayer times by city:', error);
    return null;
  }
}

export function getNextPrayer(timings) {
  if (!timings) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerKeys = ['Imsak', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const key of prayerKeys) {
    const timeStr = timings[key];
    if (!timeStr) continue;
    const [h, m] = timeStr.split(':').map(Number);
    const prayerMinutes = h * 60 + m;

    if (prayerMinutes > currentMinutes) {
      const diff = prayerMinutes - currentMinutes;
      const hoursLeft = Math.floor(diff / 60);
      const minsLeft = diff % 60;

      const mapping = PRAYER_NAMES.find((p) => p.key === key);
      return {
        key,
        name: mapping ? mapping.name : key,
        time: timeStr,
        hoursLeft,
        minsLeft,
        countdownStr: `${hoursLeft > 0 ? `${hoursLeft} jam ` : ''}${minsLeft} menit`,
      };
    }
  }

  // If passed Isha, next is tomorrow's Subuh / Imsak
  const fajrTime = timings['Fajr'] || '04:30';
  const [fh, fm] = fajrTime.split(':').map(Number);
  const fajrMinutes = (24 * 60 - currentMinutes) + (fh * 60 + fm);
  const hoursLeft = Math.floor(fajrMinutes / 60);
  const minsLeft = fajrMinutes % 60;

  return {
    key: 'Fajr',
    name: 'Subuh (Besok)',
    time: fajrTime,
    hoursLeft,
    minsLeft,
    countdownStr: `${hoursLeft > 0 ? `${hoursLeft} jam ` : ''}${minsLeft} menit`,
  };
}
