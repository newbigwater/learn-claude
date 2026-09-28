import { html } from "../lib/html.js";
import { PRIORITY_LABEL } from "../utils/todos.js";

const STYLES = {
  high: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  low: "bg-slate-200 text-slate-700 dark:bg-slate-500/30 dark:text-slate-200",
};

export default function PriorityBadge({ priority }) {
  return html`
    <span className=${`rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[priority]}`}>
      우선순위 ${PRIORITY_LABEL[priority]}
    </span>
  `;
}
