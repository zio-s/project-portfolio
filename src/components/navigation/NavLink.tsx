'use client';

import { useCallback } from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export const NavLink = ({ href, children, className, isActive }: NavLinkProps) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const currentHash = window.location.hash;
      const targetHash = href === '/' ? '' : href.slice(1);
      //토글 헤쉬
      if (currentHash === `#${targetHash}`) {
        history.pushState(null, '', window.location.pathname);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } else {
        window.location.hash = targetHash;
      }
    },
    [href]
  );

  return (
    <a href={href} onClick={handleClick} className={`${className} ${isActive ? 'active' : ''}`}>
      {children}
    </a>
  );
};
