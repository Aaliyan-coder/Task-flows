import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ListTodo, TrendingUp, Activity } from "lucide-react";
import { Counter } from "@/components/site/Motion";
import { TaskCard } from "@/components/app/TaskCard";
import { useMemo, useState } from "react";
import { TaskDialog } from "@/components/app/TaskDialog";
import type { Task } from "@/lib/db";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — TaskTide" }] }),
  component: Dashboard,
});

function Dashboard() {
  const user = useApp((s) => s.user)!;
  const tasks = useApp((s) => s.tasks);
  const activity = useApp((s) => s.activity);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const overdue = tasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "completed",
    ).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, overdue, pct };
  }, [tasks]);

  const recent = useMemo(
    () =>
      [...tasks]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5),
    [tasks],
  );

  const heatmap = useMemo(() => {
    const days: number[] = Array(28).fill(0);
    const now = Date.now();
    tasks.forEach((t) => {
      const created = new Date(t.createdAt).getTime();
      const diff = Math.floor((now - created) / 86400000);
      if (diff >= 0 && diff < 28) days[27 - diff]++;
    });
    return days;
  }, [tasks]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Good to see you, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening in your workspace today.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ListTodo} label="Total tasks" value={stats.total} tint="from-violet-500 to-fuchsia-500" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.done} tint="from-emerald-500 to-teal-500" />
        <StatCard icon={Clock} label="In progress" value={stats.inProgress} tint="from-sky-500 to-cyan-500" />
        <StatCard icon={TrendingUp} label="Completion %" value={stats.pct} suffix="%" tint="from-amber-500 to-orange-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Recent tasks</h2>
                <p className="text-xs text-muted-foreground">Your latest activity</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recent.length === 0 && (
                <div className="col-span-2 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No tasks yet — create your first one.
                </div>
              )}
              {recent.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onClick={() => {
                    setEditTask(t);
                    setOpen(true);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur">
            <h2 className="mb-4 text-base font-semibold">Activity heatmap</h2>
            <div className="grid grid-cols-14 gap-1.5 sm:grid-cols-28" style={{ gridTemplateColumns: "repeat(28, minmax(0, 1fr))" }}>
              {heatmap.map((c, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    background: `oklch(0.72 0.18 290 / ${Math.min(0.1 + c * 0.18, 0.95)})`,
                  }}
                />
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Last 28 days</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand" />
            <h2 className="text-base font-semibold">Activity</h2>
          </div>
          <div className="space-y-3">
            {activity.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            )}
            {activity.slice(0, 8).map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <div className="min-w-0">
                  <div className="text-sm">{a.message}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TaskDialog open={open} onOpenChange={setOpen} task={editTask} />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  tint,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  suffix?: string;
  tint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur"
    >
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${tint} text-white shadow-glow`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-semibold tracking-tight">
        <Counter to={value} suffix={suffix ?? ""} />
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </motion.div>
  );
}
