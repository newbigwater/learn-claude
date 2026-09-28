export const PRIORITIES = ["high", "medium", "low"];

export const PRIORITY_LABEL = { high: "높음", medium: "보통", low: "낮음" };

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export const SORT_OPTIONS = [
  { value: "created", label: "최신순" },
  { value: "due", label: "마감일순" },
  { value: "priority", label: "우선순위순" },
];

export const DEFAULT_FILTERS = {
  status: "all", // all | active | done
  categoryId: "all", // all | none | 카테고리 id
  tag: null,
  priority: "all", // all | high | medium | low
  search: "",
};

// 여러 조건을 모두 만족하는 할 일만 남긴다.
export function filterTodos(todos, filters) {
  const keyword = filters.search.trim().toLowerCase();

  return todos.filter((todo) => {
    if (filters.status === "active" && todo.completed) return false;
    if (filters.status === "done" && !todo.completed) return false;

    if (filters.categoryId === "none" && todo.categoryId) return false;
    if (filters.categoryId !== "all" && filters.categoryId !== "none" && todo.categoryId !== filters.categoryId) {
      return false;
    }

    if (filters.tag && !todo.tags.includes(filters.tag)) return false;
    if (filters.priority !== "all" && todo.priority !== filters.priority) return false;

    if (keyword) {
      const haystack = `${todo.title} ${todo.memo ?? ""}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });
}

// 원본 배열은 바꾸지 않고 정렬된 새 배열을 반환한다.
export function sortTodos(todos, sortKey) {
  const copy = [...todos];

  if (sortKey === "due") {
    // 마감일이 없는 항목은 맨 뒤로
    return copy.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
  if (sortKey === "priority") {
    return copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  }
  return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// 모든 할 일의 태그를 { tag, count } 목록으로 집계 (많이 쓰인 순)
export function collectTags(todos) {
  const counts = new Map();
  todos.forEach((todo) => todo.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export const hasActiveFilter = (filters) =>
  filters.status !== "all" ||
  filters.categoryId !== "all" ||
  filters.tag !== null ||
  filters.priority !== "all" ||
  filters.search.trim() !== "";
