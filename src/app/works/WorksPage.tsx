'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';

type WorksPageProps = {
  projectsData: Project[];
};

export const WorksPage = ({ projectsData }: WorksPageProps) => {
  return (
    <div className='px-6 py-20 min-h-screen bg-[#fdf0d5] text-[#1a2b3c] font-sans'>
      <h1 className='text-5xl font-bold my-16 text-center'>A selection of projects</h1>

      <div className='space-y-8 cursor-pointer'>
        {projectsData.map((work) => (
          <div key={work.id} className='group flex items-center justify-between border-b border-[#1a2b3c] pb-4'>
            <h2 className='text-4xl font-bold group-hover:ml-16 transition-all'>{work.title}</h2>

            <div className='flex items-center gap-6'>
              <span className='text-lg'>{work.year}</span>
              {work.links?.live && (
                <Link href={work.links.live} target='_blank'>
                  <button className='relative overflow-hidden px-5 py-2 rounded-full border-2 border-[#1a2b3c] text-[#1a2b3c] transition group-hover:text-white'>
                    <span className='relative z-10'>More +</span>
                    <span className='absolute inset-0 bg-[#1a2b3c] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out'></span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksPage;
