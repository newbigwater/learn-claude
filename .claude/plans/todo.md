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
