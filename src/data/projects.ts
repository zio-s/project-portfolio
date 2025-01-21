import { Project } from '@/types/project';

export const projectsData: Project[] = [
  {
    id: 'genie-music',
    title: 'Genie Music',
    subtitle: 'Music Streaming Platform Redesign',
    description:
      '이 프로젝트는 기존 지니뮤직의 웹 서비스를 현대적인 디자인과 향상된 사용자 경험으로 재해석한 작업입니다.\n\nHTML, CSS, JavaScript를 활용하여 개발되었으며, 실시간 음원 차트와 아티스트 상세 정보 등 핵심 기능들을 새롭게 구현했습니다.\n\n특히 사용자 인터페이스 디자인에 중점을 두어 직관적인 네비게이션과 깔끔한 레이아웃으로 시각적 만족도를 높였습니다. GSAP 라이브러리를 활용하여 부드러운 페이지 전환과 요소 애니메이션을 구현함으로써 역동적이고 모던한 사용자 경험을 제공했습니다.\n\n또한, 반응형 웹 디자인을 적용하여 다양한 디바이스에서도 일관된 서비스 경험을 제공할 수 있도록 하였습니다. 웹 표준과 웹 접근성 지침을 준수하여 개발되었으며, 크로스 브라우징 호환성을 고려한 코드 작성으로 안정적인 서비스 구현에 주력하였습니다.',
    year: '2024',
    client: 'Personal Project',
    image: ['/images/pattern/genie-intro.png', '/images/pattern/genie-2.gif'],
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
      live: 'https://zio-s.github.io/project-genie/pages/',
      details: '/projects/genie-music',
      github: 'https://github.com/zio-s/project-genie',
    },
    responsibilities: [
      '웹 표준 준수와 접근성을 강화하여 다양한 사용자가 쉽게 접근할 수 있는 UI 설계 및 개발.',
      'SCSS 및 CSS 변수(CSS Custom Properties)를 활용하여 유지보수가 용이한 모듈형 스타일링 체계 구현.',
      'GSAP과 스크롤 이벤트를 활용하여 동적인 UI/UX 인터랙션 및 시각적 몰입감 제공.',
      '그누보드 연동을 통해 커스터마이징 가능한 게시판 기능 구현 및 사용자 데이터 관리 시스템 구축.',
      'Git과 GitHub를 활용한 버전 관리 및 협업 효율성 극대화.',
    ],
    techStack: ['HTML', 'Scss', 'JavaScript', 'GSAP', 'FullPage.js', 'Gnubord', 'Swiper'],

    keyFeatures: [
      {
        title: '이미지/파일 첨부 기능',
        description:
          '드래그 앤 드롭으로 간편한 파일 첨부가 가능하며, 이미지는 자동으로 최적화되어 저장됩니다. AWS S3를 활용한 안정적인 파일 저장 시스템을 구축했습니다.',
        image: '/images/pattern/genie-intro.png',
      },
      {
        title: 'gsap을 활용한 img data 속성/랜덤 웨이브 생성',
        description:
          'img의 src속성을 활용하여 배경이미지로 저장을 했습니다. 그리고 섹션 진입시 박스 웨이브를 랜덤으로 설정하여, 음악이 재생되는 분위기를 만들었습니다.',
        image: '/images/pattern/section2-ezgif.com-crop.gif',
      },
    ],
    challenges: [
      {
        title: 'GSAP과 FullPage.js 스크롤 이벤트 충돌 해결',
        description:
          'GSAP과 FullPage.js를 함께 사용하는 과정에서 스크롤 이벤트 충돌 문제가 발생했습니다. 두 라이브러리가 서로 다른 방식으로 DOM을 조작하고 스크롤 이벤트를 핸들링하면서, 애니메이션이 끊기거나 스크롤이 정상적으로 동작하지 않는 현상이 발생했습니다.',
        solution:
          'FullPage.js의 scrollOverflow 옵션을 활성화하고, GSAP 애니메이션의 타임라인을 FullPage.js의 afterLoad/onLeave 콜백과 동기화했습니다. 섹션의 높이를 동적으로 계산하여 스크롤 가능 영역을 조정했고, ScrollTrigger의 scroller 옵션을 FullPage.js의 wrapper element로 설정하여 두 라이브러리 간의 호환성을 확보했습니다.',
      },
      {
        title: 'GSAP 애니메이션 반응형 대응 구현',
        description:
          'GSAP의 .set() 메서드로 설정된 초기 위치값들이 윈도우 리사이즈 시 적절하게 업데이트되지 않아 반응형 레이아웃에서 애니메이션이 깨지는 현상이 발생했습니다. 특히 복잡한 시퀀스 애니메이션에서 위치 계산이 부정확해지는 문제가 있었습니다.',
        solution:
          '단순히 Resize가 되면 업데이트를 할 수 있을거라 생각 했지만, 이부분에 어려움을 겪어 새로고침을 하여 재생성 할수 있게 하였고, 애니메이션 타임라인을 재생성하기위해 여러 방면을 검색하다가 실패 하였습니다. 하지만 최근 Next.js에서 GSAP을 사용 하면서 ResizeObserver API라는 것을 접해 보았고, 리사이징을 모니터링하여, 디바운스 처리된 핸들러에서 애니메이션을 재계산을 하도록 구현을 할 수 있다는 것을 알고, 추후 적용 할 예정입니다.',
      },
    ],
  },
  {
    id: 'gamers-nest',
    title: 'Gamers-Nest',
    subtitle: 'Gaming Community Platform',
    description:
      'Gamers-Nest는 게이머들이 모여 커뮤니티를 형성하고 다양한 정보를 교류할 수 있는 플랫폼입니다. 플레이어는 팀 구성, 게임 리뷰, 멋진 게임 장면을 공유하며 활발히 소통할 수 있습니다.\n\nNext.js와 Tailwind CSS, Chakra-UI를 활용하여 개발되었으며, 팀원 모집 게시판, 게임 스크린샷 갤러리, 게임 리뷰 섹션 등 다양한 커뮤니티 기능을 구현했습니다. RAWG API를 활용하여 풍부한 게임 데이터베이스를 구축하고 상세한 게임 정보 페이지를 제공합니다.\n\n특히 사용자 경험을 고려한 세련된 페이지네이션 시스템을 구축하였고, Swiper.js를 활용하여 직관적인 이미지 슬라이더를 구현했습니다. 다크모드를 지원하여 사용자의 선호도에 맞는 인터페이스를 제공하며, 반응형 디자인을 적용하여 데스크톱과 모바일 환경에서 모두 최적화된 서비스를 제공합니다.\n\nVercel을 통해 배포되어 안정적인 서비스를 제공하고 있으며, 지속적인 업데이트를 통해 사용자들의 피드백을 반영하고 있습니다.',
    year: '2024',
    client: 'Personal Project',
    image: ['/images/pattern/gamer-next.png', '/images/pattern/gamer-next-2.png'],
    period: '2024.11.27 - 2024.12.12',
    colors: {
      color1: '#3B1E54',
      color2: '#1A1A1A',
      color3: '#FF8383',
      color4: '#F5EDE5',
      color5: '##e57a7a',
      color6: '#fff',
      color7: '#e57a7a',
      color8: '#263c4f',
      color9: '#ffffff',
    },
    links: {
      live: 'https://gamers-nest.vercel.app',
      details: '/projects/gamers-nest',
      github: 'https://github.com/zio-s/project-Gamer-s_Nest',
    },
    responsibilities: [
      'CSR 방식을 통해 사용자 상호작용에 빠르게 반응하는 웹 애플리케이션 구현.',
      '다양한 사용자가 쉽게 접근할 수 있는 UI 설계 및 개발.',
      'Tailwind CSS와 Chakra-UI를 사용하여 반응형 디자인 및 유연한 스타일 구현.',
      '클라이언트에서 동적으로 최신 게임 데이터를 가져와 화면에 렌더링.',
      'Vercel 플랫폼을 사용하여 신속한 빌드와 안정적인 배포 환경 구축.',
      'Git과 GitHub를 활용한 버전 관리 및 협업 효율성 극대화.',
    ],
    techStack: ['Next.js', 'JavaScript', 'Tailwind CSS', 'Emotion', 'Swiper', 'Vercel'],
    keyFeatures: [
      {
        title: '전체게임 검색',
        description: '다양한 게임 타이틀을 빠르고 효율적으로 검색할 수 있는 통합 검색 시스템을 제공합니다.',
        image: '/images/pattern/gamer-search.mp4',
        type: 'video',
      },
      {
        title: '커뮤니티 페이지',
        description: '유저들이 자유롭게 소통하고 정보를 공유할 수 있는 interactive한 커뮤니티 공간입니다.',
        image: '/images/pattern/gamer-community.mp4',
        type: 'video',
      },
      {
        title: '이미지 확대 기능',
        description: '게시글의 이미지를 클릭하여 상세하게 확대 확인할 수 있는 뷰어 기능을 제공합니다.',
        image: '/images/pattern/gamer-viewimg.mp4',
        type: 'video',
      },
      {
        title: '필터 기능',
        description: '게시판의 콘텐츠를 사용자가 원하는 조건으로 분류하고 정렬할 수 있는 필터링 시스템을 제공합니다.',
        image: '/images/pattern/gamer-filter.mp4',
      },
    ],
    challenges: [
      {
        title: 'RAWG API 데이터 처리와 성능 최적화',
        description:
          'RAWG API에서 대량의 게임 데이터를 가져올 때 성능 이슈가 발생했습니다. 특히 이미지가 많은 데이터를 처리하고 캐싱하는 과정에서 렌더링 지연과 메모리 사용량 증가 문제가 있었습니다.',
        solution:
          'API를 활용한 무한 스크롤을 구현했습니다. Next.js의 Image 컴포넌트를 도입하여 이미지 최적화와 지연 로딩을 구현했으며, 또한 페이지당 로드되는 데이터 양을 제한하고, 사용자의 컨텐츠위치 따라 점진적으로 데이터를 로드하는 방식을 적용하여 초기 로딩 시간과 메모리 사용량을 크게 개선했습니다.',
      },
      {
        title: 'Grid 레이아웃과 Swiper 통합 시 반응형 이슈',
        description:
          'Grid로 구성된 레이아웃에 Swiper를 통합하는 과정에서 반응형 디자인 이슈가 발생했습니다. 특히 화면 크기 변경 시 Grid와 Swiper의 레이아웃이 충돌하면서 컨텐츠 깨짐과 스와이프 동작 오류가 발생했습니다.',
        solution:
          'Swiper 컴포넌트의 부모 요소에 position: absolute를 적용하여 레이아웃 흐름에서 분리했습니다. 이를 통해 불필요한 가로 스크롤 발생을 방지하고, Grid 레이아웃과의 충돌을 해결했습니다. 추가로 CSS Grid의 auto-fit과 minmax 속성을 활용하여 반응형 그리드를 구현하고, Swiper의 breakpoints 옵션을 설정하여 다양한 화면 크기에서도 안정적으로 동작하도록 개선했습니다. 미디어 쿼리를 통해 모바일 환경에서는 Grid를 단일 컬럼으로 변경하여 사용성을 향상시켰습니다.',
      },
    ],
  },
  {
    id: 'portfolio-2024',
    title: 'Portfolio 2024',
    subtitle: 'Creative Developer Portfolio',
    description: '인터랙티브한 애니메이션과 세련된 디자인이 특징인 개발자 포트폴리오 웹사이트',
    year: '2024',
    client: 'Personal Project',
    desc: '이 포트폴리오는 GSAP와 Lines 활용하여 부드러운 페이지 전환과 스크롤 기반 애니메이션을 구현했습니다. Next.js 13의 App Router를 도입하여 라우팅과 페이지 전환을 최적화했으며, Tailwind CSS를 사용하여 반응형 디자인을 구현했습니다.\n\n특히 WebGL을 활용한 3D 요소와 커스텀 셰이더로 독특한 시각적 효과를 만들어냈으며, 성능 최적화를 통해 모바일 환경에서도 60fps의 부드러운 애니메이션을 구현했습니다.',
    image: ['/images/pattern/2024-1.png', '/images/pattern/2024-2.png'],
    period: '2024.12 - 2025.01 ~',
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
      live: 'https://project-portfolio-gules.vercel.app/',
      details: '/projects/portfolio-2024',
      github: 'https://github.com/zio-s/project-portfolio',
    },
    responsibilities: [
      '웹 표준 준수와 접근성을 강화하여 다양한 사용자가 쉽게 접근할 수 있는 UI 설계 및 개발.',
      'SCSS 및 CSS 변수(CSS Custom Properties)를 활용하여 유지보수가 용이한 모듈형 스타일링 체계 구현.',
      'GSAP과 스크롤 이벤트를 활용하여 동적인 UI/UX 인터랙션 및 시각적 몰입감 제공.',
      '그누보드 연동을 통해 커스터마이징 가능한 게시판 기능 구현 및 사용자 데이터 관리 시스템 구축.',
      'Git과 GitHub를 활용한 버전 관리 및 협업 효율성 극대화.',
    ],
    techStack: ['HTML', 'Scss', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'GSAP', 'Lenis'],

    keyFeatures: [
      {
        title: '인터랙티브한 애니메이션과 세련된 디자인',
        description:
          'GSAP와 Lenis 활용하여 페이지 전환 시 부드럽고 직관적인 애니메이션을 구현하였습니다. 또한, 스크롤 기반 인터랙션을 통해 사용자가 콘텐츠를 자연스럽게 탐색할 수 있도록 디자인하였습니다. 전체적인 색상 및 타이포그래피는 사용자 친화적인 경험을 제공하기 위해 세련되게 구성하였습니다.',
        image: '/images/pattern/b-intro.mp4',
      },
      {
        title: 'Next.js 13의 App Router를 도입하여 라우팅과 페이지 전환을 최적화',
        description:
          'Next.js 13의 App Router를 통해 서버 사이드 렌더링(SSR)과 클라이언트 사이드 렌더링(CSR)을 적절히 조합하여 빠르고 안정적인 라우팅 경험을 제공합니다. 사용자 요청 시 필요한 데이터만 로드되어 성능을 최적화하였습니다.',
        image: '/images/pattern/b-about.mp4',
      },
      {
        title: '반응형 디자인 적용',
        description:
          'SCSS와 Tailwind CSS를 사용하여 다양한 디바이스에서도 콘텐츠가 보기 좋게 표시되도록 반응형 디자인을 적용하였습니다. 모바일, 태블릿, 데스크톱 환경 모두에서 일관된 사용자 경험을 제공합니다.',
        image: '/images/pattern/b-mobile.mp4',
      },
    ],
    challenges: [
      {
        title: '카드의 초기 위치 설정 버그',
        description:
          '카드 애니메이션의 초기 상태가 잘못된 위치에서 시작하는 문제가 발생했습니다. 이는 애니메이션 초기화 시 CSS 트랜스폼 값이 제대로 적용이 되지 않는 문제 였습니다.',
        solution:
          '애니메이션 초기화 단계에서 CSS에서 `transform` 설정을 하지 않고, 애니메이션 시작 시 초기 위치를 GSAP으로 지정하기 위해 Intersection Observer와 GSAP의 `fromTo` 메서드를 활용하였습니다.',
      },
      {
        title: '리사이징 될 때 애니메이션의 위치값 못 잡는 버그',
        description:
          '브라우저 창 크기를 조정할 때 애니메이션 요소의 위치값이 제대로 갱신되지 않아, 애니메이션 동작이 부자연스러워졌습니다.',
        solution:
          '`resize` 이벤트 리스너를 추가하여 창 크기 변경 시 각 요소의 위치값을 재계산하도록 수정하였습니다. 특히, `getBoundingClientRect()`를 활용해 동적으로 요소의 위치값을 다시 계산하고, GSAP의 `invalidate()` 메서드를 사용해 애니메이션 상태를 초기화하였습니다. 하지만 GSAP을 숙련도가 낮아, 리사이징 완벽하게 해결되지 않았습니다.',
      },
      {
        title: '어바웃 페이지 라우팅 방식',
        description:
          '같은 섹션을 클릭했을 때 비정상적인 동작: 같은 해시를 클릭해도 정상적으로 URL이 초기화되거나, 새로운 이벤트가 트리거되지 않는 문제가 있었습니다. 특정 링크를 클릭했을 때, 해시 상태를 토글하거나 초기화할 수 있도록 구현해야 했습니다.',
        solution:
          'useCallback 훅을 사용하여 해시 라우팅 핸들러를 최적화하고, 중복 렌더링을 방지하였습니다. 다른 해시를 가리키는 경우, window.location.hash를 업데이트하여 해시를 변경합니다. 해시 변경 후 HashChangeEvent를 트리거하여 다른 이벤트 핸들러와 동기화되도록 설계하였습니다.',
      },
    ],
  },
];
