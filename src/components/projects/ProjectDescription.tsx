import { ProjectDescriptionProps } from '@/types/project';
import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Badge, CalendarIcon, ExternalLink, ExternalLinkIcon, FileTextIcon, GithubIcon, MoveLeft } from 'lucide-react';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export const ProjectDescription = memo(({ project, isActive, closeProjectDetail }: ProjectDescriptionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // 스크롤 트리거 클린업
  const cleanupScrollTriggers = () => {
    scrollTriggersRef.current.forEach((trigger) => trigger.kill());
    scrollTriggersRef.current = [];
  };
  cleanupScrollTriggers();
  // 초기 애니메이션 설정
  useEffect(() => {
    if (!contentRef.current || !isFirstRender.current) return;

    const container = contentRef.current;
    gsap.set(container, {
      opacity: 1,
      x: window.innerWidth >= window.innerHeight ? '100%' : 0,
      y: window.innerWidth >= window.innerHeight ? 0 : '100%',
    });

    isFirstRender.current = false;
  }, []);

  // 메인 애니메이션 효과
  useEffect(() => {
    if (!contentRef.current || !containerRef.current) return;

    const container = contentRef.current;
    const scrollContainer = containerRef.current;

    // 이전 스크롤 트리거 정리
    cleanupScrollTriggers();

    if (isActive) {
      scrollContainer.style.pointerEvents = 'auto';
      scrollContainer.style.overflowY = 'auto';

      // 기존 애니메이션 코드 유지
      const tl = gsap.timeline();
      tl.to(container, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'expo.out',
      });

      // 타이틀 애니메이션
      const titleWords = container.querySelectorAll('.ttl .word span');
      tl.from(
        titleWords,
        {
          y: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'expo.out',
        },
        '-=0.3'
      );

      // 설명 텍스트 애니메이션
      const descWords = container.querySelectorAll('.description_in .word span');
      tl.from(
        descWords,
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'expo.out',
        },
        '-=0.4'
      );

      // 링크 버튼 애니메이션
      const links = container.querySelector('.links');
      tl.from(
        links,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: 'expo.out',
        },
        '-=0.2'
      );

      // 스크롤 트리거 애니메이션
      const sections = container.querySelectorAll('.project-details section');
      sections.forEach((section) => {
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          animation: gsap.from(section, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'expo.out',
            paused: true,
          }),
          toggleActions: 'play none none reverse',
        });
        scrollTriggersRef.current.push(trigger);

        // 섹션 내부 요소들 애니메이션
        const cards = section.querySelectorAll('.feature-card, .challenge-card');
        if (cards.length) {
          const cardsTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 70%',
            animation: gsap.from(cards, {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'expo.out',
              paused: true,
            }),
            toggleActions: 'play none none reverse',
          });
          scrollTriggersRef.current.push(cardsTrigger);
        }

        // Tech Stack 배지 애니메이션
        const badges = section.querySelectorAll('.tech-badges span');
        if (badges.length) {
          const badgesTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 75%',
            animation: gsap.from(badges, {
              scale: 0.8,
              opacity: 0,
              duration: 0.4,
              stagger: 0.05,
              ease: 'back.out(1.7)',
              paused: true,
            }),
            toggleActions: 'play none none reverse',
          });
          scrollTriggersRef.current.push(badgesTrigger);
        }
      });
    } else {
      gsap
        .timeline()
        .to(container.querySelectorAll('.project-details section'), {
          y: 50,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.in',
        })
        .to(
          container,
          {
            opacity: 0,
            x: window.innerWidth >= window.innerHeight ? '100%' : 0,
            y: window.innerWidth >= window.innerHeight ? 0 : '100%',
            duration: 0.6,
            ease: 'power2.in',
            onComplete: () => {
              scrollContainer.scrollTop = 0;
              scrollContainer.style.pointerEvents = 'none';
              scrollContainer.style.overflowY = 'hidden';
            },
          },
          '-=0.3'
        );
    }

    return () => {
      cleanupScrollTriggers();
    };
  }, [isActive]);

  return (
    <div
      className={`description fixed inset-0 w-full h-full `}
      data-active={isActive}
      style={{
        // zIndex: 1000,
        overflow: isActive ? 'auto' : 'hidden',
      }}
      data-lenis-scroll-snap-align='start'
      data-lenis-prevent-wheel={!isActive}
    >
      <div
        ref={containerRef}
        className='inner_container relative w-full h-full'
        style={{
          overflowY: isActive ? 'auto' : 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className='inner p-8' ref={contentRef}>
          <div className='ttl fonty words'>
            <span className='d-flex'>
              <span className='word'>
                <span>{project.title}</span>
              </span>
            </span>
            {project.subtitle && (
              <span className='d-flex'>
                <span className='word'>
                  <span>{project.subtitle}</span>
                </span>
              </span>
            )}
          </div>

          <div className='description_in big words mt-8'>
            <p className='whitespace-pre-wrap'>
              {project.description.split(' ').map((word, index) => (
                <span key={index} className='word'>
                  <span>{word}</span>
                </span>
              ))}
            </p>
            {project.desc && <p className='mt-4 whitespace-pre-wrap'>{project.desc}</p>}
          </div>

          <div className='detail mt-8'>
            <div className='links'>
              {project?.links?.live && (
                <Link className='launch-link' target='_blank' href={project.links.live} rel='noopener noreferrer'>
                  <span className='link-content'>
                    Launch project
                    <ExternalLink className='icon' size={18} />
                  </span>
                </Link>
              )}
              <button className='back-link' onClick={closeProjectDetail}>
                <span className='link-content'>
                  <MoveLeft className='icon' size={18} strokeWidth={1.5} />
                  Back Home
                </span>
              </button>
            </div>
          </div>
          <div className='project-details'>
            {/* 프로젝트 헤더 섹션 */}
            <section className='project-header'>
              <h1>{project.title}</h1>
              <div className='project-period'>
                <CalendarIcon />
                <span>{project.period}</span> {/* 예: "2023.09 - 2024.01" */}
              </div>
              <div className='project-type'>
                {project.type} {/* 예: "Team Project (4인)" 또는 "Personal Project" */}
              </div>
            </section>

            {/* 핵심 정보 섹션 */}
            <section className='project-overview'>
              <div className='role-responsibility'>
                <h3>Role & Responsibility</h3>
                <ul>
                  {project.responsibilities?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className='tech-stack'>
                <h3>Tech Stack</h3>
                <div className='tech-badges'>
                  {project.techStack?.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </section>

            {/* 프로젝트 상세 설명 */}
            <section className='project-description'>
              <div className='key-features'>
                <h3>Key Features</h3>
                {project.keyFeatures?.map((feature) => (
                  <div key={feature.title} className='feature-card'>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                    {/* 기능 시연 GIF나 이미지 */}
                  </div>
                ))}
              </div>

              <div className='challenges'>
                <h3>Technical Challenges</h3>
                {project.challenges?.map((challenge) => (
                  <div key={challenge.title} className='challenge-card'>
                    <h4>{challenge.title}</h4>
                    <p>{challenge.description}</p>
                    <div className='solution'>{challenge.solution}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 링크 섹션 */}
            <section className='project-links'>
              {project.links.github && (
                <a href={project.links.github} target='_blank'>
                  <GithubIcon /> View Code
                </a>
              )}
              {project.links.live && (
                <a href={project.links.live} target='_blank'>
                  <ExternalLinkIcon /> Live Demo
                </a>
              )}
              {project.links.presentation && (
                <a href={project.links.presentation} target='_blank'>
                  <FileTextIcon /> Project Deck
                </a>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectDescription.displayName = 'ProjectDescription';
