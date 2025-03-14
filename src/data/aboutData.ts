import { SectionData } from '@/types/about';

export const aboutData: SectionData[] = [
  {
    id: 'intro',
    title: 'Design + Code = Magic',
    type: 'intro',
    content: {
      description: '인터랙티브한 웹 경험을 만들어내는 것을 즐기는 주니어 프론트엔드 개발자입니다.',
    },
  },
  {
    id: 'skills',
    title: 'Skills & Expertise',
    type: 'skills',
    content: {
      skills: [
        {
          title: 'Frontend Development',
          items: [
            'HTML5 / CSS3',
            'JavaScript / TypeScript',
            'React / Next.js',
            'Redux-Toolkit',
            'Tailwind CSS',
            'Styled Components',
            'RESTful API',
          ],
        },
        {
          title: 'UI Development',
          items: ['Responsive Design', 'Tailwind CSS', 'Styled Components', 'UI 라이브러리 활용', 'CSS 애니메이션'],
        },
        {
          title: 'Development Tools',
          items: [
            'Git / GitHub',
            'VS Code',
            'npm / yarn',
            'Webpack / Vite',
            'Chrome DevTools',
            'Figma',
            'Confluence',
            'Notion',
            'Slack',
          ],
        },
        {
          title: 'Soft Skills',
          items: ['협업 능력', '문제 해결 능력', '코드 리뷰', '기술 문서화', '새로운 기술 습득 능력'],
        },
      ],
    },
  },
  {
    id: 'education',
    title: 'Education & Journey',
    type: 'education',
    backgroundColor: '#263c4f',
    textColor: '#fff0db',
    content: {
      education: [
        {
          title: 'Frontend Development Course',
          subtitle: '이젠아카데미 프론트엔드 개발자 양성과정',
          items: [
            '6개월 집중 교육과정 수료',
            '실무 중심의 프로젝트 수행',
            '최신 웹 기술 스택 학습',
            '팀 프로젝트 경험',
          ],
        },
        {
          title: 'Frontend Development Course',
          subtitle: '그린아카데미 UI/UX 피그마 웹 퍼블리셔 & 반응형 실무 양성과정',
          items: ['6개월 집중 교육과정 수료', '실무 중심의 프로젝트 수행', '최신 웹 기술 스택 학습'],
        },
        {
          title: 'Self Development',
          items: [
            '개인 프로젝트를 통한 실전 경험 축적',
            '온라인 강의 및 기술 문서를 통한 지속적인 학습',
            'GitHub를 통한 코드 관리 및 포트폴리오 구축',
          ],
        },
      ],
    },
  },
  {
    id: 'values',
    title: 'Personal Values',
    type: 'values',
    content: {
      values: [
        {
          emoji: '🎯',
          title: 'Problem Solving',
          description: '문제 해결을 위한 논리적 사고와 창의적 접근을 추구합니다.',
        },
        {
          emoji: '💡',
          title: 'Continuous Learning',
          description: '새로운 기술 습득과 자기계발에 열정을 가지고 있습니다.',
        },
        {
          emoji: '🤝',
          title: 'Collaboration',
          description: '팀워크를 통한 시너지 창출을 중요하게 생각합니다.',
        },
      ],
    },
  },
  {
    id: 'contact',
    title: "Let's Connect",
    type: 'contact',
  },
];
