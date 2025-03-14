import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'B Portfolio - 프론트엔드 개발자 포트폴리오',
    short_name: 'B Portfolio',
    description:
      '프론트엔드 개발자 변세민의 포트폴리오 사이트입니다. React, Next.js, TypeScript 기반 웹 개발 프로젝트를 소개합니다.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/images/pattern/favicon_io/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/pattern/favicon_io/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    categories: ['portfolio', 'web development', 'frontend'],
  };
}
