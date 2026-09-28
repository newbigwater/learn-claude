import { useState } from "react";

// 다크모드 상태. 초기 적용은 index.html의 인라인 스크립트가 담당하고, 여기서는 토글과 저장만 한다.
export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // 저장소를 쓸 수 없는 환경에서는 저장만 건너뜀
    }
    setDark(next);
  };

  return { dark, toggle };
}
