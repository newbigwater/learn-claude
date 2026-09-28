import { insert, list, remove, update } from "./client.js";

export const fetchTodos = () => list("todos");

// id는 저장소가 생성하고, 생성·수정 시각은 여기서 기록한다.
export const createTodo = (data) => {
  const now = new Date().toISOString();
  return insert("todos", { completed: false, ...data, createdAt: now, updatedAt: now });
};

export const patchTodo = (id, patch) => update("todos", id, { ...patch, updatedAt: new Date().toISOString() });

export const deleteTodo = (id) => remove("todos", id);
