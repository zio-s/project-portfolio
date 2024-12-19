import { memo } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';

interface ProjectTitleProps {
  project: Project;
  isActive: boolean;
}

export const ProjectTitle = memo(({ project }: ProjectTitleProps) => {
  return (
    <div className={`title words_holder `} data-id={project.id}>
      <div className='title_holder'>
        <div className='client fw-bold mask'>
          <span>
            {project.year} &mdash; {project.title}
          </span>
        </div>

        <Link
          href={`/project/${project.id}`}
          className='more title_in words'
          data-id={project.id}
          data-title={`${project.title} — Portfolio`}
        >
          <span className='d-flex'>
            <span className='word'>
              <span style={{ transitionDelay: '0s' }}>{project.title}</span>
            </span>
            {project.subtitle && (
              <span className='word'>
                <span style={{ transitionDelay: '0.05s' }}>{project.subtitle}</span>
              </span>
            )}
          </span>
          <div aria-hidden='true' className='ready'>
            <i className='bi bi-check-lg'></i>
          </div>
        </Link>

        <div className='meta'>
          <div className='links'>
            <Link className='more' href={`/project/${project.id}`} data-id={project.id}>
              Details &nbsp;&nbsp;<i className='bi bi-plus-circle'></i>
            </Link>
            {project?.links?.live && (
              <a className='go' target='_blank' href={project.links.live} rel='noopener noreferrer'>
                Launch project &nbsp;&nbsp;<i className='bi bi-arrow-up-right-circle'></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectTitle.displayName = 'ProjectTitle';
