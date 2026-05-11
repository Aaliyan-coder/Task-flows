import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Folder,
  Settings,
  Bell,
  Search,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Logo } from "@/components/site/SiteChrome";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { CommandPalette } from "./CommandPalette";

const NAV: Array<{ to: "/app" | "/app/tasks" | "/app/analytics"; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const user = useApp((s) => s.user);
  const projects = useApp((s) => s.projects);
  const logout = useApp((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <Logo />
          <span className="font-semibold tracking-tight">TaskTide</span>
        </div>

        <div className="px-3 pt-4">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-card/40 px-3 py-2 text-sm text-muted-foreground hover:bg-card/70 transition"
          >
            <Search className="h-3.5 w-3.5" />
            Quick search
            <span className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px]">
              ⌘K
            </span>
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-0.5 px-3">
          {NAV.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-6 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Projects
          </div>
          <div className="mt-1 space-y-0.5">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/70"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background:
                      p.color === "violet"
                        ? "oklch(0.72 0.18 290)"
                        : p.color === "cyan"
                          ? "oklch(0.72 0.15 220)"
                          : "oklch(0.72 0.17 160)",
                  }}
                />
                <span className="truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-white",
                user.avatarColor,
              )}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                toast.success("Signed out");
                navigate({ to: "/" });
              }}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur">
          <div className="md:hidden">
            <Logo />
          </div>
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden flex-1 items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm text-muted-foreground hover:bg-card/70 transition md:flex md:max-w-md"
          >
            <Search className="h-3.5 w-3.5" />
            Search tasks, projects…
            <span className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px]">
              ⌘K
            </span>
          </button>
          <div className="flex-1 md:hidden" />
          <button className="relative rounded-lg border border-border bg-card/40 p-2 text-muted-foreground hover:text-foreground transition">
            <Sparkles className="h-4 w-4" />
          </button>
          <button className="relative rounded-lg border border-border bg-card/40 p-2 text-muted-foreground hover:text-foreground transition">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand animate-pulse-ring" />
          </button>
          <Link
            to="/app/tasks"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background hover:scale-[1.03] transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New task
          </Link>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
