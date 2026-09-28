// json-server 기본 URL (환경 변수로 덮어쓸 수 있음)
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// fetch 래퍼: 응답이 실패하면 Error를 던지고, JSON 본문이 없으면 null을 반환한다.
export async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("서버에 연결할 수 없습니다. API 서버(npm run api)가 실행 중인지 확인해 주세요.");
  }

  if (!response.ok) {
    throw new Error(`요청에 실패했습니다. (${response.status})`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
