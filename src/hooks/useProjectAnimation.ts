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

  const openProjectDetail = useCallback(
    (holder: HTMLElement) => {
      if (!holder || !lenisRef.current) return;
      if (document.body.classList.contains('details')) return;

      gsap.killTweensOf('.card');
      gsap.killTweensOf('#cards');
      gsap.killTweensOf('#titles');

      lenisRef.current.stop();
      document.body.classList.add('details');
      document.body.classList.remove('home');
      document.documentElement.style.overflow = 'hidden';
      const allCardHolders = document.querySelectorAll('.card-holder');
      allCardHolders.forEach((card) => card.classList.remove('active'));

      const projectId = holder.getAttribute('data-project-id') || holder.getAttribute('data-id');
      if (projectId) {
        setActiveProject(projectId);
        holder.classList.add('active');
      }

      const cards = holder.querySelectorAll('.card');
      const cardsContainer = document.querySelector('#cards') as HTMLElement;
      const cardsTitle = document.querySelector('#titles') as HTMLElement;

      if (cardsContainer && window.innerWidth >= window.innerHeight) {
        const currentContainerX = gsap.getProperty(cardsContainer, 'xPercent') || 25;
        const currentTitleX = gsap.getProperty(cardsTitle, 'xPercent') || 0;

        gsap.fromTo(
          cardsContainer,
          {
            xPercent: currentContainerX,
            scale: 1,
          },
          {
            xPercent: 0,
            duration: 1.2,
            scale: 0.8,
            ease: 'expo.out',
          }
        );

        gsap.fromTo(
          cardsTitle,
          {
            xPercent: currentTitleX,
            scale: 1,
          },
          {
            xPercent: -25,
            duration: 1.2,
            scale: 0.8,
            ease: 'expo.out',
          }
        );
      } else {
        const huh = Math.random() > 0.5 ? 1 : -1;
        const huh2 = Math.random() > 0.5 ? 1 : -1;

        // 첫 번째 카드의 현재 상태
        const card0XPercent = gsap.getProperty(cards[0], 'xPercent') || 0;
        const card0YPercent = gsap.getProperty(cards[0], 'yPercent') || 0;
        const card0Rotation = gsap.getProperty(cards[0], 'rotation') || 0;
        const card0Scale = gsap.getProperty(cards[0], 'scale') || 1;
        const card0Opacity = gsap.getProperty(cards[0], 'opacity') || 1;

        // 두 번째 카드의 현재 상태
        const card1XPercent = gsap.getProperty(cards[1], 'xPercent') || 0;
        const card1YPercent = gsap.getProperty(cards[1], 'yPercent') || 0;
        const card1Rotation = gsap.getProperty(cards[1], 'rotation') || 0;
        const card1Scale = gsap.getProperty(cards[1], 'scale') || 1;
        const card1Opacity = gsap.getProperty(cards[1], 'opacity') || 1;

        gsap.fromTo(
          cards[0],
          {
            xPercent: card0XPercent,
            yPercent: card0YPercent,
            rotation: card0Rotation,
            opacity: card0Opacity,
            scale: card0Scale,
          },
          {
            xPercent: (window.innerWidth / parseInt(getComputedStyle(cards[0]).width)) * 40 * huh * -1,
            yPercent: (window.innerHeight / parseInt(getComputedStyle(cards[0]).height)) * 35 * huh2 * -1,
            rotation: gsap.utils.random(6, 18) * huh * -1,
            opacity: 0.5,
            duration: 1.2,
            scale: 0.7,
            ease: 'expo.out',
          }
        );

        gsap.fromTo(
          cards[1],
          {
            xPercent: card1XPercent,
            yPercent: card1YPercent,
            rotation: card1Rotation,
            opacity: card1Opacity,
            scale: card1Scale,
          },
          {
            xPercent: (window.innerWidth / parseInt(getComputedStyle(cards[1]).width)) * 40 * huh,
            yPercent: (window.innerHeight / parseInt(getComputedStyle(cards[1]).height)) * 35 * huh2,
            rotation: gsap.utils.random(6, 18) * huh,
            opacity: 0.5,
            duration: 1.2,
            scale: 0.7,
            ease: 'expo.out',
          }
        );
      }

      // 나머지 카드들 페이드 아웃
      const otherCards = gsap.utils.toArray<HTMLElement>('.card-holder:not(.active)');
      gsap.fromTo(
        otherCards,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.1,
          ease: 'power2.out',
        }
      );
    },
    [lenisRef, setActiveProject]
  );

  const closeProjectDetail = useCallback(() => {
    if (!lenisRef.current) return;

    // details 클래스가 없다면 리턴
    if (!document.body.classList.contains('details')) return;

    const activeHolder = document.querySelector('.card-holder.active') as HTMLElement;
    if (!activeHolder) return;

    // 현재 활성화된 모든 애니메이션 중지
    gsap.killTweensOf('.card');
    gsap.killTweensOf('#cards');
    gsap.killTweensOf('#titles');

    lenisRef.current.start();
    document.body.classList.remove('details');
    document.body.classList.add('home');
    document.documentElement.style.overflow = 'auto';
    setActiveProject('');

    const cardsContainer = document.querySelector('#cards') as HTMLElement;
    const cardsTitle = document.querySelector('#titles') as HTMLElement;
    const activeCards = activeHolder.querySelectorAll('.card');

    if (cardsContainer && window.innerWidth >= window.innerHeight) {
      gsap.to(cardsContainer, {
        xPercent: 25,
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
    } else {
      // 모바일에서 원래의 활성화된 위치로 돌아가기
      const direction = Math.random() > 0.5 ? 1 : -1;
      const xOffset = gsap.utils.random(25, 35);
      const yOffset = gsap.utils.random(5, 12);
      const rotation1 = gsap.utils.random(6, 18) * direction * -1;
      const rotation2 = gsap.utils.random(6, 18) * direction;

      gsap.to(activeCards[0], {
        xPercent: xOffset * direction * -1,
        yPercent: yOffset * -1,
        rotation: rotation1,
        opacity: 1,
        duration: 1.2,
        scale: 1,
        ease: 'expo.out',
        onComplete: () => {
          // 애니메이션 완료 후 활성화된 카드 애니메이션 재시작
          if (!document.body.classList.contains('details')) {
            animateActiveCard(activeHolder);
          }
        },
      });

      gsap.to(activeCards[1], {
        xPercent: xOffset * direction,
        yPercent: yOffset,
        rotation: rotation2,
        opacity: 1,
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
      onComplete: () => {
        activeHolder.classList.remove('active');
      },
    });
  }, [lenisRef, setActiveProject, animateActiveCard]);

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
    // 초기 상태 설정 - 첫 번째 카드와 타이틀 활성화

    // URL에서 현재 활성화된 카드의 인덱스 찾기
    const getCurrentCardIndex = () => {
      const hash = window.location.hash.replace('#', '');
      const currentIndex = projects.findIndex((project) => project.id === hash);
      return currentIndex >= 0 ? currentIndex : 0; // hash가 없으면 첫 번째 카드
    };

    const currentIndex = getCurrentCardIndex();

    // 현재 인덱스에 해당하는 카드와 타이틀 찾기
    const cardHolders = document.querySelectorAll('.card-holder');
    const titles = document.querySelectorAll('.title');
    const currentCard = cardHolders[currentIndex] as HTMLElement;
    const currentTitle = titles[currentIndex] as HTMLElement;

    if (currentCard && currentTitle) {
      // 현재 위치로 스크롤
      setTimeout(() => {
        window.scrollTo({
          top: currentIndex * window.innerHeight,
          behavior: 'auto',
        });

        // 현재 카드와 타이틀 활성화
        currentCard.classList.add('active');
        currentTitle.classList.add('active');

        // 현재 카드 애니메이션
        const direction = Math.random() > 0.5 ? 1 : -1;
        const cards = currentCard.querySelectorAll('.card');
        gsap.to(cards[0], {
          xPercent: gsap.utils.random(25, 35) * direction * -1,
          yPercent: gsap.utils.random(5, 12) * -1,
          rotation: gsap.utils.random(6, 18) * direction * -1,
          duration: 0.6,
          ease: 'power3.out',
        });
        gsap.to(cards[1], {
          xPercent: gsap.utils.random(25, 35) * direction,
          yPercent: gsap.utils.random(5, 12),
          rotation: gsap.utils.random(6, 18) * direction,
          duration: 0.6,
          ease: 'power3.out',
        });

        // 현재 타이틀 애니메이션
        const titleIn = currentTitle.querySelector('.title_in');
        const clients = currentTitle.querySelectorAll('.client');
        const meta = currentTitle.querySelector('.meta');

        if (titleIn) {
          gsap.fromTo(
            titleIn,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
          );
        }

        if (clients.length) {
          gsap.fromTo(
            clients,
            { yPercent: -100, opacity: 0 },
            { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
          );
        }

        if (meta) {
          gsap.fromTo(
            meta,
            { yPercent: 50, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
          );
        }

        // 활성 프로젝트 상태 업데이트
        setActiveProject(projects[currentIndex].id);
        previousIndexRef.current = currentIndex;
      }, 100);
    }
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

      // 모든 타이틀 숨기기
      const titles = gsap.utils.toArray<HTMLElement>('.title');
      titles.forEach((title) => {
        if (title.classList.contains('active')) {
          gsap.to(title.querySelectorAll('.title_in, .client, .meta'), {
            yPercent: 100,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              title.classList.remove('active');
            },
          });
        }
      });

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
