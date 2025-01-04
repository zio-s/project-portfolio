// ProjectsContainer.tsx
'use client';
import { projectsData } from '@/data/projects';
import { useProjectAnimation } from '@/hooks/useProjectAnimation';
import { useEffect, useState } from 'react';
import { ProjectTitle } from './ProjectTitle';
import { ProjectCard } from './ProjectCard';
import { ProjectDescription } from './ProjectDescription';
import { useTransitionAnimation } from '@/hooks/useTransitionAnimation';
import About from '../layout/about/About';

export const ProjectsContainer = () => {
  const [activeProject, setActiveProject] = useState<string>('');

  const { cardsRef, closeProjectDetail, openProjectDetail } = useProjectAnimation({
    projects: projectsData,
    setActiveProject,
  });

  const { currentSection, isOverlayActive, handleCloseOverlay } = useTransitionAnimation({
    onTransitionComplete: (section) => {
      if (section === 'home') {
        setActiveProject('');
      }
    },
  });

  useEffect(() => {
    const cardsElement = cardsRef.current;
    if (!cardsElement) return;

    const handleClick = (e: MouseEvent) => {
      if (!document.body.classList.contains('details')) return;

      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('.interactive-element')) {
        return;
      }

      closeProjectDetail();
    };

    cardsElement.addEventListener('click', handleClick);
    return () => {
      cardsElement.removeEventListener('click', handleClick);
    };
  }, [cardsRef, closeProjectDetail]);

  // 스크롤 관리
  useEffect(() => {
    if (isOverlayActive) {
      document.body.style.overflow = ''; // 오버레이 활성화시 기본 스크롤 허용
    }

    return () => {
      document.body.style.overflow = ''; // 클린업
    };
  }, [isOverlayActive]);

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Main content wrapper */}
      <main
        className={`relative w-full h-full transition-opacity duration-500 ${
          isOverlayActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className='projects-stage min-h-screen h-auto overflow-visible relative'>
          <div id='titles'>
            {projectsData.map((project) => (
              <ProjectTitle
                key={project.id}
                project={project}
                isActive={activeProject === project.id}
                openProjectDetail={openProjectDetail}
              />
            ))}
          </div>

          <div id='cards' className='cards-container'>
            <div
              ref={cardsRef}
              id='cards_in'
              className='fixed z-20 w-screen left-1/2 top-[var(--card-height)] -translate-x-1/2 transform-origin-top'
            >
              {projectsData.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} isActive={activeProject === project.id} />
              ))}
            </div>
          </div>

          <div id='descriptions'>
            {projectsData.map((project) => (
              <ProjectDescription
                key={project.id}
                project={project}
                isActive={activeProject === project.id}
                closeProjectDetail={closeProjectDetail}
              />
            ))}
          </div>

          {/* Faux slides */}
          {projectsData.map((project, index) => (
            <div
              key={`faux-${project.id}`}
              id={project.id}
              className='faux_slide'
              data-index={index + 1}
              style={{ height: '100vh' }}
            />
          ))}
        </div>
      </main>

      {/* Overlay sections */}
      <div
        className='absolute inset-0 w-full h-full'
        style={{
          zIndex: isOverlayActive ? 2 : 1,
          visibility: isOverlayActive ? 'visible' : 'hidden',
        }}
      >
        {currentSection === 'about' && <About isActive={isOverlayActive} closeOverlay={handleCloseOverlay} />}
        {/* 다른 컴포넌트 오버레이 */}
        {/* {currentSection === 'contact' && <Contact isActive={isOverlayActive} closeOverlay={handleCloseOverlay} />} */}
      </div>
    </div>
  );
};
