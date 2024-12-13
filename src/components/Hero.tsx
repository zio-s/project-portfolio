import React from 'react';
import HeroAnimation from '@/animations/HeroAnimation';
const Hero = () => {
  return (
    <section className='relative flex justify-center items-center h-screen bg-[#8A5A4A]'>
      <HeroAnimation />
      <div className='text-center space-y-4'>
        <h1 className='hero-title text-6xl font-bold'>Apt to live</h1>
        <p className='text-xl'>2023 - Serviced Apartments Santiago</p>
        <div className='hero-buttons flex justify-center space-x-4'>
          <button className='px-6 py-2 border rounded-full'>Details</button>
          <button className='px-6 py-2 bg-white text-black rounded-full'>Launch Project</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
