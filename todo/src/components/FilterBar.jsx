import { PRIORITIES, PRIORITY_LABEL, SORT_OPTIONS } from "../utils/todos";

const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "done", label: "완료" },
];

const controlClass =
  "rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700";

export default function FilterBar({ filters, onChange, sort, onSortChange, resultCount, canReset, onReset }) {
  return (
    <section aria-label="필터와 정렬" className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="제목·메모 검색"
          aria-label="제목·메모 검색"
          className={`${controlClass} min-w-40 flex-1`}
        />

        <div role="group" aria-label="상태 필터" className="flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ status: option.value })}
              aria-pressed={filters.status === option.value}
              className={`px-3 py-2 text-sm ${
                filters.status === option.value
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <select
          value={filters.priority}
          onChange={(event) => onChange({ priority: event.target.value })}
          aria-label="우선순위 필터"
          className={controlClass}
        >
          <option value="all">우선순위 전체</option>
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              우선순위 {PRIORITY_LABEL[priority]}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(event) => onSortChange(event.target.value)} aria-label="정렬" className={controlClass}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
        <span>{resultCount}개</span>
        {filters.tag && (
          <button
            type="button"
            onClick={() => onChange({ tag: null })}
            className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200"
            aria-label={`${filters.tag} 태그 필터 해제`}
          >
            #{filters.tag} ×
          </button>
        )}
        {canReset && (
          <button type="button" onClick={onReset} className="text-xs underline hover:text-indigo-600 dark:hover:text-indigo-400">
            필터 초기화
          </button>
        )}
      </div>
    </section>
  );
}
