import { memo } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import gsap from 'gsap';

interface ProjectTitleProps {
  project: Project;
  isActive: boolean;
  openProjectDetail: (holder: HTMLElement) => void;
}

export const ProjectTitle = memo(({ project, openProjectDetail }: ProjectTitleProps) => {
  const handleDetailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 중지

    const cardHolder = document.querySelector(`.card-holder[data-id="${project.id}"]`);
    if (cardHolder instanceof HTMLElement) {
      // 이미 details 상태면 무시
      if (document.body.classList.contains('details')) return;

      // 현재 진행 중인 애니메이션이 있다면 중지
      gsap.killTweensOf(cardHolder.querySelectorAll('.card'));

      openProjectDetail(cardHolder);
    }
  };
  return (
    <div className='title words_holder' data-id={project.id}>
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
          onClick={handleDetailClick}
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
            <Link className='more' href={`/project/${project.id}`} data-id={project.id} onClick={handleDetailClick}>
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
