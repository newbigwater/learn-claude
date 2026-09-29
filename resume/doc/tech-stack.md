#HTML5 #TailwindCSS #UtilityFirst #DesignToken #VanillaJS #IntersectionObserver #ARIA #SVGSprite #WebStorage #FOUC #PrintCSS #HeadlessBrowser

# 웹 이력서 기술 스택

## 01. 스택 개요

### 01.01. 구성

- 이 프로젝트는 **HTML5**[^1] + **Tailwind CSS**[^2] v4 + **Vanilla JS**[^3]로 만든 정적 페이지이며, 서버와 번들러가 없습니다.
- 브라우저가 `index.html`, `dist/output.css`, `js/main.js`를 그대로 내려받아 실행합니다.
- 유일한 빌드 단계는 Tailwind CLI가 `src/input.css`를 `dist/output.css`로 변환하는 것입니다.

### 01.02. 파일별 역할

| 파일 | 역할 | 관련 기술 |
|---|---|---|
| `index.html` | 콘텐츠와 구조, SEO 메타, SVG 아이콘 | HTML5, ARIA, SVG |
| `src/input.css` | 디자인 토큰과 컴포넌트 클래스 정의 | Tailwind v4 |
| `dist/output.css` | 실제 사용 클래스만 담은 빌드 결과 | Tailwind CLI |
| `js/main.js` | 다크모드, 메뉴, 스크롤 효과, 필터 | Vanilla JS, DOM API |
| `summary.html` | A4 1장 요약본 (PDF 원본) | 인라인 CSS, 인쇄 CSS |

- 정적 페이지를 택한 이유는 이력서가 **읽기 위주 콘텐츠**라 서버 로직이나 상태 관리 프레임워크가 필요 없기 때문입니다.

## 02. HTML5 마크업

### 02.01. 시맨틱 구조와 메타 정보

- 시맨틱 요소(`header`, `nav`, `section`, `footer`)를 쓰면 스크린 리더와 검색 엔진이 문서 구조를 이해할 수 있습니다.
- `<html lang="ko">`는 읽기 엔진의 발음 언어와 번역 제안 기준이 됩니다.
- `<meta name="viewport">`가 없으면 모바일 브라우저가 데스크톱 폭으로 렌더링해 반응형이 동작하지 않습니다.
- `description`, `og:*`, `twitter:*` 메타는 검색 결과와 링크 공유 미리보기에 쓰입니다.

### 02.02. 접근성 속성

- **ARIA**[^4] 속성은 화면 요소의 상태를 보조 기기에 전달합니다.
- 이 프로젝트의 사용처는 다음과 같습니다.
  - `aria-pressed`: 다크모드 토글, 프로젝트 필터 버튼의 켜짐 상태
  - `aria-expanded` / `aria-label`: 모바일 메뉴 버튼의 열림 상태와 이름
  - `aria-current="true"`: 현재 보고 있는 섹션의 메뉴 링크
  - `aria-hidden="true"`: 장식용 SVG를 읽지 않게 숨김
- 상태 표현을 `aria-*` 속성에 두면 CSS도 `.nav-link[aria-current="true"]`처럼 같은 속성을 선택자로 쓸 수 있어 **상태의 출처가 하나**가 됩니다.

### 02.03. hidden 속성과 data 속성

- `hidden` 속성은 요소를 화면에서 숨기는 표준 방법이며, 프로젝트 필터와 맨 위로 버튼이 이를 토글합니다.
- Tailwind preflight의 `[hidden]` 규칙이 `display` 클래스(`flex` 등)보다 우선하므로 충돌하지 않습니다.
- `data-category`, `data-filter` 같은 **data 속성**은 HTML에 값을 실어 두고 JS에서 `element.dataset.category`로 읽는 통로입니다.

## 03. Tailwind CSS v4

### 03.01. 유틸리티 우선 방식

- **Utility-first**[^5]는 `rounded-2xl`, `px-6`처럼 한 가지 역할의 클래스를 HTML에서 조합해 스타일링하는 방식입니다.
- CSS 파일을 오가지 않고 마크업에서 결과를 바로 볼 수 있으며, 사용하지 않는 클래스는 빌드 결과에서 제외됩니다.
- Tailwind CLI는 `index.html`과 `js/main.js`를 스캔해 **실제 등장한 클래스 문자열**만 `output.css`에 생성합니다.
- 그래서 새 클래스를 추가하면 `npm run build`로 `dist/output.css`를 다시 만들어야 합니다.

### 03.02. CSS 중심 설정

- v4는 `tailwind.config.js` 없이 `input.css` 안에서 설정을 끝냅니다.

| 지시어 | 역할 | 이 프로젝트의 사용 |
|---|---|---|
| `@import "tailwindcss"` | Tailwind 본체 불러오기 | 진입점 |
| `@theme` | **디자인 토큰**[^6] 정의 | `--color-brand-*`, `--color-night-*`, `--font-sans` |
| `@layer base` | 태그 기본 스타일 | `html`, `body`, `:focus-visible` |
| `@layer components` | 재사용 클래스 | `.btn`, `.card`, `.badge`, `.nav-link` |
| `@custom-variant` | 새 변형(`dark:` 등) 정의 | 클래스 기반 다크모드 |
| `@source not` | 스캔 제외 | `summary.html` |

- `@theme`에 `--color-brand-500`을 선언하면 `bg-brand-500`, `text-brand-500` 같은 유틸리티가 자동으로 생깁니다.

### 03.03. 컴포넌트 클래스와 @apply

- `@layer components`에서 `@apply`로 유틸리티를 묶어 `.card`, `.btn` 같은 이름 있는 클래스를 만듭니다.
- 같은 조합이 여러 번 반복될 때만 묶고, 한 번 쓰는 스타일은 유틸리티를 HTML에 직접 씁니다.
- 간격 규칙(섹션 `py-20 sm:py-24`, 그리드 `gap-6`, 카드 `rounded-2xl`)을 통일해 화면의 리듬을 유지합니다.

### 03.04. 반응형 접두사

- `sm:`, `md:`, `lg:` 접두사는 **모바일 우선(min-width)** 기준입니다. 접두사가 없는 값이 기본(작은 화면)입니다.
- 예를 들어 `hidden lg:flex`는 1024px 미만에서 숨기고 이상에서 가로로 표시합니다.
- 메뉴가 8개라 가로 메뉴 기준을 `lg`로 잡았고, `main.js`가 토글하는 `hidden`/`flex`와 짝이 맞아야 합니다.

## 04. 다크모드

### 04.01. 클래스 기반 방식

- 다크모드 전환 방식은 두 가지입니다.

| 구분 | 미디어 쿼리 방식 | 클래스 방식 |
|---|---|---|
| 정의 | `prefers-color-scheme` 값에 따라 자동 적용 | `html.dark` 클래스 유무로 적용 |
| 목적 | OS 설정을 그대로 따름 | 사용자가 직접 선택 |
| 특징 | JS 불필요, 수동 전환 불가 | JS와 저장소 필요, 전환 가능 |
| 선택 기준 | 토글 UI가 없을 때 | 토글 버튼을 제공할 때 |

- 이 프로젝트는 토글 버튼이 있으므로 **클래스 방식**을 택했고, `@custom-variant dark`로 `dark:` 접두사를 `.dark` 하위 요소에 연결합니다.

### 04.02. 세 곳이 함께 동작하는 구조

- 다크모드는 다음 세 부분이 맞물려야 동작합니다.
  - `<head>` 인라인 스크립트: 첫 렌더링 전에 `html.dark`를 붙임
  - `input.css`의 `@custom-variant dark`: `dark:` 스타일이 `.dark` 아래에서만 적용되게 함
  - `main.js` 토글: 클래스를 바꾸고 `localStorage`의 `theme` 키에 저장
- 한 곳만 바꾸면 깜빡임이 생기거나 스타일이 적용되지 않습니다.

### 04.03. FOUC 방지

- **FOUC**[^7]를 막으려면 CSS가 적용되기 전에 클래스를 붙여야 하므로, 외부 JS 대신 `<head>`의 인라인 스크립트를 씁니다.
- 외부 `main.js`는 본문 뒤에서 실행되어, 그때 클래스를 붙이면 라이트 화면이 먼저 보입니다.
- 같은 스크립트가 `html.js` 클래스도 붙이며, `.js .reveal`에서만 요소를 숨겨 **JS가 꺼진 환경에서도 콘텐츠가 보이게** 합니다. 이런 접근을 점진적 향상(Progressive Enhancement)이라 합니다.
- 저장값이 `"light"`가 아니면 다크를 적용하므로 **다크가 기본**이며 OS 설정은 따르지 않습니다.

## 05. Vanilla JS와 브라우저 API

### 05.01. DOM 조작

- **Vanilla JS**는 프레임워크 없이 브라우저 내장 API만 쓰는 방식입니다.
- 이 프로젝트에서 쓰는 API는 다음과 같습니다.
  - `classList.toggle(name, force)`: 클래스 추가/제거 (`hidden`, `flex`, `dark`)
  - `setAttribute` / `getAttribute`: ARIA 상태 갱신
  - `dataset`: `data-*` 속성 읽기
  - `closest("a")`: 이벤트 위임에서 클릭된 요소의 조상 링크 찾기
- 메뉴 링크 클릭 감지는 링크마다 리스너를 다는 대신 **`#nav-menu` 하나에 리스너를 달고** `event.target.closest("a")`로 판별합니다(이벤트 위임).

### 05.02. IntersectionObserver

- **IntersectionObserver**[^8]는 요소가 뷰포트와 겹치는지를 비동기로 알려 주는 API입니다.
- 이 프로젝트는 두 곳에서 사용합니다.

| 용도 | 옵션 | 동작 |
|---|---|---|
| 현재 섹션 메뉴 하이라이트 | `rootMargin: "-40% 0px -55% 0px"` | 화면 중앙 띠에 들어온 섹션을 현재 섹션으로 판정 |
| 스크롤 등장 애니메이션 | `threshold: 0.1` | 10% 보이면 `is-visible` 추가 후 `unobserve` |

- 스크롤 이벤트로 좌표를 계산하는 방식과 달리 매 스크롤마다 핸들러가 실행되지 않아 **메인 스레드 부담이 적습니다**.
- 등장 애니메이션은 한 번만 재생하면 되므로 `unobserve`로 관찰을 끝냅니다.
- `"IntersectionObserver" in window` 검사로 미지원 브라우저에서는 바로 보이게 처리합니다.

### 05.03. 스크롤 이벤트와 passive

- 맨 위로 버튼은 `scroll` 이벤트에서 `window.scrollY < 400`으로 `hidden`을 토글합니다.
- `{ passive: true }`는 핸들러가 `preventDefault()`를 호출하지 않겠다는 약속이라, 브라우저가 핸들러 완료를 기다리지 않고 스크롤을 진행할 수 있습니다.
- 좌표 값이 필요한 버튼 표시 같은 경우는 IntersectionObserver보다 스크롤 이벤트가 단순합니다.

### 05.04. 웹 스토리지

- **Web Storage**[^9]의 `localStorage`에 `theme` 키로 선택 값을 저장합니다.
- 사생활 보호 모드나 저장소 차단 환경에서는 접근 자체가 예외를 던지므로 읽기·쓰기를 모두 `try/catch`로 감쌉니다.
- 저장이 실패해도 토글 동작은 유지되고 **새로고침 시 기본값으로 돌아갈 뿐**입니다.

## 06. SVG 아이콘 스프라이트

### 06.01. 구조

- **SVG 스프라이트**[^10]는 `index.html` 상단에 아이콘을 `<symbol id="icon-*">`로 한 번 정의하고, 필요한 곳에서 `<use href="#icon-*">`로 참조하는 방식입니다.
- 스프라이트 컨테이너는 `size-0`과 `aria-hidden`으로 화면에서 숨깁니다. `display: none`을 쓰면 일부 브라우저에서 참조가 실패할 수 있기 때문입니다.
- 아이콘 색은 `fill="currentColor"`로 지정해 **주변 글자색을 그대로 상속**하므로 `text-brand-600`, `dark:text-brand-400`으로 색을 바꿀 수 있습니다.
- UI 선 아이콘은 `fill`, `stroke`를 `<symbol>`에 지정하면 자식 도형이 상속합니다.

### 06.02. 아이콘 처리 방식 비교

| 구분 | 인라인 SVG 반복 | SVG 스프라이트 | 이미지 파일(`<img>`) |
|---|---|---|---|
| 정의 | 사용처마다 path 복사 | 한 번 정의, `<use>`로 참조 | 별도 파일로 로드 |
| 목적 | 단순함 | 중복 제거 | 정적 이미지 |
| 특징 | HTML 비대, 수정 어려움 | 추가 요청 없음, 색 상속 가능 | 색 상속 불가, 요청 발생 |
| 선택 기준 | 아이콘 1~2개 | 같은 아이콘을 여러 곳에 재사용 | 색 변경이 필요 없는 일러스트 |

- 이 프로젝트는 SNS 아이콘이 Hero, SNS 카드, 푸터에 반복되어 스프라이트를 택했습니다.

## 07. 인쇄와 PDF

### 07.01. 인쇄 CSS

- **Print CSS**[^11]는 `@media print`로 인쇄·PDF 저장 때만 적용되는 스타일을 정의합니다.
- 이 프로젝트의 처리는 다음과 같습니다.
  - `@page { size: A4; margin: 14mm; }`: 용지 크기와 여백
  - `break-inside: avoid`: 카드가 페이지 중간에서 잘리지 않게 함
  - `a[href^="http"]::after { content: " (" attr(href) ")"; }`: 종이에서는 링크를 누를 수 없으므로 URL을 글자로 표시
  - `.text-gradient`를 단색으로 복원: 인쇄에서는 배경이 빠져 `bg-clip-text` 글자가 투명해지기 때문
- 마크업의 `print:hidden`으로 글로우, 점 패턴 같은 장식을 인쇄에서 제외합니다.
- `@custom-variant dark`를 `@media not print`로 감싸 다크 상태에서 인쇄해도 **라이트로 출력**됩니다.

### 07.02. 요약본 PDF 생성

- `summary.html`은 Tailwind를 쓰지 않는 독립 A4 페이지입니다. `output.css`의 `@media print`가 배경을 흰색으로 강제해 검정 디자인과 충돌하기 때문입니다.
- `npm run pdf`는 **Headless Chrome**[^12]으로 `summary.html`을 열어 `assets/resume.pdf`로 저장합니다.
  - `--no-pdf-header-footer`: 날짜·URL 머리글/바닥글 제거
  - `--virtual-time-budget=5000`: 웹폰트 등이 로드될 시간을 확보
- 시트가 `overflow: hidden`이라 내용이 넘쳐도 1쪽으로 나오므로, 수정 후 **하단이 잘리지 않았는지** 직접 확인해야 합니다.

## 08. 타이포그래피와 접근성 세부

### 08.01. 한글 줄바꿈과 웹폰트

- `body`의 `break-keep`(`word-break: keep-all`)은 한글을 글자 중간이 아니라 **띄어쓰기 단위로** 줄바꿈합니다.
- 긴 영문 URL이나 코드가 넘칠 때만 해당 요소에 `break-all` 또는 `break-words`를 씁니다.
- Pretendard Variable은 CDN의 `dynamic-subset` 버전으로 불러오며, 화면에 쓰인 글자가 속한 조각만 내려받아 용량이 작습니다.
- `font-sans` 스택 뒤쪽의 시스템 폰트가 로드 전과 실패 시의 대체 글꼴이 됩니다.

### 08.02. 모션과 포커스

- `prefers-reduced-motion: reduce`에서는 부드러운 스크롤과 등장 애니메이션을 끄고 요소를 즉시 표시합니다. 움직임에 민감한 사용자를 위한 배려입니다.
- `:focus-visible`은 **키보드 조작 때만** 포커스 윤곽선을 보여 주어 마우스 클릭 시 불필요한 테두리를 없앱니다.
- `scroll-mt-18`(`scroll-margin-top`)은 고정 네비게이션이 앵커 위치를 가리지 않도록 이동 지점을 보정합니다.

---

## Footnotes

[^1]: **HTML5(HyperText Markup Language 5)**
    웹 문서의 구조와 의미를 정의하는 마크업 언어의 현행 표준입니다.
    - **Scope**: 시맨틱 요소, 폼, 멀티미디어, 접근성 속성을 포함한 웹 페이지 전반
    - **Exclusion/Caution**: 시각적 표현은 CSS, 동작은 JavaScript가 담당합니다.

[^2]: **Tailwind CSS**
    미리 정의된 유틸리티 클래스를 조합해 UI를 만드는 CSS 프레임워크입니다.
    - **Scope**: 이 프로젝트는 Tailwind CLI로 사전 빌드하는 v4를 사용
    - **Exclusion/Caution**: Bootstrap처럼 완성된 컴포넌트를 제공하지 않고, 스타일의 재료만 제공합니다.

[^3]: **Vanilla JS(Vanilla JavaScript)**
    React, Vue 같은 프레임워크나 라이브러리 없이 브라우저 표준 API만으로 작성한 JavaScript입니다.
    - **Scope**: DOM 조작, 이벤트 처리, Web API 호출

[^4]: **ARIA(Accessible Rich Internet Applications)**
    HTML만으로 표현하기 어려운 요소의 역할, 상태, 속성을 보조 기술에 전달하는 W3C 명세입니다.
    - **Scope**: 커스텀 위젯의 상태 표현 (`aria-pressed`, `aria-expanded`, `aria-current`)
    - **Exclusion/Caution**: 네이티브 요소(`button`, `nav`)로 표현할 수 있으면 그것을 우선 쓰고 ARIA는 보완용으로만 씁니다.

[^5]: **Utility-first**
    의미 있는 클래스 이름(`.card`) 대신 단일 목적의 작은 클래스를 조합해 스타일을 구성하는 CSS 설계 방식입니다.
    - **Scope**: Tailwind CSS의 기본 철학

[^6]: **디자인 토큰(Design Token)**
    색상, 글꼴, 간격 같은 디자인 값을 이름 붙인 변수로 관리하는 방식입니다.
    - **Scope**: Tailwind v4에서는 `@theme` 안의 CSS 변수(`--color-brand-500`)

[^7]: **FOUC(Flash of Unstyled Content)**
    스타일이 적용되기 전의 화면이 잠깐 보였다가 바뀌는 깜빡임 현상입니다.
    - **Scope**: 다크모드 저장값을 렌더링 후에 적용할 때 라이트 화면이 먼저 보이는 경우

[^8]: **IntersectionObserver**
    관찰 대상 요소가 뷰포트나 지정한 조상 요소와 얼마나 겹치는지를 비동기로 통지하는 브라우저 API입니다.
    - **Scope**: 스크롤 기반 등장 효과, 지연 로딩, 현재 섹션 감지
    - **Exclusion/Caution**: 스크롤 위치의 정확한 좌표가 필요한 경우에는 `scroll` 이벤트가 필요합니다.

[^9]: **Web Storage**
    브라우저에 키-값 문자열을 저장하는 API로 `localStorage`(영구)와 `sessionStorage`(탭 세션 동안)로 나뉩니다.
    - **Scope**: 도메인(origin) 단위로 분리된 소량 데이터 저장
    - **Exclusion/Caution**: 문자열만 저장되며, 접근이 차단될 수 있어 `try/catch`가 필요합니다.

[^10]: **SVG 스프라이트(SVG Sprite)**
    여러 아이콘을 `<symbol>`로 한 문서에 모아 두고 `<use>`로 재사용하는 기법입니다.
    - **Scope**: 같은 아이콘을 여러 위치에서 쓰는 페이지

[^11]: **Print CSS**
    인쇄와 PDF 저장 시에만 적용되도록 `@media print`와 `@page`로 작성하는 스타일입니다.
    - **Scope**: 용지 크기, 여백, 페이지 나눔, 인쇄 전용 표시 제어

[^12]: **Headless Chrome**
    화면 UI 없이 명령줄에서 실행되는 Chrome으로, 페이지 렌더링 결과를 PDF나 스크린샷으로 저장할 수 있습니다.
    - **Scope**: 이 프로젝트는 macOS의 설치된 Chrome 경로를 `npm run pdf`에 직접 지정
    - **Exclusion/Caution**: 다른 OS에서는 Chrome 실행 경로를 바꿔야 합니다.
