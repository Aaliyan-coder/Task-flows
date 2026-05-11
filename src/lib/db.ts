// Lightweight typed repository pattern backed by localStorage.
// This stands in for a SQL.js layer while keeping the same abstraction
// boundary (repositories + service layer) used in larger apps.

export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "review" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // demo only — never do this in production
  avatarColor: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  userId: string;
  projectId?: string | null;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  dueDate?: string | null;
  subtasks: Subtask[];
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  message: string;
  type: "task" | "project" | "auth";
  createdAt: string;
}

const KEY = "tasktide.db.v1";

interface DB {
  users: User[];
  tasks: Task[];
  projects: Project[];
  activity: ActivityLog[];
  session: { userId: string | null };
}

const emptyDB = (): DB => ({
  users: [],
  tasks: [],
  projects: [],
  activity: [],
  session: { userId: null },
});

function read(): DB {
  if (typeof window === "undefined") return emptyDB();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDB();
    return { ...emptyDB(), ...JSON.parse(raw) };
  } catch {
    return emptyDB();
  }
}

function write(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export const db = {
  read,
  write,
  reset() {
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  },
};

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
