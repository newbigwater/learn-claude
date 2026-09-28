import { memo } from "react";
import { html } from "../lib/html.js";
import TodoItem from "./TodoItem.js";

function TodoList({ todos, totalCount, filtered, categories, tagSuggestions, activeTag, handlers }) {
  if (todos.length === 0) {
    return html`
      <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
        ${totalCount === 0
          ? "아직 할 일이 없습니다. 위에서 첫 할 일을 추가해 보세요."
          : filtered
            ? "조건에 맞는 할 일이 없습니다. 필터를 바꿔 보세요."
            : "표시할 할 일이 없습니다."}
      </div>
    `;
  }

  return html`
    <ul className="space-y-3">
      ${todos.map(
        (todo) => html`
          <${TodoItem}
            key=${todo.id}
            todo=${todo}
            category=${categories.find((category) => category.id === todo.categoryId)}
            categories=${categories}
            tagSuggestions=${tagSuggestions}
            activeTag=${activeTag}
            ...${handlers}
          />
        `,
      )}
    </ul>
  `;
}

export default memo(TodoList);
