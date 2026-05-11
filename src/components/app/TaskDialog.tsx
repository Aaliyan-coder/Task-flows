import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority, Task, TaskStatus } from "@/lib/db";
import { useApp } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";
import { uid } from "@/lib/db";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: TaskStatus;
}

export function TaskDialog({ open, onOpenChange, task, defaultStatus }: Props) {
  const createTask = useApp((s) => s.createTask);
  const updateTask = useApp((s) => s.updateTask);
  const toggleSubtask = useApp((s) => s.toggleSubtask);
  const projects = useApp((s) => s.projects);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [projectId, setProjectId] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; done: boolean }[]>([]);
  const [newSub, setNewSub] = useState("");

  useEffect(() => {
    if (!open) return;
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setPriority(task.priority);
      setStatus(task.status);
      setProjectId(task.projectId ?? "");
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
      setTags(task.tags.join(", "));
      setSubtasks(task.subtasks);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus(defaultStatus ?? "todo");
      setProjectId(projects[0]?.id ?? "");
      setDueDate("");
      setTags("");
      setSubtasks([]);
    }
  }, [open, task, defaultStatus, projects]);

  const onSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      projectId: projectId || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      subtasks,
    };
    if (task) {
      await updateTask(task.id, payload);
      toast.success("Task updated");
    } else {
      await createTask(payload);
      toast.success("Task created");
    }
    onOpenChange(false);
  };

  const addSubtask = () => {
    if (!newSub.trim()) return;
    setSubtasks((s) => [...s, { id: uid(), title: newSub.trim(), done: false }]);
    setNewSub("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="t-title">Title</Label>
            <Input
              id="t-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-desc">Description</Label>
            <Textarea
              id="t-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a bit of context…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-due">Due date</Label>
              <Input
                id="t-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Project</Label>
              <Select
                value={projectId || "none"}
                onValueChange={(v) => setProjectId(v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-tags">Tags (comma-separated)</Label>
            <Input
              id="t-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, ui, launch"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtasks</Label>
            <div className="space-y-1.5">
              {subtasks.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 rounded-md border border-border/70 bg-card/40 px-2.5 py-1.5 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={() => {
                      if (task) toggleSubtask(task.id, s.id);
                      setSubtasks((subs) =>
                        subs.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)),
                      );
                    }}
                    className="h-3.5 w-3.5 accent-[color:var(--brand)]"
                  />
                  <span className={s.done ? "line-through text-muted-foreground" : ""}>
                    {s.title}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSubtasks((subs) => subs.filter((x) => x.id !== s.id))
                    }
                    className="ml-auto text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                  placeholder="Add subtask"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubtask();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  className="rounded-md border border-border bg-card/40 px-2.5 text-sm hover:bg-card"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border bg-card/40 px-4 py-2 text-sm hover:bg-card"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:scale-[1.02] transition"
          >
            {task ? "Save changes" : "Create task"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
