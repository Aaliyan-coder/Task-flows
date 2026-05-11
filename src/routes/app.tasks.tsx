import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useMemo, useState } from "react";
import { TaskCard } from "@/components/app/TaskCard";
import { TaskDialog } from "@/components/app/TaskDialog";
import type { Task, TaskStatus } from "@/lib/db";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/tasks")({
  head: () => ({ meta: [{ title: "Tasks — TaskTide" }] }),
  component: TasksPage,
});

const COLUMNS: { id: TaskStatus; title: string; tint: string }[] = [
  { id: "todo", title: "Todo", tint: "from-slate-500 to-slate-400" },
  { id: "in_progress", title: "In progress", tint: "from-sky-500 to-cyan-500" },
  { id: "review", title: "Review", tint: "from-amber-500 to-orange-500" },
  { id: "completed", title: "Completed", tint: "from-emerald-500 to-teal-500" },
];

function TasksPage() {
  const tasks = useApp((s) => s.tasks);
  const moveTask = useApp((s) => s.moveTask);
  const [query, setQuery] = useState("");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [tasks, query]);

  const byCol = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      completed: [],
    };
    filtered.forEach((t) => map[t.status].push(t));
    return map;
  }, [filtered]);

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Drag cards between columns to update status.
          </p>
        </div>
        <button
          onClick={() => {
            setEditTask(null);
            setDefaultStatus("todo");
            setOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background hover:scale-[1.03] transition"
        >
          <Plus className="h-4 w-4" />
          New task
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks and tags…"
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(col.id);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/plain");
              if (id) moveTask(id, col.id);
              setDragOver(null);
            }}
            className={`flex min-h-[300px] flex-col rounded-2xl border bg-card/40 p-3 backdrop-blur transition ${
              dragOver === col.id ? "border-brand/70 bg-card/70" : "border-border/70"
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-6 rounded-full bg-gradient-to-r ${col.tint}`} />
                <span className="text-sm font-semibold">{col.title}</span>
                <span className="text-xs text-muted-foreground">
                  {byCol[col.id].length}
                </span>
              </div>
              <button
                onClick={() => {
                  setEditTask(null);
                  setDefaultStatus(col.id);
                  setOpen(true);
                }}
                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              <AnimatePresence mode="popLayout">
                {byCol[col.id].map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", t.id)
                    }
                    onClick={() => {
                      setEditTask(t);
                      setOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
              {byCol[col.id].length === 0 && (
                <motion.div
                  layout
                  className="rounded-xl border border-dashed border-border/70 p-6 text-center text-xs text-muted-foreground"
                >
                  Drop tasks here
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        task={editTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
