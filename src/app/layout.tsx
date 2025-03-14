import { MainLayout } from '@/components/layout/MainLayout';
import type { Metadata } from 'next';
import '@/styles/globals.scss';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';

export const metadata: Metadata = {
  title: 'B - 프론트엔드 개발자 포트폴리오',
  description:
    '프론트엔드 개발자 변세민의 포트폴리오입니다. React, Next.js, TypeScript를 기반으로 한 웹 개발 프로젝트를 통해 반응형 디자인, 사용자 경험 최적화, 모던 웹 기술 적용 능력을 확인하실 수 있습니다. GSAP 애니메이션, REST API 연동, 상태관리 등 다양한 기술 스택을 활용한 실무 프로젝트 경험을 소개합니다. 창의적인 문제 해결 능력과 클린 코드를 지향하는 개발자로서 성장하고 있습니다.',
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
    'GSAP 포트폴리오',
    'GSAP 프론트엔드',
    '웹 프로젝트',
    '반응형 웹',
    '프론트엔드 프로젝트',
    '개발자 이력서',
    '웹 디자인 포트폴리오',
    '자바스크립트 개발자',
    '타입스크립트 개발자',
    '프론트엔드 취업',
    '웹 퍼블리셔',
    '웹 퍼블리싱',
    '프론트엔드 경력',
    '웹 개발 포트폴리오',
    'UI/UX 개발자',
    '모던 웹 개발',
    'SPA 개발자',
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
      '프론트엔드 개발자 변세민의 포트폴리오입니다. React, Next.js, TypeScript를 기반으로 한 웹 개발 프로젝트를 통해 반응형 디자인, 사용자 경험 최적화, 모던 웹 기술 적용 능력을 확인하실 수 있습니다. GSAP 애니메이션, REST API 연동, 상태관리 등 다양한 기술 스택을 활용한 실무 프로젝트 경험을 소개합니다.',
    url: 'https://project-portfolio-gules.vercel.app/',
    siteName: 'B Portfolio',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://project-portfolio-gules.vercel.app/2024-1.png',
        width: 1200,
        height: 630,
        alt: '변세민의 포트폴리오 대표 이미지',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B - 프론트엔드 개발자 포트폴리오',
    description:
      '프론트엔드 개발자 변세민의 포트폴리오입니다. React, Next.js, TypeScript를 기반으로 한 웹 개발 프로젝트를 통해 반응형 디자인, 사용자 경험 최적화, 모던 웹 기술 적용 능력을 확인하실 수 있습니다. GSAP 애니메이션, REST API 연동, 상태관리 등 다양한 기술 스택을 활용한 실무 프로젝트 경험을 소개합니다.',
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
    maximumScale: 5,
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
