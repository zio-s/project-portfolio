'use client';
import { gsap } from 'gsap';
import { useEffect } from 'react';

export default function HeroAnimation() {
  useEffect(() => {
    gsap.fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
    gsap.fromTo('.hero-buttons', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, delay: 1 });
  }, []);

  return null;
}
