import { request } from "./client";
import type { Bug, BugIn, BugUpdate } from "./types";

export const bugsApi = {
  list: () => request<Bug[]>("/bugs/"),

  create: (data: BugIn) =>
    request<Bug>("/bugs/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: BugUpdate) =>
    request<Bug>(`/bugs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  delete: (id: number) =>
    request<void>(`/bugs/${id}`, { method: "DELETE" }),
};
