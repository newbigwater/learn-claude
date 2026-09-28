# Todo 앱 개발 로드맵

## 1. 프로젝트 개요

### 목표
카테고리·태그·우선순위·마감일로 할 일을 관리하는 **브라우저 기반 Todo 웹 앱(React SPA)**을 개발한다. **빌드 도구와 서버 없이 VS Code Live Server로 `index.html`만 열면 동작**하도록 구성한다. 데이터는 브라우저 `localStorage`에 저장하고, 저장소 접근은 Promise 기반 `src/api/` 계층으로 분리해 실제 CRUD 요청 흐름(비동기 호출 → 상태 갱신, 낙관적 업데이트)을 그대로 학습한다. (초기에는 Vite + json-server 구조였으나 Live Server에서 실행되지 않아 재설계했다. → Phase 6)

### 기술 스택
| 구분 | 기술 | 비고 |
| --- | --- | --- |
| 빌드 | 없음 | 브라우저 ES 모듈 + import map으로 CDN(esm.sh)에서 React·htm 로드 |
| 프론트엔드 | React 19 (JavaScript) | 함수형 컴포넌트 + Hooks, JSX 대신 `htm` 태그 템플릿(`src/lib/html.js`) |
| 스타일 | TailwindCSS v4 | `@tailwindcss/browser` (런타임 생성), 설정은 `index.html`의 `<style type="text/tailwindcss">` |
| 저장소 | `localStorage` | 키 `todo-app:db`, 첫 실행 시 `src/data/seed.js`의 예시 데이터로 시작 |
| 실행 | VS Code Live Server | `http://127.0.0.1:5500/todo/index.html` (npm 불필요, 인터넷 연결 필요) |

### 개발 원칙
- **컴포넌트 단일 책임**: 화면 조각별로 컴포넌트를 나눈다.
- **저장소 접근 분리**: `localStorage` 접근은 `src/api/`에만 둔다.
- **상태는 커스텀 훅으로 관리**: 컴포넌트는 표시에 집중하고 데이터 로직은 `hooks/`에 둔다.
- **접근성**: 폼 라벨, 키보드 조작, 포커스 표시를 지킨다.

---

## 2. 기능 명세

| 기능 | 내용 |
| --- | --- |
| **CRUD** | 할 일 추가 / 목록 / 수정(인라인 또는 모달) / 삭제, 완료 토글 |
| **카테고리** | 할 일당 1개 (예: 업무, 개인, 학습). 카테고리 추가·수정·삭제, 사이드바에서 필터 |
| **태그** | 할 일당 여러 개. 입력해서 추가하고, 태그를 클릭하면 해당 태그로 필터 |
| **우선순위** | 높음 / 보통 / 낮음 3단계, 색상 배지로 표시 |
| **마감일** | 날짜 선택, 오늘 마감·기한 지남(overdue) 강조 표시 |
| **필터 · 정렬 · 검색** | 상태(전체/진행/완료), 카테고리, 태그, 우선순위 필터 · 마감일/우선순위/생성일 정렬 · 제목 검색 |

---

## 3. 데이터 모델 (`localStorage`의 `todo-app:db`)

```json
{
  "todos": [
    {
      "id": "1",
      "title": "React 공부하기",
      "memo": "",
      "completed": false,
      "categoryId": "1",
      "tags": ["react", "학습"],
      "priority": "high",
      "dueDate": "2026-10-01",
      "createdAt": "2026-09-28T09:00:00.000Z",
      "updatedAt": "2026-09-28T09:00:00.000Z"
    }
  ],
  "categories": [
    { "id": "1", "name": "학습", "color": "blue" }
  ]
}
```

- `priority`는 `high` / `medium` / `low` 중 하나다.
- `dueDate`는 `YYYY-MM-DD` 문자열이며 없으면 `null`이다.
- 태그는 별도 컬렉션 없이 각 할 일의 문자열 배열로 관리하고, 태그 목록은 `todos`에서 집계한다.
- `id`는 저장소(`src/api/client.js`)가 `crypto.randomUUID()`로 만드는 문자열이다. (시드 데이터는 `"1"`, `"2"`, `"3"`)
- 초기화하려면 개발자 도구에서 `localStorage`의 `todo-app:db` 항목을 지우고 새로고침한다.

---

## 4. 저장소 API 명세 (`src/api/client.js`)

모든 함수는 Promise를 반환하고, 실패하면 Error를 던진다. (기존 REST 호출과 같은 방식이라 훅은 그대로 동작한다)

| 함수 | 용도 |
| --- | --- |
| `list(name)` | 컬렉션(`todos` / `categories`) 조회 (필터·정렬·검색은 클라이언트에서 처리) |
| `insert(name, data)` | 생성 (id 부여) |
| `update(name, id, patch)` | 수정, 완료 토글 |
| `remove(name, id)` | 삭제 |

- `src/api/todos.js`, `src/api/categories.js`가 위 함수를 감싸 `fetchTodos`, `createTodo`, `patchTodo`, `deleteTodo` 등을 제공한다.
- 카테고리를 삭제하면 해당 카테고리의 할 일은 **미분류(`categoryId: null`)**로 변경한다. (저장소는 연쇄 처리를 하지 않으므로 `unassignCategory`가 먼저 각 할 일을 수정한다)
- 없는 id를 수정·삭제하면 오류, 저장소를 쓸 수 없거나(`setItem` 실패) 저장된 JSON이 손상되면 안내 문구가 담긴 오류를 던진다.

---

## 5. 디렉터리 구조

```
todo/
├── roadmap.md
├── index.html               # import map, Tailwind 브라우저 빌드, 테마 설정
└── src/
    ├── main.js
    ├── App.js
    ├── lib/html.js          # htm.bind(createElement) — JSX 대체
    ├── data/seed.js         # 첫 실행 예시 데이터
    ├── api/                 # client.js(localStorage 저장소), todos.js, categories.js
    ├── hooks/               # useTodos, useCategories, useTheme, useContentMemo
    ├── components/          # TodoForm, TodoList, TodoItem, FilterBar,
    │                        # CategorySidebar, TagInput, PriorityBadge
    └── utils/               # 날짜 계산(오늘/지연), 필터·정렬·색상
```

---

## 6. 단계별 로드맵

### Phase 0. 개발 환경 설정 (초기 Vite + json-server 구성 — Phase 6에서 제거됨)
- [x] `todo/`에 Vite React 프로젝트 생성 (`npm create vite@latest`) — 대화형 생성기 대신 파일을 직접 구성
- [x] TailwindCSS v4 설치: `npm install tailwindcss @tailwindcss/vite`, `vite.config.js`에 플러그인 등록, `src/index.css`에 `@import "tailwindcss";`
- [x] json-server, concurrently 설치: `npm install -D json-server concurrently` — json-server v1 베타(`1.0.0-beta.15`): `id`는 서버가 만드는 문자열, 쓸 때마다 `db.json`에 `$schema` 키 추가
- [x] `db.json` 초기 파일 작성
- [x] `package.json` 스크립트 추가
  - `"api": "json-server db.json --port 3001"`
  - `"dev:all": "concurrently \"vite\" \"npm run api\""`
- [x] `.gitignore` 작성 (`node_modules/`, `dist/` 등)
- [x] `npm run dev:all`로 프론트엔드와 API가 함께 뜨는지 확인 (`/todos` 응답 확인) — `vite.config.js`에서 `db.json`을 감시 제외해야 저장할 때 페이지가 새로고침되지 않음

### Phase 1. 기본 CRUD
- [x] `src/api/todos.js`: 목록 / 생성 / 수정 / 삭제 함수 (응답 오류 처리 포함)
- [x] `useTodos` 훅: 목록 상태, 로딩·에러 상태, 추가·수정·삭제·완료 토글 — 수정·삭제는 낙관적 업데이트 + 실패 시 롤백, 액션 함수는 `useCallback`으로 identity 유지
- [x] `TodoForm`: 제목 입력 후 추가 (빈 값 방지)
- [x] `TodoList` / `TodoItem`: 목록 표시, 완료 체크박스, 삭제 버튼
- [x] 수정 기능 (인라인 편집 또는 모달) — 인라인 편집(TodoForm 재사용)
- [x] 로딩 / 에러 / 빈 목록 화면 처리
- [x] 새로고침 후에도 데이터가 유지되는지 확인 (`db.json` 반영 → Phase 6 이후 `localStorage`)

### Phase 2. 카테고리 / 태그
- [x] `src/api/categories.js`, `useCategories` 훅
- [x] `CategorySidebar`: 카테고리 목록, 추가·수정·삭제, 클릭 시 필터 — 추가·이름 변경·삭제(2단계 확인) 동작 확인
- [x] 할 일 폼에 카테고리 선택 추가, 목록에 카테고리 표시
- [x] 카테고리 삭제 시 해당 할 일을 미분류로 변경
- [x] `TagInput`: Enter로 태그 추가, 삭제, 중복 방지 — Enter 추가는 확인, 태그 삭제·중복 방지는 직접 확인하지 못함
- [x] 태그 배지 표시 및 클릭 시 태그 필터

### Phase 3. 우선순위 / 마감일
- [x] 우선순위 선택(높음/보통/낮음)과 `PriorityBadge` 색상 표시
- [x] 마감일 날짜 입력 (`<input type="date">`)
- [x] `utils/`에 오늘 마감 / 기한 지남 판별 함수 작성 (날짜 비교 시 시간대 주의) — 로컬 날짜 기준(`utils/date.js`)
- [x] 마감 임박·지남 항목 강조 스타일
- [x] 정렬 옵션: 마감일순 / 우선순위순 / 생성일순

### Phase 4. 필터 · 검색 · UI 완성
- [x] `FilterBar`: 상태(전체/진행/완료), 우선순위 필터
- [x] 제목 검색
- [x] 필터 조합(카테고리 + 태그 + 상태 + 우선순위 + 검색) 동작 — 5개 조건 동시 적용, 결과 없음, 필터 초기화까지 확인
- [x] 반응형 레이아웃 (모바일에서는 사이드바를 접거나 상단으로 이동) — 360px에서는 카테고리·태그를 접이식으로 표시(가로 넘침 없음), 1200px에서는 2단 레이아웃
- [x] 다크모드 (`dark:` 스타일) — 토글, 저장, 새로고침 후 유지 확인
- [x] 필터 결과가 없을 때의 빈 상태 화면 — 안내 문구 표시 확인

### Phase 5. 품질 개선
- [x] **접근성**: 폼 `label`, 버튼 `aria-label`, 키보드 조작, 포커스 표시 — 이름 없는 컨트롤 0개, 텍스트 색 대비(라이트·다크 56개 요소) 통과, 포커스 표시 확인. 실제 Tab 키 이동과 스크린 리더 낭독은 미확인
- [x] **에러 처리**: API 실패 시 사용자 안내, 낙관적 업데이트를 쓴다면 실패 시 롤백 — API 중단 시 롤백·오류 알림, 목록 조회 실패 시 재시도 화면 확인
- [x] 불필요한 리렌더링·중복 요청 점검 — 동작별 렌더링 횟수를 측정해 개선: 검색 1글자 입력 시 FilterBar·TodoList만, 완료 토글 시 해당 TodoItem·TodoList만, 사이드바 접기/펼치기는 자식 0회 (개선 전에는 화면 전체가 다시 그려짐). `memo` + 콜백 `useCallback` + 파생 데이터 `useContentMemo`로 해결. 초기 요청은 프로덕션에서 1회씩(개발 모드 2회는 `StrictMode`)
- [x] 브라우저 콘솔 에러·경고 없음 확인 — 초기 로딩과 주요 조작에서 확인
- [x] `npm run build` 결과 확인 — Phase 6 재설계로 빌드 단계 자체가 사라졌다.

### Phase 6. Live Server 실행을 위한 재설계 (빌드 없는 구조)
배경: `index.html`이 `/src/main.jsx`를 직접 가리켜 Live Server(`http://127.0.0.1:5500/todo/index.html`)에서 `.jsx`를 실행하지 못했고, 절대 경로가 404가 나며, Tailwind CSS도 생성되지 않고 json-server(3001)도 없었다.
- [x] `index.html`에 import map(`react@19.3.0`, `react-dom@19.3.0/client`, `htm@3.1.1`)과 Tailwind 브라우저 빌드(`@tailwindcss/browser@4.3.3`) 추가, `index.css` 내용을 `<style type="text/tailwindcss">`로 이전
- [x] JSX 파일 전부를 `htm` 태그 템플릿(`src/lib/html.js`)을 쓰는 `.js`로 변환, 모든 상대 import에 `.js` 확장자 추가 (`memo`·`useCallback`·`useContentMemo`·`todosRef` 로직은 그대로)
- [x] `src/api/client.js`를 `localStorage` 저장소로 교체하고 `todos.js`·`categories.js`는 함수 시그니처 유지 → 훅·컴포넌트는 수정 없음
- [x] `db.json` 내용을 `src/data/seed.js`로 이전, `vite.config.js`·`package.json`·`db.json`·`index.css` 삭제
- [x] 확인(Live Server, Chrome): 콘솔 에러·경고 없음, 첫 실행 시드 3건 표시, 추가·완료 토글·수정·삭제, 카테고리 추가·이름 변경·삭제(소속 할 일 미분류 전환), 검색·태그·상태 필터, 마감일순·우선순위순 정렬, 새로고침 후 데이터 유지, 다크모드 토글·저장, 빈 제목 오류 메시지, 손상된 저장소 데이터 오류 화면
- [x] 좁은 화면 확인: 390px 폭 iframe에서 사이드바 접이식 동작, 가로 스크롤 없음 (실제 창 크기 조절은 되지 않아 iframe으로 대체)
- [ ] 재설계 후 리렌더링 횟수와 색 대비 재측정 — 컴포넌트 로직은 동일하지만 측정은 하지 않음
- [ ] 태그 삭제·중복 방지, 실제 Tab 키 이동 확인 — 이번에도 직접 확인하지 못함
- [ ] 오프라인 동작 — CDN(esm.sh, jsDelivr)에서 라이브러리를 불러오므로 인터넷 연결이 필요함. 필요하면 라이브러리를 `vendor/`로 내려받아 import map을 바꾸는 방식을 검토

---

## 7. 마일스톤 (예시 일정)

| 주차 | 목표 | 산출물 |
| --- | --- | --- |
| 1주차 | Phase 0 ~ 1 | 개발 환경, 기본 CRUD 완료 |
| 2주차 | Phase 2 ~ 3 | 카테고리·태그, 우선순위·마감일 완료 |
| 3주차 | Phase 4 ~ 5 | 필터·검색·UI 완성, 품질 개선 |

---

## 8. 완료 기준 (Definition of Done)

- [x] 할 일 추가 · 조회 · 수정 · 삭제 · 완료 토글이 모두 동작한다.
- [x] 새로고침 후에도 데이터가 유지된다 (`localStorage`에 반영).
- [x] 카테고리·태그·우선순위·마감일을 지정하고 표시할 수 있다.
- [x] 필터·정렬·검색을 조합해도 결과가 정확하다.
- [x] 모바일(360px) ~ 데스크톱(1440px)에서 레이아웃이 깨지지 않는다. — 360px, 1200px에서 확인 (1440px은 직접 확인하지 않음)
- [x] 브라우저 콘솔에 에러가 없다.

---

## 9. 향후 확장 아이디어

- 실제 백엔드로 교체 (Express + DB, 또는 Supabase 등) — `src/api/client.js`만 바꾸면 됨
- 드래그 앤 드롭으로 순서 변경
- 반복 일정, 알림 기능
- 캘린더 보기
- 정적 호스팅(GitHub Pages 등)에 그대로 배포 (빌드가 없으므로 폴더 업로드만으로 가능)
- 라이브러리를 로컬(`vendor/`)로 내려받아 오프라인 실행 지원
