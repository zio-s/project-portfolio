import type { Project } from '@/types/project';
import type Lenis from '@studio-freight/lenis';

/**
 * 애니메이션 방향 모드
 */
export type OrientationMode = 'horizontal' | 'vertical';

/**
 * 애니메이션 상태
 */
export type AnimationState = 'idle' | 'scrolling' | 'transitioning' | 'detail-open';

/**
 * 카드 애니메이션 설정
 */
export interface CardAnimationConfig {
  xOffset: number;
  yOffset: number;
  rotation1: number;
  rotation2: number;
  duration: number;
  ease: string;
}

/**
 * 스크롤 스냅 설정
 */
export interface ScrollSnapConfig {
  snapDuration: number;
  snapDelay: number;
  threshold: number;
  velocityThreshold: number;
}

/**
 * 반응형 브레이크포인트
 */
export interface ResponsiveBreakpoint {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  orientation?: 'portrait' | 'landscape';
}

/**
 * 애니메이션 컨텍스트 상태
 */
export interface AnimationContextState {
  // 현재 상태
  activeProjectId: string;
  animationState: AnimationState;
  orientationMode: OrientationMode;
  isVertical: boolean;

  // Lenis 인스턴스
  lenis: Lenis | null;

  // 액션
  setActiveProject: (id: string) => void;
  setAnimationState: (state: AnimationState) => void;
  openProjectDetail: (holder: HTMLElement) => void;
  closeProjectDetail: () => void;
}

/**
 * 프로젝트 애니메이션 훅 Props
 */
export interface UseProjectAnimationProps {
  projects: Project[];
  setActiveProject: (id: string) => void;
}

/**
 * 카드 애니메이션 훅 Props
 */
export interface UseCardAnimationProps {
  projects: Project[];
  isVertical: boolean;
  setActiveProject: (id: string) => void;
}

/**
 * 스크롤 스냅 훅 Props
 */
export interface UseScrollSnapProps {
  lenis: Lenis | null;
  animateActiveCard: (holder: HTMLElement) => void;
  resetAllCards: () => void;
}

/**
 * 스무스 스크롤 훅 Props
 */
export interface UseSmoothScrollProps {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
}

/**
 * 반응형 애니메이션 훅 Props
 */
export interface UseResponsiveAnimationProps {
  projects: Project[];
  cardsRef: React.RefObject<HTMLDivElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  setActiveProject: (id: string) => void;
  resetAllCards: () => void;
}

/**
 * DOM 요소 참조 타입
 */
export interface AnimationRefs {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  cardsRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 애니메이션 타임라인 옵션
 */
export interface TimelineOptions {
  defaults?: {
    duration?: number;
    ease?: string;
  };
}

/**
 * GSAP 애니메이션 변수
 */
export interface GSAPVars {
  xPercent?: number;
  yPercent?: number;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number | object;
  overwrite?: boolean | 'auto';
  onStart?: () => void;
  onComplete?: () => void;
  [key: string]: string | number | boolean | (() => void) | object | undefined;
}
