import React from 'react';

const Header = () => {
  return (
    <header className='fixed top-0 left-0 w-full z-50 p-8'>
      <div className='flex justify-between items-center'>
        <div className='text-2xl font-bold' style={{ color: 'var(--color3)' }}>
          Byunfolio
        </div>
        <nav className='flex gap-8'>
          {['About Us', 'Projects', 'Contact'].map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase().replace(' ', '')}`}
              className='relative text-lg font-semibold hover:-translate-y-0.5 transition-all duration-300 group'
              style={{ color: 'var(--color3)' }}
            >
              {item}
              <span className='absolute bottom-[-4px] left-1/2 w-0 h-0.5 bg-current transform -translate-x-1/2 group-hover:w-full transition-all duration-300 ease-in-out' />
              {/* 배경 강조 효과 */}
              <span className='absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 bg-current opacity-0 rounded-full -z-10 scale-0 group-hover:scale-100 group-hover:opacity-10 transition-all duration-400 ease-in-out' />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
