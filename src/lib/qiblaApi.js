/**
 * Modul kalkulasi arah kiblat & koordinat Ka'bah
 */

export const KAABA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206,
};

/**
 * Menghitung sudut arah kiblat (dalam derajat dari Utara searah jarum jam 0° - 360°)
 * Menggunakan rumus spherical trigonometry
 */
export function calculateQiblaDirection(latitude, longitude) {
  const phi1 = (latitude * Math.PI) / 180;
  const phi2 = (KAABA_COORDS.latitude * Math.PI) / 180;
  const deltaLambda = ((KAABA_COORDS.longitude - longitude) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = (qiblaRad * 180) / Math.PI;

  return (qiblaDeg + 360) % 360;
}

/**
 * Menghitung jarak ke Ka'bah dalam kilometer (Haversine Formula)
 */
export function calculateDistanceToKaaba(latitude, longitude) {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((KAABA_COORDS.latitude - latitude) * Math.PI) / 180;
  const dLon = ((KAABA_COORDS.longitude - longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latitude * Math.PI) / 180) *
      Math.cos((KAABA_COORDS.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Menentukan arah mata angin dari derajat
 */
export function getCompassDirectionName(degree) {
  const directions = [
    'Utara',
    'Timur Laut',
    'Timur',
    'Tenggara',
    'Selatan',
    'Barat Daya',
    'Barat',
    'Barat Laut',
  ];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
}

export const POPULAR_INDONESIA_CITIES = [
  { id: 'jakarta', name: 'DKI Jakarta', lat: -6.2088, lng: 106.8456 },
  { id: 'surabaya', name: 'Surabaya, Jawa Timur', lat: -7.2575, lng: 112.7521 },
  { id: 'bandung', name: 'Bandung, Jawa Barat', lat: -6.9175, lng: 107.6191 },
  { id: 'medan', name: 'Medan, Sumatera Utara', lat: 3.5952, lng: 98.6722 },
  { id: 'semarang', name: 'Semarang, Jawa Tengah', lat: -6.9667, lng: 110.4167 },
  { id: 'makassar', name: 'Makassar, Sulawesi Selatan', lat: -5.1477, lng: 119.4327 },
  { id: 'palembang', name: 'Palembang, Sumatera Selatan', lat: -2.9761, lng: 104.7754 },
  { id: 'yogyakarta', name: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { id: 'denpasar', name: 'Denpasar, Bali', lat: -8.6705, lng: 115.2126 },
  { id: 'padang', name: 'Padang, Sumatera Barat', lat: -0.9471, lng: 100.4172 },
  { id: 'banda-aceh', name: 'Banda Aceh, Aceh', lat: 5.5483, lng: 95.3238 },
  { id: 'banjarmasin', name: 'Banjarmasin, Kalimantan Selatan', lat: -3.3194, lng: 114.5908 },
  { id: 'pontianak', name: 'Pontianak, Kalimantan Barat', lat: -0.0263, lng: 109.3425 },
  { id: 'samarinda', name: 'Samarinda, Kalimantan Timur', lat: -0.5022, lng: 117.1536 },
  { id: 'mataram', name: 'Mataram, NTB', lat: -8.5833, lng: 116.1167 },
  { id: 'kupang', name: 'Kupang, NTT', lat: -10.1772, lng: 123.607 },
  { id: 'jayapura', name: 'Jayapura, Papua', lat: -2.5916, lng: 140.669 },
];
