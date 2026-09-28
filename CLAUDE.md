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

- **Tailwind v4 설정은 CSS에만 있음**: `tailwind.config` 없이 `src/input.css`의 `@theme`(디자인 토큰)과 `@layer components`(`.btn`, `.card`, `.card-hover`, `.badge`, `.icon-tile`, `.icon-btn`, `.glass`, `.section-head`, `.eyebrow`, `.nav-link`, `.filter-btn`, `.text-gradient`, `.dot-grid`, `.reveal` 등)로 관리합니다. 간격은 섹션 `py-20 sm:py-24`, 섹션 헤더→본문 `mb-12`, 그리드 `gap-6`, 카드 `rounded-2xl`로 통일했으니 새 요소도 이 값을 따릅니다. 포인트 색은 보라 `brand-*`, 다크 표면색은 `night-950`(배경)·`night-900`(교차 섹션 `.section-alt`)·`night-850`(카드)입니다. 클래스는 `index.html`과 `js/main.js`를 자동 스캔해 생성합니다.
- **다크모드는 세 곳이 함께 동작**: `<head>`의 인라인 스크립트(렌더링 전에 `html.dark` 적용, FOUC 방지) + `input.css`의 `@custom-variant dark` + `main.js`의 토글(`localStorage` 키 `theme`). 한 곳만 바꾸면 깨집니다. **다크가 기본**이라 인라인 스크립트는 저장값이 `light`가 아니면 `dark`를 붙입니다(시스템 설정은 따르지 않음). `@custom-variant dark`는 `@media not print`로 감싸 인쇄 때는 dark 스타일이 꺼지고 라이트로 출력됩니다.
- **한글 줄바꿈**: `body`에 `break-keep`(`word-break: keep-all`)을 적용해 단어 단위로 줄바꿈합니다. 긴 영문 URL·코드를 넣어 넘칠 때만 해당 요소에 `break-all`/`break-words`를 씁니다.
- **`.js` 클래스 게이트**: 같은 인라인 스크립트가 `html`에 `js` 클래스를 붙이고, `.reveal` 숨김 스타일은 `.js .reveal`에만 적용됩니다. JS가 꺼져 있으면 콘텐츠가 그대로 보이게 하기 위함입니다.
- **네비게이션은 `href`와 섹션 `id`로 연결**: `main.js`가 `#nav-menu`의 앵커 `href`로 섹션을 찾아 `IntersectionObserver`로 `aria-current="true"`를 부여하고, 스타일은 `input.css`의 `.nav-link[aria-current]`가 담당합니다. 섹션을 추가하면 `id`와 메뉴 링크를 함께 추가합니다.
- **모바일 메뉴는 클래스 토글**: `main.js`가 `#nav-menu`의 `hidden`/`flex`를 바꾸므로, HTML의 `lg:flex` 등 반응형 클래스와 짝이 맞아야 합니다. 메뉴가 8개라 가로 메뉴 기준은 `lg`(1024px)이고, 현재 섹션 점(`::after`)도 `lg` 이상에서만 보입니다.
- **표시/숨김은 `hidden` 속성 사용**: 프로젝트 필터(`data-category`)와 맨 위로 버튼이 `hidden` 속성을 토글하며, Tailwind preflight의 `[hidden]`이 `display`보다 우선하므로 `flex` 등과 충돌하지 않습니다.
- **SNS·UI 아이콘은 SVG 스프라이트**: `index.html` 상단의 `<symbol id="icon-*">`를 Hero, SNS 카드, 푸터 등이 `<use href="#icon-*">`로 재사용합니다. 플랫폼을 추가하려면 symbol, Hero SNS 아이콘, SNS 카드, 푸터 아이콘을 모두 추가합니다. UI 선 아이콘은 `fill`/`stroke`를 `<symbol>`에 지정해 자식이 상속합니다.
- **인쇄 스타일**: `input.css`의 `@media print`와 마크업의 `print:hidden`을 함께 사용합니다. 장식(글로우, 점 패턴, 떠 있는 카드)은 `print:hidden`, 큰 그림자는 `print:shadow-none`(PDF에서 사각형으로 찍힘)으로 끄고, 배경이 빠지면 안 보이는 `.text-gradient`·`.cta-card`는 `@media print`에서 단색으로 되돌립니다.
- **요약본 PDF는 별도 페이지에서 생성**: `summary.html`은 Tailwind(`dist/output.css`)를 쓰지 않는 독립 A4 1장 페이지(인라인 CSS)입니다. `output.css`의 `@media print`가 배경을 흰색으로 강제해 검정 디자인과 충돌하기 때문이며, `input.css`의 `@source not`으로 스캔에서도 제외합니다. `index.html`의 내용을 바꾸면 `summary.html`도 맞춘 뒤 `npm run pdf`(headless Chrome, macOS 경로)로 `assets/resume.pdf`를 다시 만들어 함께 커밋합니다. 시트가 `overflow: hidden`이라 내용이 넘쳐도 1쪽으로 나오므로, 수정 후 하단이 잘리지 않았는지 확인합니다.
- **샘플 데이터**: 이름, URL(`example`), 연락처는 모두 더미입니다. `assets/resume.pdf`는 더미 내용으로 만든 요약본입니다.

## todo/ 아키텍처 (빌드 없는 React + htm + localStorage)

- **실행**: 빌드도 npm도 없습니다. VS Code Live Server로 `todo/index.html`을 열면 됩니다. (`http://127.0.0.1:5500/todo/index.html`) 라이브러리를 CDN에서 불러오므로 인터넷 연결이 필요합니다. 검증 도구가 없으므로 브라우저에서 직접 확인합니다.
- **로딩 방식**: `index.html`의 import map이 `react`, `react-dom/client`, `htm`을 esm.sh에 연결하고(버전 고정), Tailwind v4는 `@tailwindcss/browser`가 런타임에 만듭니다. Tailwind 설정(`@custom-variant dark`, `@theme`, `@layer base`)은 `index.html`의 `<style type="text/tailwindcss">`에 있습니다. 다크모드 FOUC 방지 인라인 스크립트, `useTheme`(localStorage 키 `theme`), `@custom-variant dark`는 함께 동작하므로 한 곳만 바꾸지 마세요.
- **JSX가 없습니다**: 컴포넌트는 `src/lib/html.js`의 `html` 태그 템플릿으로 씁니다. 컴포넌트는 `<${Comp} prop=${x} />`, 닫는 태그는 `<//>`, 속성은 `className`/`htmlFor`(HTML의 `class`가 아님), 전개는 `...${obj}`, 조건부는 `${cond && html`...`}`입니다.
- **상대 import에는 `.js` 확장자를 붙입니다**: 확장자 생략은 Vite만 해 주던 동작이라 브라우저에서는 404가 납니다. import 경로는 `./`·`../` 상대 경로만 쓰고, 파일을 옮기면 경로를 함께 고칩니다.
- **구조**: `src/api/`(저장소 래퍼, `client.js`가 유일한 저장소 접근점) → `src/hooks/`(`useTodos`, `useCategories`, `useTheme`) → `src/components/`. 컴포넌트에서 `localStorage`를 직접 읽고 쓰지 않습니다. 필터·정렬·날짜 계산은 `src/utils/`의 순수 함수입니다.
- **데이터는 localStorage**: 키 `todo-app:db`에 `{ todos, categories }`를 JSON으로 저장하고, 없으면 `src/data/seed.js`의 예시 데이터로 시작합니다. `client.js`의 `list`/`insert`/`update`/`remove`는 Promise를 반환하고 실패 시 Error를 던지므로 훅은 서버 API처럼 다룹니다. 초기화는 이 키를 지우고 새로고침합니다. 나중에 백엔드로 바꾸면 `client.js`만 교체합니다.
- **낙관적 업데이트**: `useTodos`의 수정·삭제는 화면을 먼저 바꾸고 실패하면 이전 값으로 되돌립니다. 추가는 저장소가 id(`crypto.randomUUID()`)를 만들어야 하므로 응답 후 반영합니다.
- **카테고리 삭제**: 저장소는 연쇄 처리를 하지 않으므로 `unassignCategory`로 소속 할 일을 `categoryId: null`로 바꾼 뒤(모두 성공해야) 카테고리를 삭제합니다.
- **리렌더링 최적화 규칙**: `TodoItem`, `TodoForm`, `CategorySidebar`, `FilterBar`, `TodoList`는 `memo`이므로 props를 매 렌더 새로 만들면 효과가 사라집니다. `App`에서 내려주는 콜백은 `useCallback`(현재 filters가 필요하면 함수형 `setState`)으로, 개수·태그 같은 파생 객체는 `useContentMemo`로 identity를 유지하고, `useTodos`/`useCategories`의 액션은 최신 목록을 `todosRef`로 읽어 `todos`에 의존하지 않게 합니다. 새 props를 인라인 화살표 함수나 새 객체로 넘기지 마세요. (검색 1글자 입력은 FilterBar·TodoList만, 완료 토글은 해당 TodoItem·TodoList만 다시 그려야 정상)
- **사이드바는 좁은 화면에서 접이식**: `App.js`의 `sidebarOpen` 상태로 `lg` 미만에서만 토글하고, `lg` 이상에서는 항상 표시합니다(`hidden lg:block`).
- **텍스트 색은 대비 4.5:1 이상으로**: 보조 텍스트는 라이트 `text-slate-600`(이상), 다크 `dark:text-slate-400`을 씁니다. `text-slate-400`/`500` 단독 사용은 기준 미달이었습니다.
- **Tailwind 클래스는 전체 문자열로 작성**: `utils/colors.js`처럼 클래스 이름을 동적으로 조합하지 않습니다. 브라우저 빌드는 DOM에 나타난 클래스를 읽으므로 동작은 하지만, 전체 문자열로 써야 검색·리팩터링이 안전합니다.
- **날짜는 `YYYY-MM-DD` 문자열**: `toISOString()`은 UTC라 자정 무렵 하루가 어긋나므로 `utils/date.js`의 `todayString()`(로컬 기준)을 씁니다.

## 작업 시 주의사항

- **계획서는 `.claude/plans/`에 저장하고, 파일명은 대상 폴더명으로 짓습니다.** (예: `.claude/plans/resume.md`, `.claude/plans/todo.md`) 저장 위치는 `.claude/settings.local.json`의 `plansDirectory`로 지정되어 있으며, 각 폴더 안에 `plan/` 폴더를 따로 만들지 않습니다. `roadmap.md`는 폴더 루트에 그대로 둡니다.
- `resume/`에서 HTML/JS에 새 Tailwind 클래스를 추가하면 `npm run build`로 `dist/output.css`를 다시 생성해 함께 커밋합니다.
- `resume/index.html`은 한 파일 안에서 `<!-- ==================== Hero ==================== -->` … `<!-- ==================== // Hero ==================== -->`처럼 시작/끝 주석으로 블록(Header, Hero, About 등)을 구분합니다. 새 섹션을 추가할 때도 같은 형식을 따릅니다.
- `.claude/settings.local.json`(로컬 권한 설정)은 커밋하지 않습니다.
- 진행 현황은 각 폴더의 `roadmap.md`에 체크박스로 관리하며, 확인하지 못한 항목은 완료로 표시하지 않고 메모를 남깁니다.
