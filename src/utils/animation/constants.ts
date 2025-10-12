import type { CardAnimationConfig, ScrollSnapConfig } from './types';

/**
 * 애니메이션 지속 시간 상수
 */
export const ANIMATION_DURATION = {
  FAST: 0.3,
  NORMAL: 0.6,
  SLOW: 1.2,
  EXTRA_SLOW: 1.5,
} as const;

/**
 * 애니메이션 Easing 함수
 */
export const ANIMATION_EASE = {
  POWER3_OUT: 'power3.out',
  POWER2_OUT: 'power2.out',
  POWER2_IN: 'power2.in',
  EXPO_OUT: 'expo.out',
  NONE: 'none',
} as const;

/**
 * Lenis 스무스 스크롤 기본 설정 (solitario.studio 방식)
 */
export const LENIS_CONFIG = {
  duration: 1,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
} as const;

/**
 * 스크롤 스냅 기본 설정
 */
export const SCROLL_SNAP_CONFIG: ScrollSnapConfig = {
  snapDuration: 0.35, // 빠른 스냅 속도 (레퍼런스 방식)
  snapDelay: 0.7, // 레퍼런스와 동일하게 150ms
  threshold: 25,
  velocityThreshold: 0.25, // Desktop: 0.25 (레퍼런스와 정확히 동일)
} as const;

/**
 * 카드 애니메이션 오프셋 범위
 */
export const CARD_OFFSET_RANGE = {
  HORIZONTAL: {
    X_MIN: 25,
    X_MAX: 35,
    Y_MIN: 5,
    Y_MAX: 12,
  },
  VERTICAL: {
    X_MIN: 5,
    X_MAX: 10,
    Y_MIN: 10,
    Y_MAX: 20,
  },
} as const;

/**
 * 카드 회전 범위
 */
export const CARD_ROTATION_RANGE = {
  HORIZONTAL: {
    MIN: 6,
    MAX: 18,
  },
  VERTICAL: {
    MIN: 2,
    MAX: 8,
  },
} as const;

/**
 * 데스크톱 카드 애니메이션 기본 설정
 */
export const DESKTOP_CARD_CONFIG: Partial<CardAnimationConfig> = {
  duration: 0.6,
  ease: ANIMATION_EASE.POWER3_OUT,
} as const;

/**
 * 모바일 카드 애니메이션 기본 설정
 */
export const MOBILE_CARD_CONFIG: Partial<CardAnimationConfig> = {
  duration: 0.6,
  ease: ANIMATION_EASE.POWER3_OUT,
} as const;

/**
 * 카드 회전 기본 각도
 */
export const CARD_ROTATION_ANGLE = 20;

/**
 * 카드 세로 오프셋
 */
export const CARD_VERTICAL_OFFSET = 20;

/**
 * ScrollTrigger 기본 설정
 */
export const SCROLL_TRIGGER_CONFIG = {
  start: 'top top',
  scrub: 1,
} as const;

/**
 * 반응형 브레이크포인트
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1440,
} as const;

/**
 * Resize Debounce 딜레이
 */
export const RESIZE_DEBOUNCE_DELAY = 200;

/**
 * 초기화 딜레이
 */
export const INIT_DELAY = 1000;

/**
 * Z-Index 레이어
 */
export const Z_INDEX = {
  CARD_BASE: 20,
  CARD_OVERLAY: 21,
  CARDS_CONTAINER: 22,
  ACTIVE_CARD: 25,
} as const;

/**
 * 오버레이 오퍼시티
 */
export const OVERLAY_OPACITY = {
  HIDDEN: 0,
  VISIBLE: 1,
  DIM: 0.5,
} as const;

/**
 * 디테일 페이지 스케일
 */
export const DETAIL_SCALE = {
  NORMAL: 1,
  ZOOMED_OUT: 0.8,
  MOBILE: 0.7,
} as const;

/**
 * 타이틀 애니메이션 스태거
 */
export const TITLE_STAGGER = 0.05;

/**
 * CSS 클래스 이름
 */
export const CSS_CLASSES = {
  DETAILS: 'details',
  HOME: 'home',
  ACTIVE: 'active',
  CARD_HOLDER: 'card-holder',
  CARD: 'card',
  CARD_OVERLAY: 'card-overlay',
  TITLE: 'title',
  TITLE_IN: 'title_in',
  CLIENT: 'client',
  META: 'meta',
} as const;

/**
 * DOM 선택자
 */
export const SELECTORS = {
  CARDS_CONTAINER: '#cards',
  CARDS_IN: '#cards_in',
  TITLES_CONTAINER: '#titles',
  CARD_HOLDERS: '.card-holder',
  CARDS: '.card',
  CARD_OVERLAYS: '.card-overlay',
  TITLES: '.title',
  TITLE_IN: '.title_in',
  CLIENTS: '.client',
  META: '.meta',
  ACTIVE_HOLDER: '.card-holder.active',
  NON_ACTIVE_HOLDERS: '.card-holder:not(.active)',
} as const;
