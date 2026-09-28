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

## todo/ 아키텍처 (React + Vite + json-server)

- **구조**: `src/api/`(fetch 래퍼, `client.js`의 `API_URL`이 유일한 기본 URL) → `src/hooks/`(`useTodos`, `useCategories`, `useTheme`) → `src/components/`. 컴포넌트에서 `fetch`를 직접 호출하지 않습니다. 필터·정렬·날짜 계산은 `src/utils/`의 순수 함수입니다.
- **실행**: `todo/`에서 `npm run dev:all`(Vite 5173 + json-server 3001 동시 실행). API만 띄우려면 `npm run api`. 검증 도구가 없으므로 `npm run build` 통과와 브라우저 동작 확인으로 검증합니다.
- **json-server는 v1 베타**: `id`는 서버가 만드는 문자열이고, 쓸 때마다 `db.json`에 `$schema` 키를 추가합니다. 테스트로 `db.json`이 바뀌면 시드 데이터로 되돌리고 커밋합니다.
- **`vite.config.js`의 `server.watch.ignored: ["**/db.json"]`을 지우지 마세요**: 없으면 API가 `db.json`에 쓸 때마다 Vite가 페이지를 새로고침해 입력 중인 폼과 요청 흐름이 끊깁니다.
- **낙관적 업데이트**: `useTodos`의 수정·삭제는 화면을 먼저 바꾸고 실패하면 이전 값으로 되돌립니다. 추가는 서버가 id를 만들어야 하므로 응답 후 반영합니다.
- **카테고리 삭제**: json-server는 연쇄 처리를 하지 않으므로 `unassignCategory`로 소속 할 일을 `categoryId: null`로 바꾼 뒤(모두 성공해야) 카테고리를 삭제합니다.
- **사이드바는 좁은 화면에서 접이식**: `App.jsx`의 `sidebarOpen` 상태로 `lg` 미만에서만 토글하고, `lg` 이상에서는 항상 표시합니다(`hidden lg:block`).
- **텍스트 색은 대비 4.5:1 이상으로**: 보조 텍스트는 라이트 `text-slate-600`(이상), 다크 `dark:text-slate-400`을 씁니다. `text-slate-400`/`500` 단독 사용은 기준 미달이었습니다.
- **Tailwind 클래스는 전체 문자열로 작성**: `utils/colors.js`처럼 클래스 이름을 동적으로 조합하지 않습니다(스캔되지 않음).
- **날짜는 `YYYY-MM-DD` 문자열**: `toISOString()`은 UTC라 자정 무렵 하루가 어긋나므로 `utils/date.js`의 `todayString()`(로컬 기준)을 씁니다.

## 작업 시 주의사항

- **계획서는 `.claude/plans/`에 저장하고, 파일명은 대상 폴더명으로 짓습니다.** (예: `.claude/plans/resume.md`, `.claude/plans/todo.md`) 저장 위치는 `.claude/settings.local.json`의 `plansDirectory`로 지정되어 있으며, 각 폴더 안에 `plan/` 폴더를 따로 만들지 않습니다. `roadmap.md`는 폴더 루트에 그대로 둡니다.
- `resume/`에서 HTML/JS에 새 Tailwind 클래스를 추가하면 `npm run build`로 `dist/output.css`를 다시 생성해 함께 커밋합니다.
- `resume/index.html`은 한 파일 안에서 `<!-- ==================== Hero ==================== -->` … `<!-- ==================== // Hero ==================== -->`처럼 시작/끝 주석으로 블록(Header, Hero, About 등)을 구분합니다. 새 섹션을 추가할 때도 같은 형식을 따릅니다.
- `.claude/settings.local.json`(로컬 권한 설정)은 커밋하지 않습니다.
- 진행 현황은 각 폴더의 `roadmap.md`에 체크박스로 관리하며, 확인하지 못한 항목은 완료로 표시하지 않고 메모를 남깁니다.
