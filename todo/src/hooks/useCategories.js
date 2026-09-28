import { useEffect, useState } from "react";
import { createCategory, deleteCategory, fetchCategories, patchCategory } from "../api/categories";

// 카테고리 목록 상태와 CRUD를 관리한다. 실패하면 error 메시지를 남기고 false를 반환한다.
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  const run = async (action, message) => {
    setError(null);
    try {
      await action();
      return true;
    } catch (err) {
      setError(`${message} ${err.message}`);
      return false;
    }
  };

  const addCategory = (data) =>
    run(async () => {
      const created = await createCategory(data);
      setCategories((current) => [...current, created]);
    }, "카테고리를 추가하지 못했습니다.");

  const updateCategory = (id, patch) =>
    run(async () => {
      const saved = await patchCategory(id, patch);
      setCategories((current) => current.map((category) => (category.id === id ? saved : category)));
    }, "카테고리를 수정하지 못했습니다.");

  const removeCategory = (id) =>
    run(async () => {
      await deleteCategory(id);
      setCategories((current) => current.filter((category) => category.id !== id));
    }, "카테고리를 삭제하지 못했습니다.");

  return { categories, error, clearError: () => setError(null), addCategory, updateCategory, removeCategory };
}
