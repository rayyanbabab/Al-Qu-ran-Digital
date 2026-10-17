# 📖 Al-Qur'an Digital

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-4.9-5ad8e6?style=for-the-badge&logo=daisyui)](https://daisyui.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

Aplikasi web **Al-Qur'an Digital** modern, cepat, dan responsif dengan fitur lengkap untuk mendukung ibadah sehari-hari. Dibangun menggunakan teknologi **Next.js 14 App Router**, **Tailwind CSS**, dan **DaisyUI**, aplikasi ini dirancang untuk memberikan pengalaman membaca Al-Qur'an yang nyaman, estetis, dan mudah diakses dari perangkat desktop maupun mobile.

---

## ✨ Fitur Utama

### 1. 📖 Baca Al-Qur'an Lengkap (114 Surah & 30 Juz)
* **Mode Tampilan Ganda:** Jelajahi Al-Qur'an berdasarkan daftar **Surah** maupun pembagian **30 Juz**.
* **Tipografi Jelas & Elegan:** Teks Arab berharakat tajam yang nyaman untuk mata, dilengkapi teks transliterasi Latin serta terjemahan resmi Bahasa Indonesia.
* **Audio Murottal Interaktif:** Dengarkan lantunan ayat per ayat dengan kontrol putar, jeda, dan navigasi yang responsif.
* **Tafsir & Metadata Surah:** Info lengkap mengenai jenis surah (Makkiyah/Madaniyah), urutan pewahyuan, jumlah ayat, serta tafsir ringkas.
* **Bagikan Ayat (Share Modal):** Fitur untuk menyalin teks ayat secara instan atau membagikannya dengan kartu tampilan yang rapi.
* **Penanda Bacaan & Bookmark:** Simpan ayat favorit Anda dan lanjutkan membaca dari posisi terakhir (*Last Read*) yang tersimpan otomatis di perangkat (*LocalStorage*).

### 2. ⚡ Command Palette & Navigasi Kilat (`Ctrl + K` / `Cmd + K`)
* Cari surah, lompat ke juz tertentu, atau buka fitur doa dan jadwal sholat dalam hitungan detik tanpa perlu scrolling panjang.

### 3. 🔍 Fitur Pencarian Cerdas & Cari Ayat
* **Filter Surah:** Temukan surah berdasarkan nama Latin, nama Arab, terjemahan, atau nomor urut surah.
* **Cari Ayat:** Jelajahi ayat-ayat Al-Qur'an melalui kata kunci dalam terjemahan bahasa Indonesia.

### 4. 🕌 Jadwal Sholat & Waktu Imsak
* Jadwal sholat 5 waktu (Subuh, Dzuhur, Ashar, Maghrib, Isya) ditambah waktu Imsak dan Terbit.
* Deteksi lokasi otomatis melalui geolokasi browser serta opsi pemilihan kota-kota di Indonesia.
* Dilengkapi penghitung waktu mundur (*countdown*) menuju waktu sholat berikutnya.

### 5. 🧭 Penunjuk Arah Kiblat
* Kompas kiblat interaktif berbasis koordinat pengguna untuk menentukan arah Ka'bah secara akurat di mana pun Anda berada.

### 6. 🤲 Dzikir Pagi & Petang
* Bacaan dzikir waktu pagi dan petang sesuai sunnah, dilengkapi lafal Arab, transliterasi, keutamaan, serta **Tasbih Digital** interaktif.

### 7. 📜 Doa-Doa Pilihan Harian
* Kumpulan doa mustajab sehari-hari (doa makan, tidur, safar, orang tua, dsb.) dengan arti dan referensi.

### 8. 💖 Asmaul Husna (99 Nama Allah)
* Menampilkan 99 nama-nama agung Allah Subhanahu Wa Ta'ala lengkap dengan tulisan Arab, cara pelafalan latin, dan maknanya.

### 9. 🎨 Desain Modern & Responsif
* **Multi-Theme / Dark Mode:** Pilihan tema terang dan gelap yang dapat disesuaikan untuk kenyamanan membaca di siang maupun malam hari.
* **Mobile-First & Responsive:** Tampilan rapi dan nyaman digunakan di smartphone, tablet, maupun layar monitor lebar.
* **Animasi Halus:** Transisi antar halaman dan interaksi tombol menggunakan **Framer Motion**.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Library UI** | [React 18](https://reactjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/) |
| **Animasi** | [Framer Motion](https://www.framer.com/motion/) |
| **Ikon** | [Lucide React](https://lucide.dev/) |
| **Penyimpanan Lokal** | Browser LocalStorage (Bookmarks & Last Read) |
| **Sumber Data / API** | [QuranJSON](https://github.com/penggguna/QuranJSON), API Jadwal Sholat & Kiblat |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 🚀 Memulai (Instalasi Lokal)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js** (versi 18.x atau lebih baru) dan npm/yarn/pnpm di komputer Anda.

### 2. Clone Repositori
```bash
git clone https://github.com/rayyanbabab/Al-Qu-ran-Digital.git
cd Al-Qu-ran-Digital
```

### 3. Install Dependensi
```bash
npm install
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```

Buka peramban (browser) dan akses alamat [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

### 5. Membangun untuk Produksi (*Production Build*)
```bash
npm run build
npm run start
```

---

## 📁 Struktur Direktori Singkat

```text
aplikasi-quran/
├── public/                 # Aset statis & ikon
├── src/
│   ├── app/                # Next.js 14 App Router
│   │   ├── api/            # Route handlers & proxy API
│   │   ├── asmaul-husna/   # Halaman Asmaul Husna
│   │   ├── cari-ayat/      # Fitur pencarian ayat Al-Qur'an
│   │   ├── doa/            # Kumpulan doa-doa harian
│   │   ├── dzikir/         # Dzikir Pagi & Petang + Tasbih
│   │   ├── jadwal-sholat/  # Jadwal sholat dan imsak
│   │   ├── kiblat/         # Arah kiblat berbasis kompas koordinat
│   │   ├── my-quran/       # Halaman detail surah & pembaca ayat
│   │   ├── layout.js       # Root layout, Navbar, Footer
│   │   └── page.js         # Halaman utama (Daftar Surah & Juz)
│   ├── components/         # Komponen UI modular
│   │   ├── quran/          # Komponen Al-Qur'an (SurahList, JuzList, VerseList, Audio, Bookmark)
│   │   └── ui/             # Komponen antarmuka (Navbar, Footer, CommandPalette, ThemeSwitcher)
│   ├── data/               # Data statis (doa, dzikir, asmaul husna, metadata)
│   └── lib/                # Helper utilities, kalkulator sholat/kiblat, bookmark storage
├── tailwind.config.js      # Konfigurasi Tailwind & DaisyUI
└── package.json            # Daftar dependensi & script proyek
```

---

## 🤝 Kontribusi

Kontribusi selalu terbuka! Jika Anda memiliki saran, perbaikan bug, atau penambahan fitur:
1. *Fork* repositori ini
2. Buat *feature branch* (`git checkout -b fitur/nama-fitur`)
3. Lakukan *commit* perubahan (`git commit -m 'Menambahkan fitur nama-fitur'`)
4. *Push* ke branch Anda (`git push origin fitur/nama-fitur`)
5. Buat sebuah **Pull Request**

---

## 📜 Sumber Data & Penghargaan

* Data Al-Qur'an & Terjemahan: [QuranJSON by penggguna](https://github.com/penggguna/QuranJSON)
* Audio Murottal: Al-Afasy / Kemenag / Quran API
* Ikon: [Lucide React](https://lucide.dev/)

---

## 👤 Pengembang

Dibuat dengan sepenuh hati oleh **[Rayyan Babab](https://github.com/rayyanbabab)**.

Semoga aplikasi ini dapat memberikan manfaat, memudahkan umat dalam membaca dan mentadaburi Al-Qur'an, serta menjadi ladang amal jariyah bagi kita semua. Aamiin. 🤲
