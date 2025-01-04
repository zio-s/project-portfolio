'use client';

import React from 'react';
import { NavLink } from './navigation/NavLink';

const Header = () => {
  return (
    <header id='header' className='fixed top-0 left-0 w-screen p-8'>
      <div className='flex justify-between items-center'>
        <div className='text-2xl font-bold ' style={{ color: 'var(--color3)' }}>
          <NavLink href='/'>Byunfolio</NavLink>
        </div>
        <nav className='flex gap-8'>
          {['About', 'Projects', 'Contact'].map((item, index) => (
            <NavLink
              key={index}
              href={`/${item.toLowerCase().replace(' ', '')}`}
              className='relative text-lg font-semibold hover:-translate-y-0.5 transition-all duration-300 group [color:var(--color3)]'
              // style={{ color: 'var(--color3)' }}
            >
              {item}
              <span className='absolute bottom-[-4px] left-1/2 w-0 h-0.5 bg-current transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-in-out' />
              {/* 배경 강조 효과 */}
              <span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 bg-current opacity-0 rounded-full -z-10 scale-0 group-hover:scale-100 group-hover:opacity-10 transition-all duration-400 ease-in-out' />
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
