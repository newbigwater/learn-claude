# Todo 앱 개발 로드맵

## 1. 프로젝트 개요

### 목표
카테고리·태그·우선순위·마감일로 할 일을 관리하는 **브라우저 기반 Todo 웹 앱(React SPA)**을 개발한다. 백엔드는 JSON 파일(`db.json`)을 REST API로 제공하는 방식으로 구성해, 실제 CRUD 요청 흐름(fetch → 상태 갱신)을 학습한다.

### 기술 스택
| 구분 | 기술 | 비고 |
| --- | --- | --- |
| 빌드 | Vite | React 템플릿 사용 |
| 프론트엔드 | React (JavaScript) | 함수형 컴포넌트 + Hooks |
| 스타일 | TailwindCSS v4 | `@tailwindcss/vite` 플러그인 사용 |
| 백엔드 (Mock API) | json-server + `db.json` | 별도 서버 코드·DB 없이 REST API 제공 |
| 동시 실행 | concurrently | Vite 개발 서버 + json-server를 한 번에 실행 |

### 개발 원칙
- **컴포넌트 단일 책임**: 화면 조각별로 컴포넌트를 나눈다.
- **API 호출 분리**: `fetch` 호출은 `src/api/`에만 둔다.
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

## 3. 데이터 모델 (`db.json`)

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
- json-server 버전에 따라 `id` 타입(숫자/문자열)이 다를 수 있으므로 설치 후 실제 동작을 확인하고 이 문서를 갱신한다.

---

## 4. API 명세 (json-server)

| 메서드 | 경로 | 용도 |
| --- | --- | --- |
| GET | `/todos` | 목록 조회 (필터·정렬·검색은 클라이언트에서 처리) |
| POST | `/todos` | 생성 |
| PATCH | `/todos/:id` | 수정, 완료 토글 |
| DELETE | `/todos/:id` | 삭제 |
| GET / POST / PATCH / DELETE | `/categories` | 카테고리 관리 |

- 카테고리를 삭제하면 해당 카테고리의 할 일은 **미분류(`categoryId: null`)**로 변경한다. (json-server는 연쇄 처리를 하지 않으므로 클라이언트에서 PATCH 요청으로 처리)
- 개발 포트: 프론트엔드 Vite 기본 포트, API는 `3001`로 분리한다. (`src/api/`의 기본 URL 한 곳에서 관리)

---

## 5. 디렉터리 구조

```
todo/
├── roadmap.md
├── package.json
├── vite.config.js
├── index.html
├── db.json                  # 데이터 저장소 (json-server)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css            # Tailwind 진입점 (@import "tailwindcss")
    ├── api/                 # todos.js, categories.js (fetch 래퍼)
    ├── hooks/               # useTodos.js, useCategories.js
    ├── components/          # TodoForm, TodoList, TodoItem, FilterBar,
    │                        # CategorySidebar, TagInput, PriorityBadge
    └── utils/               # 날짜 계산(오늘/지연), 필터·정렬 함수
```

---

## 6. 단계별 로드맵

### Phase 0. 개발 환경 설정
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
- [x] `useTodos` 훅: 목록 상태, 로딩·에러 상태, 추가·수정·삭제·완료 토글 — 수정·삭제는 낙관적 업데이트 + 실패 시 롤백
- [x] `TodoForm`: 제목 입력 후 추가 (빈 값 방지)
- [x] `TodoList` / `TodoItem`: 목록 표시, 완료 체크박스, 삭제 버튼
- [x] 수정 기능 (인라인 편집 또는 모달) — 인라인 편집(TodoForm 재사용)
- [x] 로딩 / 에러 / 빈 목록 화면 처리
- [x] 새로고침 후에도 데이터가 유지되는지 확인 (`db.json` 반영)

### Phase 2. 카테고리 / 태그
- [x] `src/api/categories.js`, `useCategories` 훅
- [x] `CategorySidebar`: 카테고리 목록, 추가·수정·삭제, 클릭 시 필터 — 이름 변경·삭제(2단계 확인) 동작 확인, 카테고리 추가는 브라우저에서 직접 확인하지 못함
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
- [ ] 필터 조합(카테고리 + 태그 + 상태 + 우선순위 + 검색) 동작 — 필터를 하나씩 적용했을 때의 결과만 확인, 여러 조건을 동시에 적용한 경우는 미확인
- [ ] 반응형 레이아웃 (모바일에서는 사이드바를 접거나 상단으로 이동) — 구현(`lg:` 2단 그리드)했으나 좁은 화면은 미확인
- [ ] 다크모드 (`dark:` 스타일) — 시스템 설정에 따른 다크 렌더링은 확인, 토글 버튼과 저장은 미확인
- [ ] 필터 결과가 없을 때의 빈 상태 화면 — 구현했으나 화면은 미확인

### Phase 5. 품질 개선
- [ ] **접근성**: 폼 `label`, 버튼 `aria-label`, 키보드 조작, 포커스 표시 — 라벨·`aria-*`·포커스 스타일은 적용했으나 별도 점검(키보드 조작, 대비) 미실시
- [x] **에러 처리**: API 실패 시 사용자 안내, 낙관적 업데이트를 쓴다면 실패 시 롤백 — API 중단 시 롤백·오류 알림, 목록 조회 실패 시 재시도 화면 확인
- [ ] 불필요한 리렌더링·중복 요청 점검
- [ ] 브라우저 콘솔 에러·경고 없음 확인 — 초기 로딩 시에만 확인
- [x] `npm run build` 결과 확인

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
- [x] 새로고침 후에도 데이터가 유지된다 (`db.json`에 반영).
- [x] 카테고리·태그·우선순위·마감일을 지정하고 표시할 수 있다.
- [ ] 필터·정렬·검색을 조합해도 결과가 정확하다.
- [ ] 모바일(360px) ~ 데스크톱(1440px)에서 레이아웃이 깨지지 않는다.
- [ ] 브라우저 콘솔에 에러가 없다.

---

## 9. 향후 확장 아이디어

- 실제 백엔드로 교체 (Express + DB, 또는 Supabase 등)
- 드래그 앤 드롭으로 순서 변경
- 반복 일정, 알림 기능
- 캘린더 보기
- 배포 (json-server는 로컬 전용이므로 백엔드 교체 후 진행)
