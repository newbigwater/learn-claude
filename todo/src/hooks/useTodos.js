import { useCallback, useEffect, useRef, useState } from "react";
import { createTodo, deleteTodo, fetchTodos, patchTodo } from "../api/todos.js";

// 할 일 목록 상태와 CRUD를 관리한다.
// 수정/삭제는 화면을 먼저 갱신(낙관적 업데이트)하고, 요청이 실패하면 되돌린다.
// 반환하는 액션 함수는 useCallback으로 identity가 유지되어, memo된 자식이 불필요하게 다시 그려지지 않는다.
export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null); // 목록 조회 실패 (재시도 화면 표시)
  const [actionError, setActionError] = useState(null); // 추가/수정/삭제 실패 (알림 표시)

  // 함수가 todos state에 의존하면 매번 새로 만들어지므로, 최신 목록은 ref로 읽는다.
  const todosRef = useRef(todos);
  useEffect(() => {
    todosRef.current = todos;
  });

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setTodos(await fetchTodos());
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 추가: 서버가 id를 만들어 주므로 응답을 받은 뒤 목록에 넣는다. 성공 여부를 반환한다.
  const addTodo = useCallback(async (data) => {
    setActionError(null);
    try {
      const created = await createTodo(data);
      setTodos((current) => [...current, created]);
      return true;
    } catch (error) {
      setActionError(`할 일을 추가하지 못했습니다. ${error.message}`);
      return false;
    }
  }, []);

  // 수정 (완료 토글 포함): 화면 먼저 반영 → 서버 응답으로 확정 → 실패 시 이전 값 복원
  const updateTodo = useCallback(async (id, patch) => {
    const previous = todosRef.current.find((todo) => todo.id === id);
    if (!previous) return false;

    setActionError(null);
    setTodos((current) => current.map((todo) => (todo.id === id ? { ...todo, ...patch } : todo)));
    try {
      const saved = await patchTodo(id, patch);
      setTodos((current) => current.map((todo) => (todo.id === id ? saved : todo)));
      return true;
    } catch (error) {
      setTodos((current) => current.map((todo) => (todo.id === id ? previous : todo)));
      setActionError(`변경 사항을 저장하지 못했습니다. ${error.message}`);
      return false;
    }
  }, []);

  const toggleTodo = useCallback(
    (id) => {
      const target = todosRef.current.find((todo) => todo.id === id);
      return target ? updateTodo(id, { completed: !target.completed }) : Promise.resolve(false);
    },
    [updateTodo],
  );

  const removeTodo = useCallback(async (id) => {
    const previous = todosRef.current.find((todo) => todo.id === id);
    if (!previous) return false;

    setActionError(null);
    setTodos((current) => current.filter((todo) => todo.id !== id));
    try {
      await deleteTodo(id);
      return true;
    } catch (error) {
      setTodos((current) => [...current, previous]);
      setActionError(`삭제하지 못했습니다. ${error.message}`);
      return false;
    }
  }, []);

  // 카테고리를 지울 때 해당 카테고리의 할 일을 '미분류'로 바꾼다. (json-server는 연쇄 처리를 하지 않음)
  const unassignCategory = useCallback(
    async (categoryId) => {
      const affected = todosRef.current.filter((todo) => todo.categoryId === categoryId);
      const results = await Promise.all(affected.map((todo) => updateTodo(todo.id, { categoryId: null })));
      return results.every(Boolean);
    },
    [updateTodo],
  );

  const clearActionError = useCallback(() => setActionError(null), []);

  return {
    todos,
    loading,
    loadError,
    actionError,
    clearActionError,
    reload: load,
    addTodo,
    updateTodo,
    toggleTodo,
    removeTodo,
    unassignCategory,
  };
}
