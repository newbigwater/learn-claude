// 이력서 페이지 인터랙션 (다크모드, 모바일 메뉴, 스크롤 효과, 프로젝트 필터)

const root = document.documentElement;

// ---------- 다크모드 토글 ----------
const themeToggle = document.getElementById("theme-toggle");

function syncThemeToggle() {
  themeToggle.setAttribute("aria-pressed", String(root.classList.contains("dark")));
}

themeToggle.addEventListener("click", () => {
  const isDark = root.classList.toggle("dark");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch (e) {
    // 저장소 접근이 막힌 환경에서는 저장만 건너뜀
  }
  syncThemeToggle();
});

syncThemeToggle();

// ---------- 모바일 햄버거 메뉴 ----------
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

function setMenuOpen(open) {
  navMenu.classList.toggle("hidden", !open);
  navMenu.classList.toggle("flex", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

// 링크 클릭 시 자동 닫힘
navMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

// Esc 키로 닫고 토글 버튼에 포커스 복귀
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

// ---------- 현재 섹션 네비게이션 하이라이트 ----------
const navLinks = [...navMenu.querySelectorAll('a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function highlightNav(id) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

// 화면 상단 고정 네비 아래 영역에 들어온 섹션을 현재 섹션으로 간주
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) highlightNav(entry.target.id);
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((section) => sectionObserver.observe(section));

// ---------- 스크롤 등장 애니메이션 ----------
const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

// ---------- 맨 위로 이동 버튼 ----------
const toTop = document.getElementById("to-top");

function updateToTop() {
  toTop.hidden = window.scrollY < 400;
}

window.addEventListener("scroll", updateToTop, { passive: true });
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
updateToTop();

// ---------- 프로젝트 카테고리 필터 ----------
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll("#project-list > li");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn === button)));
    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

// ---------- 인쇄 / PDF 저장 ----------
// (다크 상태로 인쇄해도 라이트로 나오도록 하는 처리는 input.css의 @custom-variant dark가 담당)
document.getElementById("print-btn").addEventListener("click", () => window.print());
