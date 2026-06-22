export interface User {
  id: number;
  name: string | null;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date: string | null;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  category_name?: string | null;
  category_color?: string | null;
}

export interface TaskIn {
  title: string;
  description?: string | null;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  due_date?: string | null;
  category_id?: number | null;
}

export interface TaskUpdate {
  title?: string | null;
  description?: string | null;
  status?: "todo" | "in_progress" | "done" | null;
  priority?: "low" | "medium" | "high" | null;
  due_date?: string | null;
  category_id?: number | null;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryIn {
  name: string;
  color: string;
}

export interface CategoryUpdate {
  name?: string | null;
  color?: string | null;
}

export interface Bug {
  id: number | null;
  title: string;
  description: string | null;
  timestamp: string | null;
  created_at: string;
  updated_at: string;
}

export interface BugIn {
  title: string;
  description?: string | null;
  timestamp?: string | null;
}

export interface BugUpdate {
  title?: string | null;
  description?: string | null;
  timestamp?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
