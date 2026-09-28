# 개발자 웹 이력서 개발 로드맵

## 1. 프로젝트 개요

### 목표
채용 담당자와 동료 개발자에게 나를 효과적으로 소개할 수 있는 **반응형 단일 페이지(SPA 형태의 정적 페이지) 웹 이력서**를 개발하고 배포한다.

### 기술 스택
| 구분 | 기술 | 비고 |
| --- | --- | --- |
| 마크업 | HTML5 | 시맨틱 태그 사용 |
| 스타일 | CSS3, TailwindCSS v4 | Tailwind CLI로 빌드 (별도 번들러 미사용) |
| 동작 | JavaScript (Vanilla, ES6+) | 프레임워크 없이 구현 |
| 배포 | GitHub Pages / Netlify / Vercel | 정적 호스팅 |

### 개발 원칙
- **모바일 퍼스트**: 작은 화면부터 설계하고 `sm` → `md` → `lg` 순으로 확장한다.
- **시맨틱 & 접근성**: 의미 있는 태그와 ARIA 속성을 사용한다.
- **콘텐츠와 코드 분리**: 이력서 데이터는 수정하기 쉽도록 분리 가능한 구조로 작성한다.
- **가볍게 유지**: 외부 라이브러리 없이 Tailwind CSS와 순수 JS만 사용한다.

---

## 2. 이력서 콘텐츠 구성 (일반 항목)

| 섹션 | 포함 내용 |
| --- | --- |
| **Hero / 프로필** | 이름, 직무(예: 프론트엔드 개발자), 한 줄 소개, 프로필 사진, CTA 버튼(연락하기, 이력서 PDF 다운로드) |
| **About** | 자기소개, 개발 철학, 핵심 역량 요약 |
| **Skills** | 카테고리별 기술 스택 (Frontend / Backend / Tools), 배지 또는 숙련도 표시 |
| **Experience** | 회사명, 근무 기간, 직책, 담당 업무 및 주요 성과 (타임라인 형태) |
| **Projects** | 프로젝트 카드 (설명, 사용 기술 태그, GitHub / 데모 링크) |
| **Education & Certifications** | 학력, 자격증, 교육 이수 내역 |
| **SNS** | GitHub, YouTube, Instagram, LinkedIn, 기술 블로그, X 링크 카드 (아이콘은 인라인 SVG 스프라이트) |
| **Contact** | 이메일, GitHub, LinkedIn, 블로그 링크 |
| **Footer** | 저작권 표기, 맨 위로 이동 링크 |

> 모든 내용은 실제 정보로 교체하기 전까지 **샘플(더미) 데이터**로 작성한다.

---

## 3. 디렉터리 구조

```
resume/
├── index.html            # 메인 페이지
├── package.json          # Tailwind CLI 및 스크립트 정의
├── .gitignore
├── src/
│   └── input.css         # Tailwind 진입점 (@import "tailwindcss")
├── dist/
│   └── output.css        # 빌드 결과물
├── js/
│   ├── main.js           # 인터랙션 (다크모드, 메뉴, 스크롤 등)
│   └── data.js           # (선택) 이력서 데이터 분리
└── assets/
    ├── images/           # 프로필, 프로젝트 이미지, 파비콘
    └── resume.pdf        # 다운로드용 이력서
```

---

## 4. 단계별 로드맵

### Phase 0. 개발 환경 설정
- [x] 프로젝트 폴더 생성 및 `git init`
- [x] `npm init -y` 실행
- [x] TailwindCSS 설치: `npm install tailwindcss @tailwindcss/cli`
- [x] `src/input.css`에 `@import "tailwindcss";` 작성
- [x] `package.json`에 빌드/워치 스크립트 추가
  - `"dev": "tailwindcss -i ./src/input.css -o ./dist/output.css --watch"`
  - `"build": "tailwindcss -i ./src/input.css -o ./dist/output.css --minify"`
- [x] `.gitignore` 작성 (`node_modules/` 등)
- [x] VS Code / Cursor Live Server 등 로컬 미리보기 환경 준비 — `python3 -m http.server`로 대체

### Phase 1. HTML 마크업
- [x] `index.html` 기본 골격 작성 (`<!DOCTYPE html>`, `lang="ko"`, viewport 메타 태그)
- [x] `dist/output.css` 및 `js/main.js` 연결
- [x] 시맨틱 구조 작성: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- [x] 섹션별 샘플 콘텐츠 작성 (Hero, About, Skills, Experience, Projects, Education, Contact)
- [x] 내부 앵커 링크(`#about`, `#skills` 등) 및 네비게이션 연결
- [x] 이미지 `alt` 속성 및 외부 링크 `rel="noopener noreferrer"` 적용

### Phase 2. Tailwind 스타일링
- [x] `@theme`로 브랜드 색상, 폰트(예: Pretendard) 등 디자인 토큰 정의
- [x] 공통 레이아웃 설정 (`max-w-*`, `mx-auto`, 섹션 간격)
- [x] 고정 상단 네비게이션 바 스타일링
- [x] Hero 섹션: 중앙 정렬, 프로필 이미지, CTA 버튼
- [x] Skills 섹션: 카테고리별 배지/그리드 레이아웃
- [x] Experience 섹션: 세로 타임라인 UI
- [x] Projects 섹션: 카드 그리드 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), hover 효과
- [x] 반응형 점검 (모바일 / 태블릿 / 데스크톱) — 모바일(388px)·데스크톱(1800px) 확인, 태블릿은 미확인
- [x] 다크모드용 `dark:` 스타일 적용

### Phase 3. JavaScript 인터랙션
- [x] **다크모드 토글**: 시스템 설정 감지 + `localStorage` 저장
- [x] **모바일 햄버거 메뉴**: 열기/닫기, 링크 클릭 시 자동 닫힘
- [x] **스무스 스크롤** 및 **현재 섹션 네비게이션 하이라이트** (`IntersectionObserver`)
- [x] **스크롤 등장 애니메이션** (fade-in / slide-up)
- [x] **맨 위로 이동 버튼**: 스크롤 위치에 따라 표시
- [x] (선택) 프로젝트 카테고리 필터
- [ ] (선택) `data.js`의 이력서 데이터를 읽어 DOM 동적 렌더링 — 미진행 (콘텐츠는 `index.html`에 직접 작성하기로 결정)

### Phase 4. 품질 개선
- [x] **접근성**: 색상 대비, 키보드 포커스 표시, ARIA 레이블, 스킵 링크 — 색상 대비 수치 측정은 미실시
- [x] **SEO**: `title`, `description`, Open Graph / Twitter 카드 메타 태그, 파비콘 (OG 이미지는 미포함)
- [x] **성능**: CSS minify — 이미지는 SVG 플레이스홀더 1개뿐이라 WebP 변환·`loading="lazy"`는 미적용 (실제 사진 교체 시 적용)
- [x] **인쇄 스타일**: Tailwind `print:` variant로 A4 출력 최적화 — 스타일 작성만 완료, 인쇄 미리보기는 미확인
- [ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox, Edge) — Chrome만 확인, 나머지 브라우저는 직접 확인 필요
- [ ] 이력서 PDF 파일 준비 및 다운로드 링크 연결 — 연결만 완료, `assets/resume.pdf` 파일은 직접 준비 필요

### Phase 5. 배포
- [ ] GitHub 저장소 생성 및 push
- [ ] GitHub Pages(또는 Netlify / Vercel) 배포 설정
- [ ] 배포 URL 접속 및 모든 링크 동작 확인
- [ ] Lighthouse 점검 (Performance / Accessibility / Best Practices / SEO)
- [ ] (선택) 커스텀 도메인 연결 및 HTTPS 확인

---

## 5. 마일스톤 (예시 일정)

| 주차 | 목표 | 산출물 |
| --- | --- | --- |
| 1주차 | Phase 0 ~ 1 | 개발 환경, HTML 마크업 완료 |
| 2주차 | Phase 2 ~ 3 | 스타일링 및 JS 인터랙션 완료 |
| 3주차 | Phase 4 ~ 5 | 품질 개선, 배포 완료 |

---

## 6. 완료 기준 (Definition of Done)

- [ ] 모바일(360px) ~ 데스크톱(1440px)에서 레이아웃이 깨지지 않는다.
- [ ] 다크모드 / 라이트모드 전환이 정상 동작하고 설정이 유지된다.
- [ ] 모든 내부/외부 링크가 정상 동작한다.
- [ ] Lighthouse 4개 항목 모두 90점 이상이다.
- [ ] 이력서 PDF 다운로드 및 인쇄가 정상 동작한다.
- [ ] 공개 URL로 배포되어 있다.

---

## 7. 향후 확장 아이디어

- 한국어 / 영어 다국어 전환 토글
- 블로그 또는 노션 글 연동 (최신 글 목록 표시)
- 방문자 통계 (Google Analytics 등) 및 문의 폼 연동
- 스크롤 진행률 표시, 타이핑 효과 등 추가 애니메이션
