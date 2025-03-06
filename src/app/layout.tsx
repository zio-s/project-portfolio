import { MainLayout } from '@/components/layout/MainLayout';
import type { Metadata } from 'next';
import '@/styles/globals.scss';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';

export const metadata: Metadata = {
  title: 'B - 프론트엔드 개발자 포트폴리오',
  description:
    '프론트엔드 개발자 변세민 포트폴리오입니다. 제 작업물이 궁금 하신가요? 바로 확인 해보세요! React, Next.js를 활용한 웹 개발 프로젝트를 확인하실 수 있습니다.',
  generator: 'Next.js',
  applicationName: 'B Portfolio',
  keywords: [
    '포트폴리오',
    '웹개발자',
    'frontend',
    'react',
    'next.js',
    '프론트엔드 개발자',
    '웹 포트폴리오',
    '신입 개발자',
    '프론트엔드 포트폴리오',
    'React 개발자',
    '웹사이트 제작',
    'React Next.js 포트폴리오',
    '리엑트 포트폴리오',
    '타입스크립트 포트폴리오',
    '신입 개발자 react 포트폴리오',
    '신입 개발자 react 포트폴리오',
  ],
  authors: [{ name: 'B', url: 'https://project-portfolio-gules.vercel.app/' }],
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
  metadataBase: new URL('https://project-portfolio-gules.vercel.app/'),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/ko',
      'en-US': '/en',
    },
  },
  verification: {
    google: 'google7a081191afb23e6f',
  },
  openGraph: {
    title: 'B - 프론트엔드 개발자 포트폴리오',
    description:
      '프론트엔드 개발자 B의 포트폴리오입니다. React, Next.js를 활용한 웹 개발 프로젝트를 확인하실 수 있습니다.',
    url: 'https://project-portfolio-gules.vercel.app/',
    siteName: 'B Portfolio',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/2024-1.png',
        width: 1200,
        height: 630,
        alt: 'B의 포트폴리오 대표 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B - 프론트엔드 개발자 포트폴리오',
    description:
      '프론트엔드 개발자 B의 포트폴리오입니다. React, Next.js를 활용한 웹 개발 프로젝트를 확인하실 수 있습니다.',
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
