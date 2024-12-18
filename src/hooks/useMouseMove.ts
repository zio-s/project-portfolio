'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useMouseMove() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // quickTo 함수 생성
    const xTo = gsap.quickTo(cardRef.current, 'x', {
      duration: 0.8,
      ease: 'power3',
    });

    const yTo = gsap.quickTo(cardRef.current, 'y', {
      duration: 0.8,
      ease: 'power3',
    });

    // 마우스 이벤트 핸들러
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      // 마우스 위치에 따라 카드 이동
      // 움직임을 작게 하기 위해 계수를 0.02로 설정
      xTo(clientX * 0.02);
      yTo(clientY * 0.02);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return cardRef;
}
