# 개발자 웹 이력서 roadmap.md 작성 계획

## Context
저장소(`/Users/nbe/git/claude-code-mastery`)는 비어 있습니다. 사용자는 HTML/CSS/JavaScript/TailwindCSS로 개발자 웹 이력서를 만들기 위한 단계별 개발 로드맵 문서(`roadmap.md`)를 원합니다. 이력서 내용은 특정 인물이 아닌 일반적인(샘플) 개발자 이력서 항목으로 구성합니다. 이번 작업의 산출물은 `roadmap.md` 한 파일이며, 실제 코드는 작성하지 않습니다.

## 산출물
- 생성 파일: `/Users/nbe/git/claude-code-mastery/roadmap.md` (한국어, CLAUDE.md 규칙 준수)

## roadmap.md 구성안

1. **프로젝트 개요** — 목표(반응형 단일 페이지 웹 이력서), 기술 스택(HTML5, CSS3, Vanilla JS, TailwindCSS v4 CLI), 빌드 도구 없이 Tailwind CLI만 사용하는 방침
2. **이력서 콘텐츠 구성(일반 항목)**
   - Hero/프로필: 이름, 직무(프론트엔드 개발자), 한 줄 소개, 프로필 사진, CTA(연락하기/PDF 다운로드)
   - About: 자기소개, 핵심 역량 요약
   - Skills: 언어/프레임워크/도구 카테고리별 배지·숙련도
   - Experience: 회사·기간·역할·주요 성과 타임라인
   - Projects: 카드형(설명, 기술 태그, GitHub/데모 링크)
   - Education & Certifications
   - Contact: 이메일, GitHub, LinkedIn, 블로그
   - Footer
3. **디렉터리 구조**
   ```
   index.html
   src/input.css        # Tailwind 진입점 (@import "tailwindcss")
   dist/output.css      # 빌드 결과
   js/main.js           # 다크모드, 스크롤, 메뉴 등 인터랙션
   js/data.js           # (선택) 이력서 데이터 분리
   assets/images/, assets/resume.pdf
   package.json
   ```
4. **단계별 로드맵 (체크리스트 형식 `- [ ]`)**
   - Phase 0. 환경 설정: `npm init`, `tailwindcss @tailwindcss/cli` 설치, 빌드/워치 스크립트, `.gitignore`, git 초기화
   - Phase 1. 마크업: 시맨틱 HTML 골격(header/nav/main/section/footer), 섹션별 콘텐츠 더미 작성, 메타 태그
   - Phase 2. 스타일링: Tailwind 테마(색상·폰트 커스텀 `@theme`), 모바일 퍼스트 반응형(sm/md/lg), 섹션별 레이아웃(타임라인, 카드 그리드)
   - Phase 3. 인터랙션(JS): 다크모드 토글(localStorage 저장), 모바일 햄버거 메뉴, 스무스 스크롤 + 현재 섹션 네비 하이라이트(IntersectionObserver), 스크롤 등장 애니메이션, 맨 위로 버튼, (선택) data.js 기반 동적 렌더링
   - Phase 4. 품질 개선: 접근성(alt, aria, 키보드 포커스, 대비), SEO/OG 태그·파비콘, 성능(이미지 최적화, lazy loading, CSS minify), 인쇄용 스타일(`print:` variant)
   - Phase 5. 배포: GitHub Pages 또는 Netlify/Vercel, 커스텀 도메인(선택), Lighthouse 점검
5. **마일스톤/일정 예시** — 주차별(약 2~3주) 표
6. **완료 기준(Definition of Done)** — 모바일/데스크톱 반응형, Lighthouse 90+ , 다크모드 동작, 모든 링크 동작
7. **향후 확장 아이디어** — 다국어(한/영) 토글, 블로그 연동, 방문자 통계

## 검증
- 파일 생성 후 Read로 내용 확인: 섹션 누락 없음, 한국어 작성, 체크리스트 마크다운 문법 정상
- 작성 후 CLAUDE.md의 "프로젝트 현황"은 이번 범위 밖이므로 수정하지 않음

---

## 2026-09-28 요약본 PDF 다운로드 추가

### Context
Hero의 "이력서 PDF 다운로드" 버튼은 `assets/resume.pdf`를 가리키지만 파일이 없습니다. 참고 이미지(검정 배경, 흰 테두리 둥근 카드, 골드 강조, 가운데 원형 프로필)와 같은 스타일의 **A4 1장 요약본**을 만들고, 그 PDF를 이 버튼으로 내려받게 합니다.

### 설계

#### 1. 요약본 페이지 `resume/summary.html` (신규)
- **독립 페이지**로 만들고 `dist/output.css`는 불러오지 않습니다. `input.css`의 `@media print`가 배경을 흰색으로 강제(`background:#fff !important`)해서 검정 디자인과 충돌하기 때문입니다. 스타일은 `<head>`의 인라인 `<style>`에 plain CSS로 씁니다.
- 색은 `:root` 변수로 관리합니다(`--bg`, `--line` 흰색, `--accent` 골드, `--text`). 폰트는 `index.html`과 같은 Pretendard CDN 링크와 `--font-sans` 스택을 씁니다.
- **A4 고정 크기**: `.sheet { width:210mm; height:297mm }`, `@page { size:A4; margin:0 }`, `print-color-adjust: exact`로 PDF에서도 검정 배경을 유지합니다. 화면에서는 회색 배경 가운데에 종이처럼 보이게 하고, 상단 도구 막대("이력서로 돌아가기", "PDF 다운로드")를 둡니다. 도구 막대는 `@media print`에서 숨깁니다.
- **배경 질감**: 이미지의 대리석 느낌은 CSS 그라디언트(옅은 대각선 줄무늬)로 흉내 냅니다. 이미지 파일은 추가하지 않습니다.
- **레이아웃과 내용 매핑**: 내용은 `index.html`의 더미 데이터만 씁니다. 새 사실은 만들지 않습니다. 제목은 이미지처럼 두 단어 색 분리(흰색 + 골드)로 합니다.

| 이미지 | 요약본 | 출처 |
| --- | --- | --- |
| 이름/직무 + `</>` 모니터 아이콘 | **김**(흰색)**개발**(골드) / `FRONTEND DEVELOPER` 자간 넓게, 인라인 SVG 아이콘 | Hero |
| EDUCATION · 원형 사진 · CONTACT | **학력** 샘플대학교 컴퓨터공학과 학사 2018.03 – 2022.02 / `assets/images/profile.svg` 원형(흰 테두리) / **연락처** 이메일, GitHub, 블로그, LinkedIn | Education, Contact, SNS |
| ABOUT ME | **자기 소개** 문단 + 개발 철학 한 줄 | About |
| INTEREST · 노트북 그림 · LANGUAGE SKILLS | **주요 성과** 3년+ / 12개 / 95+ · 노트북 인라인 SVG · **자격증** | About 통계, Certifications |
| PERSONAL SKILLS | **기술 스택** Frontend / Backend / Tools 3열, 열마다 선 아이콘(SVG) | Skills |
| WORK EXPERIENCE 2열 | **경력** 샘플테크(2024.03 – 현재) / 예시소프트(2022.01 – 2024.02) | Experience |

- 카드는 `border:2px solid #fff; border-radius:24px`. 첫 줄의 두 카드는 가운데 원형 사진에 모서리가 가려지도록 사진을 `z-index`로 겹칩니다.
- 새 파일에도 `<!-- ==================== Header ==================== -->` … `<!-- ==================== // Header ==================== -->` 형식의 블록 주석을 씁니다.
- 대비: 보조 텍스트는 `#d4d4d4` 이상으로 해서 검정 배경에서 4.5:1 이상을 지킵니다. `lang="ko"`, 이미지 `alt`, `<meta name="robots" content="noindex">`를 넣습니다.

#### 2. PDF 생성 (`resume/assets/resume.pdf`, 커밋 대상)
- `package.json`에 `pdf` 스크립트를 추가합니다. macOS의 headless Chrome으로 `summary.html`을 `assets/resume.pdf`로 출력하며(`--no-pdf-header-footer`, `--virtual-time-budget=5000`으로 웹폰트·이미지 로드를 기다림), 텍스트를 선택할 수 있는 벡터 PDF가 됩니다. 브라우저 JS 라이브러리(html2pdf 등)는 쓰지 않습니다.
- 결과가 정확히 A4 1쪽인지 확인합니다.

#### 3. 연결 (`resume/index.html` Hero)
- 기존 다운로드 링크를 `download="김개발_이력서_요약본.pdf"`가 있는 "요약본 PDF 다운로드"로 바꿉니다. "인쇄 / PDF 저장" 버튼(`#print-btn`)은 그대로 둡니다.
- 새 Tailwind 클래스는 추가하지 않습니다. `src/input.css`에 `@source not "../summary.html";`를 넣어 요약본 페이지가 스캔되지 않게 하고, `npm run build`로 `dist/output.css`를 다시 생성합니다.

#### 4. 문서 갱신
- `CLAUDE.md` resume/ 아키텍처에 요약본 규칙을 추가합니다(독립 A4 페이지, Tailwind 미사용, `index.html` 내용을 바꾸면 `summary.html`도 맞추고 `npm run pdf`로 재생성해 커밋). "샘플 데이터"의 "`assets/resume.pdf` 파일이 아직 없습니다" 문구는 지웁니다.
- `README.md` resume/ 구조에 `summary.html`, `assets/resume.pdf`, `npm run pdf`를 추가합니다.
- `resume/roadmap.md`의 PDF 관련 체크박스(110행, 137행)는 확인한 뒤에만 완료로 바꾸고, 확인하지 못한 항목은 메모를 남깁니다.

### 주요 파일
- 신규: `resume/summary.html`, `resume/assets/resume.pdf`
- 수정: `resume/index.html`(Hero 링크), `resume/src/input.css`, `resume/dist/output.css`, `resume/package.json`, `CLAUDE.md`, `README.md`, `resume/roadmap.md`

### 검증
1. `resume/`에서 `python3 -m http.server 8000` → `summary.html`을 브라우저로 열어 스크린샷으로 이미지와 레이아웃을 비교하고, 콘솔 에러와 폰트·프로필 로드 실패가 없는지 봅니다.
2. `npm run pdf` → `assets/resume.pdf`가 A4 1쪽이고 검정 배경과 한글이 제대로 들어갔는지 PDF를 읽어 확인합니다.
3. `index.html` Hero의 링크가 `assets/resume.pdf`(200 응답)를 `download` 속성과 함께 가리키는지 확인합니다.
4. `npm run build` 후 `git diff --stat dist/output.css`로 기존 스타일이 그대로인지 확인합니다.

---

## 2026-09-28 디자인 리뉴얼 (모던 다크 스타일)


### Context
`resume/index.html`은 기능(다크모드, 섹션 하이라이트, 필터, 인쇄)은 갖췄지만 디자인이 평범합니다. 가운데 정렬 Hero, `max-w-5xl` 좁은 폭, 섹션마다 다른 간격, 단순한 카드 때문입니다. 사용자가 준 참고 이미지(짙은 남색 배경, 보라 포인트, 2단 Hero와 원형 그라디언트 프로필, 떠 있는 통계 카드, 통계 바, 유리 느낌 카드)처럼 **모던하고 세련된 디자인**으로 바꾸고, **레이아웃과 간격을 일관되게** 맞춥니다.

사용자 결정:
- **다크 기본 + 토글 유지**: 처음 방문하면 다크로 시작합니다. 라이트 모드도 같은 디자인 언어로 다듬습니다.
- **구조까지 재구성**: 섹션, 콘텐츠, `id`는 유지하고 배치를 참고 이미지처럼 바꿉니다.
- **Skills는 배지 유지**: % 막대는 넣지 않고(새 수치를 만들지 않음) 아이콘 카드와 칩으로 개선합니다.


### 수정 파일
- `resume/src/input.css`: 토큰, 컴포넌트, 인쇄 스타일
- `resume/index.html`: 전 섹션 마크업
- `resume/js/main.js`: 인쇄 시 라이트 전환만 추가
- `resume/dist/output.css`: 빌드 결과, 함께 커밋
- `CLAUDE.md`(resume 아키텍처 절), `resume/roadmap.md`
- `summary.html`과 `assets/resume.pdf`는 **건드리지 않습니다**. 콘텐츠가 바뀌지 않기 때문입니다.

#### 1. 디자인 시스템 (`src/input.css`)

**토큰(`@theme`)**
- `brand-*`를 참고 이미지의 보라(violet) 계열로 바꿉니다. 대략 `500 #7c5cff`, `600 #6a45f5`, `400 #9580ff`이고 50~900 단계를 둡니다. 클래스 이름은 그대로라 기존 마크업이 유지됩니다. 대비 조건: `brand-600`은 흰 배경에서, `brand-400`은 다크 배경에서 4.5:1 이상이어야 합니다.
- 다크 표면색 `night-*`를 추가합니다. `950 #07070d`(배경), `900 #0c0c16`(교차 섹션), `850 #12121f`(카드).
- 폰트는 Pretendard를 그대로 씁니다. 제목은 `font-extrabold tracking-tight`로 인상을 줍니다.

**간격 규칙(일관성의 핵심)**
| 요소 | 값 |
| --- | --- |
| 컨테이너 `.container-page` | `max-w-6xl px-4 sm:px-6 lg:px-8` |
| 헤더 높이 | `h-18`, 섹션 `scroll-mt-18` |
| 섹션 `.section` | `py-20 sm:py-24` (모든 섹션 동일) |
| 섹션 헤더 → 본문 | `mb-12` 고정 |
| 그리드 간격 | `gap-6` 통일 |
| 카드 안쪽 | `p-6` (SNS처럼 작은 카드만 `!p-5`) |
| 모서리 | 카드 `rounded-2xl`, 버튼·아이콘 타일 `rounded-xl`, 칩 `rounded-lg` |
- 섹션 배경은 번갈아 씁니다. 기본은 `night-950`, 교차 섹션은 `bg-slate-50 dark:bg-night-900`입니다.

**컴포넌트(`@layer components`)**. 기존 이름은 유지하고 스타일만 바꿉니다.
- `.section-head`: flex, 왼쪽 제목 묶음과 오른쪽 부가 요소(필터 등). `.eyebrow`: 작은 대문자 보라 라벨(예: `ABOUT`). `.section-title`: `text-3xl sm:text-4xl`. 기존 `::after` 막대는 eyebrow로 대체합니다.
- `.btn`: `rounded-xl px-6 py-3`. `.btn-primary`: 보라 + `shadow-lg shadow-brand-600/30` 글로우. `.btn-outline`: 다크는 `border-white/15 hover:bg-white/5`. `.btn-sm`: 헤더용.
- `.card`: `rounded-2xl`, 다크는 `bg-night-850 border-white/8`. `.card-hover`(신규): 살짝 떠오르며 보라 테두리.
- `.icon-tile`(신규): `size-12 rounded-xl` 아이콘 배경.
- `.badge`: 칩 형태. 다크는 `bg-white/5 border-white/10 text-slate-300`, 라이트는 `bg-slate-100 text-slate-700`.
- `.nav-link[aria-current]`: 보라 글자 + 아래에 `::after` 점 표시(참고 이미지의 Home 표시).
- `.filter-btn`: 칩 형태로 맞춤.
- `.dot-grid`(신규): radial-gradient 점 패턴(Hero 장식). `.text-gradient`(신규): 보라→자홍 그라디언트 글자.
- `.reveal` 규칙은 그대로 둡니다.

**인쇄**: `.text-gradient`는 인쇄 때 배경이 빠져 글자가 투명해지므로 `@media print`에서 단색으로 되돌립니다. 장식 요소(점 패턴, 글로우, 떠 있는 카드)에는 `print:hidden`을 붙입니다.

### 2. 섹션별 마크업 (`index.html`)
블록 주석 형식, `id`, `aria-labelledby`, SVG 스프라이트 재사용 규칙은 유지합니다. 아이콘 SVG는 인라인으로 추가합니다.

- **Header**: `</>` 아이콘 + 김**개발**(보라) 로고. 메뉴 맨 앞에 `홈(#hero)` 링크를 추가해 8개가 되므로, 데스크톱 메뉴 전환 기준을 `md`에서 **`lg`**로 올립니다(`#nav-menu`의 `lg:static lg:flex …`, `#menu-toggle`의 `lg:hidden`). 오른쪽에는 테마 토글과 `요약본 PDF` 다운로드 버튼(`.btn-outline .btn-sm`, 다운로드 아이콘, `sm` 이상에서 표시)을 둡니다.
- **Hero**: `lg:grid-cols-2`, 배경에 흐릿한 보라 글로우를 둡니다.
  - 왼쪽: `👋 안녕하세요, 저는` 알약 라벨, `h1#hero-title` "김**개발**"(`text-5xl sm:text-6xl lg:text-7xl`, 성은 흰색, 이름은 `.text-gradient`), `프론트엔드 개발자`(`text-2xl`), 소개 문단, CTA(`연락하기 →` primary / `프로젝트 보기` outline), "Follow me" 줄(스프라이트 github, linkedin, x, blog 아이콘 재사용).
  - 오른쪽: 원형 그라디언트(`from-brand-500 to-brand-700`) 위에 `profile.svg`, 뒤에 `.dot-grid`, 떠 있는 유리 카드 2개(3년+ 실무 경력 / 12개 프로젝트)를 둡니다. 떠 있는 카드는 아래 통계 바와 내용이 겹치므로 `aria-hidden="true"`로 처리하고 `sm` 이상에서만 보여 줍니다.
  - **통계 바**(Hero 안쪽 아래): 카드 1개를 4칸으로 나누고(`sm:grid-cols-2 lg:grid-cols-4`, 칸 사이 구분선) 색 아이콘 타일을 둡니다. 3년+ 실무 경력(보라 `</>`), 12개 완료 프로젝트(emerald 체크), 95+ Lighthouse 접근성(amber 상장), 15개 사용 기술(pink, Skills 배지 6+4+5를 센 값이라 새 사실이 아님). 색 클래스는 전체 문자열로 씁니다.
- **About**: 기존 통계 목록은 통계 바로 옮겨 중복을 없앱니다. `lg:grid-cols-5`로 나눠 왼쪽 3칸에 소개 문단, 오른쪽 2칸에 "개발 철학" 인용 카드(큰 따옴표 장식, 보라 테두리 강조)를 둡니다.
- **Skills**(교차 배경): 카드 3개. 각 카드에 아이콘 타일(Frontend 모니터 / Backend 서버 / Tools 렌치), 제목, "6개 기술" 같은 보조 줄, 칩 목록을 둡니다.
- **Experience**: `ol` 타임라인은 유지합니다. 각 항목은 카드이고, 보라 점 + 그라디언트 세로선, 기간은 `.badge` 형태로 둡니다. `lg`에서는 기간 칸 + 내용 칸 2열입니다.
- **Projects**(교차 배경): `.section-head` 오른쪽에 필터 버튼을 둡니다(`md` 이상 오른쪽 정렬). 카드 위쪽에 이미지 없이 만든 썸네일을 둡니다. 카드마다 다른 그라디언트, 브라우저 창 점 3개, 가운데 아이콘으로 구성하며 `aria-hidden`입니다. 카드는 `!p-0 overflow-hidden`, 본문은 `p-6`. 링크는 `GitHub ↗`, `데모 ↗` 형태입니다. `data-category`와 `#project-list`는 유지합니다.
- **Education**: 카드 2개에 아이콘 타일(학사모 / 인증서)을 추가합니다.
- **SNS**(교차 배경): 카드 구조와 브랜드 호버 색은 유지합니다. 아이콘 배경을 `rounded-xl`로 바꾸고, 오른쪽에 호버 때 움직이는 `↗` 화살표를 추가합니다.
- **Contact**: 가운데에 큰 CTA 카드(`rounded-3xl`, 보라 그라디언트 + 글로우)를 둡니다. eyebrow `CONTACT`, `h2#contact-title`, 안내 문구, 버튼은 메일(흰 배경)과 `#print-btn` 인쇄 버튼(흰 테두리)입니다. `#print-btn`은 Hero에서 이곳으로 옮깁니다. `main.js`는 id로 찾으므로 영향이 없습니다.
- **Footer / 맨 위로 버튼**: 로고 + 저작권 + 아이콘 + 맨 위로. 테두리는 `dark:border-white/5`, 맨 위로 버튼은 `rounded-xl` + 글로우입니다.

### 3. 동작 변경
- **다크 기본**: `<head>` 인라인 스크립트 조건을 `saved !== "light"`이면 `dark`로 바꿉니다(시스템 설정 무시, 저장값 우선). `main.js`의 토글 저장 로직은 그대로입니다. `meta theme-color`는 `#07070d`로 바꿉니다.
- **인쇄 시 라이트 전환**(`main.js`): 다크가 기본이 되면 인쇄 때 흰 배경 위에 다크 카드와 흰 글자가 찍히는 문제가 생깁니다. `beforeprint`에서 `dark` 클래스를 잠시 빼고 `afterprint`에서 원래대로 돌립니다(저장값은 건드리지 않음).

### 4. 문서
- `CLAUDE.md`의 resume 절: 컴포넌트 목록에 `.section-head`, `.eyebrow`, `.card-hover`, `.icon-tile`, `.dot-grid`, `.text-gradient`를 추가하고, 다크 기본(`saved !== "light"`), 메뉴 기준 `lg`, `beforeprint` 라이트 전환, `.text-gradient`의 인쇄 예외를 적습니다.
- `resume/roadmap.md`: "디자인 리뉴얼" 항목을 체크박스로 추가하고, 확인하지 못한 항목에는 메모를 남깁니다.

### 검증
1. `resume/`에서 `npm run build`가 오류 없이 끝나는지 확인합니다.
2. `python3 -m http.server 8000`을 띄우고 Chrome MCP로 `http://localhost:8000`을 엽니다. 1440px, 768px, 375px에서 다크와 라이트 각각 스크린샷을 찍어 참고 이미지와 비교하고, 가로 스크롤이 없는지와 간격이 일관된지 봅니다.
3. 동작 확인
   - 첫 방문 다크: `localStorage`를 지운 뒤 새로고침합니다.
   - 토글 유지와 새로고침 후 FOUC가 없는지 봅니다.
   - 스크롤할 때 메뉴 하이라이트 점이 이동하는지 봅니다(`홈` 포함).
   - `lg` 미만에서 햄버거 열기/닫기, Esc, 링크 클릭 시 닫힘을 확인합니다.
   - 프로젝트 필터, 맨 위로 버튼, reveal 애니메이션을 확인합니다.
   - 요약본 PDF 다운로드 링크를 확인합니다.
   - 콘솔 오류가 없는지 봅니다.
4. 인쇄: 다크 상태에서 인쇄 미리보기를 열어 흰 배경, 검정 글자, 그라디언트 글자가 제대로 보이는지 확인합니다.
5. 대비: 보조 텍스트(`slate-600` / `dark:slate-400`)와 보라 링크 색이 4.5:1 이상인지 JS로 계산하거나 DevTools로 확인합니다.
