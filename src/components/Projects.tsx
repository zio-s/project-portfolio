'use client';
import { useState, useCallback } from 'react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useProjectAnimation } from '@/hooks/useProjectAnimation';
import { projectsData } from '@/data/projects';

export default function Projects() {
  const [activeProject, setActiveProject] = useState(projectsData[0].id);

  const handleSetActiveProject = useCallback((id: string) => {
    setActiveProject(id);
  }, []);

  const { wrapperRef, cardsRef } = useProjectAnimation({
    projects: projectsData,
    setActiveProject: handleSetActiveProject,
  });

  return (
    <div ref={wrapperRef} className='min-h-screen h-auto overflow-visible relative'>
      {/* 더미 슬라이드 - 스크롤 높이를 위한 요소 */}
      {projectsData.map((_, index) => (
        <div key={`faux-${index}`} className='h-screen relative z-[1]' />
      ))}

      {/* 카드 컨테이너 */}
      <div
        className='fixed z-20 w-screen left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        style={{ height: '48vh' }}
      >
        <div
          ref={cardsRef}
          className='w-[450vmax] h-[450vmax] absolute left-1/2 top-0 pointer-events-none'
          style={{
            transform: 'translate(-50%, 0%)',
            // transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} isActive={activeProject === project.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
