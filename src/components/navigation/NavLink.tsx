'use client';
import { useState, useCallback, useEffect } from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export const NavLink = ({ href, children, className, isActive }: NavLinkProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      // 중복 클릭 방지
      if (isClicked) return;
      setIsClicked(true);

      // 현재 해시와 대상 해시
      const currentHash = window.location.hash;
      const targetHash = href === '/' ? '' : href.slice(1);

      console.log(`NavLink clicked: ${href}, targetHash: ${targetHash}, currentHash: ${currentHash}`);

      if (currentHash !== `#${targetHash}`) {
        // 약간의 지연을 두어 이전 해시 이벤트 처리가 완료되도록 함
        setTimeout(() => {
          window.location.hash = targetHash;

          // about이나 works에서 홈으로 돌아갈 경우 페이지 리로드
          if ((currentHash.toLowerCase() === '#about' || currentHash.toLowerCase() === '#works') && targetHash === '') {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }

          setIsClicked(false);
        }, 100);
      } else {
        // 같은 해시를 다시 클릭한 경우 (토글 동작)
        history.pushState(null, '', window.location.pathname);
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        if (currentHash.toLowerCase() === '#about' || currentHash.toLowerCase() === '#works') {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }

        setIsClicked(false);
      }
    },
    [href, isClicked]
  );

  // 페이지 이동 시 클릭 상태 초기화
  useEffect(() => {
    const resetClickState = () => setIsClicked(false);
    window.addEventListener('popstate', resetClickState);
    return () => window.removeEventListener('popstate', resetClickState);
  }, []);

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive ? 'active' : ''}`}
      style={isClicked ? { pointerEvents: 'none', opacity: 0.7 } : {}}
    >
      {children}
    </a>
  );
};
