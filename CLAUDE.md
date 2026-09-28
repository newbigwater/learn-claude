# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 프로젝트 현황

`resume/`에 개발자 웹 이력서(정적 페이지)가 있습니다. 개발 계획과 진행 현황은 `resume/roadmap.md`를 참고하세요. (`resume/`는 별도 git 저장소이며, 루트는 git 저장소가 아닙니다.)

### resume/ 구조 및 명령어

- 스택: HTML5 + TailwindCSS v4 (Tailwind CLI, 번들러 없음) + Vanilla JS
- `index.html` — 모든 콘텐츠를 직접 작성 (`data.js` 없음). 섹션: Hero, About, Skills, Experience, Projects, Education, SNS, Contact
- `src/input.css` — Tailwind 진입점 (디자인 토큰 `@theme`, 컴포넌트 클래스, 인쇄 스타일)
- `dist/output.css` — 빌드 결과물 (`index.html`이 참조하므로 커밋 대상)
- `js/main.js` — 다크모드, 모바일 메뉴, 섹션 하이라이트, 스크롤 애니메이션, 프로젝트 필터
- 명령어 (`resume/`에서 실행): `npm run dev` (watch 빌드), `npm run build` (minify 빌드), 미리보기는 `python3 -m http.server`
- HTML/JS에서 새 Tailwind 클래스를 추가하면 `npm run build`로 `dist/output.css`를 다시 생성해야 합니다.
