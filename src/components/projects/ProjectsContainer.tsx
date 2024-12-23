'use client';
import { projectsData } from '@/data/projects';
import { useProjectAnimation } from '@/hooks/useProjectAnimation';
import { useState } from 'react';
import { ProjectTitle } from './ProjectTitle';
import { ProjectCard } from './ProjectCard';
import { ProjectDescription } from './ProjectDescription';

export const ProjectsContainer = () => {
  const [activeProject, setActiveProject] = useState<string>('');
  const { wrapperRef, cardsRef, closeProjectDetail, openProjectDetail } = useProjectAnimation({
    projects: projectsData,
    setActiveProject,
  });

  return (
    <div id='stage' ref={wrapperRef} className='min-h-screen h-auto overflow-visible relative'>
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

      <div id='cards'>
        <div
          ref={cardsRef}
          id='cards_in'
          className='fixed z-20 w-screen left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
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

      {/* 스크롤 높이를 위한 더미 슬라이드 */}
      {projectsData.map((project, index) => (
        <div
          key={`faux-${project.id}`}
          id={project.id}
          className='faux_slide'
          data-index={index + 1}
          style={{
            height: '100vh', // 명확한 높이 설정
          }}
          // data-color1={project.colors.color1}
          // data-color2={project.colors.color2}
          // {...project.colors}
          // scroll-snap-align
        />
      ))}
    </div>
  );
};
