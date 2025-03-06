export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  client: string;
  desc?: string;
  image: string[];

  colors: ProjectColors;

  // 프로젝트 링크 정보
  links: ProjectLinks;

  // 추가 세부 정보
  techStack?: string[];
  responsibilities?: string[];
  keyFeatures?: ProjectFeature[];
  challenges?: ProjectChallenge[];
  period?: string;
  teamSize?: number;
  role?: string;
  type?: 'Team Project' | 'Personal Project';
}

// 프로젝트 카드 Props 인터페이스
export interface ProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean;
}

export interface ProjectColors {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
}

export interface ProjectLinks {
  live?: string;
  details?: string;
  github?: string;
  presentation?: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  image?: string;
  type?: 'image' | 'video';
}

export interface ProjectChallenge {
  title: string;
  description: string;
  solution: string;
}

export interface ProjectColorsProps {
  colors: Project;
}

export interface ProjectDescriptionProps {
  project: Project;
  isActive: boolean;
  closeProjectDetail: () => void;
}
export interface IAboutProps {
  project?: Project;
  isActive: boolean;
  closeOverlay: () => void;
}

export interface techStackIcons {
  HTML: string;
  CSS: string;
  JavaScript: string;
  React: string;
  SASS: string;
  Node: string;
  Python: string;
  Lenis: string;
  GSAP?: string;
  'FullPage.js'?: string;
  Gnubord?: string;
  Swiper?: string;
  [key: string]: string | undefined;
}

export type LenisInstance = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      lock?: boolean;
      duration?: number;
    }
  ) => void;
  stop: () => void;
  start: () => void;
  destroy: () => void;
  options: {
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
    lerp?: number;
    duration?: number;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal';
    smoothWheel?: boolean;
    smoothTouch?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
  };
};
