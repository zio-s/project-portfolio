import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import type { UseCardAnimationProps } from '@/utils/animation/types';
import {
  generateCardAnimationConfig,
  getRandomDirection,
  getVerticalCardVars,
  getHorizontalCardVars,
  applyProjectColors,
  safeQuerySelectorAll,
  elementExists,
} from '@/utils/animation/helpers';
import {
  ANIMATION_DURATION,
  OVERLAY_OPACITY,
  SELECTORS,
} from '@/utils/animation/constants';

/**
 * 카드 애니메이션 훅
 *
 * @description
 * 프로젝트 카드의 활성화/비활성화 애니메이션을 관리합니다.
 * 가로/세로 모드에 따라 다른 애니메이션을 적용합니다.
 *
 * @example
 * const { animateActiveCard, resetAllCards } = useCardAnimation({
 *   projects,
 *   isVertical,
 *   setActiveProject
 * });
 */
export const useCardAnimation = ({
  projects,
  isVertical,
}: UseCardAnimationProps) => {
  const activeAnimationRef = useRef<GSAPTimeline | null>(null);

  /**
   * 활성 카드 애니메이션
   */
  const animateActiveCard = useCallback(
    (holder: HTMLElement) => {
      if (!elementExists(holder)) {
        return;
      }

      const cards = holder.querySelectorAll<HTMLElement>(SELECTORS.CARDS);
      const overlays = holder.querySelectorAll<HTMLElement>(SELECTORS.CARD_OVERLAYS);

      if (cards.length === 0 || overlays.length === 0) {
        return;
      }

      // 기존 애니메이션 충돌 방지: 즉시 종료
      if (activeAnimationRef.current) {
        activeAnimationRef.current.kill();
      }

      // 모든 카드의 기존 애니메이션 즉시 종료
      gsap.killTweensOf([cards, overlays]);

      const cardHolders = safeQuerySelectorAll<HTMLElement>(SELECTORS.CARD_HOLDERS);
      if (cardHolders.length === 0) {
        return;
      }

      const currentIndex = cardHolders.indexOf(holder);
      if (currentIndex === -1) {
        return;
      }

      const targetProject = projects[currentIndex];

      // 랜덤 방향 생성
      const direction = getRandomDirection();

      // 애니메이션 설정 생성
      const config = generateCardAnimationConfig(isVertical, direction);

      // GSAP 타임라인 생성 (레퍼런스: duration * 4 = 0.6초, ease: 'expo')
      const tl = gsap.timeline({
        defaults: { duration: 0.3, ease: 'expo', overwrite: true },
      });

      // 오버레이 표시
      tl.to(
        overlays,
        {
          opacity: OVERLAY_OPACITY.VISIBLE,
          duration: ANIMATION_DURATION.FAST,
        },
        0
      );

      // 카드 애니메이션 (가로/세로 모드에 따라)
      if (isVertical) {
        const card0Vars = getVerticalCardVars(config, direction, true);
        const card1Vars = getVerticalCardVars(config, direction, false);

        tl.to(cards[0], card0Vars, 0).to(cards[1], card1Vars, 0);
      } else {
        const card0Vars = getHorizontalCardVars(config, direction, true);
        const card1Vars = getHorizontalCardVars(config, direction, false);

        tl.to(cards[0], card0Vars, 0).to(cards[1], card1Vars, 0);
      }

      // 색상 업데이트
      tl.to(
        [document.documentElement, document.querySelector('header')],
        {
          duration: 0.01,
          ease: config.ease,
          onStart: () => {
            applyProjectColors(targetProject);
          },
        },
        0
      );

      activeAnimationRef.current = tl;
    },
    [projects, isVertical]
  );

  /**
   * 모든 카드 리셋
   */
  const resetAllCards = useCallback(() => {
    const cardHolders = safeQuerySelectorAll<HTMLElement>(SELECTORS.CARD_HOLDERS);

    cardHolders.forEach((holder) => {
      const cards = holder.querySelectorAll<HTMLElement>(SELECTORS.CARDS);
      const overlays = holder.querySelectorAll<HTMLElement>(SELECTORS.CARD_OVERLAYS);

      gsap.to(cards, {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        duration: 0.4,
        overwrite: true,
      });

      gsap.to(overlays, {
        opacity: OVERLAY_OPACITY.HIDDEN,
        duration: ANIMATION_DURATION.FAST,
      });
    });
  }, []);

  return {
    animateActiveCard,
    resetAllCards,
  };
};
