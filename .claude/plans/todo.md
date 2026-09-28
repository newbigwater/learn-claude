# Todo 앱 개발 계획 문서 작성 (todo/roadmap.md)

## Context
다음 학습 과제로 Todo 앱을 만든다. 이번 요청의 산출물은 **계획 문서만**이며 구현은 이후 별도 요청 시 진행한다. `resume/roadmap.md`와 같은 형식으로 `todo/roadmap.md`를 작성하고 루트 README 폴더 목록에 추가한다.

사용자 요구사항:
- 플랫폼: 브라우저 기반 웹
- Front-end: **React**
- Back-end: **JSON** → `json-server`로 `db.json` 파일을 REST API로 제공 (별도 서버 코드·DB 없이 실제 CRUD 요청 흐름 학습 가능)
- 기능: 기본 CRUD, 카테고리/태그, 우선순위/마감일

## 작업 내용 (실행 시)
1. `todo/` 폴더 생성, `todo/roadmap.md` 작성 (아래 목차)
2. 루트 `README.md` 폴더 목록 표에 `todo/` 한 줄 추가 (`CLAUDE.md` 규칙)
3. 커밋·푸시는 사용자 요청 시 진행

## todo/roadmap.md 목차 (resume/roadmap.md 형식 재사용)

### 1. 프로젝트 개요
- 목표: 카테고리·태그·우선순위·마감일로 할 일을 관리하는 React SPA
- 기술 스택 표
  | 구분 | 기술 |
  | --- | --- |
  | 빌드 | Vite |
  | 프론트엔드 | React 19 (JavaScript, 함수형 컴포넌트 + Hooks) |
  | 스타일 | TailwindCSS v4 (`@tailwindcss/vite`) — resume과 동일 계열 |
  | 백엔드(Mock API) | json-server + `db.json` |
  | 동시 실행 | `concurrently` (Vite + json-server) |
- 개발 원칙: 컴포넌트 단일 책임, API 호출은 `src/api/`로 분리, 상태는 커스텀 훅으로 관리, 접근성(라벨·키보드) 준수

### 2. 기능 명세
| 기능 | 내용 |
| --- | --- |
| CRUD | 할 일 추가 / 목록 / 수정(인라인 또는 모달) / 삭제, 완료 토글 |
| 카테고리 | 할 일당 1개 (예: 업무, 개인, 학습). 카테고리 CRUD, 사이드바 필터 |
| 태그 | 할 일당 여러 개. 입력 시 추가, 태그 클릭 필터 |
| 우선순위 | 높음/보통/낮음 3단계, 색상 배지 |
| 마감일 | 날짜 선택, 오늘/지연(overdue) 강조 표시 |
| 필터·정렬·검색 | 상태(전체/진행/완료), 카테고리, 태그, 우선순위 필터 · 마감일/우선순위/생성일 정렬 · 제목 검색 |

### 3. 데이터 모델 (`db.json`)
```json
{
  "todos": [
    { "id": "1", "title": "", "memo": "", "completed": false,
      "categoryId": "1", "tags": ["react"], "priority": "high",
      "dueDate": "2026-10-01", "createdAt": "", "updatedAt": "" }
  ],
  "categories": [ { "id": "1", "name": "업무", "color": "blue" } ]
}
```
- 태그는 별도 컬렉션 없이 todo의 문자열 배열로 관리 (목록은 todos에서 집계)

### 4. API 명세 (json-server)
| 메서드 | 경로 | 용도 |
| --- | --- | --- |
| GET | `/todos` | 목록 (필터·정렬은 클라이언트에서 처리) |
| POST | `/todos` | 생성 |
| PATCH | `/todos/:id` | 수정·완료 토글 |
| DELETE | `/todos/:id` | 삭제 |
| GET/POST/PATCH/DELETE | `/categories` | 카테고리 관리 |
- 카테고리 삭제 시 해당 todo의 `categoryId` 처리 방침(미분류로 변경) 명시

### 5. 디렉터리 구조
```
todo/
├── roadmap.md
├── package.json
├── vite.config.js
├── index.html
├── db.json
└── src/
    ├── main.jsx / App.jsx / index.css
    ├── api/          # todos.js, categories.js (fetch 래퍼)
    ├── hooks/        # useTodos.js, useCategories.js
    ├── components/   # TodoForm, TodoList, TodoItem, FilterBar, CategorySidebar, TagInput, PriorityBadge
    └── utils/        # 날짜 계산(오늘/지연), 필터·정렬 함수
```

### 6. 단계별 로드맵 (체크박스)
- **Phase 0. 환경 설정**: Vite React 템플릿 생성, Tailwind v4·json-server·concurrently 설치, `npm run dev`(프론트+API 동시 실행) 스크립트, `.gitignore`
- **Phase 1. 기본 CRUD**: `db.json` 초기 데이터, API 모듈, `useTodos` 훅, 추가/목록/수정/삭제/완료 토글, 로딩·에러 상태 처리
- **Phase 2. 카테고리 / 태그**: 카테고리 CRUD·사이드바 필터, 태그 입력·표시·필터
- **Phase 3. 우선순위 / 마감일**: 우선순위 선택·배지, 날짜 입력, 오늘/지연 강조, 정렬 옵션
- **Phase 4. 필터·검색·UI 완성**: 복합 필터, 검색, 반응형 레이아웃, 다크모드, 빈 상태 화면
- **Phase 5. 품질 개선**: 접근성(폼 라벨, 키보드 조작, 포커스), 낙관적 업데이트 또는 에러 롤백, 콘솔 에러 0
- (배포는 json-server가 로컬 전용이므로 범위 밖 — 향후 확장에 기록)

### 7. 마일스톤, 8. 완료 기준(DoD), 9. 향후 확장 아이디어
- DoD 예: 새로고침 후에도 데이터 유지(db.json 반영), 모든 CRUD 동작, 필터 조합 정상, 360~1440px 레이아웃 정상
- 확장: 실제 백엔드(Express/Supabase)로 교체, 드래그 앤 드롭 정렬, 알림, 배포

## 검증
- `todo/roadmap.md`가 위 목차와 사용자 요구사항(React, JSON 백엔드, CRUD·카테고리/태그·우선순위/마감일)을 모두 포함하는지 확인
- README 폴더 목록 링크(`./todo`)가 정상인지 `git status`/미리보기로 확인

---

## 2026-09-28 Live Server용 빌드 없는 구조로 재설계

### Context
`todo/`는 Vite(JSX 변환, `@tailwindcss/vite`)와 json-server(3001)가 있어야 동작해서, VS Code Live Server(`http://127.0.0.1:5500/todo/index.html`)로 열면 아무것도 뜨지 않습니다. 원인은 네 가지입니다. 브라우저가 `.jsx`를 실행하지 못하고, 절대 경로 `/src/main.jsx`가 404가 나고, CSS가 생성되지 않고, API 서버가 없습니다.
**빌드 없는 구조로 재작성하고 데이터는 localStorage로 교체**해서, Live Server로 `todo/index.html`만 열면 모든 기능이 동작하게 합니다. npm, Vite, 서버는 필요 없어집니다.

### 설계

#### 1. 런타임 로딩 (`todo/index.html`)
- **import map**으로 bare import를 CDN에 연결하고 버전은 고정합니다(구현 시 실제 최신 19.x, 3.x 확인).
  - `react` → `https://esm.sh/react@19.x.x`
  - `react-dom/client` → `https://esm.sh/react-dom@19.x.x/client?external=react` (React 인스턴스 중복 방지)
  - `htm` → `https://esm.sh/htm@3.x.x`
- **Tailwind v4 브라우저 빌드**: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4">`. `src/index.css`의 내용(`@custom-variant dark`, `@theme` 폰트, `@layer base`)은 `<style type="text/tailwindcss">`로 옮기고 `index.css`는 삭제합니다.
- 다크모드 FOUC 방지 인라인 스크립트는 그대로 둡니다.
- 진입점은 `<script type="module" src="./src/main.js">`. **상대 경로**여야 `/todo/` 하위 경로에서도 동작합니다.
- 선택: `<noscript>`와 CDN 로딩 실패 안내 문구.

#### 2. JSX → htm 변환
- 새 파일 `src/lib/html.js`: `import htm from "htm"; import { createElement } from "react"; export const html = htm.bind(createElement);`
- `.jsx`를 모두 `.js`로 바꿉니다(`main`, `App`, `components/*` 7개).
  - `<Comp a={x} />` → `<${Comp} a=${x} />`, 닫는 태그는 `<//>`
  - `{...handlers}` → `...${handlers}`, `{/* 주석 */}` → `<!-- 주석 -->`
  - 조건부/목록 렌더링은 `${cond && html`...`}` 형태
- **모든 상대 import에 `.js` 확장자**를 붙입니다(확장자 생략 해석은 Vite만 함). hooks/utils/api 파일도 해당됩니다.
- `main.js`의 `import "./index.css"`는 제거합니다.
- 컴포넌트 로직, `memo`, `useCallback`, `useContentMemo`, `todosRef`는 그대로 유지하고 문법만 바꿉니다.

#### 3. 데이터 계층: localStorage (`src/api/`)
- `src/api/client.js`를 localStorage 저장소로 바꿉니다.
  - 키 `todo-app:db`, 값 `{ todos, categories }`.
  - `loadDb()`: 값이 없으면 `src/data/seed.js`(기존 `db.json` 내용, `$schema` 제외)로 초기화. 파싱 실패 시 Error.
  - `saveDb(db)`: `setItem` 실패(용량 초과, 사생활 보호 모드) 시 Error.
  - `createId()`: `crypto.randomUUID()`, 없으면 `Date.now()` + 난수 (json-server처럼 문자열 id).
  - 공용 헬퍼 `list(name)`, `insert(name, data)`, `update(name, id, patch)`, `remove(name, id)`: 모두 **Promise 반환**, 없는 id면 에러.
- `src/api/todos.js`, `src/api/categories.js`는 함수 이름·시그니처를 유지하고 내부만 헬퍼로 바꿉니다(`createdAt`/`updatedAt` 로직 유지).
  → hooks와 컴포넌트는 영향을 받지 않고, 낙관적 업데이트·되돌리기·`unassignCategory`도 그대로 동작합니다.
- 오류 문구의 "API 서버(npm run api)" 안내는 저장소 기준으로 바꿉니다.
- "예시 데이터로 초기화" 버튼은 이번 범위에서 넣지 않고, 초기화 방법(localStorage 키 삭제)을 문서에 적습니다.

#### 4. 삭제할 파일
`vite.config.js`, `package.json`, `package-lock.json`, `db.json`, `src/index.css`, `todo/node_modules/`, `todo/dist/`(둘 다 gitignore 대상)

#### 5. 문서 갱신
- `CLAUDE.md` "todo/ 아키텍처": 실행(Live Server로 `todo/index.html`), 검증(빌드 없이 브라우저 확인), import map/htm/Tailwind 브라우저 빌드, `.js` 확장자 규칙, 데이터(localStorage 키 `todo-app:db`, 시드 `src/data/seed.js`)로 바꾸고 json-server·`vite.config`(`$schema`, `watch.ignored`) 항목은 삭제합니다. 리렌더링·대비·날짜 규칙은 유지합니다.
- `README.md` 폴더 표 설명: "React(CDN, htm) + Tailwind v4 브라우저 빌드 + localStorage".
- `todo/roadmap.md`: 기술 스택·데이터 모델을 갱신하고 재설계 항목을 체크박스로 추가합니다. 확인하지 못한 항목은 메모와 함께 미완료로 둡니다.

### 주요 파일
- 수정: `todo/index.html`, `todo/src/api/{client,todos,categories}.js`, `todo/src/hooks/*.js`(import 경로만)
- 변환(.jsx→.js): `todo/src/main.js`, `todo/src/App.js`, `todo/src/components/{CategorySidebar,FilterBar,PriorityBadge,TagInput,TodoForm,TodoItem,TodoList}.js`
- 신규: `todo/src/lib/html.js`, `todo/src/data/seed.js`

### 검증
1. 저장소 루트에서 `python3 -m http.server 5500`으로 Live Server와 같은 경로 구조를 만들고(Live Server는 VS Code 확장이라 직접 실행 불가), `http://127.0.0.1:5500/todo/index.html`을 열어 콘솔 에러(404, 모듈 해석 오류, React 중복 경고)가 없는지 확인합니다.
2. 첫 실행에서 시드 할 일 3개와 카테고리가 표시되는지 확인합니다.
3. 할 일 추가/수정/완료 토글/삭제, 카테고리 추가/이름 변경/삭제(소속 할 일이 미분류로 바뀌는지), 태그 필터, 검색, 정렬을 확인합니다.
4. 새로고침 후에도 데이터가 유지되는지(localStorage) 확인합니다.
5. 다크모드 토글, 새로고침 시 깜빡임 없음, 좁은 화면에서 사이드바 접힘, Tailwind 스타일 적용을 확인합니다.
6. 실제 Live Server로도 한 번 열어 봐 달라고 안내합니다.
