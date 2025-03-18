'use client';
import React from 'react';
// import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { IAboutProps } from '@/types/project';
import { aboutData } from '@/data/aboutData';
import AboutSection from './AboutSection';

gsap.registerPlugin(ScrollTrigger);

const About = ({ isActive, closeOverlay }: IAboutProps) => {
  return (
    <div
      className={`overlay fixed inset-0 w-full h-full bg-[#fff0db] text-[#263c4f]
      ${isActive ? 'visible' : 'invisible'}`}
      style={{
        willChange: 'transform, opacity',
        // display: isActive ? 'block' : 'none',
      }}
      data-active={isActive}
      data-lenis-prevent-wheel={!isActive}
    >
      <div
        className='about-content h-full overflow-y-auto'
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div>
          {aboutData.map((section) => (
            <AboutSection key={section.id} data={section} closeOverlay={closeOverlay} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
