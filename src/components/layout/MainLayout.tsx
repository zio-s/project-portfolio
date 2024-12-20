'use client';

import { useEffect, useState } from 'react';

// import { useThemeColor } from '@/hooks/useThemeColor';
// import { projectsData } from '@/data/projects';
import Header from '../Header';
import Footer from '../Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  // useThemeColor(projectsData[0].colors); // 초기 컬러 설정

  useEffect(() => {
    // 폰트 및 이미지 로딩 체크
    const loadCheck = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadCheck);
  }, []);

  return (
    <div className={`main-wrapper ${isLoading ? 'state-loading' : ''}`}>
      {isLoading && (
        <div id='splash' className='words_holder fonty'>
          {/* 로딩 화면 내용 */}
        </div>
      )}

      <div id='cursor' className='d-portrait-none' aria-hidden='true'>
        <div>
          <i className='smile-icon'></i>
        </div>
      </div>

      <Header />

      <div id='main' className={isScrolling ? 'is-scrolling' : ''}>
        {children}
      </div>

      <Footer />
    </div>
  );
};
