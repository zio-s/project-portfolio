### 프로젝트 구조 기획

```plaintext
📁 PROJECT-PORTFOLIO
├── 📁 node_modules
├── 📁 public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── fonts/
│       └── font.ttf
├── 📁 src
│   ├── 📁 app
│   │   ├── layout.tsx
│   │   ├── globals.css     # 글로벌 CSS
│   │   ├── page.tsx        # 홈 페이지
│   │   ├── 📁 about        # About 페이지
│   │   │   └── page.tsx
│   │   ├── 📁 projects     # 프로젝트 목록 및 상세 페이지
│   │   │   ├── page.tsx    # 프로젝트 목록 페이지
│   │   │   └── [id]/       # 동적 라우팅: 프로젝트 상세 페이지
│   │   │       └── page.tsx
│   │   └── 📁 contact      # Contact 페이지
│   │       └── page.tsx
│   ├── 📁 components       # 재사용 가능한 컴포넌트
│   │   ├── Header.tsx      # 헤더 컴포넌트
│   │   ├── Footer.tsx      # 푸터 컴포넌트
│   │   ├── Navbar.tsx      # 네비게이션 바
│   │   └── Button.tsx      # 재사용 가능한 버튼
│   ├── 📁 animations       # 애니메이션 관리
│   │   ├── HeroAnimation.tsx # 홈 히어로 섹션 애니메이션
│   │   ├── ScrollEffects.tsx # 스크롤 애니메이션
│   │   └── Globe3D.tsx     # Three.js를 활용한 3D 지구본 (미정)
│   ├── 📁 hooks            # 커스텀 훅
│   │   └── useScroll.ts    # 스크롤 관련 훅
│   ├── 📁 styles           # Tailwind 확장 및 전역 스타일
│   │   ├── variables.css   # CSS 변수
│   │   └── mixins.css      # 공통 스타일 믹스인
│   └── 📁 utils            # 유틸리티 함수 모음
│       └── formatDate.ts   # 날짜 포맷 함수 등
├── favicon.ico             
├── .gitignore              
├── eslint.config.mjs       
├── next-env.d.ts           
├── next.config.ts         
├── package-lock.json       
├── package.json            
├── postcss.config.mjs     
├── README.md              
├── tailwind.config.ts     
└── tsconfig.json          
```
