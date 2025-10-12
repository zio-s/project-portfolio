import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { UseProjectAnimationProps, AnimationRefs } from '@/utils/animation/types';
import { useSmoothScroll } from './useSmoothScroll';
import { useCardAnimation } from './useCardAnimation';
import { useLenisScrollSnap } from './useLenisScrollSnap';
import { useResponsiveAnimation } from './useResponsiveAnimation';
import { useProjectDetail } from './useProjectDetail';
import {
  getCurrentCardInfo,
  applyProjectColors,
  safeQuerySelectorAll,
  generateCardAnimationConfig,
  getRandomDirection,
  isVerticalMode,
} from '@/utils/animation/helpers';
import { INIT_DELAY, CSS_CLASSES, SELECTORS } from '@/utils/animation/constants';

/**
 * 통합 프로젝트 애니메이션 훅
 *
 * @description
 * 모든 애니메이션 로직을 통합하여 관리합니다.
 * - 스무스 스크롤 (Lenis)
 * - 카드 애니메이션
 * - 스크롤 스냅
 * - 반응형 처리 (ResizeObserver)
 * - 프로젝트 디테일 열기/닫기
 *
 * @example
 * const { wrapperRef, cardsRef, isVertical, openProjectDetail, closeProjectDetail, lenis } =
 *   useProjectAnimation({ projects, setActiveProject });
 */
export const useProjectAnimation = ({
  projects,
  setActiveProject,
}: UseProjectAnimationProps): AnimationRefs & {
  isVertical: boolean;
  openProjectDetail: (holder: HTMLElement) => void;
  closeProjectDetail: () => void;
  lenis: ReturnType<typeof useSmoothScroll>['lenis'];
} => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const isInitializedRef = useRef(false);

  // 1. 스무스 스크롤 초기화
  const { lenis, start: startLenis } = useSmoothScroll();

  // 2. 반응형 애니메이션 (ResizeObserver 포함)
  const { isVertical } = useResponsiveAnimation({
    projects,
    cardsRef,
    wrapperRef,
    setActiveProject,
    resetAllCards: () => {}, // 임시, 아래에서 실제 함수로 대체
  });

  // 3. 카드 애니메이션
  const { animateActiveCard, resetAllCards } = useCardAnimation({
    projects,
    isVertical,
    setActiveProject,
  });

  // 4. Lenis velocity 기반 스크롤 스냅 (solitario.studio 방식)
  const { previousIndexRef } = useLenisScrollSnap({
    lenis,
    animateActiveCard,
    resetAllCards,
  });

  // 5. 프로젝트 디테일
  const { openProjectDetail, closeProjectDetail } = useProjectDetail({
    projects,
    isVertical,
    lenis,
    setActiveProject,
    animateActiveCard,
  });

  /**
   * 초기 카드 설정 및 애니메이션
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    gsap.registerPlugin(ScrollTrigger);

    const { currentIndex, currentProject } = getCurrentCardInfo(projects);

    // 프로젝트 색상 적용
    if (currentProject) {
      applyProjectColors(currentProject);
    }

    // 현재 카드와 타이틀 찾기
    const cardHolders = safeQuerySelectorAll<HTMLElement>(SELECTORS.CARD_HOLDERS);
    const titles = safeQuerySelectorAll<HTMLElement>(SELECTORS.TITLES);

    const currentCard = cardHolders[currentIndex];
    const currentTitle = titles[currentIndex];

    if (currentCard && currentTitle) {
      currentCard.setAttribute('data-project-id', currentProject.id);

      setTimeout(() => {
        window.scrollTo({
          top: currentIndex * window.innerHeight,
          behavior: 'auto',
        });

        // 현재 카드 활성화
        currentCard.classList.add(CSS_CLASSES.ACTIVE);
        currentTitle.classList.add(CSS_CLASSES.ACTIVE);

        const isVerticalNow = isVerticalMode();
        const direction = getRandomDirection();
        const config = generateCardAnimationConfig(isVerticalNow, direction);
        const cards = currentCard.querySelectorAll<HTMLElement>(SELECTORS.CARDS);

        // 카드 애니메이션 (레퍼런스: 0.6초, expo)
        if (isVerticalNow) {
          gsap.to(cards[0], {
            yPercent: config.yOffset * -1,
            xPercent: config.xOffset * direction,
            rotation: config.rotation1,
            duration: 0.6,
            ease: 'expo',
          });
          gsap.to(cards[1], {
            yPercent: config.yOffset,
            xPercent: config.xOffset * direction * -1,
            rotation: config.rotation2,
            duration: 0.6,
            ease: 'expo',
          });
        } else {
          gsap.to(cards[0], {
            xPercent: config.xOffset * direction * -1,
            yPercent: config.yOffset * -1,
            rotation: config.rotation1,
            duration: 0.6,
            ease: 'expo',
          });
          gsap.to(cards[1], {
            xPercent: config.xOffset * direction,
            yPercent: config.yOffset,
            rotation: config.rotation2,
            duration: 0.6,
            ease: 'expo',
          });
        }

        // 타이틀 애니메이션
        const titleIn = currentTitle.querySelector<HTMLElement>(SELECTORS.TITLE_IN);
        const clients = currentTitle.querySelectorAll<HTMLElement>(SELECTORS.CLIENTS);
        const meta = currentTitle.querySelector<HTMLElement>(SELECTORS.META);

        if (titleIn) {
          gsap.fromTo(
            titleIn,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
          );
        }

        if (clients.length) {
          gsap.fromTo(
            clients,
            { yPercent: -100, opacity: 0 },
            { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
          );
        }

        if (meta) {
          gsap.fromTo(
            meta,
            { yPercent: 50, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
          );
        }

        // 활성 프로젝트 설정
        setActiveProject(currentProject.id);
        previousIndexRef.current = currentIndex;
      }, INIT_DELAY);
    }

    // RAF 시작
    requestAnimationFrame(() => {
      startLenis();
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
    // previousIndexRef는 ref 객체로 의존성 배열에 포함하지 않음
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, setActiveProject, startLenis]);

  return {
    wrapperRef,
    cardsRef,
    isVertical,
    openProjectDetail,
    closeProjectDetail,
    lenis,
  };
};
