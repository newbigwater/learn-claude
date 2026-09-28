import { useState } from "react";
import PriorityBadge from "./PriorityBadge";
import TodoForm from "./TodoForm";
import { colorOf } from "../utils/colors";
import { getDueStatus } from "../utils/date";

const DUE_STYLES = {
  overdue: "bg-red-600 text-white",
  today: "bg-orange-500 text-white",
  soon: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  normal: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const actionClass =
  "rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

export default function TodoItem({ todo, category, categories, tagSuggestions, activeTag, onToggle, onUpdate, onRemove, onTagClick }) {
  const [editing, setEditing] = useState(false);
  const due = getDueStatus(todo.dueDate, todo.completed);

  if (editing) {
    return (
      <li className="rounded-xl border border-indigo-300 bg-white p-4 dark:border-indigo-500/50 dark:bg-slate-900">
        <TodoForm
          initial={todo}
          categories={categories}
          tagSuggestions={tagSuggestions}
          submitLabel="저장"
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            const ok = await onUpdate(todo.id, values);
            if (ok) setEditing(false);
            return ok;
          }}
        />
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`${todo.title} 완료 표시`}
          className="mt-1 size-4 shrink-0 accent-indigo-600"
        />

        <div className="min-w-0 flex-1">
          <p className={`break-words font-medium ${todo.completed ? "text-slate-500 line-through dark:text-slate-400" : ""}`}>
            {todo.title}
          </p>
          {todo.memo && <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-500 dark:text-slate-400">{todo.memo}</p>}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {category && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorOf(category.color).chip}`}>
                {category.name}
              </span>
            )}
            <PriorityBadge priority={todo.priority} />
            {due.status !== "none" && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DUE_STYLES[due.status]}`}>
                {due.status === "normal" || due.status === "soon" ? "마감 " : ""}
                {due.label}
              </span>
            )}
            {todo.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                aria-pressed={activeTag === tag}
                aria-label={`${tag} 태그로 필터`}
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTag === tag
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-200 dark:hover:bg-indigo-500/30"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={() => setEditing(true)} aria-label={`${todo.title} 수정`} className={actionClass}>
            수정
          </button>
          <button
            type="button"
            onClick={() => onRemove(todo.id)}
            aria-label={`${todo.title} 삭제`}
            className={`${actionClass} hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-500/10`}
          >
            삭제
          </button>
        </div>
      </div>
    </li>
  );
}
