import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SprintStatusBadge } from "@/components/shared/status-badge";
import { SprintTaskBoard } from "@/features/sprints/components/sprint-task-board";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import type { SprintDTO } from "@/features/sprints/types/sprints.types";

export async function SprintDetail({ sprint }: { sprint: SprintDTO }) {
  const t = await getTranslations("sprints");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <SprintStatusBadge status={sprint.status} />
        <span className="text-xs text-muted-foreground font-mono">
          {formatDate(sprint.startsAt)} – {formatDate(sprint.endsAt)}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>{t("goal")}</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-foreground/90">{sprint.goal}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("hypothesis")}</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-foreground/90">{sprint.hypothesis}</p></CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">{t("tasks")}</h3>
        <SprintTaskBoard sprintId={sprint.id} tasks={sprint.tasks} />
      </div>

      <Card>
        <CardHeader><CardTitle>{t("metrics")}</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          {sprint.metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border p-3">
              <p className="text-2xs text-muted-foreground">{m.label}</p>
              <p className="text-sm font-mono mt-1">
                <span className="text-foreground">{m.actual ?? "—"}</span>
                <span className="text-muted-foreground"> / {m.target}</span>
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {(sprint.results || sprint.learnings) && (
        <div className="grid md:grid-cols-2 gap-4">
          {sprint.results && (
            <Card>
              <CardHeader><CardTitle>{t("results")}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-foreground/90">{sprint.results}</p></CardContent>
            </Card>
          )}
          {sprint.learnings && (
            <Card>
              <CardHeader><CardTitle>{t("learnings")}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-foreground/90">{sprint.learnings}</p></CardContent>
            </Card>
          )}
        </div>
      )}

      {sprint.actionItems.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t("actionItems")}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {sprint.actionItems.map((a) => (
              <div key={a.title} className="flex items-center gap-2 text-sm">
                {a.done ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                <span className={a.done ? "text-muted-foreground line-through" : "text-foreground/90"}>{a.title}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
