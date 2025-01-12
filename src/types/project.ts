// types/project.ts

// 기본 프로젝트 정보 인터페이스
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  client: string;
  desc?: string;
  image: string[];

  // 프로젝트에 사용된 색상 정보
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

// 색상 정보 인터페이스
export interface ProjectColors {
  color1: string; // 주 배경색
  color2: string; // 주 텍스트색
  color3: string; // 강조색
  color4: string; // 보조색 1
  color5: string; // 보조색 2
  color6: string; // 보조색 3
  color7: string; // 보조색 4
  color8: string; // 보조색 5
  color9: string; // 보조색 6
}

// 링크 정보 인터페이스
export interface ProjectLinks {
  live?: string; // 라이브 데모 링크
  details?: string; // 상세 정보 페이지 링크
  github?: string; // 깃허브 레포지토리 링크
  presentation?: string; // 프로젝트 발표자료 링크
}

// 프로젝트 주요 기능 인터페이스
export interface ProjectFeature {
  title: string;
  description: string;
  image?: string;
  type?: 'image' | 'video';
}

// 프로젝트 기술적 도전과제 인터페이스
export interface ProjectChallenge {
  title: string;
  description: string;
  solution: string;
}

// 전체 프로젝트 데이터의 색상 정보 Props
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
  GSAP?: string;
  'FullPage.js'?: string;
  Gnubord?: string;
  Swiper?: string;
  [key: string]: string | undefined; // 추가 기술 스택을 위한 인덱스 시그니처
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
