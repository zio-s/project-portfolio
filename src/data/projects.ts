import { Project } from '@/types/project';

export const projectsData: Project[] = [
  {
    id: 'genie-music',
    title: 'Genie Music',
    subtitle: 'Music Streaming Platform Redesign',
    description: '지니뮤직 웹 서비스의 UI/UX를 개선하고 새로운 기능을 추가하여 사용자 경험을 향상시킨 프로젝트',
    year: '2024',
    client: 'Personal Project',
    desc: '이 프로젝트는 기존 지니뮤직의 웹 서비스를 현대적인 디자인과 향상된 사용자 경험으로 재해석한 작업입니다. React와 Next.js를 활용하여 개발되었으며, 실시간 음원 차트, 개인화된 플레이리스트 추천, 소셜 음악 공유 기능 등을 새롭게 구현했습니다.\n\n특히 성능 최적화에 중점을 두어 이미지 레이지 로딩, 컴포넌트 코드 스플리팅, 서버 사이드 렌더링을 적용했으며, 이를 통해 초기 로딩 시간을 40% 단축했습니다. 또한 Framer Motion을 활용한 부드러운 애니메이션으로 사용자 인터랙션을 개선했습니다.',
    image: ['/images/common/placeholder.png', '/images/common/placeholder.png'],
    period: '2024.09.10 - 2024.09.21',
    colors: {
      color1: '#003161',
      color2: '#1A1A1A',
      color3: '#FFF4B7',
      color4: '#F5EDE5',
      color5: '#495057',
      color6: '#20C997',
      color7: '#845EF7',
      color8: '#FF922B',
      color9: '#ffffff',
    },
    links: {
      live: 'https://genie-music-redesign.vercel.app',
      details: '/projects/genie-music',
    },
  },
  {
    id: 'gamers-nest',
    title: 'Gamers-Nest',
    subtitle: 'Gaming Community Platform',
    description: '게이머들을 위한 소셜 커뮤니티 플랫폼으로, 게임 리뷰, 팁 공유, 팀 매칭 기능을 제공하는 웹 서비스',
    year: '2024',
    client: 'Team Project',
    desc: 'Gamers-Nest는 게이머들이 자유롭게 소통하고 정보를 공유할 수 있는 커뮤니티 플랫폼입니다. Socket.io를 활용한 실시간 채팅, WebRTC 기반의 음성 채팅, 게임 매칭 시스템 등을 구현했습니다.\n\n프로젝트의 백엔드는 Node.js와 Express를 사용했으며, MongoDB를 데이터베이스로 활용했습니다. 프론트엔드는 React와 TypeScript를 기반으로 개발되었으며, 상태 관리를 위해 Redux Toolkit을 사용했습니다.\n\n특히 SEO 최적화와 웹 접근성 개선에 주력하여 Lighthouse 성능 점수 95점을 달성했습니다.',
    image: ['/images/common/placeholder.png', '/images/common/placeholder.png'],
    colors: {
      color1: '#3B1E54',
      color2: '#1A1A1A',
      color3: '#FF8383',
      color4: '#E89C5A',
      color5: '##e57a7a',
      color6: '#fff',
      color7: '#e57a7a',
      color8: '#263c4f',
      color9: '#ffffff',
    },
    links: {
      live: 'https://gamers-nest.vercel.app',
      details: '/projects/gamers-nest',
    },
  },
  {
    id: 'portfolio-2024',
    title: 'Portfolio 2024',
    subtitle: 'Creative Developer Portfolio',
    description: '인터랙티브한 애니메이션과 세련된 디자인이 특징인 개발자 포트폴리오 웹사이트',
    year: '2024',
    client: 'Personal Project',
    desc: '이 포트폴리오는 GSAP와 Framer Motion을 활용하여 부드러운 페이지 전환과 스크롤 기반 애니메이션을 구현했습니다. Next.js 13의 App Router를 도입하여 라우팅과 페이지 전환을 최적화했으며, Tailwind CSS를 사용하여 반응형 디자인을 구현했습니다.\n\n특히 WebGL을 활용한 3D 요소와 커스텀 셰이더로 독특한 시각적 효과를 만들어냈으며, 성능 최적화를 통해 모바일 환경에서도 60fps의 부드러운 애니메이션을 구현했습니다.',
    image: ['/images/common/placeholder.png', '/images/common/placeholder.png'],
    colors: {
      color1: '#181C14',
      color2: '#1A1A1A',
      color3: '#EEDF7A',
      color4: '#fff',
      color5: '#FFE4E1',
      color6: '#FFA07A',
      color7: '#FF69B4',
      color8: '#FFB6C1',
      color9: '#ffffff',
    },
    links: {
      live: 'https://portfolio-2024.vercel.app',
      details: '/projects/portfolio-2024',
    },
  },
];
