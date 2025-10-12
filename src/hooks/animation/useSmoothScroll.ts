import { useRef, useEffect, useCallback, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { UseSmoothScrollProps } from '@/utils/animation/types';
import { LENIS_CONFIG } from '@/utils/animation/constants';

/**
 * Lenis 스무스 스크롤 훅
 *
 * @description
 * Lenis 라이브러리를 활용한 스무스 스크롤 기능을 제공합니다.
 * GSAP의 ticker와 통합되어 애니메이션과 동기화됩니다.
 *
 * @example
 * const { lenis, start, stop } = useSmoothScroll();
 *
 * // 스크롤 제어
 * lenis?.scrollTo(0);
 * start();
 * stop();
 */
export const useSmoothScroll = (props?: UseSmoothScrollProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  /**
   * Lenis 시작
   */
  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  /**
   * Lenis 정지
   */
  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  /**
   * 특정 위치로 스크롤
   */
  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: {
        offset?: number;
        immediate?: boolean;
        duration?: number;
        onComplete?: () => void;
      }
    ) => {
      if (!lenisRef.current) return;

      lenisRef.current.scrollTo(target, {
        offset: options?.offset,
        immediate: options?.immediate,
        duration: options?.duration,
        onComplete: options?.onComplete,
      });
    },
    []
  );

  /**
   * Lenis 리사이즈
   */
  const resize = useCallback(() => {
    lenisRef.current?.resize();
  }, []);

  /**
   * Lenis 초기화
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('🚀 Initializing Lenis');

    // 기존 인스턴스 제거
    if (lenisRef.current) {
      console.log('🔄 Destroying existing Lenis instance');
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    // GSAP ScrollTrigger 플러그인 등록
    gsap.registerPlugin(ScrollTrigger);

    // Config 생성 (solitario.studio 방식: smoothWheel: true 사용)
    const config = {
      duration: props?.duration ?? LENIS_CONFIG.duration,
      easing: props?.easing ?? LENIS_CONFIG.easing,
      smoothWheel: props?.smoothWheel ?? LENIS_CONFIG.smoothWheel,
      wheelMultiplier: props?.wheelMultiplier ?? LENIS_CONFIG.wheelMultiplier,
    };

    console.log('⚙️ Lenis config:', config);

    // Lenis 인스턴스 생성
    const lenisInstance = new Lenis(config);
    lenisRef.current = lenisInstance;
    setLenis(lenisInstance); // 상태 업데이트로 다른 훅에 전파

    console.log('✅ Lenis instance created:', lenisInstance);

    // RAF (RequestAnimationFrame) 설정
    const raf = (time: number) => {
      lenisRef.current?.raf(time * 1000);
      ScrollTrigger.update();
    };

    gsap.ticker.add(raf);

    // 초기 시작
    requestAnimationFrame(() => {
      lenisRef.current?.start();
      console.log('▶️ Lenis started');
    });

    // Cleanup
    return () => {
      console.log('🛑 Cleaning up Lenis');
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        setLenis(null);
      }
      gsap.ticker.remove(raf);
    };
  }, [props?.duration, props?.easing, props?.smoothWheel, props?.wheelMultiplier]);

  return {
    lenis, // state 값 반환 (ref 대신)
    start,
    stop,
    scrollTo,
    resize,
  };
};
