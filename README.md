# learn-claude

Claude Code를 학습하며 만든 결과물을 폴더 단위로 정리하는 저장소입니다.

## 폴더 목록

| 폴더 | 설명 |
| --- | --- |
| [`resume/`](./resume) | 개발자 웹 이력서 (HTML5 + TailwindCSS v4 + Vanilla JS 정적 페이지) |
| [`todo/`](./todo) | Todo 앱 (React + Vite + TailwindCSS v4 + json-server). 핵심 기능 구현 완료, 반응형·접근성 등 일부 항목은 확인 필요 — [`roadmap.md`](./todo/roadmap.md) |

> 새 폴더를 추가하면 위 표에 한 줄씩 추가합니다.

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
├── js/main.js        # 다크모드, 모바일 메뉴, 섹션 하이라이트, 스크롤 애니메이션, 프로젝트 필터
├── assets/images/    # 프로필, 파비콘 (SVG 플레이스홀더)
└── roadmap.md        # 개발 로드맵 및 진행 현황
```

### 실행

`resume/` 폴더에서 실행합니다.

```bash
npm install                    # 최초 1회
npm run dev                    # Tailwind watch 빌드
npm run build                  # minify 빌드
python3 -m http.server 8000    # 미리보기 (http://localhost:8000)
```
