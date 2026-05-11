import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  LogOut,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const tasks = useApp((s) => s.tasks);
  const logout = useApp((s) => s.logout);
  const createTask = useApp((s) => s.createTask);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (path: "/app" | "/app/tasks" | "/app/analytics" | "/") => {
    onOpenChange(false);
    navigate({ to: path });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => go("/app")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go("/app/tasks")}>
            <CheckSquare className="mr-2 h-4 w-4" /> Tasks
          </CommandItem>
          <CommandItem onSelect={() => go("/app/analytics")}>
            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={async () => {
              await createTask({ title: "New task" });
              toast.success("Task created");
              onOpenChange(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create new task
          </CommandItem>
          <CommandItem
            onSelect={() => {
              logout();
              onOpenChange(false);
              toast.success("Signed out");
              navigate({ to: "/" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </CommandItem>
        </CommandGroup>
        {tasks.length > 0 && (
          <CommandGroup heading="Recent tasks">
            {tasks.slice(0, 6).map((t) => (
              <CommandItem
                key={t.id}
                onSelect={() => {
                  onOpenChange(false);
                  navigate({ to: "/app/tasks" });
                }}
              >
                <CheckSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                {t.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
