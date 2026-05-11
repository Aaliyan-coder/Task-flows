import { motion } from "framer-motion";
import { Calendar, Flag, MoreHorizontal, Trash2 } from "lucide-react";
import type { Priority, Task } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-info/15 text-info",
  medium: "bg-warning/15 text-warning",
  high: "bg-destructive/15 text-destructive",
  urgent: "bg-gradient-brand text-primary-foreground",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Med",
  high: "High",
  urgent: "Urgent",
};

export function TaskCard({
  task,
  onClick,
  draggable = false,
  onDragStart,
}: {
  task: Task;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  const deleteTask = useApp((s) => s.deleteTask);
  const updateTask = useApp((s) => s.updateTask);

  const due = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue =
    due && due < new Date() && task.status !== "completed";

  const content = (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border/70 bg-card/60 p-3.5 backdrop-blur transition hover:border-border hover:shadow-elegant"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            PRIORITY_STYLES[task.priority],
          )}
        >
          <Flag className="mr-1 inline h-2.5 w-2.5" />
          {PRIORITY_LABEL[task.priority]}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <button className="rounded p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-accent">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={() =>
                updateTask(task.id, {
                  status: task.status === "completed" ? "todo" : "completed",
                })
              }
            >
              Mark {task.status === "completed" ? "incomplete" : "complete"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                deleteTask(task.id);
                toast.success("Task deleted");
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className={cn(
          "mt-2 text-sm font-medium leading-snug",
          task.status === "completed" && "text-muted-foreground line-through",
        )}
      >
        {task.title}
      </div>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {task.description}
        </p>
      )}
      {(task.tags.length > 0 || due) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {task.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground"
            >
              {t}
            </span>
          ))}
          {due && (
            <span
              className={cn(
                "ml-auto inline-flex items-center gap-1 text-[10px]",
                isOverdue ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <Calendar className="h-2.5 w-2.5" />
              {due.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );

  if (!draggable) return content;
  return (
    <div draggable onDragStart={onDragStart}>
      {content}
    </div>
  );
}
