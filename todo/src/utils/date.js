// 날짜는 모두 'YYYY-MM-DD' 문자열로 다룬다. (시간대 오차를 피하려고 UTC 기준으로 일수를 계산)

const pad = (n) => String(n).padStart(2, "0");

// 사용자의 로컬 날짜 기준 오늘 (toISOString은 UTC라 자정 무렵에 하루가 어긋난다)
export function todayString(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function toDayNumber(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

// 마감일까지 남은 일수 (오늘 = 0, 지남 = 음수)
export function daysUntil(dueDate, today = todayString()) {
  return toDayNumber(dueDate) - toDayNumber(today);
}

// 마감 상태: overdue(기한 지남) / today(오늘 마감) / soon(3일 이내) / normal / none
export function getDueStatus(dueDate, completed, today = todayString()) {
  if (!dueDate) return { status: "none", label: "" };
  const diff = daysUntil(dueDate, today);

  if (completed) return { status: "normal", label: dueDate };
  if (diff < 0) return { status: "overdue", label: `${-diff}일 지남` };
  if (diff === 0) return { status: "today", label: "오늘 마감" };
  if (diff <= 3) return { status: "soon", label: `D-${diff}` };
  return { status: "normal", label: dueDate };
}
