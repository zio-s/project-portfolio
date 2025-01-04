import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    const onMouseMove = (e: MouseEvent) => {
      // Animate outer cursor with slight delay
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Animate inner dot with no delay
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'none',
      });
    };

    // Handle cursor hover states
    const handleMouseEnter = () => {
      cursor?.classList.add('cursor-hover');
      cursorDot?.classList.add('cursor-dot-hover');
    };

    const handleMouseLeave = () => {
      cursor?.classList.remove('cursor-hover');
      cursorDot?.classList.remove('cursor-dot-hover');
    };

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove);

    // Add hover effect to all links and buttons
    const hoverElements = document.querySelectorAll('a, button');
    hoverElements.forEach((element) => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      hoverElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className='custom-cursor hidden md:block fixed w-8 h-8 pointer-events-none z-50'>
        <div className='relative w-full h-full'>
          <svg
            className='cursor-svg absolute inset-0 w-full h-full text-[#263c4f] transition-transform duration-300'
            viewBox='0 0 50 50'
          >
            <circle cx='25' cy='25' r='20' fill='none' stroke='currentColor' strokeWidth='1' />
          </svg>
        </div>
      </div>
      <div
        ref={cursorDotRef}
        className='custom-cursor-dot hidden md:block fixed w-1 h-1 bg-[#263c4f] rounded-full pointer-events-none z-50'
      />
    </>
  );
};

export default CustomCursor;
