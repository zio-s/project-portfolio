// useTransitionAnimation.ts
import { useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import type { LenisInstance } from '@/types/project';

type Section = 'home' | string; // 모든 섹션 타입을 허용

interface UseTransitionOptions {
  onTransitionComplete?: (section: Section) => void;
  lenis?: LenisInstance | null;
}

export const useTransitionAnimation = ({ lenis, onTransitionComplete }: UseTransitionOptions = {}) => {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  const handleOpenOverlay = useCallback(
    (section: string) => {
      if (lenis) {
        lenis.stop();
      }

      // 메인 스크롤 비활성화
      document.body.style.overflow = 'hidden';

      // 메인 컨텐츠 페이드 아웃 및 포인터 이벤트 비활성화
      gsap.to('.projects-stage', {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentSection(section);
          setIsOverlayActive(true);
          onTransitionComplete?.(section);
        },
      });
    },
    [lenis, onTransitionComplete]
  );

  const handleCloseOverlay = useCallback(() => {
    if (lenis) {
      lenis.start();
    }

    // 메인 스크롤 다시 활성화
    document.body.style.overflow = '';

    gsap.to('.projects-stage', {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentSection('home');
        setIsOverlayActive(false);
        onTransitionComplete?.('home');
      },
    });
  }, [lenis, onTransitionComplete]);

  // 컴포넌트 언마운트시 스크롤 상태 복구
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      if (lenis) {
        lenis.start();
      }
    };
  }, [lenis]);

  // 해시 변경 감지 및 처리
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      if (!hash || hash === 'home') {
        handleCloseOverlay();
        return;
      }

      if (isOverlayActive && currentSection === hash) {
        handleCloseOverlay();
        history.pushState(null, '', window.location.pathname);
      } else {
        handleOpenOverlay(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    const initialHash = window.location.hash.slice(1);
    if (initialHash && initialHash !== 'home') {
      handleOpenOverlay(initialHash);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentSection, isOverlayActive, handleOpenOverlay, handleCloseOverlay]);

  return {
    currentSection,
    isOverlayActive,
    handleCloseOverlay,
  };
};
