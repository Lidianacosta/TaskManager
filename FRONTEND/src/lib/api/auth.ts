import { BASE_URL, ApiError } from "./client";
import type { LoginResponse } from "./types";

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const body = new URLSearchParams({ username: email, password });
    const res = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      let detail = res.statusText;
      try {
        const data = await res.json();
        detail = data.detail ?? detail;
      } catch {
      }
      throw new ApiError(res.status, detail);
    }
    return res.json();
  },
};
