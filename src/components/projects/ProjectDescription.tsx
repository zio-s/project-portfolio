import { ProjectDescriptionProps } from '@/types/project';
import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CalendarIcon, ExternalLink, GithubIcon, MoveLeft, User2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export const ProjectDescription = memo(({ project, isActive, closeProjectDetail }: ProjectDescriptionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  // const titleRef = useRef(null);
  const headerHeight = '80px'; // 실제 헤더 높이에 맞게 조정
  const titleRef = useRef<HTMLDivElement>(null);
  interface TechBadgeProps {
    name: string;
  }
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
      scrollContainer.scrollTop = 0;
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
      const descWords = container.querySelectorAll('.tech-badges div');
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
    }

    return () => {
      cleanupScrollTriggers();
    };
  }, [isActive]);

  const TechBadge: React.FC<TechBadgeProps> = ({ name }) => {
    // 기술 스택별 배경색 매핑
    const getBadgeColor = (tech: string) => {
      const colorMap: { [key: string]: string } = {
        TypeScript: 'bg-[#3178C6] text-white',
        JavaScript: 'bg-[#F7DF1E] text-black',
        Python: 'bg-[#3776AB] text-white',
        'Next.js': 'bg-black text-white',
        Zustand: 'bg-[#4C4C4C] text-white',
        Recoil: 'bg-[#3578E5] text-white',
        'React-Query': 'bg-[#FF4154] text-white',
        'React-Hook-Form': 'bg-[#EC5990] text-white',
        Scss: 'bg-[#CC6699] text-white',
        'Tailwind CSS': 'bg-[#38B2AC] text-white',
        Django: 'bg-[#092E20] text-white',
        Firebase: 'bg-[#FFCA28] text-black',
        Supabase: 'bg-[#3ECF8E] text-white',
        AWS: 'bg-[#FF9900] text-black',
        Vercel: 'bg-[#121111] text-white',
        Docker: 'bg-[#2496ED] text-white',
        HTML: 'bg-[#E34F26] text-white',
        SASS: 'bg-[#CC6699] text-white',
        GSAP: 'bg-[#88CE02] text-black',
        'FullPage.js': 'bg-[#4CAF50] text-white',
        Gnubord: 'bg-[#4A90E2] text-white',
        Swiper: 'bg-[#6332F6] text-white',
        Emotion: 'bg-[#D36AC2] text-white',
      };

      return colorMap[tech] || 'bg-gray-500 text-white'; // 기본값
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium mr-2 mb-2 ${getBadgeColor(name)}`}>
        {name}
      </span>
    );
  };
  return (
    <div
      className={`description fixed inset-0 w-full h-full`}
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
        <div className='inner flex flex-col gap-20' ref={contentRef}>
          <div
            ref={titleRef}
            className='ttl flex flex-col gap-4 fonty words'
            style={{
              marginTop: headerHeight, // 헤더 높이만큼 여백
            }}
          >
            <div className='title-box'>
              <span className='word'>
                <h1>{project.title}</h1>
              </span>
              {project.subtitle && <span className='subtitle'>{project.subtitle}</span>}
            </div>
            <div className='project-day-type'>
              <div className='project-period'>
                <CalendarIcon />
                <span>{project.period}</span> {/* 예: "2023.09 - 2024.01" */}
              </div>
              <div className='project-type'>
                <User2 /> {project.client} {/* 예: "Team Project (4인)" 또는 "Personal Project" */}
              </div>
            </div>
          </div>

          <section className='description_in big words'>
            <p className='whitespace-pre-wrap '>
              <span>{project.description}</span>
            </p>
            {project.desc && <p className='mt-4 whitespace-pre-wrap'>{project.desc}</p>}
          </section>

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
              <h3 className='flex'>Tech Stack</h3>
              <div className='tech-badges'>
                <div className='flex flex-wrap gap-2'>
                  {project.techStack?.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className='project-'>
            <div className='project-description'>
              <div className='key-features'>
                <h3>Key Features</h3>
                {project.keyFeatures?.map((feature) => (
                  <div key={feature.title} className='feature-card'>
                    {feature.image && (
                      <div className='image-wrapper'>
                        {feature.image.endsWith('.mp4') ? (
                          <video autoPlay loop muted playsInline className='object-cover w-full h-full'>
                            <source src={feature.image} type='video/mp4' />
                          </video>
                        ) : (
                          <Image
                            src={feature.image}
                            alt={feature.title}
                            fill
                            className='object-cover'
                            sizes='(max-width: 768px) 100vw, 45vw'
                          />
                        )}
                      </div>
                    )}
                    <div className='content'>
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
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
            </div>
          </section>
          <div className='action-box'>
            <div className='links'>
              {project?.links?.live && (
                <Link className='launch-link' target='_blank' href={project.links.live} rel='noopener noreferrer'>
                  <span className='link-content'>
                    <ExternalLink className='icon' size={18} />
                    Launch project
                  </span>
                </Link>
              )}
              {project.links.github && (
                <Link
                  className='launch-link flex gap-4'
                  target='_blank'
                  href={project.links.github}
                  rel='noopener noreferrer'
                >
                  <GithubIcon /> View Code
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
        </div>
      </div>
    </div>
  );
});

ProjectDescription.displayName = 'ProjectDescription';
