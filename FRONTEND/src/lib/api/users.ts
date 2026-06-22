import { request } from "./client";
import type { User } from "./types";

export const usersApi = {
  register: (data: { name?: string | null; email: string; password: string }) =>
    request<User>("/users/", { method: "POST", body: JSON.stringify(data), skipAuth: true }),

  me: () => request<User>("/users/me"),

  updateMe: (data: { name?: string | null; email?: string; password?: string }) =>
    request<User>("/users/me", { method: "PATCH", body: JSON.stringify(data) }),
};
