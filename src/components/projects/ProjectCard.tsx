import { memo } from 'react';
import Image from 'next/image';
import { ProjectCardProps } from '@/types/project';
import { useMouseMove } from '@/hooks/useMouseMove';

export const ProjectCard = memo(({ project, index, isActive }: ProjectCardProps) => {
  const cardRef = useMouseMove();

  return (
    <div
      ref={cardRef}
      className={`card-holder ${isActive ? 'active' : ''}`}
      data-index={index + 1}
      data-id={project.id}
    >
      <div className='card-holder-in'>
        <div className='card-holder-inn'>
          <div className='card'>
            <div className='card-overlay'></div>
            <div className='card-in relative'>
              {/* <Image
                src={project.image[0] || project.image[1]}
                alt={project.title}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                priority={index === 0}
                className='d-sheet obj
                ect-cover'
              /> */}
              <video muted playsInline autoPlay>
                <source src={project.image[1]} />
              </video>
            </div>
          </div>
          <div className='card'>
            <div className='card-overlay'></div>
            <div className='card-in relative'>
              <Image
                src={project.image[0] || project.image[1]}
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
