import { create } from "zustand";
import {
  db,
  uid,
  type Task,
  type User,
  type Project,
  type ActivityLog,
  type TaskStatus,
  type Priority,
  type Subtask,
} from "./db";

const AVATAR_COLORS = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
];

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

interface AppState {
  user: User | null;
  tasks: Task[];
  projects: Project[];
  activity: ActivityLog[];
  hydrated: boolean;

  hydrate: () => void;

  signUp: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  createTask: (input: Partial<Task> & { title: string }) => Promise<Task>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: TaskStatus) => Promise<void>;
  toggleSubtask: (taskId: string, subId: string) => Promise<void>;

  createProject: (name: string, color: string) => Promise<Project>;
}

const persist = (patch: {
  tasks?: Task[];
  projects?: Project[];
  activity?: ActivityLog[];
  user?: User | null;
  users?: User[];
}) => {
  const cur = db.read();
  if (patch.tasks) cur.tasks = patch.tasks;
  if (patch.projects) cur.projects = patch.projects;
  if (patch.activity) cur.activity = patch.activity;
  if (patch.users) cur.users = patch.users;
  if (patch.user !== undefined) cur.session.userId = patch.user?.id ?? null;
  db.write(cur);
};

const logActivity = (
  state: AppState,
  message: string,
  type: ActivityLog["type"] = "task",
): ActivityLog[] => {
  if (!state.user) return state.activity;
  const entry: ActivityLog = {
    id: uid(),
    userId: state.user.id,
    message,
    type,
    createdAt: new Date().toISOString(),
  };
  return [entry, ...state.activity].slice(0, 50);
};

export const useApp = create<AppState>((set, get) => ({
  user: null,
  tasks: [],
  projects: [],
  activity: [],
  hydrated: false,

  hydrate: () => {
    const cur = db.read();
    const user = cur.users.find((u) => u.id === cur.session.userId) ?? null;
    const userId = user?.id;
    set({
      user,
      tasks: userId ? cur.tasks.filter((t) => t.userId === userId) : [],
      projects: userId
        ? cur.projects.filter((p) => p.userId === userId)
        : [],
      activity: userId
        ? cur.activity.filter((a) => a.userId === userId)
        : [],
      hydrated: true,
    });
  },

  signUp: async (name, email, password) => {
    await delay(400);
    const cur = db.read();
    if (cur.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const user: User = {
      id: uid(),
      name,
      email,
      password,
      avatarColor:
        AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      createdAt: new Date().toISOString(),
    };
    cur.users.push(user);
    cur.session.userId = user.id;

    // seed demo data
    const projects: Project[] = [
      {
        id: uid(),
        userId: user.id,
        name: "Product launch",
        color: "violet",
        createdAt: new Date().toISOString(),
      },
      {
        id: uid(),
        userId: user.id,
        name: "Marketing site",
        color: "cyan",
        createdAt: new Date().toISOString(),
      },
    ];
    const now = Date.now();
    const seedTitles: Array<[string, TaskStatus, Priority, string[]]> = [
      ["Design new dashboard layout", "in_progress", "high", ["design", "ui"]],
      ["Write launch announcement", "todo", "medium", ["copy"]],
      ["Review Q3 analytics", "review", "medium", ["analytics"]],
      ["Fix authentication redirect", "todo", "urgent", ["bug"]],
      ["Onboarding email sequence", "completed", "low", ["email"]],
      ["Refactor task store", "in_progress", "medium", ["engineering"]],
      ["User interviews — round 2", "todo", "high", ["research"]],
    ];
    const tasks: Task[] = seedTitles.map(([title, status, priority, tags], i) => ({
      id: uid(),
      userId: user.id,
      projectId: projects[i % projects.length].id,
      title,
      description: "",
      status,
      priority,
      tags,
      dueDate: new Date(now + (i + 1) * 86400000).toISOString(),
      subtasks: [],
      order: i,
      createdAt: new Date(now - (10 - i) * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: status === "completed" ? new Date().toISOString() : null,
    }));
    cur.tasks.push(...tasks);
    cur.projects.push(...projects);
    const welcome: ActivityLog = {
      id: uid(),
      userId: user.id,
      message: "Welcome to TaskTide — your workspace is ready.",
      type: "auth",
      createdAt: new Date().toISOString(),
    };
    cur.activity.push(welcome);
    db.write(cur);

    set({
      user,
      tasks,
      projects,
      activity: [welcome],
      hydrated: true,
    });
  },

  login: async (email, password) => {
    await delay(400);
    const cur = db.read();
    const user = cur.users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!user) throw new Error("Invalid email or password.");
    cur.session.userId = user.id;
    db.write(cur);
    set({
      user,
      tasks: cur.tasks.filter((t) => t.userId === user.id),
      projects: cur.projects.filter((p) => p.userId === user.id),
      activity: cur.activity.filter((a) => a.userId === user.id),
      hydrated: true,
    });
  },

  logout: () => {
    const cur = db.read();
    cur.session.userId = null;
    db.write(cur);
    set({ user: null, tasks: [], projects: [], activity: [] });
  },

  createTask: async (input) => {
    await delay(150);
    const state = get();
    if (!state.user) throw new Error("Not authenticated.");
    const task: Task = {
      id: uid(),
      userId: state.user.id,
      projectId: input.projectId ?? state.projects[0]?.id ?? null,
      title: input.title,
      description: input.description ?? "",
      status: input.status ?? "todo",
      priority: input.priority ?? "medium",
      tags: input.tags ?? [],
      dueDate: input.dueDate ?? null,
      subtasks: input.subtasks ?? [],
      order: state.tasks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    };
    const tasks = [task, ...state.tasks];
    const activity = logActivity(state, `Created task “${task.title}”`);
    set({ tasks, activity });
    persist({ tasks: mergeForUser(state.user.id, tasks, "tasks"), activity: mergeForUser(state.user.id, activity, "activity") });
    return task;
  },

  updateTask: async (id, patch) => {
    const state = get();
    if (!state.user) return;
    const tasks = state.tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            ...patch,
            updatedAt: new Date().toISOString(),
            completedAt:
              patch.status === "completed"
                ? new Date().toISOString()
                : patch.status
                  ? null
                  : t.completedAt,
          }
        : t,
    );
    set({ tasks });
    persist({ tasks: mergeForUser(state.user.id, tasks, "tasks") });
  },

  deleteTask: async (id) => {
    const state = get();
    if (!state.user) return;
    const target = state.tasks.find((t) => t.id === id);
    const tasks = state.tasks.filter((t) => t.id !== id);
    const activity = target
      ? logActivity(state, `Deleted task “${target.title}”`)
      : state.activity;
    set({ tasks, activity });
    persist({
      tasks: mergeForUser(state.user.id, tasks, "tasks"),
      activity: mergeForUser(state.user.id, activity, "activity"),
    });
  },

  moveTask: async (id, status) => {
    const state = get();
    if (!state.user) return;
    const tasks = state.tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status,
            updatedAt: new Date().toISOString(),
            completedAt:
              status === "completed" ? new Date().toISOString() : null,
          }
        : t,
    );
    const target = tasks.find((t) => t.id === id);
    const activity = target
      ? logActivity(state, `Moved “${target.title}” → ${status.replace("_", " ")}`)
      : state.activity;
    set({ tasks, activity });
    persist({
      tasks: mergeForUser(state.user.id, tasks, "tasks"),
      activity: mergeForUser(state.user.id, activity, "activity"),
    });
  },

  toggleSubtask: async (taskId, subId) => {
    const state = get();
    if (!state.user) return;
    const tasks = state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subId ? { ...s, done: !s.done } : s,
            ),
            updatedAt: new Date().toISOString(),
          }
        : t,
    );
    set({ tasks });
    persist({ tasks: mergeForUser(state.user.id, tasks, "tasks") });
  },

  createProject: async (name, color) => {
    const state = get();
    if (!state.user) throw new Error("Not authenticated.");
    const project: Project = {
      id: uid(),
      userId: state.user.id,
      name,
      color,
      createdAt: new Date().toISOString(),
    };
    const projects = [...state.projects, project];
    set({ projects });
    persist({ projects: mergeForUser(state.user.id, projects, "projects") });
    return project;
  },
}));

// Merge user-scoped arrays back into the global DB array.
function mergeForUser<T extends { userId: string }>(
  userId: string,
  current: T[],
  key: "tasks" | "projects" | "activity",
): T[] {
  const cur = db.read();
  const others = (cur[key] as unknown as T[]).filter((x) => x.userId !== userId);
  return [...others, ...current];
}

export const subtask = (title: string): Subtask => ({
  id: uid(),
  title,
  done: false,
});
