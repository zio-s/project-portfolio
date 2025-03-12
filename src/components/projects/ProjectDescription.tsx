'use client';
import { ProjectDescriptionProps } from '@/types/project';
import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CalendarIcon, ExternalLink, GithubIcon, MoveLeft, User2, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export const ProjectDescription = memo(({ project, isActive, closeProjectDetail }: ProjectDescriptionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  const headerHeight = '80px';
  const titleRef = useRef<HTMLDivElement>(null);
  interface TechBadgeProps {
    name: string;
  }
  const cleanupScrollTriggers = () => {
    scrollTriggersRef.current.forEach((trigger) => trigger.kill());
    scrollTriggersRef.current = [];
  };
  cleanupScrollTriggers();
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
    const getBadgeColor = (tech: string) => {
      const colorMap: { [key: string]: string } = {
        TypeScript: 'bg-[#3178C6] text-white',
        JavaScript: 'bg-[#F7DF1E] text-black',
        Python: 'bg-[#3776AB] text-white',
        'Next.js': 'bg-black text-white',
        Zustand: 'bg-[#4C4C4C] text-white',
        Recoil: 'bg-[#3578E5] text-white',
        'React-Query': 'bg-[#FF4154] text-white',
        'Styled-Components': 'bg-[#EC5990] text-white',
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
        Lenis: 'bg-purple-600 text-white',
        React: 'bg-[#61DAFB] text-black',
        Vite: 'bg-[#646CFF] text-white',
        Redux: 'bg-[#764ABC] text-white',
        'Redux Toolkit': 'bg-[#764ABC] text-white',
        'Redux-Saga': 'bg-[#89D96D] text-black',
        'Redux-Thunk': 'bg-[#764ABC] text-white',
        Vue: 'bg-[#42b883] text-white',
        Angular: 'bg-[#DD0031] text-white',
        Node: 'bg-[#339933] text-white',
        'Node.js': 'bg-[#339933] text-white',
        Express: 'bg-[#000000] text-white',
        MongoDB: 'bg-[#47A248] text-white',
        PostgreSQL: 'bg-[#336791] text-white',
        MySQL: 'bg-[#4479A1] text-white',
        GraphQL: 'bg-[#E10098] text-white',
        Apollo: 'bg-[#311C87] text-white',
        Jest: 'bg-[#C21325] text-white',
        'Testing Library': 'bg-[#E33332] text-white',
        Cypress: 'bg-[#17202C] text-white',
        Webpack: 'bg-[#8DD6F9] text-black',
        Babel: 'bg-[#F9DC3E] text-black',
        ESLint: 'bg-[#4B32C3] text-white',
        Prettier: 'bg-[#F7B93E] text-black',
        'Material UI': 'bg-[#0081CB] text-white',
        'Chakra UI': 'bg-[#319795] text-white',
        Ant: 'bg-[#0170FE] text-white',
        'Ant Design': 'bg-[#0170FE] text-white',
        Storybook: 'bg-[#FF4785] text-white',
        'Three.js': 'bg-[#000000] text-white',
        D3: 'bg-[#F9A03C] text-black',
        'D3.js': 'bg-[#F9A03C] text-black',
        'Framer Motion': 'bg-[#0055FF] text-white',
        Axios: 'bg-[#5A29E4] text-white',
        Stripe: 'bg-[#008CDD] text-white',
        i18next: 'bg-[#26A69A] text-white',
        'React Router': 'bg-[#CA4245] text-white',
        'React Hook Form': 'bg-[#EC5990] text-white',
        Formik: 'bg-[#0669EB] text-white',
        Yup: 'bg-[#9F0FF1] text-white',
        Zod: 'bg-[#3E67B1] text-white',
        'Socket.io': 'bg-[#010101] text-white',
        JWT: 'bg-[#000000] text-white',
        OAuth: 'bg-[#EB5424] text-white',
        Auth0: 'bg-[#EB5424] text-white',
        Netlify: 'bg-[#00C7B7] text-white',
        Heroku: 'bg-[#430098] text-white',
        'Google Cloud': 'bg-[#4285F4] text-white',
        Azure: 'bg-[#0078D4] text-white',
        'Azure DevOps': 'bg-[#0078D4] text-white',
        Jenkins: 'bg-[#D24939] text-white',
        GitHub: 'bg-[#181717] text-white',
        GitLab: 'bg-[#FCA121] text-black',
        Bitbucket: 'bg-[#0052CC] text-white',
        Figma: 'bg-[#F24E1E] text-white',
        Sketch: 'bg-[#FDB300] text-black',
        Zeplin: 'bg-[#FDBD39] text-black',
        Jira: 'bg-[#0052CC] text-white',
        Confluence: 'bg-[#172B4D] text-white',
        Trello: 'bg-[#0079BF] text-white',
        KakaoAPI: 'bg-[#FFCD00] text-black',
        NaverAPI: 'bg-[#1EC800] text-white',
        GoogleAPI: 'bg-[#4285F4] text-white',
        AOS: 'bg-[#0076E7] text-white',
        Toast: 'bg-[#FFBE3D] text-black',
      };

      return colorMap[tech] || 'bg-gray-500 text-white';
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
              marginTop: headerHeight,
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
                <span>{project.period}</span>
              </div>
              <div className='project-type'>
                {project.client.includes('Team') || project.client.includes('팀') ? <Users /> : <User2 />}
                {project.client}
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
