import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { UseResponsiveAnimationProps } from '@/utils/animation/types';
import {
  isVerticalMode,
  safeQuerySelectorAll,
  isRefValid,
} from '@/utils/animation/helpers';
import {
  CARD_ROTATION_ANGLE,
  CARD_VERTICAL_OFFSET,
  RESIZE_DEBOUNCE_DELAY,
} from '@/utils/animation/constants';

/**
 * 반응형 애니메이션 훅
 *
 * @description
 * ResizeObserver를 활용하여 화면 크기 변경을 감지하고
 * 애니메이션을 재조정합니다. 리사이징 버그를 수정합니다.
 *
 * @example
 * const { isVertical } = useResponsiveAnimation({
 *   projects,
 *   cardsRef,
 *   wrapperRef,
 *   setActiveProject,
 *   resetAllCards
 * });
 */
export const useResponsiveAnimation = ({
  projects,
  cardsRef,
  wrapperRef,
  setActiveProject,
  resetAllCards,
}: UseResponsiveAnimationProps) => {
  const [isVertical, setIsVertical] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * ScrollTrigger 설정 (solitario.studio 완전 복제)
   */
  const setupScrollTriggers = useCallback(
    (isVerticalMode: boolean) => {
      if (!isRefValid(cardsRef) || !isRefValid(wrapperRef)) {
        return;
      }

      const cardHolders = safeQuerySelectorAll<HTMLElement>('.card-holder');
      const totalCards = cardHolders.length;

      if (totalCards === 0) return;

      // 기존 ScrollTrigger 제거
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      if (isVerticalMode) {
        // 세로 모드: 수직 스택 배치
        cardHolders.forEach((holder, index) => {
          gsap.set(holder, {
            y: index > 0 ? index * CARD_VERTICAL_OFFSET : 0,
            rotation: 0,
            transformOrigin: '50% 50%',
          });
        });

        // 세로 모드에서는 컨테이너 회전 없음
        gsap.set(cardsRef.current, {
          rotation: 0,
        });
      } else {
        // 가로 모드: 모든 카드를 양수 각도로 배치 (레퍼런스 방식)
        // 컨테이너가 역회전하면서 순서대로 가운데로 가져옴

        // 1단계: 각 카드를 data-deg 속성에 따라 배치
        cardHolders.forEach((holder, index) => {
          // 모든 카드를 index * CARD_ROTATION_ANGLE 각도로 배치
          const degValue = index * CARD_ROTATION_ANGLE;

          // data-deg 속성 설정 (레퍼런스 방식)
          holder.setAttribute('data-deg', degValue.toString());

          // 카드 홀더 초기 회전 설정
          gsap.set(holder, {
            y: 0,
            rotation: degValue,
            transformOrigin: '50% 100%',
          });
        });

        // 2단계: 컨테이너 역방향 회전 애니메이션 (레퍼런스 방식)
        // fullRange = (totalCards - 1) * CARD_ROTATION_ANGLE
        // 6개 카드: (6 - 1) * 20 = 100°
        const fullRange = (totalCards - 1) * CARD_ROTATION_ANGLE;

        // GSAP 타임라인 생성 및 ScrollTrigger 연결
        const tl = gsap.timeline({
          paused: true,
        });

        tl.fromTo(
          cardsRef.current,
          {
            rotation: 0,
            xPercent: -50,
          },
          {
            xPercent: -50,
            rotation: -fullRange,
            duration: 1,
            ease: 'none',
          },
          0
        );

        ScrollTrigger.create({
          animation: tl,
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          scrub: true,
        });
      }
    },
    [projects, cardsRef, wrapperRef, setActiveProject, resetAllCards]
  );

  /**
   * 리사이즈 핸들러 (디바운스 적용)
   */
  const handleResize = useCallback(() => {
    // 기존 타임아웃 제거
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // 디바운스 적용
    resizeTimeoutRef.current = setTimeout(() => {
      const isVerticalNow = isVerticalMode();
      setIsVertical(isVerticalNow);

      // ScrollTrigger 재설정
      setupScrollTriggers(isVerticalNow);

      // ScrollTrigger 리프레시
      ScrollTrigger.refresh();
    }, RESIZE_DEBOUNCE_DELAY);
  }, [setupScrollTriggers]);

  /**
   * ResizeObserver 설정
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // GSAP ScrollTrigger 플러그인 등록
    gsap.registerPlugin(ScrollTrigger);

    // 초기 상태 설정
    const isVerticalNow = isVerticalMode();
    setIsVertical(isVerticalNow);

    // 초기 ScrollTrigger 설정
    setupScrollTriggers(isVerticalNow);

    // ResizeObserver 생성
    resizeObserverRef.current = new ResizeObserver(() => {
      handleResize();
    });

    // body 요소 관찰
    if (document.body) {
      resizeObserverRef.current.observe(document.body);
    }

    // window resize 이벤트도 추가 (폴백)
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setupScrollTriggers, handleResize]);

  return {
    isVertical,
  };
};
