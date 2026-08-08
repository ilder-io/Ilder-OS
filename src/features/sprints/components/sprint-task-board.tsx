"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  DndContext,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTaskStatusLabel } from "@/hooks/use-enum-labels";
import type { SprintTaskDTO } from "@/features/sprints/types/sprints.types";
import type { TaskStatus } from "@/types";

const COLUMN_ORDER: TaskStatus[] = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];
const columnDroppableId = (status: TaskStatus) => `column:${status}`;

interface TaskUpdate {
  id: string;
  status: TaskStatus;
  order: number;
}

function TaskCard({ task, onDelete }: { task: SprintTaskDTO; onDelete: (id: string) => void }) {
  const t = useTranslations("sprints.board");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-2.5 text-xs text-foreground/90 flex items-center gap-1.5 group",
        task.status === "BLOCKED" && "border-warning/40"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground touch-none shrink-0"
        aria-label={t("drag")}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className={cn("flex-1 min-w-0", task.status === "DONE" && "line-through decoration-muted-foreground/50 text-muted-foreground")}>
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
        aria-label={t("deleteTask")}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </Card>
  );
}

function Column({ status, tasks, onDelete }: { status: TaskStatus; tasks: SprintTaskDTO[]; onDelete: (id: string) => void }) {
  const { setNodeRef } = useDroppable({ id: columnDroppableId(status) });
  const taskStatusLabel = useTaskStatusLabel();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">{taskStatusLabel(status)}</span>
        <span className="text-2xs font-mono text-muted-foreground">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="space-y-1.5 min-h-[3rem]">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && <div className="rounded-md border border-dashed border-border h-12" />}
        </div>
      </SortableContext>
    </div>
  );
}

/** Jira-style board: drag a card between columns or reorder within one.
 *  Keeps its own local `tasks` state (seeded from the server-fetched
 *  sprint) so drags feel instant — every move is persisted in the
 *  background via `PATCH /api/sprint-tasks/reorder`, and only reconciled
 *  against the server (`router.refresh()`) if that write fails. */
export function SprintTaskBoard({ sprintId, tasks: initialTasks }: { sprintId: string; tasks: SprintTaskDTO[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const t = useTranslations("sprints.board");
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function tasksByStatus(status: TaskStatus): SprintTaskDTO[] {
    return tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);
  }

  async function persist(updates: TaskUpdate[]) {
    const res = await fetch("/api/sprint-tasks/reorder", {
      method: "PATCH",
      body: JSON.stringify({ sprintId, updates }),
    });
    if (!res.ok) {
      toast.error(t("moveError"));
      router.refresh();
    }
  }

  function applyUpdates(updates: TaskUpdate[]) {
    setTasks((prev) =>
      prev.map((task) => {
        const update = updates.find((u) => u.id === task.id);
        return update ? { ...task, status: update.status, order: update.order } : task;
      })
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeTask = tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    const destStatus = overId.startsWith("column:")
      ? (overId.replace("column:", "") as TaskStatus)
      : tasks.find((task) => task.id === overId)?.status;
    if (!destStatus) return;

    const sourceStatus = activeTask.status;
    const updates: TaskUpdate[] = [];

    if (sourceStatus === destStatus) {
      const columnTasks = tasksByStatus(sourceStatus);
      const oldIndex = columnTasks.findIndex((task) => task.id === activeId);
      const overIndex = overId.startsWith("column:") ? columnTasks.length - 1 : columnTasks.findIndex((task) => task.id === overId);
      if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) return;

      arrayMove(columnTasks, oldIndex, overIndex).forEach((task, index) => {
        if (task.order !== index) updates.push({ id: task.id, status: sourceStatus, order: index });
      });
    } else {
      tasksByStatus(sourceStatus)
        .filter((task) => task.id !== activeId)
        .forEach((task, index) => {
          if (task.order !== index) updates.push({ id: task.id, status: sourceStatus, order: index });
        });

      const destTasks = tasksByStatus(destStatus);
      const insertIndex = overId.startsWith("column:") ? destTasks.length : destTasks.findIndex((task) => task.id === overId);
      const nextDestTasks = [...destTasks];
      nextDestTasks.splice(insertIndex === -1 ? destTasks.length : insertIndex, 0, { ...activeTask, status: destStatus });
      nextDestTasks.forEach((task, index) => updates.push({ id: task.id, status: destStatus, order: index }));
    }

    if (updates.length === 0) return;
    applyUpdates(updates);
    void persist(updates);
  }

  async function onAddTask(e: FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setAdding(true);
    const res = await fetch(`/api/sprints/${sprintId}/tasks`, { method: "POST", body: JSON.stringify({ title }) });
    setAdding(false);
    if (!res.ok) {
      toast.error(t("addError"));
      return;
    }
    const { data } = await res.json();
    setTasks((prev) => [...prev, data as SprintTaskDTO]);
    setNewTitle("");
  }

  function onDeleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    void fetch(`/api/sprint-tasks/${id}`, { method: "DELETE" }).then((res) => {
      if (!res.ok) {
        toast.error(t("deleteError"));
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-3">
      <form onSubmit={onAddTask} className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={t("addPlaceholder")}
          className="h-8 text-xs"
        />
        <Button type="submit" size="sm" disabled={adding || !newTitle.trim()}>
          <Plus className="h-3.5 w-3.5" />
          {t("add")}
        </Button>
      </form>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {COLUMN_ORDER.map((status) => (
            <Column key={status} status={status} tasks={tasksByStatus(status)} onDelete={onDeleteTask} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
