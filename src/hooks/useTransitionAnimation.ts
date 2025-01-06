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

  // section open
  const handleOpenOverlay = useCallback(
    (section: string) => {
      if (lenis) {
        previousScroll.current = window.scrollY;
        lenis.stop();
      }

      document.documentElement.style.overflow = 'hidden';

      const cardsContainer = document.querySelector('#cards') as HTMLElement;
      const cardsTitle = document.querySelector('#titles') as HTMLElement;
      const overlay = document.querySelector('.overlay') as HTMLElement;
      const aboutContent = document.querySelector('.about-content') as HTMLElement;
      const header = document.querySelector('header') as HTMLElement;

      // CSS transition 설정
      gsap.set([cardsContainer, cardsTitle], {
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      });

      // 1. About 컴포넌트 초기 상태 설정
      gsap.set(overlay, {
        display: 'block',
        opacity: 0,
        visibility: 'visible',
      });

      gsap.set(aboutContent, {
        y: 30,
        opacity: 0,
      });

      // 2. 카드 페이드아웃
      gsap.set([cardsContainer, cardsTitle], {
        opacity: 0,
        scale: 0.55,
      });

      // 3. 오버레이 페이드인
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.inOut',
        onComplete: () => {
          // 4. About 컨텐츠 페이드인
          gsap.to(aboutContent, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.2)',
            onComplete: () => {
              setCurrentSection(section);
              setIsOverlayActive(true);
              onTransitionComplete?.(section);
            },
          });
        },
      });
      if (header) {
        gsap.to(header, {
          backgroundColor: '#fff0db',
          duration: 0.55,
          ease: 'back.out(1.2)',
        });
      }
    },
    [lenis, onTransitionComplete]
  );

  const handleCloseOverlay = useCallback(() => {
    history.pushState('', document.title, window.location.pathname);

    if (lenis) {
      lenis.start();
    }
    window.dispatchEvent(new Event('popstate'));
    const overlay = document.querySelector('.overlay') as HTMLElement;
    const aboutContent = document.querySelector('.about-content') as HTMLElement;
    const cardsContainer = document.querySelector('#cards') as HTMLElement;
    const cardsTitle = document.querySelector('#titles') as HTMLElement;
    const header = document.querySelector('header') as HTMLElement;

    if (header) {
      gsap.to(header, {
        backgroundColor: 'transparent', // 또는 원하는 기본 배경색
        duration: 0.25,
        ease: 'power2.inOut',
      });
    }

    // 1. 현재 진행 중인 모든 애니메이션 정리
    gsap.killTweensOf([cardsContainer, cardsTitle, overlay, aboutContent]);

    // 2. CSS transition 설정
    // About 컨텐츠가 사라질 때는 빠르게, 카드가 나타날 때는 조금 더 부드럽게
    gsap.set([cardsContainer, cardsTitle], {
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    });

    // 3. About 컨텐츠 페이드아웃
    gsap.to(aboutContent, {
      y: 30,
      opacity: 0,
      duration: 0.3, // 좀 더 빠르게
      ease: 'back.in(1.2)', // 더 강한 back 효과

      onComplete: () => {
        // 4. About 오버레이 페이드아웃
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25, // 빠르게
          ease: 'power2.inOut',
          onComplete: () => {
            // 5. 오버레이 완전히 숨기기
            gsap.set(overlay, {
              display: 'none',
              visibility: 'hidden',
            });

            // 6. 카드 초기 상태 설정
            gsap.set([cardsContainer, cardsTitle], {
              opacity: 0,
              scale: 0.85, // 0.5보다 덜 작게 시작
            });

            // 약간의 지연 후 최종 상태로 변경
            requestAnimationFrame(() => {
              gsap.set([cardsContainer, cardsTitle], {
                opacity: 1,
                scale: 1,
                onComplete: () => {
                  document.documentElement.style.overflow = '';
                  document.body.classList.add('home');

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
              });
            });
          },
        });
      },
    });
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
