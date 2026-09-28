import { memo, useId, useState } from "react";
import { html } from "../lib/html.js";
import { PRIORITIES, PRIORITY_LABEL } from "../utils/todos.js";
import TagInput from "./TagInput.js";

const EMPTY = { title: "", memo: "", categoryId: "", priority: "medium", dueDate: "", tags: [] };

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:[color-scheme:dark]";
const labelClass = "mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400";

// 추가와 수정에서 함께 쓰는 폼. initial이 있으면 수정 모드로 동작한다.
// onSubmit은 성공 여부(boolean)를 반환하는 Promise를 돌려주고, 추가 성공 시에만 입력을 비운다.
function TodoForm({ categories, tagSuggestions, initial, submitLabel = "추가", onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initial
      ? { ...EMPTY, ...initial, categoryId: initial.categoryId ?? "", dueDate: initial.dueDate ?? "", memo: initial.memo ?? "" }
      : EMPTY,
  );
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const id = useId();

  const set = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = values.title.trim();
    if (!title) {
      setShowError(true);
      return;
    }

    setSubmitting(true);
    const ok = await onSubmit({
      title,
      memo: values.memo.trim(),
      categoryId: values.categoryId || null,
      priority: values.priority,
      dueDate: values.dueDate || null,
      tags: values.tags,
    });
    setSubmitting(false);

    if (ok && !initial) {
      setValues(EMPTY);
      setShowError(false);
    }
  };

  return html`
    <form onSubmit=${handleSubmit} className="space-y-3" noValidate>
      <div>
        <label htmlFor=${`${id}-title`} className=${labelClass}>할 일</label>
        <input
          id=${`${id}-title`}
          value=${values.title}
          onChange=${(event) => {
            set("title")(event);
            setShowError(false);
          }}
          placeholder="무엇을 해야 하나요?"
          aria-invalid=${showError}
          aria-describedby=${showError ? `${id}-error` : undefined}
          className=${fieldClass}
        />
        ${showError &&
        html`
          <p id=${`${id}-error`} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
            할 일 제목을 입력해 주세요.
          </p>
        `}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor=${`${id}-category`} className=${labelClass}>카테고리</label>
          <select id=${`${id}-category`} value=${values.categoryId} onChange=${set("categoryId")} className=${fieldClass}>
            <option value="">미분류</option>
            ${categories.map((category) => html`<option key=${category.id} value=${category.id}>${category.name}</option>`)}
          </select>
        </div>
        <div>
          <label htmlFor=${`${id}-priority`} className=${labelClass}>우선순위</label>
          <select id=${`${id}-priority`} value=${values.priority} onChange=${set("priority")} className=${fieldClass}>
            ${PRIORITIES.map((priority) => html`<option key=${priority} value=${priority}>${PRIORITY_LABEL[priority]}</option>`)}
          </select>
        </div>
        <div>
          <label htmlFor=${`${id}-due`} className=${labelClass}>마감일</label>
          <input id=${`${id}-due`} type="date" value=${values.dueDate} onChange=${set("dueDate")} className=${fieldClass} />
        </div>
      </div>

      <${TagInput}
        tags=${values.tags}
        onChange=${(tags) => setValues((current) => ({ ...current, tags }))}
        suggestions=${tagSuggestions}
      />

      <div>
        <label htmlFor=${`${id}-memo`} className=${labelClass}>메모</label>
        <textarea id=${`${id}-memo`} rows=${2} value=${values.memo} onChange=${set("memo")} className=${fieldClass} />
      </div>

      <div className="flex justify-end gap-2">
        ${onCancel &&
        html`
          <button
            type="button"
            onClick=${onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            취소
          </button>
        `}
        <button
          type="submit"
          disabled=${submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          ${submitLabel}
        </button>
      </div>
    </form>
  `;
}

export default memo(TodoForm);
