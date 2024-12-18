import React from 'react';

const Header = () => {
  return (
    <header className='flex fixed w-full justify-between items-center p-4 z-50'>
      <div className='text-2xl font-bold'>Byunfolio</div>
      <nav className='flex space-x-6'>
        <a href='#about' className='hover:underline'>
          About Us
        </a>
        <a href='#projects' className='hover:underline'>
          Projects
        </a>
        <a href='#contact' className='hover:underline'>
          Contact
        </a>
      </nav>
    </header>
  );
};

export default Header;
