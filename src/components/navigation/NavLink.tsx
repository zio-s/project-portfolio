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

      if (currentHash !== `#${targetHash}`) {
        window.location.hash = targetHash;

        if (currentHash.toLowerCase() === '#about') {
          setTimeout(() => {
            window.location.href = window.location.pathname;
          }, 500);
        }
      } else {
        history.pushState(null, '', window.location.pathname);
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        if (currentHash.toLowerCase() === '#about') {
          setTimeout(() => {
            window.location.href = window.location.pathname;
          }, 500);
        }
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
