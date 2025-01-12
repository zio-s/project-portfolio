import { MainLayout } from '@/components/layout/MainLayout';
import type { Metadata } from 'next';
import '@/styles/globals.scss';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';

export const metadata: Metadata = {
  title: 'B의 Portfolio',
  description: 'B의 포트폴리오 - 웹 개발자 포트폴리오 사이트입니다.',
  generator: 'Next.js',
  applicationName: 'B Portfolio',
  keywords: ['포트폴리오', '웹개발', 'frontend', 'react', 'next.js', '프론트앤드', 'gsap'],
  authors: [{ name: 'B', url: 'https://your-website.com' }],
  creator: 'B',
  publisher: 'B',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/pattern/favicon_io/favicon.ico',
    shortcut: '/images/pattern/favicon_io/favicon.ico',
    apple: '/images/pattern/favicon_io/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/images/pattern/favicon_io/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/images/pattern/favicon_io/favicon-32x32.png',
      },
      {
        rel: 'android-chrome',
        sizes: '192x192',
        url: '/images/pattern/favicon_io/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome',
        sizes: '512x512',
        url: '/images/pattern/favicon_io/android-chrome-512x512.png',
      },
    ],
  },

  openGraph: {
    title: 'B의 Portfolio',
    description: 'B의 포트폴리오 - 웹 개발자 포트폴리오 사이트입니다.',
    url: 'https://your-website.com',
    siteName: 'B Portfolio',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://your-website.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'B의 포트폴리오 대표 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B의 Portfolio',
    description: 'B의 포트폴리오 - 웹 개발자 포트폴리오 사이트입니다.',
    creator: '@your_twitter',
    images: ['https://your-website.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <head></head>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
