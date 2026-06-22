import { request } from "./client";
import type { Category, CategoryIn, CategoryUpdate } from "./types";

export const categoriesApi = {
  list: () => request<Category[]>("/categories/"),

  create: (data: CategoryIn) =>
    request<Category>("/categories/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: CategoryUpdate) =>
    request<Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  delete: (id: number) =>
    request<void>(`/categories/${id}`, { method: "DELETE" }),
};
