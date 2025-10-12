'use client';
import { projectsData } from '@/data/projects';
import { useProjectAnimation } from '@/hooks/animation';
import { useEffect, useState, useMemo } from 'react';
import { ProjectTitle } from './ProjectTitle';
import { ProjectCard } from './ProjectCard';
import { ProjectDescription } from './ProjectDescription';
import { useTransitionAnimation } from '@/hooks/useTransitionAnimation';
import About from '../layout/about/About';
import WorksPage from '@/app/works/WorksPage';

export const ProjectsContainer: React.FC = () => {
  // showOnMain이 false인 항목만 제외 (기본은 true)
  // useMemo로 메모이제이션하여 불필요한 재계산 방지
  const mainProjects = useMemo(() => projectsData.filter((p) => p.showOnMain !== false), []);
  const [activeProject, setActiveProject] = useState<string>('');

  // 리팩토링된 애니메이션 훅 사용
  const { wrapperRef, cardsRef, closeProjectDetail, openProjectDetail } = useProjectAnimation({
    projects: mainProjects, // FIXED: mainProjects로 변경 (렌더링되는 카드와 일치)
    setActiveProject,
  });

  const { currentSection, isOverlayActive, handleCloseOverlay } = useTransitionAnimation({
    onTransitionComplete: (section) => {
      if (section === 'home') setActiveProject('');
    },
  });

  useEffect(() => {
    const cardsEl = cardsRef.current;
    if (!cardsEl) return;

    const handleClick = (e: MouseEvent) => {
      if (!document.body.classList.contains('details')) return;
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('.interactive-element')) return;
      closeProjectDetail();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.body.classList.contains('details')) closeProjectDetail();
    };

    cardsEl.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      cardsEl.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [cardsRef, closeProjectDetail]);

  useEffect(() => {
    document.body.style.overflow = isOverlayActive ? '' : '';
  }, [isOverlayActive]);

  // URL 해시로 디테일 열기
  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash || ['about', 'works', 'home'].includes(hash)) return;
      const project = mainProjects.find((p) => p.id === hash);
      if (project) {
        setActiveProject(hash);
        if (!document.body.classList.contains('details')) {
          const el = document.querySelector(`.card-holder[data-id="${hash}"]`);
          if (el instanceof HTMLElement) setTimeout(() => openProjectDetail(el), 100);
        }
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [mainProjects, openProjectDetail]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={`relative w-full h-full transition-opacity duration-500 ${
          isOverlayActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className='projects-stage min-h-screen overflow-visible relative'>
          <div id='titles'>
            {mainProjects.map((project) => (
              <ProjectTitle
                key={project.id}
                project={project}
                isActive={activeProject === project.id}
                openProjectDetail={openProjectDetail}
              />
            ))}
          </div>

          <div id='cards' className='cards-container'>
            <div ref={cardsRef} id='cards_in'>
              {mainProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} isActive={activeProject === project.id} />
              ))}
            </div>
          </div>

          <div id='descriptions'>
            {mainProjects.map((project) => (
              <ProjectDescription
                key={project.id}
                project={project}
                isActive={activeProject === project.id}
                closeProjectDetail={closeProjectDetail}
              />
            ))}
          </div>

          {mainProjects.map((project, index) => (
            <div
              key={`faux-${project.id}`}
              id={project.id}
              className='faux_slide'
              data-index={index + 1}
              style={{ height: '100vh' }}
            />
          ))}
        </div>
      </div>

      <div
        className='absolute inset-0 w-full h-full'
        style={{
          zIndex: isOverlayActive ? 2 : 1,
          visibility: isOverlayActive ? 'visible' : 'hidden',
        }}
      >
        {currentSection === 'about' && <About isActive={isOverlayActive} closeOverlay={handleCloseOverlay} />}
        {currentSection === 'works' && <WorksPage isActive={isOverlayActive} closeOverlay={handleCloseOverlay} />}
      </div>
    </>
  );
};
