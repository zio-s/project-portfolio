import { Project } from '@/types/project';
import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MoveLeft } from 'lucide-react';

interface ProjectDescriptionProps {
  project: Project;
  isActive: boolean;
  closeProjectDetail: () => void;
}

export const ProjectDescription = memo(({ project, isActive, closeProjectDetail }: ProjectDescriptionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && contentRef.current) {
      // 초기 상태 설정
      gsap.set(contentRef.current.children, {
        y: 30,
        opacity: 0,
      });

      // 등장 애니메이션
      gsap.to(contentRef.current.children, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3, // 패널이 슬라이드 된 후 시작
      });
    }
  }, [isActive]);

  return (
    <div className={`description words_holder ${isActive ? 'active' : ''}`} data-lenis-prevent>
      <div className='inner_container'>
        <i className='has--back less d-portrait-none'></i>
        <div className='inner' ref={contentRef}>
          <div className='ttl fonty words d-landscape-none'>
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

          <div className='description_in big words'>
            <p>
              {project.description.split(' ').map((word, index) => (
                <span key={index} className='word'>
                  <span>{word}</span>
                </span>
              ))}
            </p>
          </div>

          <div className='meta'>
            <div className='links'>
              {project?.links?.live && (
                <a className='go' target='_blank' href={project.links.live} rel='noopener noreferrer'>
                  Launch project &nbsp;&nbsp;
                  <i className='bi bi-arrow-up-right-circle'></i>
                </a>
              )}
              <button className='less' onClick={closeProjectDetail}>
                <MoveLeft size={20} strokeWidth={1.5} />
                &nbsp;&nbsp;Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectDescription.displayName = 'ProjectDescription';
