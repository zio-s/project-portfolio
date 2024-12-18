import { MainLayout } from '@/components/layout/MainLayout';
import type { Metadata } from 'next';
import '@/styles/globals.scss';
// import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'B의 Portfolio',
  description: 'Zio-s의 포트폴리오입니다.',
  openGraph: {
    title: 'B의 Portfolio',
    description: 'Zio-s의 포트폴리오입니다.',
    type: 'website',
    url: 'http://www.mysite.com/article/article1.html',
    images: [
      {
        url: 'http://www.mysite.com/article/article1_featured_image.jpg',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: '페이지 제목',
    description: '페이지 설명',
    images: ['http://www.mysite.com/article/article1.html'],
    creator: '사이트 명',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
