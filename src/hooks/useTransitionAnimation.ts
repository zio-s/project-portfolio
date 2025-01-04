// useTransitionAnimation.ts
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const previousScroll = useRef(0);

  const handleOpenOverlay = useCallback(
    (section: string) => {
      if (lenis) {
        previousScroll.current = window.scrollY;
        lenis.stop();
      }

      // 기존 애니메이션 정리
      gsap.killTweensOf('.card');
      gsap.killTweensOf('#cards');
      gsap.killTweensOf('#titles');

      document.documentElement.style.overflow = 'hidden';

      const cardsContainer = document.querySelector('#cards') as HTMLElement;
      const cardsTitle = document.querySelector('#titles') as HTMLElement;

      gsap.fromTo(
        cardsTitle,
        {
          scale: 1,
          opacity: 1,
        },
        {
          opacity: 0,
          scale: 0.7,
          duration: 0.7,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        cardsContainer,
        {
          scale: 1,
          opacity: 1,
        },
        {
          scale: 0.7,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => {
            setCurrentSection(section);
            setIsOverlayActive(true);
            onTransitionComplete?.(section);
          },
        }
      );
    },
    [lenis, onTransitionComplete]
  );

  const handleCloseOverlay = useCallback(() => {
    history.pushState('', document.title, window.location.pathname);

    if (lenis) {
      lenis.start();
    }

    document.documentElement.style.overflow = '';
    document.body.classList.add('home');

    const cardsContainer = document.querySelector('#cards') as HTMLElement;
    const cardsTitle = document.querySelector('#titles') as HTMLElement;

    gsap.fromTo(
      cardsTitle,
      {
        scale: 0.5,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: 'expo.out',
      }
    );

    gsap.fromTo(
      cardsContainer,
      {
        scale: 0.5,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: 'expo.out',
        onComplete: () => {
          if (lenis) {
            lenis.scrollTo(previousScroll.current, {
              immediate: true,
              lock: true,
            });
          }
          setCurrentSection('home');
          setIsOverlayActive(false);
          onTransitionComplete?.('home');
        },
      }
    );
  }, [lenis, onTransitionComplete]);

  // 컴포넌트 언마운트시 스크롤 상태 복구
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = '';
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
