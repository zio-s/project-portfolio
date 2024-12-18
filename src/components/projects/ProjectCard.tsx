import { memo } from 'react';
import Image from 'next/image';
import { ProjectCardProps } from '@/types/project';

export const ProjectCard = memo(({ project, index, isActive }: ProjectCardProps) => {
  return (
    <div
      className={`card-holder ${isActive ? 'active' : ''}`}
      style={{
        zIndex: 20 - index,
        rotate: `${index * 20}deg`,
      }}
      data-index={index + 1}
      data-id={project.id}
    >
      <div className='card-holder-in'>
        <div className='card-holder-inn'>
          <div className='card'>
            <div className='card-in relative'>
              <Image
                src={project.image[0]}
                alt={project.title}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                priority={index === 0}
                className='d-sheet object-cover'
              />
            </div>
          </div>
          <div className='card'>
            <div className='card-in relative'>
              <Image
                src={project.image[0] || project.image[0]}
                alt={project.title}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='d-sheet object-cover'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';
