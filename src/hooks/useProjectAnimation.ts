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

  const animateActiveCard = useCallback(
    (holder: HTMLElement) => {
      if (!holder || isScrollingRef.current) return;

      if (activeAnimationRef.current) {
        activeAnimationRef.current.kill();
      }

      const cards = holder.querySelectorAll('.card');
      const overlays = holder.querySelectorAll('.card-overlay');
      const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');
      const currentIndex = cardHolders.indexOf(holder);
      const targetProject = projects[currentIndex];
      const isVerticalMode = window.innerWidth < window.innerHeight;

      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: 'power3.out' },
      });

      const direction = Math.random() > 0.5 ? 1 : -1;

      // Show overlay
      tl.to(
        overlays,
        {
          opacity: 1,
          duration: 0.3,
        },
        0
      );

      if (isVerticalMode) {
        // Vertical mode animation (mobile)
        const yOffset = gsap.utils.random(10, 20);
        const xOffset = gsap.utils.random(5, 10);
        const rotation1 = gsap.utils.random(2, 8) * direction * -1;
        const rotation2 = gsap.utils.random(2, 8) * direction;

        tl.to(
          cards[0],
          {
            yPercent: yOffset * -1,
            xPercent: xOffset * direction,
            rotation: rotation1,
            overwrite: true,
          },
          0
        ).to(
          cards[1],
          {
            yPercent: yOffset,
            xPercent: xOffset * direction * -1,
            rotation: rotation2,
            overwrite: true,
          },
          0
        );
      } else {
        // Horizontal mode animation (desktop) - original
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
      }

      // Update colors
      tl.to(
        [document.documentElement, document.querySelector('header')],
        {
          duration: 0.01,
          ease: 'power3.out',
          onStart: () => {
            if (targetProject?.colors) {
              Object.entries(targetProject.colors).forEach(([key, value]) => {
                document.body.setAttribute(`data-${key}`, value);
              });
              // Update header background color
              const header = document.querySelector('header');
              if (header && targetProject.colors.color1) {
                header.style.backgroundColor = targetProject.colors.color1;
              }
            }
          },
          ...Object.entries(targetProject?.colors || {}).reduce((acc, [key, value]) => {
            acc[`--${key}`] = value;
            return acc;
          }, {} as Record<string, string>),
        },
        0
      );

      activeAnimationRef.current = tl;
    },
    [projects]
  );

  const openProjectDetail = useCallback(
    (holder: HTMLElement) => {
      if (!holder || !lenisRef.current) return;
      if (document.body.classList.contains('details')) return;
      const projectId = holder.getAttribute('data-project-id') || holder.getAttribute('data-id');

      const currentProject = projects.find((p) => p.id === projectId);
      if (currentProject?.colors) {
        Object.entries(currentProject.colors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key}`, value);
          document.body.setAttribute(`data-${key}`, value);
        });
      }
      gsap.killTweensOf('.card');
      gsap.killTweensOf('#cards');
      gsap.killTweensOf('#titles');

      document.body.classList.add('details');
      document.body.classList.remove('home');
      document.documentElement.style.overflow = 'hidden';
      const allCardHolders = document.querySelectorAll('.card-holder');
      allCardHolders.forEach((card) => card.classList.remove('active'));

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
        gsap.fromTo(
          cardsTitle,
          {
            y: 0,
            opacity: 1,
          },
          {
            opacity: 0,
            duration: 1.2,
            y: 35,
            ease: 'expo.out',
          }
        );
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
    [lenisRef, setActiveProject, projects]
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
      gsap.fromTo(
        cardsTitle,
        {
          y: 35,
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1.2,
          y: 0,
          ease: 'expo.out',
        }
      );
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

  const resetAllCards = useCallback(() => {
    const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');
    cardHolders.forEach((holder) => {
      const cards = holder.querySelectorAll('.card');
      const overlays = holder.querySelectorAll('.card-overlay');
      gsap.to(cards, {
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        duration: 0.4,
        overwrite: true,
      });
      gsap.to(overlays, {
        opacity: 0,
        duration: 0.3,
      });
    });
  }, []);

  const snapToNearestCard = useCallback(() => {
    if (!lenisRef.current || isScrollingRef.current === false) return;

    // HTMLElement 타입을 가진 배열로 명시적 타입 지정
    const titleHolders = gsap.utils.toArray<HTMLElement>('.title');
    const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');

    if (!titleHolders.length || !cardHolders.length) return; // 요소가 없는 경우 early return

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const winCenterScroll = scrollPosition + windowHeight / 2;

    interface HolderDistance {
      holder: HTMLElement;
      distance: number;
    }

    // 가장 가까운 홀더 찾기를 reduce로 변경하여 더 명확하게 처리
    const closest = cardHolders.reduce<HolderDistance>(
      (acc, holder) => {
        const rect = holder.getBoundingClientRect();
        const holderCenter = rect.top + rect.height / 2;
        const distance = Math.abs(winCenterScroll - (holderCenter + scrollPosition));

        return distance < acc.distance ? { holder, distance } : acc;
      },
      { holder: cardHolders[0], distance: Infinity }
    );

    const targetHolder = closest.holder;
    const targetIndex = cardHolders.indexOf(targetHolder);
    const targetId = targetHolder.dataset.id;

    if (targetId === undefined) return; // dataset.id가 없는 경우 early return

    const targetPosition = targetIndex * windowHeight;

    resetAllCards();

    // 모든 요소의 active 클래스 제거
    cardHolders.forEach((holder) => holder.classList.remove('active'));
    titleHolders.forEach((title) => title.classList.remove('active'));

    // 스크롤 애니메이션
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetPosition, {
        duration: 0.25,
        onComplete: () => {
          isScrollingRef.current = false;

          // 타겟 홀더 active 처리
          targetHolder.classList.add('active');

          // 타겟 타이틀 찾기
          const targetTitle = titleHolders.find((title) => title.dataset.id === targetId);

          if (targetTitle) {
            const titleIn = targetTitle.querySelector<HTMLElement>('.title_in');
            const clientElements = targetTitle.querySelectorAll<HTMLElement>('.client');
            const metaElement = targetTitle.querySelector<HTMLElement>('.meta');

            if (!titleIn || !metaElement || clientElements.length === 0) return;

            targetTitle.classList.add('active');

            const tl = gsap.timeline();

            // 타이틀 애니메이션
            tl.fromTo(
              titleIn,
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
                clientElements,
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
                metaElement,
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

          animateActiveCard(targetHolder);
          previousIndexRef.current = targetIndex;
        },
      });
    }
  }, [animateActiveCard, resetAllCards]);

  const initializeAnimation = useCallback(() => {
    if (typeof window === 'undefined') return () => {};
    gsap.registerPlugin(ScrollTrigger);

    // ScrollTrigger 및 Lenis 정리
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Lenis 초기화
    lenisRef.current = new Lenis({
      duration: 0.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // RAF 설정
    const raf = (time: number) => {
      lenisRef.current?.raf(time * 1000);
      ScrollTrigger.update();
    };

    gsap.ticker.add(raf);

    return () => {
      if (activeAnimationRef.current) {
        activeAnimationRef.current.kill();
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(raf);
    };
  }, []);

  useEffect(() => {
    const cleanup = initializeAnimation();
    return () => cleanup();
  }, [initializeAnimation, projects]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    gsap.registerPlugin(ScrollTrigger);

    // Get current card info
    const getCurrentCardInfo = () => {
      const activeCardHolder = document.querySelector('.card-holder.active') as HTMLElement;

      if (activeCardHolder) {
        const cardHolders = Array.from(document.querySelectorAll('.card-holder'));
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

    const { currentIndex, currentProject } = getCurrentCardInfo();

    if (currentProject?.colors) {
      Object.entries(currentProject.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
        document.body.setAttribute(`data-${key}`, value);
      });
    }

    // Find current card and title
    const cardHolders = document.querySelectorAll('.card-holder');
    const titles = document.querySelectorAll('.title');

    const currentCard = cardHolders[currentIndex] as HTMLElement;
    const currentTitle = titles[currentIndex] as HTMLElement;

    if (currentCard && currentTitle) {
      currentCard.setAttribute('data-project-id', currentProject.id);

      setTimeout(() => {
        window.scrollTo({
          top: currentIndex * window.innerHeight,
          behavior: 'auto',
        });

        // Activate current card and title
        currentCard.classList.add('active');
        currentTitle.classList.add('active');

        // Check if we're in vertical mode (mobile)
        const isVerticalMode = window.innerWidth < window.innerHeight;

        // Animate cards differently based on orientation
        const direction = Math.random() > 0.5 ? 1 : -1;
        const cards = currentCard.querySelectorAll('.card');

        if (isVerticalMode) {
          // For vertical (mobile) - slide cards vertically instead of rotating
          gsap.to(cards[0], {
            yPercent: gsap.utils.random(10, 20) * -1,
            xPercent: gsap.utils.random(5, 10) * direction,
            rotation: gsap.utils.random(2, 8) * direction * -1, // Less rotation
            duration: 0.6,
            ease: 'power3.out',
          });
          gsap.to(cards[1], {
            yPercent: gsap.utils.random(10, 20),
            xPercent: gsap.utils.random(5, 10) * direction * -1,
            rotation: gsap.utils.random(2, 8) * direction, // Less rotation
            duration: 0.6,
            ease: 'power3.out',
          });
        } else {
          // For horizontal - original animation
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
        }

        // Animate title elements
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

        // Update active project
        setActiveProject(currentProject.id);
        previousIndexRef.current = currentIndex;
      }, 1000);
    }

    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 0.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // Scroll event handler
    const handleScroll = () => {
      isScrollingRef.current = true;
      resetAllCards();

      // Hide all titles
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

    // Configure GSAP animations
    if (cardsRef.current) {
      const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');
      const totalCards = cardHolders.length;
      const isVerticalMode = window.innerWidth < window.innerHeight;

      // Set initial card positions based on orientation
      cardHolders.forEach((holder, index) => {
        if (isVerticalMode) {
          // Vertical arrangement for mobile
          gsap.set(holder, {
            y: index > 0 ? index * 20 : 0, // Vertical offset instead of rotation
            rotation: 0, // No rotation in vertical mode
            transformOrigin: '50% 50%',
            zIndex: totalCards - index,
          });
        } else {
          // Original horizontal rotation for desktop
          gsap.set(holder, {
            rotation: index > 0 ? 20 * index : 0,
            transformOrigin: '50% 100%',
            zIndex: totalCards - index,
          });
        }
      });

      // Create ScrollTrigger
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
            // Reset cards only while scrolling
            if (isScrollingRef.current) {
              resetAllCards();
            }
          }
        },
      });

      // Animation for entire container
      if (totalCards > 1) {
        if (isVerticalMode) {
          // Vertical animation for mobile
          gsap.to(cardsRef.current, {
            y: -((totalCards - 1) * 20), // Vertical movement
            rotation: 0, // No rotation
            ease: 'none',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: `+=${window.innerHeight * (totalCards - 1)}`,
              scrub: 1,
            },
          });
        } else {
          // Original rotation animation for desktop
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
    }

    // Set up Lenis events and RAF
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
      const isVerticalMode = window.innerWidth < window.innerHeight;
      setIsVertical(isVerticalMode);

      if (cardsRef.current) {
        const cardHolders = gsap.utils.toArray<HTMLElement>('.card-holder');
        const totalCards = cardHolders.length;

        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        cardHolders.forEach((holder, index) => {
          if (isVerticalMode) {
            gsap.set(holder, {
              y: index > 0 ? index * window.innerHeight : 0,
              rotation: 0,
              transformOrigin: '50% 50%',
              zIndex: totalCards - index,
            });
          } else {
            gsap.set(holder, {
              y: 0,
              rotation: index > 0 ? 20 * index : 0,
              transformOrigin: '50% 100%',
              zIndex: totalCards - index,
            });
          }
        });

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

        if (totalCards > 1) {
          if (isVerticalMode) {
            gsap.to(cardsRef.current, {
              y: -((totalCards - 1) * window.innerHeight),
              rotation: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: wrapperRef.current,
                start: 'top top',
                end: `+=${window.innerHeight * (totalCards - 1)}`,
                scrub: 1,
              },
            });
          } else {
            gsap.to(cardsRef.current, {
              rotation: -((totalCards - 1) * 20),
              y: 0,
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
      }

      if (lenisRef.current) {
        lenisRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [projects, setActiveProject, resetAllCards]);

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
  return { wrapperRef, cardsRef, isVertical, openProjectDetail, closeProjectDetail, lenis: lenisRef.current };
};
