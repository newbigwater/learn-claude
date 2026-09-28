# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)

## 프로젝트 현황

저장소 루트(`claude-code-mastery/`)가 git 저장소이며, 학습 결과를 폴더 단위로 추가합니다. 폴더 목록, 구조, 실행 명령어는 README.md를 참고하세요. 새 폴더를 추가하면 README.md의 폴더 목록도 함께 갱신합니다.

@README.md

## resume/ 아키텍처 (여러 파일이 맞물리는 규칙)

린터와 테스트는 없습니다. 검증은 `npm run build` 후 로컬 서버로 브라우저에서 직접 확인합니다.

- **Tailwind v4 설정은 CSS에만 있음**: `tailwind.config` 없이 `src/input.css`의 `@theme`(디자인 토큰)과 `@layer components`(`.btn`, `.card`, `.badge`, `.nav-link`, `.filter-btn`, `.reveal`)로 관리합니다. 클래스는 `index.html`과 `js/main.js`를 자동 스캔해 생성합니다.
- **다크모드는 세 곳이 함께 동작**: `<head>`의 인라인 스크립트(렌더링 전에 `html.dark` 적용, FOUC 방지) + `input.css`의 `@custom-variant dark` + `main.js`의 토글(`localStorage` 키 `theme`). 한 곳만 바꾸면 깨집니다.
- **`.js` 클래스 게이트**: 같은 인라인 스크립트가 `html`에 `js` 클래스를 붙이고, `.reveal` 숨김 스타일은 `.js .reveal`에만 적용됩니다. JS가 꺼져 있으면 콘텐츠가 그대로 보이게 하기 위함입니다.
- **네비게이션은 `href`와 섹션 `id`로 연결**: `main.js`가 `#nav-menu`의 앵커 `href`로 섹션을 찾아 `IntersectionObserver`로 `aria-current="true"`를 부여하고, 스타일은 `input.css`의 `.nav-link[aria-current]`가 담당합니다. 섹션을 추가하면 `id`와 메뉴 링크를 함께 추가합니다.
- **모바일 메뉴는 클래스 토글**: `main.js`가 `#nav-menu`의 `hidden`/`flex`를 바꾸므로, HTML의 `md:flex` 등 반응형 클래스와 짝이 맞아야 합니다.
- **표시/숨김은 `hidden` 속성 사용**: 프로젝트 필터(`data-category`)와 맨 위로 버튼이 `hidden` 속성을 토글하며, Tailwind preflight의 `[hidden]`이 `display`보다 우선하므로 `flex` 등과 충돌하지 않습니다.
- **SNS 아이콘은 SVG 스프라이트**: `index.html` 상단의 `<symbol id="icon-*">`를 SNS 카드와 푸터가 `<use href="#icon-*">`로 재사용합니다. 플랫폼을 추가하려면 symbol, SNS 카드, 푸터 아이콘을 모두 추가합니다.
- **인쇄 스타일**: `input.css`의 `@media print`와 마크업의 `print:hidden`을 함께 사용합니다.
- **샘플 데이터**: 이름, URL(`example`), 연락처는 모두 더미입니다. Hero의 `assets/resume.pdf` 링크는 파일이 아직 없습니다.

## 작업 시 주의사항

- `resume/`에서 HTML/JS에 새 Tailwind 클래스를 추가하면 `npm run build`로 `dist/output.css`를 다시 생성해 함께 커밋합니다.
- `resume/index.html`은 한 파일 안에서 `<!-- ==================== Hero ==================== -->` … `<!-- ==================== // Hero ==================== -->`처럼 시작/끝 주석으로 블록(Header, Hero, About 등)을 구분합니다. 새 섹션을 추가할 때도 같은 형식을 따릅니다.
- `.claude/settings.local.json`(로컬 권한 설정)은 커밋하지 않습니다.
- 진행 현황은 각 폴더의 `roadmap.md`에 체크박스로 관리하며, 확인하지 못한 항목은 완료로 표시하지 않고 메모를 남깁니다.
