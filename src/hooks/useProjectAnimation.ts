import { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import type { Project } from '@/types/project';
import { debounce } from 'lodash';

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
  const [isVertical, setIsVertical] = useState(false);
  // useProjectAnimation 훅에 추가할 디테일 페이지 관련 로직

  const openProjectDetail = useCallback((holder: HTMLElement) => {
    if (!holder || !lenisRef.current) return;

    lenisRef.current.stop();
    document.body.classList.add('details');
    document.body.classList.remove('home');

    // 카드 컨테이너 애니메이션 추가
    const cardsContainer = document.querySelector('#cards') as HTMLElement;
    const cardsTitle = document.querySelector('#titles') as HTMLElement;
    if (cardsContainer && window.innerWidth >= window.innerHeight) {
      gsap.to(cardsContainer, {
        xPercent: -75, // translate(-50% - 25vw)의 효과를 위해 추가 -25% 적용
        duration: 1.2,
        scale: 0.8,
        ease: 'expo.out',
      });
      gsap.to(cardsTitle, {
        xPercent: -25,
        duration: 1.2,
        scale: 0.8,
        ease: 'expo.out',
      });
    }
    // 나머지 카드들 페이드 아웃
    const otherCards = gsap.utils.toArray<HTMLElement>('.card-holder:not(.active)');
    gsap.to(otherCards, {
      opacity: 0,
      duration: 0.4,
    });
  }, []);

  const closeProjectDetail = useCallback(() => {
    if (!lenisRef.current) return;

    lenisRef.current.start();
    document.body.classList.remove('details');

    const cardsContainer = document.querySelector('#cards') as HTMLElement;
    const cardsTitle = document.querySelector('#titles') as HTMLElement;
    if (cardsContainer) {
      gsap.to(cardsContainer, {
        xPercent: -50,
        duration: 1.2,
        scale: 1,
        ease: 'expo.out',
      });
      gsap.to(cardsTitle, {
        xPercent: 0,
        duration: 1.2,
        scale: 1,
        ease: 'expo.out',
      });
    }

    // 나머지 카드들 페이드 인
    const otherCards = gsap.utils.toArray<HTMLElement>('.card-holder:not(.active)');
    gsap.to(otherCards, {
      opacity: 1,
      duration: 0.4,
      delay: 0.6,
    });
  }, []);
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
    const xOffset = gsap.utils.random(25, 35);
    const yOffset = gsap.utils.random(5, 12);
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
    const titleHolders = gsap.utils.toArray<HTMLElement>('.title');
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
      const targetId = targetHolder.dataset.id;
      const targetPosition = targetIndex * windowHeight;

      resetAllCards();

      // 모든 카드에서 active 클래스 제거
      cardHolders.forEach((holder) => {
        holder.classList.remove('active');
      });
      titleHolders.forEach((title) => {
        title.classList.remove('active');
      });

      lenisRef.current.scrollTo(targetPosition, {
        duration: 0.1,
        onComplete: () => {
          isScrollingRef.current = false;
          // 타겟 카드에 active 클래스 추가
          targetHolder?.classList.add('active');
          const targetTitle = titleHolders.find((title) => title.dataset.id === targetId);
          if (targetTitle) {
            // 타이틀 애니메이션을 위한 GSAP 타임라인
            const tl = gsap.timeline();
            targetTitle.classList.add('active');

            // 타이틀 애니메이션
            tl.fromTo(
              targetTitle.querySelector('.title_in'),
              {
                yPercent: 100,
                opacity: 0,
              },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.4,
                ease: 'power3.out',
              }
            )
              .fromTo(
                targetTitle.querySelectorAll('.client'),
                {
                  yPercent: -100,
                  opacity: 0,
                },
                {
                  opacity: 1,
                  yPercent: 0,
                  duration: 0.6,
                  stagger: 0.05,
                  ease: 'power3.out',
                },
                '-=0.4'
              )
              .fromTo(
                targetTitle.querySelector('.meta'),
                {
                  yPercent: 50,
                  opacity: 0,
                },
                {
                  yPercent: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: 'power3.out',
                },
                '-=0.4'
              );
          }

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
      // infinite: true,
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
  useEffect(() => {
    const handleResize = () => {
      // 방향 체크
      setIsVertical(window.innerWidth < window.innerHeight);

      if (cardsRef.current) {
        const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');
        const totalCards = cardHolders.length;

        // ScrollTrigger 업데이트
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        // 카드 위치 재설정
        cardHolders.forEach((holder, index) => {
          gsap.set(holder, {
            rotation: index > 0 ? 20 * index : 0,
            transformOrigin: '50% 100%',
            zIndex: totalCards - index,
          });
        });

        // ScrollTrigger 재생성
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
              if (isScrollingRef.current) {
                resetAllCards();
              }
            }
          },
        });

        // 전체 회전 애니메이션 재설정
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

      // Lenis 업데이트
      if (lenisRef.current) {
        lenisRef.current.resize();
      }
    };

    // 리사이즈 이벤트 추가
    window.addEventListener('resize', handleResize);

    // 초기 실행
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [projects, setActiveProject, resetAllCards]);

  // 디바운스된 리사이즈 핸들러도 추가
  const debouncedResize = useCallback(
    debounce(() => {
      if (lenisRef.current) {
        lenisRef.current.resize();
      }
      ScrollTrigger.refresh();
    }, 200),
    []
  );

  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [debouncedResize]);
  return { wrapperRef, cardsRef, isVertical, openProjectDetail, closeProjectDetail };
};
