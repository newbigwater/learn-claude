# learn-claude

Claude Code를 학습하며 만든 결과물을 폴더 단위로 정리하는 저장소입니다.

## 폴더 목록

| 폴더 | 설명 |
| --- | --- |
| [`resume/`](./resume) | 개발자 웹 이력서 (HTML5 + TailwindCSS v4 + Vanilla JS 정적 페이지) |
| [`todo/`](./todo) | Todo 앱 (React + htm + TailwindCSS v4, 빌드 없이 Live Server로 실행, localStorage 저장). 구현 완료 (재설계 후 일부 항목 재검증 필요) — [`roadmap.md`](./todo/roadmap.md) |

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
├── summary.html      # A4 1장 요약본 (Tailwind 없이 인라인 CSS, PDF 생성 원본)
├── js/main.js        # 다크모드, 모바일 메뉴, 섹션 하이라이트, 스크롤 애니메이션, 프로젝트 필터
├── assets/images/    # 프로필, 파비콘 (SVG 플레이스홀더)
├── assets/resume.pdf # 요약본 PDF (npm run pdf로 생성, Hero 다운로드 버튼이 연결)
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
