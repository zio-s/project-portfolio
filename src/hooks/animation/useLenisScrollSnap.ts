import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import type Lenis from '@studio-freight/lenis';
import {
  findNearestCardByViewportCenter,
  safeQuerySelectorAll,
} from '@/utils/animation/helpers';
import {
  SCROLL_SNAP_CONFIG,
  CSS_CLASSES,
  SELECTORS,
} from '@/utils/animation/constants';

interface UseLenisScrollSnapProps {
  lenis: Lenis | null;
  animateActiveCard: (holder: HTMLElement) => void;
  resetAllCards: () => void;
}

/**
 * Lenis velocity 기반 스크롤 스냅 훅 (solitario.studio 방식)
 *
 * @description
 * 레퍼런스 사이트(solitario.studio)의 스크롤 스냅 로직을 구현합니다.
 * - Lenis scroll 이벤트 사용
 * - velocity 기반 스냅 트리거
 * - 스크롤 시작 시 카드 리셋
 * - 뷰포트 중심 기반 스냅 계산
 *
 * @example
 * const { previousIndexRef } = useLenisScrollSnap({
 *   lenis,
 *   animateActiveCard,
 *   resetAllCards
 * });
 */
export const useLenisScrollSnap = ({
  lenis,
  animateActiveCard,
  resetAllCards,
}: UseLenisScrollSnapProps) => {
  const isScrollingRef = useRef(false);
  const isSnappingRef = useRef(false);
  const previousIndexRef = useRef<number>(-1);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * 타이틀 애니메이션 (in)
   */
  const animateTitle = useCallback((title: HTMLElement) => {
    const titleIn = title.querySelector<HTMLElement>(SELECTORS.TITLE_IN);
    const clientElements = title.querySelectorAll<HTMLElement>(SELECTORS.CLIENTS);
    const metaElement = title.querySelector<HTMLElement>(SELECTORS.META);

    if (!titleIn || !metaElement || clientElements.length === 0) return;

    // 애니메이션 충돌 방지: 기존 애니메이션 즉시 종료
    gsap.killTweensOf([titleIn, clientElements, metaElement]);

    const tl = gsap.timeline();

    tl.fromTo(
      titleIn,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out', overwrite: true }
    )
      .fromTo(
        clientElements,
        { yPercent: -100, opacity: 0 },
        { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', overwrite: true },
        '-=0.4'
      )
      .fromTo(
        metaElement,
        { yPercent: 50, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out', overwrite: true },
        '-=0.4'
      );
  }, []);

  /**
   * 타이틀 애니메이션 (out)
   */
  const hideAllTitles = useCallback(() => {
    const titles = safeQuerySelectorAll<HTMLElement>(SELECTORS.TITLES);
    titles.forEach((title) => {
      if (title.classList.contains(CSS_CLASSES.ACTIVE)) {
        const elements = title.querySelectorAll<HTMLElement>(`${SELECTORS.TITLE_IN}, ${SELECTORS.CLIENTS}, ${SELECTORS.META}`);

        // 애니메이션 충돌 방지: 기존 애니메이션 즉시 종료
        gsap.killTweensOf(elements);

        gsap.to(elements, {
          yPercent: 100,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          overwrite: true,
          onComplete: () => {
            title.classList.remove(CSS_CLASSES.ACTIVE);
          },
        });
      }
    });
  }, []);

  /**
   * 스크롤 시작 시 활성 카드 리셋 (solitario.studio 패턴)
   */
  const resetActiveCards = useCallback(() => {
    const activeHolders = safeQuerySelectorAll<HTMLElement>(`${SELECTORS.CARD_HOLDERS}.${CSS_CLASSES.ACTIVE}`);

    activeHolders.forEach((holder) => {
      const cards = holder.querySelectorAll<HTMLElement>(SELECTORS.CARDS);
      const overlays = holder.querySelectorAll<HTMLElement>(SELECTORS.CARD_OVERLAYS);

      if (cards.length > 0) {
        // 카드를 즉시 접음 (레퍼런스 방식: 즉시 리셋)
        gsap.killTweensOf(cards);
        gsap.set(cards, {
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
        });
      }

      if (overlays.length > 0) {
        // 오버레이도 즉시 숨김
        gsap.killTweensOf(overlays);
        gsap.set(overlays, {
          opacity: 0,
        });
      }

      holder.classList.remove(CSS_CLASSES.ACTIVE);
    });

    hideAllTitles();
  }, [hideAllTitles]);

  /**
   * 가장 가까운 카드로 스냅
   */
  const snapToNearestCard = useCallback(() => {
    if (isSnappingRef.current || !lenis) return;

    const titleHolders = safeQuerySelectorAll<HTMLElement>(SELECTORS.TITLES);
    const cardHolders = safeQuerySelectorAll<HTMLElement>(SELECTORS.CARD_HOLDERS);

    if (titleHolders.length === 0 || cardHolders.length === 0) return;

    // 뷰포트 중심 기반 스냅 계산 (solitario.studio 방식)
    const targetIndex = findNearestCardByViewportCenter(cardHolders);
    const targetHolder = cardHolders[targetIndex];
    const targetId = targetHolder.dataset.id;

    if (!targetId) return;

    // 이미 해당 카드가 활성화되어 있으면 스킵
    if (previousIndexRef.current === targetIndex && targetHolder.classList.contains(CSS_CLASSES.ACTIVE)) {
      isScrollingRef.current = false;
      return;
    }

    const targetPosition = targetIndex * window.innerHeight;
    const currentScroll = window.scrollY;

    // 이미 목표 위치에 있으면 바로 활성화
    if (Math.abs(currentScroll - targetPosition) < 10) {
      isScrollingRef.current = false;
      isSnappingRef.current = false;

      resetAllCards();
      cardHolders.forEach((holder) => holder.classList.remove(CSS_CLASSES.ACTIVE));
      titleHolders.forEach((title) => title.classList.remove(CSS_CLASSES.ACTIVE));

      targetHolder.classList.add(CSS_CLASSES.ACTIVE);
      const targetTitle = titleHolders.find((title) => title.dataset.id === targetId);

      if (targetTitle) {
        targetTitle.classList.add(CSS_CLASSES.ACTIVE);
        animateTitle(targetTitle);
      }

      animateActiveCard(targetHolder);
      previousIndexRef.current = targetIndex;
      return;
    }

    isSnappingRef.current = true;

    resetAllCards();

    // 모든 active 클래스 제거
    cardHolders.forEach((holder) => holder.classList.remove(CSS_CLASSES.ACTIVE));
    titleHolders.forEach((title) => title.classList.remove(CSS_CLASSES.ACTIVE));

    // Lenis로 스냅 애니메이션 (부드럽게)
    lenis.scrollTo(targetPosition, {
      duration: SCROLL_SNAP_CONFIG.snapDuration,
      onComplete: () => {
        isScrollingRef.current = false;
        isSnappingRef.current = false;

        // 스냅 완료 후 즉시 활성화 (동시에 진행)
        targetHolder.classList.add(CSS_CLASSES.ACTIVE);
        const targetTitle = titleHolders.find((title) => title.dataset.id === targetId);

        if (targetTitle) {
          targetTitle.classList.add(CSS_CLASSES.ACTIVE);
          animateTitle(targetTitle);
        }

        // 카드 펼침 애니메이션을 바로 시작 (부드러운 전환)
        animateActiveCard(targetHolder);
        previousIndexRef.current = targetIndex;
      },
    });
  }, [lenis, animateActiveCard, resetAllCards, animateTitle]);

  /**
   * Lenis 스크롤 이벤트 핸들러 (solitario.studio 패턴)
   *
   * @description
   * 레퍼런스 사이트의 checkScroll 로직:
   * 1. 스크롤 시작 시 활성 카드 리셋
   * 2. velocity가 threshold 이하로 떨어지면 스냅 트리거
   */
  const handleLenisScroll = useCallback(
    (e: { velocity: number; scroll: number; direction: number; progress: number }) => {
      // 스냅 중에는 무시
      if (isSnappingRef.current) return;

      // 스크롤이 시작되었는지 확인
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        // 스크롤 시작 시 즉시 모든 카드 접기
        resetActiveCards();
      }

      // 기존 타임아웃 제거
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // velocity 기반 스냅 트리거 (레퍼런스 방식)
      const velocityThreshold = SCROLL_SNAP_CONFIG.velocityThreshold;
      if (Math.abs(e.velocity) < velocityThreshold) {
        // velocity가 threshold 이하로 떨어지면 200ms 후 스냅
        scrollTimeoutRef.current = setTimeout(() => {
          snapToNearestCard();
        }, SCROLL_SNAP_CONFIG.snapDelay);
      }
    },
    [resetActiveCards, snapToNearestCard]
  );

  /**
   * Lenis scroll 이벤트 리스너 등록
   */
  useEffect(() => {
    if (!lenis) {
      return;
    }

    lenis.on('scroll', handleLenisScroll);

    return () => {
      lenis.off('scroll', handleLenisScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lenis, handleLenisScroll]);

  return {
    isScrolling: () => isScrollingRef.current,
    setScrolling: (value: boolean) => {
      isScrollingRef.current = value;
    },
    snapToNearestCard,
    previousIndexRef,
  };
};
