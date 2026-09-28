import { request } from "./client";

export const fetchCategories = () => request("/categories");

export const createCategory = (data) => request("/categories", { method: "POST", body: data });

export const patchCategory = (id, patch) =>
  request(`/categories/${id}`, { method: "PATCH", body: patch });

export const deleteCategory = (id) => request(`/categories/${id}`, { method: "DELETE" });
