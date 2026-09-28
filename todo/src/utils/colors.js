// Tailwind는 클래스 이름을 문자열 그대로 스캔하므로, 동적 조합 대신 전체 클래스를 나열한다.
export const CATEGORY_COLORS = {
  blue: {
    label: "파랑",
    dot: "bg-blue-500",
    chip: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
  },
  amber: {
    label: "노랑",
    dot: "bg-amber-500",
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  },
  green: {
    label: "초록",
    dot: "bg-green-500",
    chip: "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200",
  },
  red: {
    label: "빨강",
    dot: "bg-red-500",
    chip: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
  },
  purple: {
    label: "보라",
    dot: "bg-purple-500",
    chip: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200",
  },
  slate: {
    label: "회색",
    dot: "bg-slate-500",
    chip: "bg-slate-200 text-slate-800 dark:bg-slate-500/30 dark:text-slate-200",
  },
};

export const colorOf = (name) => CATEGORY_COLORS[name] ?? CATEGORY_COLORS.slate;
