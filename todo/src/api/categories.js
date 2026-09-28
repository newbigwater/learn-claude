import { insert, list, remove, update } from "./client.js";

export const fetchCategories = () => list("categories");

export const createCategory = (data) => insert("categories", data);

export const patchCategory = (id, patch) => update("categories", id, patch);

export const deleteCategory = (id) => remove("categories", id);
