'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function useMouseMove() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  // const isVertical = window.innerWidth < window.innerHeight;
  const [isVertical, setIsVertical] = useState(false);
  useEffect(() => {
    // 여기서 window 체크 및 상태 설정
    setIsVertical(window.innerWidth < window.innerHeight);

    const handleResize = () => {
      setIsVertical(window.innerWidth < window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // active 클래스 감지를 위한 observer 설정
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsActive(card.classList.contains('active'));
        }
      });
    });

    observer.observe(card, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // 마우스 이벤트 핸들러
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive || isVertical) return;

      const cards = card.querySelectorAll('.card');
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // 중앙으로부터의 거리 계산
      const distX = (clientX - centerX) * 0.02;
      const distY = (clientY - centerY) * 0.02;

      // 각 카드에 애니메이션 적용
      gsap.to(cards[0], {
        x: distX,
        y: distY,
        duration: 0.8,
        ease: 'power3',
      });

      gsap.to(cards[1], {
        x: -distX,
        y: -distY,
        duration: 0.8,
        ease: 'power3',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.set(card.querySelectorAll('.card'), {
        x: 0,
        y: 0,
      });
    };
  }, [isActive, isVertical]);

  return cardRef;
}
