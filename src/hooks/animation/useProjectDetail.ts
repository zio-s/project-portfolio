import { useCallback } from 'react';
import gsap from 'gsap';
import type Lenis from '@studio-freight/lenis';
import type { Project } from '@/types/project';
import {
  applyProjectColors,
  findProjectById,
  safeQuerySelector,
  safeQuerySelectorAll,
  setBodyClass,
  setOverflow,
  getRandomDirection,
  generateCardAnimationConfig,
  killAllAnimations,
} from '@/utils/animation/helpers';
import {
  ANIMATION_DURATION,
  ANIMATION_EASE,
  CSS_CLASSES,
  SELECTORS,
  OVERLAY_OPACITY,
  DETAIL_SCALE,
} from '@/utils/animation/constants';

interface UseProjectDetailProps {
  projects: Project[];
  isVertical: boolean;
  lenis: Lenis | null;
  setActiveProject: (id: string) => void;
  animateActiveCard: (holder: HTMLElement) => void;
}

/**
 * 프로젝트 디테일 열기/닫기 훅
 *
 * @description
 * 프로젝트 카드 클릭 시 상세 페이지를 열고 닫는 애니메이션을 처리합니다.
 *
 * @example
 * const { openProjectDetail, closeProjectDetail } = useProjectDetail({
 *   projects,
 *   isVertical,
 *   lenis,
 *   setActiveProject,
 *   animateActiveCard
 * });
 */
export const useProjectDetail = ({
  projects,
  isVertical,
  lenis,
  setActiveProject,
  animateActiveCard,
}: UseProjectDetailProps) => {
  /**
   * 프로젝트 디테일 열기
   */
  const openProjectDetail = useCallback(
    (holder: HTMLElement) => {
      if (!holder || !lenis) return;
      if (document.body.classList.contains(CSS_CLASSES.DETAILS)) return;

      const projectId = holder.getAttribute('data-project-id') || holder.getAttribute('data-id');
      const currentProject = findProjectById(projects, projectId || '');

      // 프로젝트 색상 적용
      if (currentProject) {
        applyProjectColors(currentProject);
      }

      // 기존 애니메이션 킬
      killAllAnimations([SELECTORS.CARDS, SELECTORS.CARDS_CONTAINER, SELECTORS.TITLES_CONTAINER]);

      // Body 클래스 변경
      setBodyClass(CSS_CLASSES.DETAILS, CSS_CLASSES.HOME);
      setOverflow('hidden');

      // 모든 카드 홀더 비활성화
      const allCardHolders = safeQuerySelectorAll<HTMLElement>(SELECTORS.CARD_HOLDERS);
      allCardHolders.forEach((card) => card.classList.remove(CSS_CLASSES.ACTIVE));

      // 현재 카드 활성화
      if (projectId) {
        setActiveProject(projectId);
        holder.classList.add(CSS_CLASSES.ACTIVE);
      }

      const cards = holder.querySelectorAll<HTMLElement>(SELECTORS.CARDS);
      if (cards.length === 0) return;

      const cardsContainer = safeQuerySelector<HTMLElement>(SELECTORS.CARDS_CONTAINER);
      const cardsTitle = safeQuerySelector<HTMLElement>(SELECTORS.TITLES_CONTAINER);

      if (!cardsContainer || !cardsTitle) return;

      // 가로 모드 애니메이션
      if (!isVertical) {
        const currentContainerX = gsap.getProperty(cardsContainer, 'xPercent') as number || 25;
        const currentTitleX = gsap.getProperty(cardsTitle, 'xPercent') as number || 0;

        gsap.fromTo(
          cardsContainer,
          { xPercent: currentContainerX, scale: 1 },
          { xPercent: 0, duration: ANIMATION_DURATION.SLOW, scale: DETAIL_SCALE.ZOOMED_OUT, ease: ANIMATION_EASE.EXPO_OUT }
        );

        gsap.fromTo(
          cardsTitle,
          { xPercent: currentTitleX, scale: 1 },
          { xPercent: -25, duration: ANIMATION_DURATION.SLOW, scale: DETAIL_SCALE.ZOOMED_OUT, ease: ANIMATION_EASE.EXPO_OUT }
        );
      } else {
        // 세로 모드 애니메이션
        const huh = getRandomDirection();
        const huh2 = getRandomDirection();

        gsap.fromTo(
          cardsTitle,
          { y: 0, opacity: 1 },
          { opacity: 0, duration: ANIMATION_DURATION.SLOW, y: 35, ease: ANIMATION_EASE.EXPO_OUT }
        );

        // 첫 번째 카드 현재 상태
        const card0XPercent = gsap.getProperty(cards[0], 'xPercent') as number || 0;
        const card0YPercent = gsap.getProperty(cards[0], 'yPercent') as number || 0;
        const card0Rotation = gsap.getProperty(cards[0], 'rotation') as number || 0;
        const card0Scale = gsap.getProperty(cards[0], 'scale') as number || 1;
        const card0Opacity = gsap.getProperty(cards[0], 'opacity') as number || 1;

        // 두 번째 카드 현재 상태
        const card1XPercent = gsap.getProperty(cards[1], 'xPercent') as number || 0;
        const card1YPercent = gsap.getProperty(cards[1], 'yPercent') as number || 0;
        const card1Rotation = gsap.getProperty(cards[1], 'rotation') as number || 0;
        const card1Scale = gsap.getProperty(cards[1], 'scale') as number || 1;
        const card1Opacity = gsap.getProperty(cards[1], 'opacity') as number || 1;

        const card0Width = parseInt(getComputedStyle(cards[0]).width);
        const card0Height = parseInt(getComputedStyle(cards[0]).height);
        const card1Width = parseInt(getComputedStyle(cards[1]).width);
        const card1Height = parseInt(getComputedStyle(cards[1]).height);

        gsap.fromTo(
          cards[0],
          { xPercent: card0XPercent, yPercent: card0YPercent, rotation: card0Rotation, opacity: card0Opacity, scale: card0Scale },
          {
            xPercent: (window.innerWidth / card0Width) * 40 * huh * -1,
            yPercent: (window.innerHeight / card0Height) * 35 * huh2 * -1,
            rotation: gsap.utils.random(6, 18) * huh * -1,
            opacity: OVERLAY_OPACITY.DIM,
            duration: ANIMATION_DURATION.SLOW,
            scale: DETAIL_SCALE.MOBILE,
            ease: ANIMATION_EASE.EXPO_OUT,
          }
        );

        gsap.fromTo(
          cards[1],
          { xPercent: card1XPercent, yPercent: card1YPercent, rotation: card1Rotation, opacity: card1Opacity, scale: card1Scale },
          {
            xPercent: (window.innerWidth / card1Width) * 40 * huh,
            yPercent: (window.innerHeight / card1Height) * 35 * huh2,
            rotation: gsap.utils.random(6, 18) * huh,
            opacity: OVERLAY_OPACITY.DIM,
            duration: ANIMATION_DURATION.SLOW,
            scale: DETAIL_SCALE.MOBILE,
            ease: ANIMATION_EASE.EXPO_OUT,
          }
        );
      }

      // 나머지 카드들 페이드 아웃
      const otherCards = safeQuerySelectorAll<HTMLElement>(SELECTORS.NON_ACTIVE_HOLDERS);
      gsap.fromTo(
        otherCards,
        { opacity: 1 },
        { opacity: 0, duration: 0.1, ease: ANIMATION_EASE.POWER2_OUT }
      );
    },
    [projects, isVertical, lenis, setActiveProject]
  );

  /**
   * 프로젝트 디테일 닫기
   */
  const closeProjectDetail = useCallback(() => {
    if (!lenis) return;
    if (!document.body.classList.contains(CSS_CLASSES.DETAILS)) return;

    const activeHolder = safeQuerySelector<HTMLElement>(SELECTORS.ACTIVE_HOLDER);
    if (!activeHolder) return;

    // 기존 애니메이션 킬
    killAllAnimations([SELECTORS.CARDS, SELECTORS.CARDS_CONTAINER, SELECTORS.TITLES_CONTAINER]);

    lenis.start();
    setBodyClass(CSS_CLASSES.HOME, CSS_CLASSES.DETAILS);
    setOverflow('auto');
    setActiveProject('');

    const cardsContainer = safeQuerySelector<HTMLElement>(SELECTORS.CARDS_CONTAINER);
    const cardsTitle = safeQuerySelector<HTMLElement>(SELECTORS.TITLES_CONTAINER);
    const activeCards = activeHolder.querySelectorAll<HTMLElement>(SELECTORS.CARDS);

    if (!cardsContainer || !cardsTitle) return;

    if (!isVertical) {
      // 가로 모드: 원래 위치로
      gsap.to(cardsContainer, {
        xPercent: 25,
        duration: ANIMATION_DURATION.SLOW,
        scale: 1,
        ease: ANIMATION_EASE.EXPO_OUT,
      });
      gsap.to(cardsTitle, {
        xPercent: 0,
        duration: ANIMATION_DURATION.SLOW,
        scale: 1,
        ease: ANIMATION_EASE.EXPO_OUT,
      });
    } else {
      // 세로 모드: 활성화된 위치로 돌아가기
      const direction = getRandomDirection();
      const config = generateCardAnimationConfig(true, direction);

      gsap.fromTo(
        cardsTitle,
        { y: 35, opacity: 0 },
        { opacity: 1, duration: ANIMATION_DURATION.SLOW, y: 0, ease: ANIMATION_EASE.EXPO_OUT }
      );

      gsap.to(activeCards[0], {
        xPercent: config.xOffset * direction * -1,
        yPercent: config.yOffset * -1,
        rotation: config.rotation1,
        opacity: 1,
        duration: ANIMATION_DURATION.SLOW,
        scale: 1,
        ease: ANIMATION_EASE.EXPO_OUT,
        onComplete: () => {
          if (!document.body.classList.contains(CSS_CLASSES.DETAILS)) {
            animateActiveCard(activeHolder);
          }
        },
      });

      gsap.to(activeCards[1], {
        xPercent: config.xOffset * direction,
        yPercent: config.yOffset,
        rotation: config.rotation2,
        opacity: 1,
        duration: ANIMATION_DURATION.SLOW,
        scale: 1,
        ease: ANIMATION_EASE.EXPO_OUT,
      });
    }

    // 나머지 카드들 페이드 인
    const otherCards = safeQuerySelectorAll<HTMLElement>(SELECTORS.NON_ACTIVE_HOLDERS);
    gsap.to(otherCards, {
      opacity: 1,
      duration: 0.4,
      delay: 0.6,
      onComplete: () => {
        activeHolder.classList.remove(CSS_CLASSES.ACTIVE);
      },
    });
  }, [isVertical, lenis, setActiveProject, animateActiveCard]);

  return {
    openProjectDetail,
    closeProjectDetail,
  };
};
