import { useId, useState } from "react";
import { html } from "../lib/html.js";

// Enter 또는 쉼표로 태그를 추가하고, 빈 입력에서 Backspace로 마지막 태그를 지운다.
export default function TagInput({ tags, onChange, suggestions = [] }) {
  const [draft, setDraft] = useState("");
  const inputId = useId();
  const listId = useId();

  const commit = () => {
    const tag = draft.trim().replace(/^#/, "");
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft("");
  };

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return; // 한글 입력 조합 중에는 무시
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault(); // Enter가 폼 제출로 이어지지 않도록 막는다
      commit();
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return html`
    <div>
      <label htmlFor=${inputId} className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
        태그
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 px-2 py-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30 dark:border-slate-700">
        ${tags.map(
          (tag) => html`
            <span
              key=${tag}
              className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200"
            >
              #${tag}
              <button
                type="button"
                onClick=${() => onChange(tags.filter((t) => t !== tag))}
                aria-label=${`${tag} 태그 삭제`}
                className="rounded-full px-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-400/30"
              >
                ×
              </button>
            </span>
          `,
        )}
        <input
          id=${inputId}
          list=${listId}
          value=${draft}
          onChange=${(event) => setDraft(event.target.value)}
          onKeyDown=${handleKeyDown}
          onBlur=${commit}
          placeholder=${tags.length ? "" : "입력 후 Enter"}
          className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
        />
        <datalist id=${listId}>
          ${suggestions
            .filter((tag) => !tags.includes(tag))
            .map((tag) => html`<option key=${tag} value=${tag} />`)}
        </datalist>
      </div>
    </div>
  `;
}
