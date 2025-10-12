import gsap from 'gsap';
import type { Project } from '@/types/project';
import type { OrientationMode, CardAnimationConfig, GSAPVars } from './types';
import {
  CARD_OFFSET_RANGE,
  CARD_ROTATION_RANGE,
  ANIMATION_DURATION,
  ANIMATION_EASE,
} from './constants';

/**
 * 현재 화면이 세로 모드인지 확인
 */
export const isVerticalMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < window.innerHeight;
};

/**
 * 화면 방향 모드 가져오기
 */
export const getOrientationMode = (): OrientationMode => {
  return isVerticalMode() ? 'vertical' : 'horizontal';
};

/**
 * 랜덤 방향 생성 (1 또는 -1)
 */
export const getRandomDirection = (): 1 | -1 => {
  return Math.random() > 0.5 ? 1 : -1;
};

/**
 * 카드 애니메이션 설정 생성 (가로/세로 모드에 따라)
 */
export const generateCardAnimationConfig = (
  isVertical: boolean,
  direction: 1 | -1
): CardAnimationConfig => {
  const range = isVertical ? CARD_OFFSET_RANGE.VERTICAL : CARD_OFFSET_RANGE.HORIZONTAL;
  const rotationRange = isVertical ? CARD_ROTATION_RANGE.VERTICAL : CARD_ROTATION_RANGE.HORIZONTAL;

  const xOffset = gsap.utils.random(range.X_MIN, range.X_MAX);
  const yOffset = gsap.utils.random(range.Y_MIN, range.Y_MAX);
  const rotation1 = gsap.utils.random(rotationRange.MIN, rotationRange.MAX) * direction * -1;
  const rotation2 = gsap.utils.random(rotationRange.MIN, rotationRange.MAX) * direction;

  return {
    xOffset,
    yOffset,
    rotation1,
    rotation2,
    duration: ANIMATION_DURATION.NORMAL,
    ease: ANIMATION_EASE.POWER3_OUT,
  };
};

/**
 * 세로 모드 카드 애니메이션 변수 생성
 */
export const getVerticalCardVars = (
  config: CardAnimationConfig,
  direction: 1 | -1,
  isFirst: boolean
): GSAPVars => {
  const multiplier = isFirst ? -1 : 1;

  return {
    yPercent: config.yOffset * multiplier,
    xPercent: config.xOffset * direction * (isFirst ? 1 : -1),
    rotation: isFirst ? config.rotation1 : config.rotation2,
    duration: config.duration,
    ease: config.ease,
    overwrite: true,
  };
};

/**
 * 가로 모드 카드 애니메이션 변수 생성
 */
export const getHorizontalCardVars = (
  config: CardAnimationConfig,
  direction: 1 | -1,
  isFirst: boolean
): GSAPVars => {
  const multiplier = isFirst ? -1 : 1;

  return {
    xPercent: config.xOffset * direction * multiplier,
    yPercent: config.yOffset * multiplier,
    rotation: isFirst ? config.rotation1 : config.rotation2,
    duration: config.duration,
    ease: config.ease,
    overwrite: true,
  };
};

/**
 * 프로젝트 색상 CSS 변수로 설정
 */
export const applyProjectColors = (project: Project | undefined): void => {
  if (!project?.colors) return;

  Object.entries(project.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
    document.body.setAttribute(`data-${key}`, value);
  });

  // 헤더 배경색 업데이트
  const header = document.querySelector('header') as HTMLElement;
  if (header && project.colors.color1) {
    header.style.backgroundColor = project.colors.color1;
  }
};

/**
 * 모든 GSAP 애니메이션 킬
 */
export const killAllAnimations = (selectors: string[]): void => {
  selectors.forEach((selector) => gsap.killTweensOf(selector));
};

/**
 * DOM 요소 존재 여부 확인
 */
export const elementExists = (element: Element | HTMLElement | null): element is HTMLElement => {
  return element !== null && element !== undefined;
};

/**
 * 안전한 DOM 쿼리
 */
export const safeQuerySelector = <T extends Element = HTMLElement>(
  selector: string,
  parent: Document | Element = document
): T | null => {
  try {
    return parent.querySelector<T>(selector);
  } catch (error) {
    console.error(`Failed to query selector: ${selector}`, error);
    return null;
  }
};

/**
 * 안전한 DOM 쿼리 (전체)
 */
export const safeQuerySelectorAll = <T extends Element = HTMLElement>(
  selector: string,
  parent: Document | Element = document
): T[] => {
  try {
    return Array.from(parent.querySelectorAll<T>(selector));
  } catch (error) {
    console.error(`Failed to query selector all: ${selector}`, error);
    return [];
  }
};

/**
 * 현재 스크롤 위치에서 가장 가까운 카드 인덱스 찾기
 */
export const findNearestCardIndex = (cardHolders: HTMLElement[]): number => {
  if (cardHolders.length === 0) return 0;

  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const winCenterScroll = scrollPosition + windowHeight / 2;

  const closest = cardHolders.reduce(
    (acc, holder, index) => {
      const rect = holder.getBoundingClientRect();
      const holderCenter = rect.top + rect.height / 2;
      const distance = Math.abs(winCenterScroll - (holderCenter + scrollPosition));

      return distance < acc.distance ? { index, distance } : acc;
    },
    { index: 0, distance: Infinity }
  );

  return closest.index;
};

/**
 * 뷰포트 중심 기반 가장 가까운 카드 찾기 (solitario.studio 방식)
 *
 * @description
 * 레퍼런스 사이트(solitario.studio)의 scrollToProject 로직을 구현.
 * 뷰포트 중심이 포함되거나 가장 가까운 섹션을 찾습니다.
 */
export const findNearestCardByViewportCenter = (cardHolders: HTMLElement[]): number => {
  if (cardHolders.length === 0) return 0;

  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const totalCards = cardHolders.length;

  // 뷰포트 중심 위치 계산
  const viewportCenter = scrollTop + windowHeight / 2;

  // 각 카드의 중심 위치와 뷰포트 중심 사이의 거리 계산
  let closestIndex = 0;
  let minDistance = Infinity;

  for (let i = 0; i < totalCards; i++) {
    // 각 카드의 스크롤 위치 (index * windowHeight)
    const cardScrollPosition = i * windowHeight;
    // 카드 중심 = 카드 스크롤 위치 + windowHeight / 2
    const cardCenter = cardScrollPosition + windowHeight / 2;
    // 뷰포트 중심과의 거리
    const distance = Math.abs(viewportCenter - cardCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
};

/**
 * 현재 활성 카드 정보 가져오기
 */
export const getCurrentCardInfo = (
  projects: Project[]
): { currentIndex: number; currentProject: Project } => {
  const activeCardHolder = safeQuerySelector<HTMLElement>('.card-holder.active');

  if (activeCardHolder) {
    const cardHolders = safeQuerySelectorAll<HTMLElement>('.card-holder');
    const activeIndex = cardHolders.indexOf(activeCardHolder);

    if (activeIndex >= 0) {
      return {
        currentIndex: activeIndex,
        currentProject: projects[activeIndex],
      };
    }
  }

  const currentScroll = window.scrollY;
  const windowHeight = window.innerHeight;
  const currentIndex = Math.round(currentScroll / windowHeight);

  return {
    currentIndex: Math.min(currentIndex, projects.length - 1),
    currentProject: projects[Math.min(currentIndex, projects.length - 1)],
  };
};

/**
 * Body 클래스 관리
 */
export const setBodyClass = (addClass: string, removeClass?: string): void => {
  if (removeClass) {
    document.body.classList.remove(removeClass);
  }
  document.body.classList.add(addClass);
};

/**
 * 오버플로우 설정
 */
export const setOverflow = (value: 'auto' | 'hidden'): void => {
  document.documentElement.style.overflow = value;
};

/**
 * 디바운스 함수 (타입 안전)
 */
export const debounce = <T extends (...args: never[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Ref가 유효한지 확인
 */
export const isRefValid = <T>(ref: React.RefObject<T>): ref is React.RefObject<T> & { current: T } => {
  return ref.current !== null && ref.current !== undefined;
};

/**
 * 계산된 스타일 값 가져오기
 */
export const getComputedValue = (element: HTMLElement, property: string): number => {
  const value = window.getComputedStyle(element).getPropertyValue(property);
  return parseFloat(value) || 0;
};

/**
 * 애니메이션 안전 실행 래퍼
 */
export const safeAnimate = (
  animation: () => void,
  errorMessage: string = 'Animation error'
): void => {
  try {
    animation();
  } catch (error) {
    console.error(errorMessage, error);
  }
};

/**
 * 화면 크기에 따른 카드 스케일 계산
 */
export const calculateCardScale = (isVertical: boolean, isDetail: boolean): number => {
  if (!isDetail) return 1;
  return isVertical ? 0.7 : 0.8;
};

/**
 * 화면 크기에 따른 컨테이너 변환값 계산
 */
export const calculateContainerTransform = (
  isVertical: boolean,
  isDetail: boolean
): { xPercent: number; yPercent?: number } => {
  if (!isDetail) {
    return isVertical ? { xPercent: 0 } : { xPercent: 25 };
  }

  return isVertical ? { xPercent: 0 } : { xPercent: 0 };
};

/**
 * 프로젝트 ID로 프로젝트 찾기
 */
export const findProjectById = (projects: Project[], id: string): Project | undefined => {
  return projects.find((p) => p.id === id);
};
