'use client';

import { memo, useEffect, useState } from 'react';

import Header from '../Header';
import Footer from '../Footer';
import CustomCursor from '../CustomCursor';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = memo(({ children }: MainLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 폰트 및 이미지 로딩 체크
    const loadCheck = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadCheck);
  }, []);

  return (
    <div className={`main-wrapper min-h-screen ${isLoading ? 'state-loading' : ''}`}>
      {isLoading && (
        <div id='splash' className='words_holder fonty'>
          {/* 로딩 화면 내용 */}
        </div>
      )}

      <CustomCursor />

      <Header />

      <main className='relative min-h-screen'>{children}</main>

      <Footer />
    </div>
  );
});

MainLayout.displayName = 'MainLayout';
