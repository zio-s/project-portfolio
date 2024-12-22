import { Project } from '@/types/project';
import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Badge, CalendarIcon, ExternalLinkIcon, FileTextIcon, GithubIcon, MoveLeft } from 'lucide-react';

interface ProjectDescriptionProps {
  project: Project;
  isActive: boolean;
  closeProjectDetail: () => void;
}

export const ProjectDescription = memo(({ project, isActive, closeProjectDetail }: ProjectDescriptionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // 컴포넌트 마운트/언마운트 시 스크롤 위치 관리
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isActive) {
      // 활성화될 때는 상단으로 스크롤
      container.scrollTop = 0;
    }

    return () => {
      if (container) {
        container.scrollTop = 0;
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!contentRef.current || !isFirstRender.current) return;

    const container = contentRef.current;
    const words = container.querySelectorAll('.word span');
    const detail = container.querySelector('.detail');

    gsap.set(container, {
      opacity: 0,
      x: window.innerWidth >= window.innerHeight ? '100%' : 0,
      y: window.innerWidth >= window.innerHeight ? 0 : '100%',
    });

    gsap.set([words, detail], {
      opacity: 0,
      yPercent: 100,
    });

    isFirstRender.current = false;
  }, []);

  useEffect(() => {
    if (!contentRef.current || !containerRef.current) return;

    const container = contentRef.current;
    const scrollContainer = containerRef.current;
    const words = container.querySelectorAll('.word span');
    const detail = container.querySelector('.detail');

    gsap.killTweensOf([container, words, detail]);

    if (isActive) {
      // 컨테이너 스타일 설정
      scrollContainer.style.pointerEvents = 'auto';
      scrollContainer.style.overflowY = 'auto';

      gsap.to(container, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'expo.out',
        onComplete: () => {
          gsap.to(words, {
            opacity: 1,
            yPercent: 0,
            duration: 0.7,
            stagger: 0.02,
            ease: 'expo.out',
          });

          gsap.to(detail, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
          });
        },
      });
    } else {
      // 컨테이너 스타일 리셋
      scrollContainer.style.pointerEvents = 'none';
      scrollContainer.style.overflowY = 'hidden';

      gsap.to([words, detail], {
        opacity: 0,
        yPercent: 100,
        duration: 0.6,
        stagger: 0.01,
        ease: 'power2.in',
      });

      gsap.to(container, {
        opacity: 0,
        x: window.innerWidth >= window.innerHeight ? '100%' : 0,
        y: window.innerWidth >= window.innerHeight ? 0 : '100%',
        duration: 0.8,
        ease: 'power2.in',
        onComplete: () => {
          scrollContainer.scrollTop = 0;
        },
      });
    }
  }, [isActive]);

  return (
    <div
      className={`description fixed inset-0 w-full h-full ${isActive ? 'active' : ''}`}
      style={{
        zIndex: 1000,
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
            <div className='links flex items-center justify-between'>
              {project?.links?.live && (
                <a
                  className='go inline-flex items-center hover:opacity-80 transition-opacity'
                  target='_blank'
                  href={project.links.live}
                  rel='noopener noreferrer'
                >
                  Launch project
                </a>
              )}
              <button
                className='less inline-flex items-center hover:opacity-80 transition-opacity'
                onClick={closeProjectDetail}
              >
                <MoveLeft size={20} strokeWidth={1.5} className='mr-2' />
                Back Home
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
