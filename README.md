# learn-claude

Claude Code를 학습하며 만든 결과물을 폴더 단위로 정리하는 저장소입니다.

## 폴더 목록

| 폴더 | 설명 |
| --- | --- |
| [`resume/`](./resume) | 개발자 웹 이력서 (HTML5 + TailwindCSS v4 + Vanilla JS 정적 페이지). 기술 스택 설명서 — [`doc/tech-stack.md`](./resume/doc/tech-stack.md) |
| [`todo/`](./todo) | Todo 앱 (React + htm + TailwindCSS v4, 빌드 없이 Live Server로 실행, localStorage 저장). 구현 완료 (재설계 후 일부 항목 재검증 필요) — [`roadmap.md`](./todo/roadmap.md), 기술 스택 설명서 — [`doc/tech-stack.md`](./todo/doc/tech-stack.md) |

> 새 프로젝트 폴더를 추가하면 위 표에 한 줄을 추가하고, 아래에 `## 폴더명/` 상세 섹션(스택·구조·실행)도 함께 작성합니다.

## resume/

개발 계획과 진행 현황은 [`resume/roadmap.md`](./resume/roadmap.md)를 참고하세요.

### 스택

HTML5 + TailwindCSS v4 (Tailwind CLI, 번들러 없음) + Vanilla JS

### 구조

```
resume/
├── index.html        # 모든 콘텐츠를 직접 작성 (Hero, About, Skills, Experience, Projects, Education, SNS, Contact)
├── src/input.css     # Tailwind 진입점 (디자인 토큰 @theme, 컴포넌트 클래스, 인쇄 스타일)
├── dist/output.css   # 빌드 결과물 (index.html이 참조하므로 커밋 대상)
├── summary.html      # A4 1장 요약본 (Tailwind 없이 인라인 CSS, PDF 생성 원본)
├── js/main.js        # 다크모드, 모바일 메뉴, 섹션 하이라이트, 스크롤 애니메이션, 프로젝트 필터
├── assets/images/    # 프로필, 파비콘 (SVG 플레이스홀더)
├── assets/resume.pdf # 요약본 PDF (npm run pdf로 생성, Hero 다운로드 버튼이 연결)
├── doc/tech-stack.md # 사용한 기술 스택 설명서 (HTML5, Tailwind v4, Vanilla JS, 인쇄/PDF 등)
└── roadmap.md        # 개발 로드맵 및 진행 현황
```

### 실행

`resume/` 폴더에서 실행합니다.

```bash
npm install                    # 최초 1회
npm run dev                    # Tailwind watch 빌드
npm run build                  # minify 빌드
npm run pdf                    # summary.html → assets/resume.pdf (macOS Chrome 필요)
python3 -m http.server 8000    # 미리보기 (http://localhost:8000)
```

## todo/

개발 계획과 진행 현황은 [`todo/roadmap.md`](./todo/roadmap.md)를 참고하세요.

### 스택

React 19 + htm(JSX 대체) + TailwindCSS v4 브라우저 빌드 + localStorage (빌드·npm 없음, CDN에서 라이브러리 로드)

### 구조

```
todo/
├── index.html          # 진입점 (import map, Tailwind 브라우저 빌드, 다크모드 초기화 스크립트)
├── src/
│   ├── main.js         # React 마운트
│   ├── App.js          # 상태 조립과 화면 구성
│   ├── api/            # localStorage 저장소 (client.js가 유일한 접근점) + 리소스별 API
│   ├── hooks/          # useTodos, useCategories, useTheme, useContentMemo
│   ├── components/     # TodoList, TodoItem, TodoForm, FilterBar, CategorySidebar 등
│   ├── utils/          # 필터·정렬·날짜 계산 순수 함수
│   ├── lib/html.js     # htm을 React에 연결한 html 태그 템플릿
│   └── data/seed.js    # 첫 실행 시 예시 데이터
├── doc/tech-stack.md   # 사용한 기술 스택 설명서 (React, htm, import map, 낙관적 업데이트 등)
└── roadmap.md          # 개발 로드맵 및 진행 현황
```

### 실행

빌드도 `npm install`도 필요 없습니다. 라이브러리를 CDN에서 불러오므로 인터넷 연결이 필요합니다.

- VS Code Live Server로 `todo/index.html`을 엽니다. (`http://127.0.0.1:5500/todo/index.html`)
- 데이터 초기화: 개발자 도구에서 localStorage의 `todo-app:db` 키를 지우고 새로고침합니다.
