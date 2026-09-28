import { request } from "./client";

export const fetchTodos = () => request("/todos");

// id는 json-server가 생성하고, 생성·수정 시각은 클라이언트에서 기록한다.
export const createTodo = (data) => {
  const now = new Date().toISOString();
  return request("/todos", {
    method: "POST",
    body: { completed: false, ...data, createdAt: now, updatedAt: now },
  });
};

export const patchTodo = (id, patch) =>
  request(`/todos/${id}`, {
    method: "PATCH",
    body: { ...patch, updatedAt: new Date().toISOString() },
  });

export const deleteTodo = (id) => request(`/todos/${id}`, { method: "DELETE" });
