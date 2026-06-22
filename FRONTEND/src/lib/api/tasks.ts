import { request } from "./client";
import type { Task, TaskIn, TaskUpdate } from "./types";

export const tasksApi = {
  list: () => request<Task[]>("/tasks/"),

  create: (data: TaskIn) =>
    request<Task>("/tasks/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: TaskUpdate) =>
    request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  delete: (id: number) =>
    request<void>(`/tasks/${id}`, { method: "DELETE" }),
};
