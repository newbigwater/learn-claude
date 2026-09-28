# 개발자 웹 이력서 roadmap.md 작성 계획

## Context
저장소(`/Users/nbe/git/claude-code-mastery`)는 비어 있습니다. 사용자는 HTML/CSS/JavaScript/TailwindCSS로 개발자 웹 이력서를 만들기 위한 단계별 개발 로드맵 문서(`roadmap.md`)를 원합니다. 이력서 내용은 특정 인물이 아닌 일반적인(샘플) 개발자 이력서 항목으로 구성합니다. 이번 작업의 산출물은 `roadmap.md` 한 파일이며, 실제 코드는 작성하지 않습니다.

## 산출물
- 생성 파일: `/Users/nbe/git/claude-code-mastery/roadmap.md` (한국어, CLAUDE.md 규칙 준수)

## roadmap.md 구성안

1. **프로젝트 개요** — 목표(반응형 단일 페이지 웹 이력서), 기술 스택(HTML5, CSS3, Vanilla JS, TailwindCSS v4 CLI), 빌드 도구 없이 Tailwind CLI만 사용하는 방침
2. **이력서 콘텐츠 구성(일반 항목)**
   - Hero/프로필: 이름, 직무(프론트엔드 개발자), 한 줄 소개, 프로필 사진, CTA(연락하기/PDF 다운로드)
   - About: 자기소개, 핵심 역량 요약
   - Skills: 언어/프레임워크/도구 카테고리별 배지·숙련도
   - Experience: 회사·기간·역할·주요 성과 타임라인
   - Projects: 카드형(설명, 기술 태그, GitHub/데모 링크)
   - Education & Certifications
   - Contact: 이메일, GitHub, LinkedIn, 블로그
   - Footer
3. **디렉터리 구조**
   ```
   index.html
   src/input.css        # Tailwind 진입점 (@import "tailwindcss")
   dist/output.css      # 빌드 결과
   js/main.js           # 다크모드, 스크롤, 메뉴 등 인터랙션
   js/data.js           # (선택) 이력서 데이터 분리
   assets/images/, assets/resume.pdf
   package.json
   ```
4. **단계별 로드맵 (체크리스트 형식 `- [ ]`)**
   - Phase 0. 환경 설정: `npm init`, `tailwindcss @tailwindcss/cli` 설치, 빌드/워치 스크립트, `.gitignore`, git 초기화
   - Phase 1. 마크업: 시맨틱 HTML 골격(header/nav/main/section/footer), 섹션별 콘텐츠 더미 작성, 메타 태그
   - Phase 2. 스타일링: Tailwind 테마(색상·폰트 커스텀 `@theme`), 모바일 퍼스트 반응형(sm/md/lg), 섹션별 레이아웃(타임라인, 카드 그리드)
   - Phase 3. 인터랙션(JS): 다크모드 토글(localStorage 저장), 모바일 햄버거 메뉴, 스무스 스크롤 + 현재 섹션 네비 하이라이트(IntersectionObserver), 스크롤 등장 애니메이션, 맨 위로 버튼, (선택) data.js 기반 동적 렌더링
   - Phase 4. 품질 개선: 접근성(alt, aria, 키보드 포커스, 대비), SEO/OG 태그·파비콘, 성능(이미지 최적화, lazy loading, CSS minify), 인쇄용 스타일(`print:` variant)
   - Phase 5. 배포: GitHub Pages 또는 Netlify/Vercel, 커스텀 도메인(선택), Lighthouse 점검
5. **마일스톤/일정 예시** — 주차별(약 2~3주) 표
6. **완료 기준(Definition of Done)** — 모바일/데스크톱 반응형, Lighthouse 90+ , 다크모드 동작, 모든 링크 동작
7. **향후 확장 아이디어** — 다국어(한/영) 토글, 블로그 연동, 방문자 통계

## 검증
- 파일 생성 후 Read로 내용 확인: 섹션 누락 없음, 한국어 작성, 체크리스트 마크다운 문법 정상
- 작성 후 CLAUDE.md의 "프로젝트 현황"은 이번 범위 밖이므로 수정하지 않음
