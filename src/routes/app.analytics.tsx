import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — TaskTide" }] }),
  component: Analytics,
});

const COLORS = [
  "oklch(0.72 0.18 290)",
  "oklch(0.70 0.15 230)",
  "oklch(0.80 0.17 75)",
  "oklch(0.72 0.17 160)",
];

function Analytics() {
  const tasks = useApp((s) => s.tasks);

  const byStatus = useMemo(() => {
    const counts: Record<string, number> = {
      todo: 0,
      in_progress: 0,
      review: 0,
      completed: 0,
    };
    tasks.forEach((t) => counts[t.status]++);
    return [
      { name: "Todo", value: counts.todo },
      { name: "In progress", value: counts.in_progress },
      { name: "Review", value: counts.review },
      { name: "Completed", value: counts.completed },
    ];
  }, [tasks]);

  const byPriority = useMemo(() => {
    const counts: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    tasks.forEach((t) => counts[t.priority]++);
    return [
      { name: "Low", count: counts.low },
      { name: "Medium", count: counts.medium },
      { name: "High", count: counts.high },
      { name: "Urgent", count: counts.urgent },
    ];
  }, [tasks]);

  const completion = useMemo(() => {
    const days = 14;
    const arr: { day: string; completed: number; created: number }[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const completed = tasks.filter(
        (t) => t.completedAt && t.completedAt.slice(0, 10) === key,
      ).length;
      const created = tasks.filter((t) => t.createdAt.slice(0, 10) === key).length;
      arr.push({ day: label, completed, created });
    }
    return arr;
  }, [tasks]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Productivity insights for your last two weeks.
        </p>
      </motion.div>

      <div className="rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur">
        <h2 className="mb-4 text-base font-semibold">Tasks over time</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={completion}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 290)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 290)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.17 160)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.72 0.17 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
              <XAxis dataKey="day" stroke="oklch(0.66 0.02 270)" fontSize={11} />
              <YAxis stroke="oklch(0.66 0.02 270)" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.20 0.014 270)",
                  border: "1px solid oklch(0.28 0.014 270)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="created"
                stroke="oklch(0.72 0.18 290)"
                fill="url(#g1)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="oklch(0.72 0.17 160)"
                fill="url(#g2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur">
          <h2 className="mb-4 text-base font-semibold">By status</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={byStatus}
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {byStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.014 270)",
                    border: "1px solid oklch(0.28 0.014 270)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {byStatus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur">
          <h2 className="mb-4 text-base font-semibold">By priority</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={byPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="name" stroke="oklch(0.66 0.02 270)" fontSize={11} />
                <YAxis stroke="oklch(0.66 0.02 270)" fontSize={11} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 0.04)" }}
                  contentStyle={{
                    background: "oklch(0.20 0.014 270)",
                    border: "1px solid oklch(0.28 0.014 270)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="oklch(0.72 0.18 290)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
