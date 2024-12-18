import { Project } from '@/types/project';
import { memo } from 'react';

interface ProjectDescriptionProps {
  project: Project;
  isActive: boolean;
}

export const ProjectDescription = memo(({ project, isActive }: ProjectDescriptionProps) => {
  return (
    <div className={`description words_holder ${isActive ? 'active' : ''}`} data-lenis-prevent>
      <div className='bah'>
        <i className='has--back less d-portrait-none'></i>
        <div className='bahh'>
          <div className='ttl fonty words d-landscape-none'>
            <span className='d-flex'>
              <span className='word'>
                <span style={{ transitionDelay: '0s' }}>{project.title}</span>
              </span>
            </span>
            {project.subtitle && (
              <span className='d-flex'>
                <span className='word'>
                  <span style={{ transitionDelay: '0.05s' }}>{project.subtitle}</span>
                </span>
              </span>
            )}
          </div>

          <div className='description_in big words'>
            <p>
              {project.description.split(' ').map((word, index) => (
                <span key={index} className='word'>
                  <span style={{ transitionDelay: `${index * 0.0035}s` }}>{word}</span>
                </span>
              ))}
            </p>
          </div>

          <div className='meta'>
            <div className='links'>
              {project?.links?.live && (
                <a className='go' target='_blank' href={project.links.live} rel='noopener noreferrer'>
                  Launch project &nbsp;&nbsp;<i className='bi bi-arrow-up-right-circle'></i>
                </a>
              )}
              <button className='less'>
                <i className='bi bi-arrow-left'></i>
                &nbsp;&nbsp;To Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectDescription.displayName = 'ProjectDescription';
