// About.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { IAboutProps } from '@/types/project';

gsap.registerPlugin(ScrollTrigger);

const About = ({ isActive, closeOverlay }: IAboutProps) => {
  return (
    <div
      className={`fixed inset-0 w-full h-full bg-[#fff0db] text-[#263c4f] transition-opacity duration-300
        ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      data-active={isActive}
      data-lenis-prevent-wheel={!isActive}
    >
      <div
        className='h-full overflow-y-auto'
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className='w-full'>
          {/* Hero Section */}
          <section className='min-h-screen flex items-center justify-center px-4'>
            <div className='text-center'>
              <h1 className='text-6xl font-bold mb-8 font-editorial'>Creative Studio</h1>
              <p className='text-xl max-w-2xl mx-auto'>
                Based in Santiago, Chile; we&apos;re a small studio with years of experience in web development and
                graphic design, with a simple goal: creating great digital experiences.
              </p>
            </div>
          </section>

          {/* Services Section */}
          <section className='py-32 px-4'>
            <div className='max-w-6xl mx-auto'>
              <h2 className='text-4xl font-editorial mb-16 text-center'>We specialize in:</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                {['Web Development', 'UI & UX', 'Art Direction'].map((service) => (
                  <div key={service} className='service-item text-center'>
                    <h3 className='text-2xl font-bold mb-4'>{service}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Work Process Section */}
          <section className='py-32 px-4 bg-[#263c4f] text-[#fff0db]'>
            <div className='max-w-6xl mx-auto'>
              <h2 className='text-4xl font-editorial mb-16 text-center'>Our Work Process</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                <div>
                  <p className='text-lg'>
                    We work as a creative network. Whether it&apos;s web developers, graphic designers, advertising
                    creatives or any other craft; we love connecting with interesting people who are constantly creating
                    and looking for their next big idea.
                  </p>
                </div>
                <div>
                  <p className='text-lg'>
                    Our clients are people who believe in craft and the beauty of things. Sure, there are deadlines, but
                    that shouldn&apos;t mean sacrificing a user&apos;s experience when interacting with your product.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className='py-32 px-4'>
            <div className='text-center'>
              <h2 className='text-4xl font-editorial mb-8'>Let&apos;s work together</h2>
              <div className='flex gap-4 justify-center'>
                <Link
                  href='mailto:hello@solitario.studio'
                  className='inline-block bg-[#263c4f] text-[#fff0db] px-8 py-4 rounded-full text-lg 
                         transition-transform hover:scale-105 duration-300'
                >
                  hello@solitario.studio
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    closeOverlay();
                  }}
                  className='inline-block border-2 border-[#263c4f] text-[#263c4f] px-8 py-4 rounded-full text-lg 
                         transition-transform hover:scale-105 duration-300'
                >
                  Back Home
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
