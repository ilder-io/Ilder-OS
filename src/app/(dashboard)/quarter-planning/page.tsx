import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OKRStatusBadge } from "@/components/shared/status-badge";
import { NewQuarterButton } from "@/features/okrs/components/new-quarter-button";
import { QuarterDeleteButton } from "@/features/okrs/components/quarter-delete-button";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { sprintsService } from "@/features/sprints/api/sprints.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { CalendarRange } from "lucide-react";

export default async function QuarterPlanningPage() {
  const workspaceId = await getDemoWorkspaceId();
  const [quarters, sprints] = await Promise.all([
    okrsService.listQuarters(workspaceId),
    sprintsService.listSprints(workspaceId),
  ]);
  const t = await getTranslations("quarterPlanning");
  const unassignedSprints = sprints.filter((s) => !s.quarterId);

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<NewQuarterButton />}
        />

        <div className="space-y-4">
          {quarters.map((q) => {
            const quarterSprints = sprints.filter((s) => s.quarterId === q.id);
            return (
              <Card key={q.id}>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                      <CalendarRange className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>{q.label}</CardTitle>
                      <CardDescription>{q.theme}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline">{t("objectivesCount", { count: q.objectives.length })}</Badge>
                    <QuarterDeleteButton quarterId={q.id} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="divide-y divide-border">
                    {q.objectives.map((o) => (
                      <div key={o.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                        <span className="text-sm text-foreground/90">{o.title}</span>
                        <OKRStatusBadge status={o.status} />
                      </div>
                    ))}
                    {q.objectives.length === 0 && (
                      <p className="py-2.5 text-xs text-muted-foreground">{t("noObjectives")}</p>
                    )}
                  </div>

                  {quarterSprints.length > 0 && (
                    <div className="pt-1">
                      <p className="text-2xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                        {t("sprintsInQuarter")}
                      </p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {quarterSprints.map((s) => (
                          <Card key={s.id} className="p-3">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{s.name}</p>
                            <p className="text-2xs text-muted-foreground mt-1 line-clamp-2">{s.goal}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {quarters.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("noQuarters")}</p>
          )}
        </div>

        {unassignedSprints.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">{t("unassignedSprintsHeading")}</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {unassignedSprints.map((s) => (
                <Card key={s.id} className="p-4">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{s.name}</p>
                  <p className="text-2xs text-muted-foreground mt-1 line-clamp-2">{s.goal}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
