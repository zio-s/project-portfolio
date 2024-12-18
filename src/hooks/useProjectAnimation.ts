import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import type { Project } from '@/types/project';

interface UseProjectAnimationProps {
  projects: Project[];
  setActiveProject: (id: string) => void;
}

export const useProjectAnimation = ({ projects, setActiveProject }: UseProjectAnimationProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0));
  const activeAnimationRef = useRef<GSAPTimeline | null>(null);
  const isInitializedRef = useRef(false);
  const previousIndexRef = useRef<number>(-1);

  // 활성 카드 애니메이션
  const animateActiveCard = useCallback((holder: HTMLElement) => {
    if (!holder || isScrollingRef.current) return;

    // 이미 애니메이션이 진행 중이면 중단
    if (activeAnimationRef.current) {
      activeAnimationRef.current.kill();
    }

    const cards = holder.querySelectorAll('.card');
    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: 'power3.out' },
    });

    const direction = Math.random() > 0.5 ? 1 : -1;
    const xOffset = gsap.utils.random(20, 30);
    const yOffset = gsap.utils.random(8, 12);
    const rotation1 = gsap.utils.random(6, 18) * direction * -1;
    const rotation2 = gsap.utils.random(6, 18) * direction;

    tl.to(
      cards[0],
      {
        xPercent: xOffset * direction * -1,
        yPercent: yOffset * -1,
        rotation: rotation1,
        overwrite: true,
      },
      0
    ).to(
      cards[1],
      {
        xPercent: xOffset * direction,
        yPercent: yOffset,
        rotation: rotation2,
        overwrite: true,
      },
      0
    );

    activeAnimationRef.current = tl;
  }, []);
  // 모든 카드 접기
  const resetAllCards = useCallback(() => {
    const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');
    cardHolders.forEach((holder) => {
      const cards = holder.querySelectorAll('.card');
      gsap.to(cards, {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        duration: 0.4,
        overwrite: true,
      });
    });
  }, []);

  // 스크롤 스냅
  const snapToNearestCard = useCallback(() => {
    if (!lenisRef.current || isScrollingRef.current === false) return;

    const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const winCenterScroll = scrollPosition + windowHeight / 2;

    let targetHolder: HTMLElement | null = null;
    let minDistance = Infinity;

    cardHolders.forEach((holder) => {
      const rect = holder.getBoundingClientRect();
      const holderCenter = rect.top + rect.height / 2;
      const distance = Math.abs(winCenterScroll - (holderCenter + scrollPosition));

      if (distance < minDistance) {
        minDistance = distance;
        targetHolder = holder;
      }
    });

    if (targetHolder) {
      const targetIndex = cardHolders.indexOf(targetHolder);

      // 현재 인덱스와 같으면 스냅하지 않음
      if (targetIndex === previousIndexRef.current) {
        isScrollingRef.current = false;
        animateActiveCard(targetHolder);
        return;
      }

      const targetPosition = targetIndex * windowHeight;

      resetAllCards();

      lenisRef.current.scrollTo(targetPosition, {
        duration: 0.8,
        onComplete: () => {
          isScrollingRef.current = false;
          animateActiveCard(targetHolder!);
          previousIndexRef.current = targetIndex;
        },
      });
    }
  }, [animateActiveCard, resetAllCards]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    gsap.registerPlugin(ScrollTrigger);

    // Lenis 초기화
    lenisRef.current = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      isScrollingRef.current = true;
      resetAllCards();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        snapToNearestCard();
      }, 150);
    };

    // GSAP 애니메이션 설정
    if (cardsRef.current) {
      const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');
      const totalCards = cardHolders.length;

      // 초기 카드 위치 설정
      cardHolders.forEach((holder, index) => {
        gsap.set(holder, {
          rotation: index > 0 ? 20 * index : 0,
          transformOrigin: '50% 100%',
          zIndex: totalCards - index,
        });
      });

      // ScrollTrigger 설정
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * (totalCards - 1)}`,
        scrub: 1,
        onUpdate: (self) => {
          const currentIndex = Math.floor(self.progress * (totalCards - 1));
          if (currentIndex !== previousIndexRef.current) {
            setActiveProject(projects[Math.min(currentIndex, totalCards - 1)].id);
            previousIndexRef.current = currentIndex;
            // 스크롤 중일 때만 리셋
            if (isScrollingRef.current) {
              resetAllCards();
            }
          }
        },
      });

      // 전체 회전 애니메이션
      if (totalCards > 1) {
        gsap.to(cardsRef.current, {
          rotation: -((totalCards - 1) * 20),
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: `+=${window.innerHeight * (totalCards - 1)}`,
            scrub: 1,
          },
        });
      }
    }

    // Lenis 이벤트 및 RAF 설정
    lenisRef.current.on('scroll', handleScroll);

    const raf = (time: number) => {
      lenisRef.current?.raf(time * 1000);
      ScrollTrigger.update();
    };

    gsap.ticker.add(raf);

    requestAnimationFrame(() => {
      lenisRef.current?.start();
    });

    return () => {
      if (activeAnimationRef.current) {
        activeAnimationRef.current.kill();
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      lenisRef.current?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(raf);
    };
  }, [projects, setActiveProject, snapToNearestCard, resetAllCards]);

  return { wrapperRef, cardsRef };
};
