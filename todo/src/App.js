import { useCallback, useMemo, useState } from "react";
import CategorySidebar from "./components/CategorySidebar.js";
import FilterBar from "./components/FilterBar.js";
import TodoForm from "./components/TodoForm.js";
import TodoList from "./components/TodoList.js";
import { useCategories } from "./hooks/useCategories.js";
import { useContentMemo } from "./hooks/useContentMemo.js";
import { useTheme } from "./hooks/useTheme.js";
import { useTodos } from "./hooks/useTodos.js";
import { html } from "./lib/html.js";
import { DEFAULT_FILTERS, collectTags, filterTodos, hasActiveFilter, sortTodos } from "./utils/todos.js";

export default function App() {
  const {
    todos,
    loading,
    loadError,
    actionError,
    clearActionError,
    reload,
    addTodo,
    updateTodo,
    toggleTodo,
    removeTodo,
    unassignCategory,
  } = useTodos();
  const { categories, error: categoryError, addCategory, updateCategory, removeCategory } = useCategories();
  const { dark, toggle: toggleTheme } = useTheme();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("created");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 자식에게 내려가는 콜백은 모두 useCallback으로 identity를 유지한다. (memo된 자식이 불필요하게 다시 그려지지 않도록)
  // 현재 filters 값을 읽어야 하는 로직은 함수형 setState로 처리해 의존성을 없앤다.
  const patchFilters = useCallback((patch) => setFilters((current) => ({ ...current, ...patch })), []);
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const selectCategory = useCallback((id) => patchFilters({ categoryId: id }), [patchFilters]);
  const toggleTag = useCallback(
    (tag) => setFilters((current) => ({ ...current, tag: current.tag === tag ? null : tag })),
    [],
  );

  const visibleTodos = useMemo(() => sortTodos(filterTodos(todos, filters), sort), [todos, filters, sort]);

  // 파생 데이터는 내용이 같으면 같은 객체를 유지한다. (예: 완료 토글은 개수·태그를 바꾸지 않는다)
  const tags = useContentMemo(useMemo(() => collectTags(todos), [todos]));
  const tagNames = useMemo(() => tags.map(({ tag }) => tag), [tags]);

  // 사이드바에 표시할 개수는 필터와 무관하게 전체 할 일 기준
  const counts = useContentMemo(
    useMemo(() => {
      const result = { all: todos.length, none: 0 };
      todos.forEach((todo) => {
        if (todo.categoryId) result[todo.categoryId] = (result[todo.categoryId] ?? 0) + 1;
        else result.none += 1;
      });
      return result;
    }, [todos]),
  );

  // 카테고리 삭제: 소속 할 일을 먼저 미분류로 바꾼 뒤(모두 성공해야) 카테고리를 지운다.
  const handleRemoveCategory = useCallback(
    async (id) => {
      if (!(await unassignCategory(id))) return;
      if (await removeCategory(id)) {
        setFilters((current) => (current.categoryId === id ? { ...current, categoryId: "all" } : current));
      }
    },
    [unassignCategory, removeCategory],
  );

  const handlers = useMemo(
    () => ({ onToggle: toggleTodo, onUpdate: updateTodo, onRemove: removeTodo, onTagClick: toggleTag }),
    [toggleTodo, updateTodo, removeTodo, toggleTag],
  );

  return html`
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Todo<span className="text-indigo-500">.</span></h1>
          <button
            type="button"
            onClick=${toggleTheme}
            aria-pressed=${dark}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ${dark ? "라이트 모드" : "다크 모드"}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[16rem_1fr]">
        <div>
          <!-- 좁은 화면에서는 사이드바를 접어 두고, lg 이상에서는 항상 표시 -->
          <button
            type="button"
            onClick=${() => setSidebarOpen((open) => !open)}
            aria-expanded=${sidebarOpen}
            aria-controls="sidebar"
            className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900 lg:hidden"
          >
            <span>카테고리 · 태그</span>
            <span aria-hidden="true">${sidebarOpen ? "▲" : "▼"}</span>
          </button>
          <div id="sidebar" className=${sidebarOpen ? "mt-3 block" : "hidden lg:block"}>
            <${CategorySidebar}
              categories=${categories}
              counts=${counts}
              selected=${filters.categoryId}
              onSelect=${selectCategory}
              onAdd=${addCategory}
              onRename=${updateCategory}
              onRemove=${handleRemoveCategory}
              tags=${tags}
              activeTag=${filters.tag}
              onTagSelect=${toggleTag}
              error=${categoryError}
            />
          </div>
        </div>

        <main className="min-w-0 space-y-6">
          <section aria-label="할 일 추가" className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <${TodoForm} categories=${categories} tagSuggestions=${tagNames} onSubmit=${addTodo} />
          </section>

          ${actionError &&
          html`
            <div role="alert" className="flex items-start justify-between gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              <span>${actionError}</span>
              <button type="button" onClick=${clearActionError} aria-label="오류 메시지 닫기" className="font-bold">×</button>
            </div>
          `}

          <${FilterBar}
            filters=${filters}
            onChange=${patchFilters}
            sort=${sort}
            onSortChange=${setSort}
            resultCount=${visibleTodos.length}
            canReset=${hasActiveFilter(filters)}
            onReset=${resetFilters}
          />

          ${loading
            ? html`<p role="status" className="py-12 text-center text-slate-600 dark:text-slate-400">불러오는 중…</p>`
            : loadError
              ? html`
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    <p>${loadError}</p>
                    <button type="button" onClick=${reload} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                      다시 시도
                    </button>
                  </div>
                `
              : html`
                  <${TodoList}
                    todos=${visibleTodos}
                    totalCount=${todos.length}
                    filtered=${hasActiveFilter(filters)}
                    categories=${categories}
                    tagSuggestions=${tagNames}
                    activeTag=${filters.tag}
                    handlers=${handlers}
                  />
                `}
        </main>
      </div>
    </div>
  `;
}
