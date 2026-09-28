import { useId, useState } from "react";
import { CATEGORY_COLORS, colorOf } from "../utils/colors";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-transparent px-2 py-1 text-sm outline-none focus:border-indigo-500 dark:border-slate-700";

// 카테고리 한 줄: 선택 / 이름 수정 / 삭제(2단계 확인)
function CategoryRow({ category, count, selected, onSelect, onRename, onRemove }) {
  const [mode, setMode] = useState("view"); // view | edit | confirm
  const [name, setName] = useState(category.name);

  if (mode === "edit") {
    return (
      <li>
        <form
          className="flex gap-1"
          onSubmit={async (event) => {
            event.preventDefault();
            const trimmed = name.trim();
            if (trimmed && (trimmed === category.name || (await onRename(category.id, { name: trimmed })))) setMode("view");
          }}
        >
          <input value={name} onChange={(event) => setName(event.target.value)} aria-label="카테고리 이름" className={inputClass} autoFocus />
          <button type="submit" className="rounded-md px-2 text-xs text-indigo-600 hover:bg-slate-100 dark:text-indigo-400 dark:hover:bg-slate-800">
            저장
          </button>
          <button
            type="button"
            onClick={() => {
              setName(category.name);
              setMode("view");
            }}
            className="rounded-md px-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            취소
          </button>
        </form>
      </li>
    );
  }

  if (mode === "confirm") {
    return (
      <li className="rounded-md bg-red-50 p-2 text-xs dark:bg-red-500/10">
        <p className="mb-1 text-red-700 dark:text-red-300">
          '{category.name}'을(를) 삭제할까요? 해당 할 일은 미분류로 바뀝니다.
        </p>
        <div className="flex gap-1">
          <button type="button" onClick={() => onRemove(category.id)} className="rounded-md bg-red-600 px-2 py-1 text-white hover:bg-red-700">
            삭제
          </button>
          <button type="button" onClick={() => setMode("view")} className="rounded-md px-2 py-1 hover:bg-white dark:hover:bg-slate-800">
            취소
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-1">
      <button
        type="button"
        onClick={() => onSelect(category.id)}
        aria-pressed={selected}
        className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
          selected ? "bg-indigo-100 font-semibold dark:bg-indigo-500/20" : "hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <span className={`size-2.5 shrink-0 rounded-full ${colorOf(category.color).dot}`} aria-hidden="true" />
        <span className="truncate">{category.name}</span>
        <span className="ml-auto text-xs text-slate-400">{count}</span>
      </button>
      <button
        type="button"
        onClick={() => setMode("edit")}
        aria-label={`${category.name} 이름 수정`}
        className="rounded-md px-1.5 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        수정
      </button>
      <button
        type="button"
        onClick={() => setMode("confirm")}
        aria-label={`${category.name} 삭제`}
        className="rounded-md px-1.5 py-1 text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
      >
        삭제
      </button>
    </li>
  );
}

export default function CategorySidebar({
  categories,
  counts, // { all, none, [categoryId]: number }
  selected,
  onSelect,
  onAdd,
  onRename,
  onRemove,
  tags, // [{ tag, count }]
  activeTag,
  onTagSelect,
  error,
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const id = useId();

  const rowClass = (active) =>
    `flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm ${
      active ? "bg-indigo-100 font-semibold dark:bg-indigo-500/20" : "hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <aside aria-label="카테고리와 태그" className="space-y-6">
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">카테고리</h2>
        {error && (
          <p role="alert" className="mb-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <ul className="space-y-0.5">
          <li>
            <button type="button" onClick={() => onSelect("all")} aria-pressed={selected === "all"} className={rowClass(selected === "all")}>
              <span>전체</span>
              <span className="text-xs text-slate-400">{counts.all}</span>
            </button>
          </li>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              count={counts[category.id] ?? 0}
              selected={selected === category.id}
              onSelect={onSelect}
              onRename={onRename}
              onRemove={onRemove}
            />
          ))}
          <li>
            <button type="button" onClick={() => onSelect("none")} aria-pressed={selected === "none"} className={rowClass(selected === "none")}>
              <span>미분류</span>
              <span className="text-xs text-slate-400">{counts.none}</span>
            </button>
          </li>
        </ul>

        <form
          className="mt-3 space-y-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const trimmed = name.trim();
            if (trimmed && (await onAdd({ name: trimmed, color }))) setName("");
          }}
        >
          <label htmlFor={`${id}-name`} className="sr-only">
            새 카테고리 이름
          </label>
          <input id={`${id}-name`} value={name} onChange={(event) => setName(event.target.value)} placeholder="새 카테고리" className={inputClass} />
          <div className="flex gap-2">
            <label htmlFor={`${id}-color`} className="sr-only">
              카테고리 색상
            </label>
            <select id={`${id}-color`} value={color} onChange={(event) => setColor(event.target.value)} className={`${inputClass} flex-1`}>
              {Object.entries(CATEGORY_COLORS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700">
              추가
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">태그</h2>
        {tags.length === 0 ? (
          <p className="text-xs text-slate-400">아직 태그가 없습니다.</p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => onTagSelect(tag)}
                  aria-pressed={activeTag === tag}
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeTag === tag
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-200 dark:hover:bg-indigo-500/30"
                  }`}
                >
                  #{tag} <span className="opacity-70">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
