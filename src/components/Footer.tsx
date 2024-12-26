import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className='fixed flex items-center justify-between w-full p-8  bottom-0 z-50 left-1/2 -translate-x-1/2 text-center py-4 text-sm '>
      <p className='my_text' style={{ color: 'var(--color3)' }}>
        This is just the beginning, stay tuned!
      </p>
      <div className='sns'>
        <ul className='flex gap-3'>
          <li className='sns_git'>
            <Link href='https://github.com/zio-s' target='_blank'>
              <i className='la la-git' style={{ fontSize: '32px', color: 'var(--color3)' }}></i>
            </Link>
          </li>
          <li className='sns_blog'>
            <Link href='https://github.com/zio-s' target='_blank'>
              <i className='lab la-blogger-b' style={{ fontSize: '32px', color: 'var(--color3)' }}></i>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
