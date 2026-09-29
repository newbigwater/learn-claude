#React #htm #TailwindCSS #ESModules #ImportMap #Hook #Memoization #TailwindBrowser #WCAG #Promise #OptimisticUpdate

# Todo 앱 기술 스택

## 01. 스택 개요

### 01.01. 구성

- 이 프로젝트는 **React**[^1] 19 + **htm**[^2] + **Tailwind CSS**[^3] v4 브라우저 빌드 + `localStorage`로 만든 **빌드 없는 SPA**입니다.
- `npm install`도 번들러도 없이 VS Code Live Server로 `todo/index.html`을 열면 실행됩니다.
- 라이브러리는 CDN(`esm.sh`, `jsDelivr`)에서 불러오므로 인터넷 연결이 필요합니다.

### 01.02. 계층 구조

| 계층 | 위치 | 책임 |
|---|---|---|
| 저장소 | `src/api/client.js` | `localStorage` 접근의 유일한 창구, CRUD 제공 |
| 도메인 API | `src/api/todos.js`, `categories.js` | 시각 기록 등 리소스별 규칙 |
| 상태 로직 | `src/hooks/` | `useTodos`, `useCategories`, `useTheme` |
| 화면 | `src/components/` | 표시와 사용자 입력 |
| 순수 함수 | `src/utils/` | 필터, 정렬, 날짜 계산 |

- 컴포넌트는 `localStorage`를 직접 읽고 쓰지 않으므로, 나중에 백엔드로 바꿀 때 **`client.js`만 교체**하면 됩니다.

## 02. 빌드 없는 실행 환경

### 02.01. ES Modules

- **ES Modules**[^4]는 `import`/`export`로 파일을 나누는 JavaScript 표준 모듈 체계이며, `<script type="module">`로 브라우저가 직접 해석합니다.
- 번들러(Vite 등)는 확장자 생략과 패키지 이름 해석을 대신해 주지만, 브라우저는 그렇지 않습니다.
- 그래서 상대 경로 import에는 `.js` 확장자를 반드시 붙이고, 경로는 `./`, `../` 상대 경로만 씁니다. 생략하면 404가 납니다.

```javascript
import App from "./App.js"; // 확장자 필수
import { useState } from "react"; // 패키지 이름은 import map이 해석
```

### 02.02. Import Map

- **Import Map**[^5]은 `import "react"` 같은 패키지 이름을 실제 URL로 연결하는 브라우저 기능입니다.
- `index.html`에서 `react`, `react-dom/client`, `htm`을 `esm.sh` 주소에 매핑하며, 버전을 고정해 재현성을 확보합니다.
- 모듈 스크립트가 실행되기 전에 선언되어야 하므로 `<script type="importmap">`을 `type="module"` 스크립트보다 앞에 둡니다.
- `react-dom/client?external=react` 쿼리는 `react-dom`이 자체 React 사본을 넣지 않고 **import map의 React를 공유**하게 합니다. 사본이 둘이면 훅이 오동작합니다.

### 02.03. 번들러 방식과의 비교

| 구분 | 빌드 없는 방식 (이 프로젝트) | 번들러 방식 (Vite 등) |
|---|---|---|
| 정의 | 브라우저가 모듈을 직접 로드 | 빌드 도구가 묶고 변환 |
| 목적 | 도구 없이 원리 학습, 즉시 실행 | 배포 최적화, 큰 프로젝트 관리 |
| 특징 | 설치 불필요, JSX 불가, 요청 수 많음 | 트리 쉐이킹, 압축, JSX·TS 지원 |
| 선택 기준 | 학습, 프로토타입, 소규모 | 실서비스, 성능·타입 안정성 필요 |

- 실서비스에서는 CDN 의존과 다수의 네트워크 요청이 성능·가용성 부담이 되므로 번들러 전환을 고려합니다.

## 03. React

### 03.01. 선언형 UI와 상태

- React는 **상태(state)가 바뀌면 화면을 다시 계산**하는 선언형 UI 라이브러리입니다. DOM을 직접 고치지 않고 "이 상태면 이렇게 보인다"를 함수로 기술합니다.
- `useState`는 컴포넌트 안에서 바뀌는 값을 보관하고, 값이 바뀌면 컴포넌트를 다시 실행(렌더링)합니다.
- `createRoot(...).render(...)`가 `#root`에 앱을 마운트하며, `StrictMode`는 개발 중 부수효과 실수를 찾기 위해 일부 로직을 두 번 실행합니다.

### 03.02. 훅으로 로직 분리

- **Hook**[^6]은 함수 컴포넌트에서 상태와 생명주기를 쓰는 함수이며, 직접 만든 훅(`useTodos` 등)으로 로직을 재사용합니다.
- 사용하는 훅은 다음과 같습니다.

| 훅 | 용도 | 이 프로젝트의 사용처 |
|---|---|---|
| `useState` | 상태 보관 | 할 일 목록, 필터, 사이드바 열림 |
| `useEffect` | 렌더링 후 부수효과 | 최초 목록 불러오기, `todosRef` 동기화 |
| `useRef` | 렌더링과 무관한 값 보관 | `todosRef`로 최신 목록 읽기 |
| `useCallback` | 함수 identity 유지 | `App`이 내려주는 콜백 |
| `useMemo` | 계산 결과 캐시 | 필터·정렬 결과, 태그 목록 |
| `memo` | props 불변 시 재렌더링 생략 | `TodoItem`, `TodoList` 등 |

- `App`은 화면 조립만 하고, 데이터 처리는 훅이, 계산은 `utils/`의 순수 함수가 맡습니다.

### 03.03. 리렌더링 최적화

- **Memoization**[^7]은 입력이 같으면 이전 결과를 재사용해 불필요한 계산·렌더링을 줄이는 기법입니다.
- `memo`로 감싼 컴포넌트는 props를 **`Object.is`로 얕게 비교**하므로, 부모가 매번 새 함수·새 객체를 넘기면 최적화가 무효가 됩니다.
- 그래서 지켜야 할 규칙은 다음과 같습니다.
  - 콜백은 `useCallback`으로 만들고, 현재 필터가 필요하면 함수형 `setState(current => ...)`로 의존성을 없앱니다.
  - 액션 함수가 `todos`에 의존하지 않도록 최신 목록은 `todosRef`로 읽습니다.
  - 새 props를 인라인 화살표 함수나 새 객체 리터럴로 넘기지 않습니다.
- `useContentMemo`는 값을 `JSON.stringify`한 문자열이 같으면 **이전과 같은 객체를 반환**하는 훅입니다. 완료 토글은 개수·태그 내용을 바꾸지 않으므로 사이드바와 필터바가 다시 그려지지 않습니다.
- 정상 동작 기준은 "검색창 1글자 입력은 `FilterBar`, `TodoList`만, 완료 토글은 해당 `TodoItem`, `TodoList`만 다시 그린다"입니다.
- `useContentMemo`는 JSON으로 직렬화되는 **작은 값**에만 적합합니다. 큰 데이터에서는 직렬화 비용이 이득을 넘습니다.

### 03.04. 참조 동일성과 useRef 패턴

- 함수가 `todos` state에 의존하면 `todos`가 바뀔 때마다 함수가 새로 만들어져 `memo`가 깨집니다.
- 이를 피하려고 `todosRef.current`에 최신 목록을 넣고, 액션 함수는 `useCallback(..., [])`로 한 번만 만든 뒤 호출 시점에 ref를 읽습니다.
- ref 값은 바뀌어도 리렌더링을 일으키지 않으므로 "최신 값 조회용 통로"로 적합합니다.

## 04. htm

### 04.01. JSX 없이 마크업 쓰기

- **htm**[^2]은 태그 템플릿 리터럴로 JSX와 비슷한 문법을 브라우저에서 바로 쓰게 해 주는 라이브러리입니다.
- `htm.bind(createElement)`로 React와 연결한 것이 `src/lib/html.js`의 `html`입니다.
- JSX는 빌드 단계에서 변환이 필요하지만, htm은 **런타임에 템플릿 문자열을 해석**하므로 변환기가 필요 없습니다.

### 04.02. JSX와의 문법 차이

| 항목 | JSX | htm |
|---|---|---|
| 컴포넌트 | `<App prop={x} />` | `<${App} prop=${x} />` |
| 닫는 태그 | `</App>` | `<//>` |
| 값 삽입 | `{value}` | `${value}` |
| 전개 | `{...obj}` | `...${obj}` |
| 조건부 | `{cond && <A />}` | `${cond && html`...`}` |
| 속성 이름 | `className`, `htmlFor` | 동일 (HTML의 `class` 아님) |

- 컴포넌트가 함수이므로 태그 이름 자리에 `${Comp}`로 참조를 끼워 넣어야 합니다.

```javascript
createRoot(document.getElementById("root")).render(
  html`<${StrictMode}><${App} /><//>`,
);
```

## 05. Tailwind CSS 브라우저 빌드

### 05.01. 동작 방식

- **`@tailwindcss/browser`**[^8]는 페이지에 스크립트로 넣으면 DOM에 나타난 클래스를 런타임에 읽어 CSS를 생성합니다.
- 설정은 `<style type="text/tailwindcss">` 안에 씁니다. 여기에 `@custom-variant dark`, `@theme`, `@layer base`가 있습니다.
- 동적으로 그려지는 React 화면에서도 클래스가 DOM에 붙는 순간 스타일이 만들어집니다.

### 05.02. resume과의 비교

| 구분 | CLI 사전 빌드 (`resume/`) | 브라우저 빌드 (`todo/`) |
|---|---|---|
| 정의 | 빌드 때 CSS 파일을 생성 | 실행 때 브라우저가 CSS 생성 |
| 목적 | 배포용 최적화 | 빌드 없는 즉시 실행 |
| 특징 | 결과물 작고 빠름, 클래스 추가마다 재빌드 | 재빌드 불필요, 첫 로드 시 계산 비용 |
| 선택 기준 | 실서비스 | 학습, 프로토타입 |

- 브라우저 빌드는 DOM에서 클래스를 읽으므로 동적 조합도 동작하지만, 클래스는 **전체 문자열로** 써야 검색·리팩터링이 안전합니다.

```javascript
// 권장: 전체 문자열
const DUE_STYLES = { overdue: "bg-red-600 text-white" };
// 지양: 조각을 이어 붙임
const bad = `bg-${color}-600`;
```

### 05.03. 다크모드와 색 대비

- 다크모드는 `resume/`과 같은 클래스 방식이며, `index.html` 인라인 스크립트(첫 렌더링 전 적용), `@custom-variant dark`, `useTheme`(토글과 저장)이 함께 동작합니다.
- 차이는 초기값입니다. `todo/`는 저장값이 없으면 **OS 설정(`prefers-color-scheme`)을 따릅니다.**
- 보조 텍스트는 명도 대비 4.5:1(WCAG AA[^9]) 이상을 위해 라이트 `text-slate-600` 이상, 다크 `dark:text-slate-400`을 씁니다. `text-slate-400`/`500` 단독 사용은 기준에 미달했습니다.

## 06. 데이터 저장

### 06.01. Web Storage 비교

| 구분 | localStorage | sessionStorage | IndexedDB |
|---|---|---|---|
| 정의 | 영구 키-값 저장 | 탭 세션 동안만 유지 | 브라우저 내장 객체 DB |
| 목적 | 설정, 소량 데이터 | 임시 상태 | 대용량·구조화 데이터 |
| 특징 | 동기 API, 문자열만, 약 5MB | 탭마다 분리 | 비동기, 인덱스·트랜잭션 |
| 선택 기준 | 이 앱처럼 작은 JSON | 새로고침 후 버려도 될 값 | 수천 건 이상, 검색·정렬 필요 |

- 이 앱은 `todo-app:db` 키 하나에 `{ todos, categories }` 전체를 JSON으로 저장합니다.
- 저장소는 **도메인(origin) 단위**로 분리되어, Live Server 주소(`127.0.0.1:5500`)와 다른 주소에서는 데이터가 공유되지 않습니다.
- 첫 실행에서 키가 없으면 `src/data/seed.js`의 예시 데이터로 시작합니다. 초기화는 개발자 도구에서 이 키를 지우고 새로고침합니다.

### 06.02. 저장소를 서버 API처럼 다루기

- `client.js`의 `list`/`insert`/`update`/`remove`는 **Promise를 반환**하고 실패 시 Error를 던집니다.
- `run(task)` 헬퍼는 동기 함수를 `new Promise`로 감싸, 던진 예외가 자동으로 rejected Promise가 되게 합니다.
- 훅은 `async/await`와 `try/catch`로 서버 API와 같은 방식으로 다루므로, 나중에 `fetch` 기반 백엔드로 바꿔도 훅의 코드는 거의 그대로입니다.
- 저장소는 json-server처럼 문자열 id를 만들며 `crypto.randomUUID()`를 쓰고, 지원하지 않는 환경에서는 시간과 난수로 대체합니다.
- 접근 실패(사생활 보호 모드, 용량 초과)와 JSON 파싱 실패는 **사용자가 이해할 수 있는 메시지**의 Error로 바꿔 던집니다.

## 07. 비동기 처리와 낙관적 업데이트

### 07.01. Promise와 async/await

- **Promise**[^10]는 나중에 완료될 작업의 결과(성공 또는 실패)를 나타내는 객체이고, `async/await`는 이를 동기 코드처럼 읽히게 하는 문법입니다.
- `Promise.all`은 여러 작업을 동시에 실행해 모두 끝나길 기다립니다. `unassignCategory`가 소속 할 일 여러 건을 한 번에 갱신할 때 씁니다.
- `load`는 `try/catch/finally`로 로딩 상태와 오류 상태를 관리합니다. 조회 실패는 재시도 화면, 추가·수정·삭제 실패는 알림으로 구분해 보여 줍니다.

### 07.02. 낙관적 업데이트

- **Optimistic Update**[^11]는 서버 응답을 기다리지 않고 화면을 먼저 바꾼 뒤, 실패하면 이전 값으로 되돌리는 방식입니다.
- `useTodos`의 수정·삭제 흐름은 다음과 같습니다.
  - 되돌릴 이전 값을 `todosRef`에서 저장
  - `setTodos`로 화면 먼저 갱신
  - 저장 성공 시 응답 값으로 확정, 실패 시 이전 값 복원과 오류 메시지 표시
- 추가는 예외입니다. id를 저장소가 만들기 때문에 **응답을 받은 뒤** 목록에 넣습니다.

| 구분 | 낙관적 업데이트 | 비관적 업데이트 |
|---|---|---|
| 정의 | 화면 먼저, 결과는 나중에 확정 | 응답을 받은 뒤 화면 갱신 |
| 목적 | 체감 속도 향상 | 화면과 저장 상태의 항상 일치 |
| 특징 | 실패 시 롤백 코드 필요 | 응답 지연이 그대로 보임 |
| 선택 기준 | 실패 확률이 낮은 토글·수정·삭제 | 서버가 값을 만드는 생성, 결제 |

### 07.03. 카테고리 삭제의 무결성 처리

- 저장소는 DB의 외래 키 연쇄 처리(cascade)를 하지 않으므로 앱이 직접 처리합니다.
- 순서는 ① 소속 할 일을 `categoryId: null`(미분류)로 변경 ② **모두 성공했을 때만** 카테고리 삭제입니다.
- 순서가 반대이면 카테고리만 사라지고 존재하지 않는 id를 가리키는 할 일이 남습니다.

## 08. 날짜 처리

### 08.01. 로컬 날짜와 UTC

- 날짜는 `YYYY-MM-DD` 문자열로 다룹니다. 시간대가 개입하는 `Date` 객체를 저장 값으로 쓰지 않기 위해서입니다.
- `toISOString()`은 UTC 기준이라 한국(UTC+9) 자정~오전 9시에는 **전날 날짜**가 나옵니다. 그래서 `getFullYear()`, `getMonth()`, `getDate()`로 로컬 날짜를 조합하는 `todayString()`을 씁니다.
- 반대로 두 날짜의 차이(일수)는 `Date.UTC(y, m - 1, d) / 86_400_000`으로 계산해, 서머타임 같은 시간대 규칙에 의한 오차를 피합니다.
- 생성·수정 시각(`createdAt`, `updatedAt`)은 시점이 중요하므로 `toISOString()`으로 저장합니다.

### 08.02. 마감 상태 판정

- `getDueStatus`가 남은 일수(`daysUntil`)로 상태를 분류합니다.

| 상태 | 조건 | 표시 |
|---|---|---|
| `overdue` | 남은 일수 < 0 | `N일 지남` |
| `today` | 0 | `오늘 마감` |
| `soon` | 1~3 | `D-N` |
| `normal` | 4 이상 또는 완료됨 | 날짜 |

- 완료된 항목은 기한이 지나도 경고 상태로 표시하지 않습니다.
- `today` 인자를 기본값 매개변수로 받아, 테스트나 확인 시 **오늘 날짜를 주입**할 수 있는 순수 함수가 됩니다.

## 09. 반응형과 접근성

### 09.01. 좁은 화면 대응

- 사이드바는 `hidden lg:block`으로 `lg`(1024px) 이상에서 항상 보이고, 그 미만에서는 `sidebarOpen` 상태로 접고 펼칩니다.
- 표시 여부는 CSS(반응형 클래스)와 React 상태가 분담합니다. 큰 화면의 고정 표시는 CSS로, 작은 화면의 토글은 상태로 처리합니다.

### 09.02. 접근성

- 체크박스에 `aria-label`로 "제목 + 완료 표시"를 부여해 스크린 리더가 어떤 항목인지 알 수 있게 합니다.
- `:focus-visible` 윤곽선으로 키보드 사용자가 현재 위치를 확인할 수 있습니다.
- `<noscript>` 태그로 JavaScript가 꺼진 환경에 안내 문구를 보여 줍니다.
- 긴 텍스트는 `break-words`로 레이아웃이 밀리는 것을 막고, 메모의 줄바꿈은 `whitespace-pre-wrap`으로 보존합니다.

---

## Footnotes

[^1]: **React**
    상태 변화에 따라 UI를 선언형으로 갱신하는 컴포넌트 기반 JavaScript 라이브러리입니다.
    - **Scope**: 이 프로젝트는 19.x를 `esm.sh`에서 불러와 사용
    - **Exclusion/Caution**: 라우팅, 데이터 저장 같은 기능은 포함하지 않는 UI 라이브러리입니다.

[^2]: **htm(Hyperscript Tagged Markup)**
    태그 템플릿 리터럴로 JSX 유사 문법을 런타임에 해석해 `createElement` 호출로 바꿔 주는 라이브러리입니다.
    - **Scope**: 빌드 도구 없이 브라우저에서 React 마크업을 쓰는 경우
    - **Exclusion/Caution**: JSX와 문법이 다르며(`<//>`, `${}`), 에디터의 JSX 자동 완성이 동작하지 않습니다.

[^3]: **Tailwind CSS**
    단일 목적의 유틸리티 클래스를 조합해 스타일을 만드는 CSS 프레임워크입니다.
    - **Scope**: 이 프로젝트는 브라우저용 런타임 빌드를 사용 (CLI 방식은 `resume/` 문서 참고)

[^4]: **ES Modules(ECMAScript Modules)**
    `import`/`export` 문법으로 파일 단위 모듈을 정의하는 JavaScript 표준 모듈 시스템입니다.
    - **Scope**: 브라우저(`type="module"`)와 Node.js
    - **Exclusion/Caution**: CommonJS(`require`)와 다르며, 브라우저에서는 확장자와 경로를 생략할 수 없습니다.

[^5]: **Import Map**
    모듈 지정자(`"react"`)를 실제 URL로 매핑하는 JSON을 `<script type="importmap">`에 선언하는 브라우저 기능입니다.
    - **Scope**: 번들러 없이 패키지 이름으로 import할 때
    - **Exclusion/Caution**: 모듈을 로드하는 스크립트보다 먼저 선언해야 합니다.

[^6]: **Hook**
    함수 컴포넌트에서 상태, 부수효과, 참조 같은 React 기능에 연결하는 `use*` 함수입니다.
    - **Scope**: 함수 컴포넌트와 커스텀 훅의 최상위
    - **Exclusion/Caution**: 조건문·반복문 안에서 호출할 수 없으며 호출 순서가 매 렌더링마다 같아야 합니다.

[^7]: **메모이제이션(Memoization)**
    같은 입력에 대한 계산 결과를 저장해 두고 재사용하는 최적화 기법입니다.
    - **Scope**: React의 `memo`, `useMemo`, `useCallback`
    - **Exclusion/Caution**: 비교와 캐시 자체에도 비용이 있으므로 실제로 재렌더링 비용이 큰 곳에 적용합니다.

[^8]: **@tailwindcss/browser**
    Tailwind v4를 `<script>`로 불러와 브라우저에서 CSS를 즉석 생성하는 빌드입니다.
    - **Scope**: 프로토타입, 학습, 빌드 없는 데모
    - **Exclusion/Caution**: 공식적으로 실서비스용이 아니며, CLI 사전 빌드보다 첫 로드가 무겁습니다.

[^9]: **WCAG(Web Content Accessibility Guidelines)**
    W3C가 정한 웹 접근성 지침으로, AA 등급은 일반 텍스트의 명도 대비 4.5:1 이상을 요구합니다.
    - **Scope**: 텍스트·배경 색 대비, 키보드 조작, 대체 텍스트 등

[^10]: **Promise**
    비동기 작업의 완료(fulfilled) 또는 실패(rejected) 결과를 나타내는 JavaScript 객체입니다.
    - **Scope**: `then`/`catch`, `async/await`, `Promise.all`
    - **Exclusion/Caution**: `Promise.all`은 하나라도 실패하면 즉시 reject되므로 결과 처리에 유의해야 합니다.

[^11]: **낙관적 업데이트(Optimistic Update)**
    작업이 성공할 것이라 가정하고 UI를 먼저 갱신한 뒤, 실패하면 이전 상태로 되돌리는 UX 패턴입니다.
    - **Scope**: 실패 확률이 낮고 응답이 느릴 수 있는 수정·삭제·토글
    - **Exclusion/Caution**: 서버가 값을 결정하는 작업(id 생성 등)에는 적용하기 어렵습니다.
