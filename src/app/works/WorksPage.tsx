'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Noto_Sans_KR } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { projectsData } from '@/data/projects';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';

const notoSans = Noto_Sans_KR({
  weight: ['400', '700'],
  subsets: ['latin', 'latin-ext'],
  preload: false,
  variable: '--font-sans',
});

interface WorksPageProps {
  isActive: boolean;
  closeOverlay: () => void;
}

const WorksPage: React.FC<WorksPageProps> = ({ isActive }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expandedStacks, setExpandedStacks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    if (!isActive || !contentRef.current) return;

    const items = contentRef.current.querySelectorAll('.work-item');
    const heading = contentRef.current.querySelector('h1');
    const sub = contentRef.current.querySelector('.subheading');
    const back = contentRef.current.querySelector('.back-button');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } });

    tl.fromTo(heading, { y: 50, opacity: 0 }, { y: 0, opacity: 1 })
      .fromTo(sub, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.5')
      .fromTo(back, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.4')
      .fromTo(
        items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          onComplete: () => {
            items.forEach((item) => {
              ScrollTrigger.create({
                trigger: item,
                start: 'top 80%',
                onEnter: () => gsap.to(item, { scale: 1, opacity: 1, duration: 0.4, ease: 'power1.out' }),
                once: true,
              });
            });
          },
        }
      );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isActive]);

  const toggleStack = (id: string) => setExpandedStacks((prev) => ({ ...prev, [id]: true }));

  const sortedProjects = [...projectsData].sort((a, b) => +b.year - +a.year);

  return (
    <div
      className={`${notoSans.className} overlay fixed inset-0 w-full h-full bg-[#fff0db] text-[#263c4f] ${
        isActive ? 'visible' : 'invisible'
      }`}
      style={{ willChange: 'transform, opacity' }}
      data-active={isActive}
      data-lenis-prevent-wheel={!isActive}
    >
      <div
        className='works-content h-full overflow-y-auto'
        style={{ WebkitOverflowScrolling: 'touch' }}
        ref={contentRef}
      >
        <div className='py-32 px-4 md:px-8 max-w-6xl mx-auto'>
          <div className='flex flex-col  md:justify-between md:items-center mb-16'>
            <h1 className='text-5xl md:text-6xl font-bold mb-8 font-editorial text-center md:text-left'>
              Projects Collection
            </h1>
            <p className='subheading text-xl mb-12 text-center md:text-left'>
              프론트엔드 개발자로서의 여정을 담은 프로젝트 모음입니다. 다양한 기술 스택과 도전 과제를 통해 성장한 경험을
              공유합니다.
            </p>
          </div>

          <div className='works-grid space-y-12'>
            {sortedProjects.map((work) => {
              const expanded = expandedStacks[work.id];
              const list = work.techStack || [];
              const visible = expanded ? list : list.slice(0, 5);
              const more = list.length - 5;

              return (
                <div
                  key={work.id}
                  className='work-item flex flex-col md:flex-row gap-8 border-b pb-12 border-[#263c4f] border-opacity-20 transform opacity-0 scale-[0.98]'
                >
                  <div className='relative w-full md:w-1/3 h-64 md:h-80 rounded-lg overflow-hidden flex-shrink-0'>
                    <Image
                      src={work.image[0]}
                      alt={work.title}
                      fill
                      className='object-cover transition-transform duration-500'
                      sizes='(max-width: 768px) 100vw, 33vw'
                    />
                  </div>

                  <div className='flex-1'>
                    <div className='text-lg text-[#263c4f] opacity-70 mb-1'>{work.year}</div>
                    <h2 className='text-3xl md:text-4xl font-bold font-editorial'>{work.title}</h2>
                    <p className='text-xl mt-2 mb-6'>{work.subtitle}</p>

                    <div className='flex flex-wrap gap-3 mb-6'>
                      {visible.map((tech) => (
                        <span key={tech} className='px-3 py-1 bg-[#263c4f] bg-opacity-10 rounded-full text-sm'>
                          {tech}
                        </span>
                      ))}
                      {list.length > 5 && !expanded && (
                        <span
                          className='px-3 py-1 bg-[#263c4f] bg-opacity-5 rounded-full text-sm cursor-pointer'
                          onClick={() => toggleStack(work.id)}
                        >
                          +{more} more
                        </span>
                      )}
                    </div>

                    <div className='flex flex-wrap gap-4'>
                      {work.links.live && (
                        <Link
                          href={work.links.live}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 border-2 border-[#263c4f] text-[#263c4f] px-6 py-2 rounded-full text-lg transition-transform hover:scale-105 duration-300'
                        >
                          Live Site
                          <ExternalLink size={16} />
                        </Link>
                      )}
                      {work.links.github && (
                        <Link
                          href={work.links.github}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 border-2 border-[#263c4f] text-[#263c4f] px-6 py-2 rounded-full text-lg transition-transform hover:scale-105 duration-300'
                        >
                          GitHub
                          <Github size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksPage;
