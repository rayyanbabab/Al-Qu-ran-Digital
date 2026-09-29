import {
  Inter,
  Noto_Sans_Arabic,
  IBM_Plex_Sans_Arabic,
  Noto_Kufi_Arabic,
  Amiri,
} from 'next/font/google';
import '@/styles/globals.css';
import { Provider } from '@/components/provider';
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  variable: '--font-amiri',
  weight: ['400', '700'],
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-arabic',
  weight: ['300', '400', '600'],
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-ibm-arabic',
  weight: ['300', '400', '600'],
});

const kufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  variable: '--font-kufi-arabic',
  weight: ['300', '400', '600'],
});

export const metadata = {
  title: "Al-Qur'an Digital Indonesia",
  description:
    "Baca Al-Qur'an digital lengkap 30 Juz 114 Surah, terjemahan & tafsir Kemenag RI, audio murattal jernih.",
};

export default function RootLayout({ children }) {
  return (
    <Provider>
      <html lang="id" data-theme="emerald" suppressHydrationWarning>
        <body
          className={`${inter.className} ${amiri.variable} ${notoArabic.variable} ${ibmArabic.variable} ${kufiArabic.variable} min-h-screen flex flex-col`}
        >
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <Analytics />
        </body>
      </html>
    </Provider>
  );
}
