import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SprintStatusBadge } from "@/components/shared/status-badge";
import type { SprintDTO } from "@/features/sprints/types/sprints.types";

export async function ActiveSprintWidget({ sprint }: { sprint: SprintDTO | undefined }) {
  if (!sprint) return null;
  const t = await getTranslations("dashboard");
  const done = sprint.tasks.filter((t) => t.status === "DONE").length;
  const progress = sprint.tasks.length ? Math.round((done / sprint.tasks.length) * 100) : 0;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{t("activeSprint")}</CardTitle>
        <SprintStatusBadge status={sprint.status} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">{sprint.name}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{sprint.goal}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-2xs font-mono text-muted-foreground">
            <span>{t("tasksComplete", { done, total: sprint.tasks.length })}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <Link href={`/sprints/${sprint.id}`} className="flex items-center gap-1 text-2xs text-primary hover:underline w-fit">
          {t("viewSprint")} <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
