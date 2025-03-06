'use client';

import React, { useEffect, useState } from 'react';
import { NavLink } from './navigation/NavLink';

const Header = () => {
  const [textColor, setTextColor] = useState('var(--color3)');

  const updateTextColor = (hash: string) => {
    setTextColor(hash !== '' ? '#263c4f' : 'var(--color3)');
  };

  useEffect(() => {
    updateTextColor(window.location.hash);

    const handleHashChange = () => {
      updateTextColor(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    const handleUrlChange = () => {
      updateTextColor(window.location.hash);
    };

    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);
  return (
    <header id='header' className='fixed top-0 left-0 w-screen p-8'>
      <div className='flex justify-between items-center'>
        <div className='text-2xl font-bold transition-colors duration-300' style={{ color: textColor }}>
          <NavLink href='/'>Byunfolio</NavLink>
        </div>
        <nav className='flex gap-8'>
          {['About'].map((item, index) => (
            <NavLink
              key={index}
              href={`/${item.toLowerCase().replace(' ', '')}`}
              className={`relative text-lg font-semibold hover:-translate-y-0.5 transition-all duration-300 group ${
                textColor === '#263c4f' ? 'text-[#263c4f]' : 'text-[var(--color3)]'
              }`}
              // style={{ color: textColor }}
            >
              {item}
              <span className='absolute bottom-[-4px] left-1/2 w-0 h-0.5 bg-current transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-in-out' />
              <span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 bg-current opacity-0 rounded-full -z-10 scale-0 group-hover:scale-100 group-hover:opacity-10 transition-all duration-400 ease-in-out' />
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
