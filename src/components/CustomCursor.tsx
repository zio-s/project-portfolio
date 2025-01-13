import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Point {
  r: number;
  p: {
    x: number | null;
    y: number | null;
  };
  w: number;
  c: string;
  d: number;
  s: number;
  originalD: number;
  originalS: number;
}

interface MousePosition {
  x: number | null;
  y: number | null;
}

type CursorMode = 'default' | 'interactive';

const CustomCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<MousePosition>({ x: null, y: null });
  const pointsRef = useRef<Point[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const colorRef = useRef<string>('#263c4f');
  const cursorModeRef = useRef<CursorMode>('default');

  useEffect(() => {
    // 색상 변경을 감지하는 observer 설정
    const colorObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-color3') {
          const newColor = document.body.getAttribute('data-color3') || '#263c4f';
          colorRef.current = newColor;

          // 모든 포인트의 색상 업데이트
          pointsRef.current.forEach((point) => {
            point.c = newColor;
          });
        }
      });
    });

    colorObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-color3'],
    });

    const isPc = window.innerWidth > 768;
    if (!isPc) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mousePos.current = { x: canvas.width / 2, y: canvas.height / 2 };
    };
    setCanvasSize();

    const updateCursorMode = (): void => {
      const currentHash = window.location.hash;

      if (currentHash === '#about' || currentHash === '#contact') {
        // cursorModeRef.current = 'interactive';
        // const centerX = window.innerWidth / 2;
        // const centerY = window.innerHeight / 2;
        // gsap.to(mousePos.current, {
        //   x: centerX,
        //   y: centerY,
        //   duration: 2,
        //   ease: 'power2.out',
        // });
        // pointsRef.current.forEach((point) => {
        //   const randomAngle = Math.random() * 360;
        //   const randomDistance = 450 + Math.random() * 250;
        //   gsap.to(point, {
        //     r: randomAngle,
        //     d: randomDistance,
        //     duration: 1.5,
        //     ease: 'power2.out',
        //   });
        //   point.s = point.s * 0.1;
        // });
      } else {
        cursorModeRef.current = 'default';

        pointsRef.current.forEach((point) => {
          gsap.to(point, {
            d: point.originalD || 100,
            duration: 1,
            ease: 'power2.out',
          });
          point.s = point.originalS;
        });
      }
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!mousePos.current) return;

      if (cursorModeRef.current !== 'interactive') {
        gsap.to(mousePos.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    };

    const COUNT = 25;
    const SPEED_VARIATION = 5;
    const DISTANCE = 60;

    // 초기 색상 설정
    const initialColor = document.body.getAttribute('data-color3') || '#263c4f';
    colorRef.current = initialColor;

    for (let i = 0; i < COUNT; i++) {
      const distance = Math.random() * (DISTANCE + 5) - 5;
      const speed = Math.random() * (SPEED_VARIATION + 5) - 5;
      pointsRef.current.push({
        r: (360 / COUNT) * i,
        p: { x: null, y: null },
        w: Math.random() * 5,
        c: colorRef.current,
        d: distance,
        s: speed,
        originalD: distance,
        originalS: speed,
      });
    }

    const render = (): void => {
      if (!mousePos.current || mousePos.current.x === null || mousePos.current.y === null) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';

      pointsRef.current.forEach((p: Point) => {
        p.r += p.s;
        if (p.r >= 360) p.r = p.r - 360;

        const vel = {
          x: p.d * Math.cos((p.r * Math.PI) / 180),
          y: p.d * Math.sin((p.r * Math.PI) / 180),
        };

        const currentX = mousePos.current?.x;
        const currentY = mousePos.current?.y;

        if (p.p.x !== null && p.p.y !== null && currentX !== null && currentY !== null) {
          if (cursorModeRef.current === 'interactive') {
            const pulse = Math.sin(Date.now() * 0.005) * 1 + 10; // 1~5 사이로 점 크기가 변화

            ctx.strokeStyle = p.c;
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(p.p.x, p.p.y);
            ctx.lineTo(currentX + vel.x, currentY + vel.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(currentX + vel.x, currentY + vel.y, pulse, 0, Math.PI * 2);
            ctx.fillStyle = p.c;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.p.x, p.p.y, 1, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.strokeStyle = p.c;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.p.x, p.p.y);
            ctx.lineTo(currentX + vel.x, currentY + vel.y);
            ctx.stroke();
          }
        }

        if (currentX !== null && currentY !== null) {
          p.p.x = currentX + vel.x;
          p.p.y = currentY + vel.y;
        }
      });
    };

    const animate = (): void => {
      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    updateCursorMode();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('hashchange', updateCursorMode);
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('popstate', updateCursorMode);

    return () => {
      colorObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('hashchange', updateCursorMode);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('popstate', updateCursorMode);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='fixed top-0 left-0 w-full h-full pointer-events-none z-50 hidden md:block'
      style={{ background: 'transparent' }}
    />
  );
};

export default CustomCursor;
