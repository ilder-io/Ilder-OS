import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { SprintStatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { SprintDeleteButton } from "@/features/sprints/components/sprint-delete-button";
import type { SprintDTO } from "@/features/sprints/types/sprints.types";

export async function SprintCard({ sprint }: { sprint: SprintDTO }) {
  const t = await getTranslations("sprints");
  const done = sprint.tasks.filter((task) => task.status === "DONE").length;
  const progress = sprint.tasks.length ? Math.round((done / sprint.tasks.length) * 100) : 0;

  return (
    <Link href={`/sprints/${sprint.id}`}>
      <Card className="p-4 h-full flex flex-col gap-3 hover:border-primary/40 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground line-clamp-1">{sprint.name}</p>
          <div className="flex items-center gap-1 shrink-0">
            <SprintStatusBadge status={sprint.status} />
            <SprintDeleteButton sprintId={sprint.id} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{sprint.goal}</p>
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center justify-between text-2xs text-muted-foreground font-mono">
            <span>{t("tasksCount", { done, total: sprint.tasks.length })}</span>
            <span>{formatDate(sprint.startsAt)} – {formatDate(sprint.endsAt)}</span>
          </div>
          <Progress value={progress} />
        </div>
      </Card>
    </Link>
  );
}
