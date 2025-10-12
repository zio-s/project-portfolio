import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import type { UseScrollSnapProps } from '@/utils/animation/types';
import {
  findNearestCardIndex,
  safeQuerySelectorAll,
} from '@/utils/animation/helpers';
import {
  ANIMATION_DURATION,
  SCROLL_SNAP_CONFIG,
  CSS_CLASSES,
  SELECTORS,
} from '@/utils/animation/constants';

/**
 * 스크롤 스냅 훅
 *
 * @description
 * 스크롤 이벤트를 감지하고 가장 가까운 카드로 스냅합니다.
 * 타이틀 애니메이션과 카드 활성화를 처리합니다.
 *
 * @example
 * const { isScrolling, snapToNearestCard } = useScrollSnap({
 *   projects,
 *   isVertical,
 *   lenis,
 *   setActiveProject,
 *   animateActiveCard,
 *   resetAllCards
 * });
 */
export const useScrollSnap = ({
  lenis,
  animateActiveCard,
  resetAllCards,
}: UseScrollSnapProps) => {
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const previousIndexRef = useRef<number>(-1);

  /**
   * 타이틀 애니메이션
   */
  const animateTitle = useCallback((title: HTMLElement) => {
    const titleIn = title.querySelector<HTMLElement>(SELECTORS.TITLE_IN);
    const clientElements = title.querySelectorAll<HTMLElement>(SELECTORS.CLIENTS);
    const metaElement = title.querySelector<HTMLElement>(SELECTORS.META);

    if (!titleIn || !metaElement || clientElements.length === 0) return;

    const tl = gsap.timeline();

    tl.fromTo(
      titleIn,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    )
      .fromTo(
        clientElements,
        { yPercent: -100, opacity: 0 },
        { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        metaElement,
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );
  }, []);

  /**
   * 가장 가까운 카드로 스냅
   */
  const snapToNearestCard = useCallback(() => {
    if (!lenis) return;

    const titleHolders = safeQuerySelectorAll<HTMLElement>(SELECTORS.TITLES);
    const cardHolders = safeQuerySelectorAll<HTMLElement>(SELECTORS.CARD_HOLDERS);

    if (titleHolders.length === 0 || cardHolders.length === 0) return;

    const targetIndex = findNearestCardIndex(cardHolders);
    const targetHolder = cardHolders[targetIndex];
    const targetId = targetHolder.dataset.id;

    if (!targetId) return;

    // 이미 해당 카드가 활성화되어 있으면 스킵
    if (previousIndexRef.current === targetIndex && targetHolder.classList.contains(CSS_CLASSES.ACTIVE)) {
      isScrollingRef.current = false;
      return;
    }

    const targetPosition = targetIndex * window.innerHeight;

    resetAllCards();

    // 모든 active 클래스 제거
    cardHolders.forEach((holder) => holder.classList.remove(CSS_CLASSES.ACTIVE));
    titleHolders.forEach((title) => title.classList.remove(CSS_CLASSES.ACTIVE));

    // 스크롤 애니메이션
    lenis.scrollTo(targetPosition, {
      duration: SCROLL_SNAP_CONFIG.snapDuration,
      onComplete: () => {
        isScrollingRef.current = false;

        // 타겟 홀더 활성화
        targetHolder.classList.add(CSS_CLASSES.ACTIVE);

        // 타겟 타이틀 찾기 및 활성화
        const targetTitle = titleHolders.find((title) => title.dataset.id === targetId);

        if (targetTitle) {
          targetTitle.classList.add(CSS_CLASSES.ACTIVE);
          animateTitle(targetTitle);
        }

        animateActiveCard(targetHolder);
        previousIndexRef.current = targetIndex;
      },
    });
  }, [lenis, animateActiveCard, resetAllCards, animateTitle]);

  /**
   * 스크롤 시작 처리
   */
  const handleScrollStart = useCallback(() => {
    isScrollingRef.current = true;
    resetAllCards();

    // 모든 타이틀 숨기기
    const titles = safeQuerySelectorAll<HTMLElement>(SELECTORS.TITLES);
    titles.forEach((title) => {
      if (title.classList.contains(CSS_CLASSES.ACTIVE)) {
        gsap.to(title.querySelectorAll(`${SELECTORS.TITLE_IN}, ${SELECTORS.CLIENTS}, ${SELECTORS.META}`), {
          yPercent: 100,
          opacity: 0,
          duration: ANIMATION_DURATION.FAST,
          ease: 'power2.in',
          onComplete: () => {
            title.classList.remove(CSS_CLASSES.ACTIVE);
          },
        });
      }
    });

    // 기존 타임아웃 제거
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 딜레이 후 스냅
    scrollTimeoutRef.current = setTimeout(() => {
      snapToNearestCard();
    }, SCROLL_SNAP_CONFIG.snapDelay);
  }, [resetAllCards, snapToNearestCard]);

  /**
   * 스크롤 중 여부 확인
   */
  const isScrolling = useCallback(() => isScrollingRef.current, []);

  /**
   * 스크롤 상태 설정
   */
  const setScrolling = useCallback((value: boolean) => {
    isScrollingRef.current = value;
  }, []);

  return {
    isScrolling,
    setScrolling,
    snapToNearestCard,
    handleScrollStart,
    previousIndexRef,
  };
};
