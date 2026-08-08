import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ObjectiveCard } from "@/features/okrs/components/objective-card";
import { QuarterSummary } from "@/features/okrs/components/quarter-summary";
import { NewObjectiveButton } from "@/features/okrs/components/new-objective-button";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { CalendarRange } from "lucide-react";

export default async function OKRsPage() {
  const workspaceId = await getDemoWorkspaceId();
  const quarters = await okrsService.listQuarters(workspaceId);
  const currentQuarter = quarters[0];
  const t = await getTranslations("okrs");

  if (!currentQuarter) {
    return (
      <>
        <Topbar title={t("pageTitle")} />
        <main className="flex-1 px-6 py-6 pb-20 md:pb-6">
          <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
          <EmptyState
            icon={CalendarRange}
            title={t("noQuartersYetTitle")}
            description={t("noQuartersYetDescription")}
            action={<Button asChild size="sm"><Link href="/quarter-planning">{t("goToQuarterPlanning")}</Link></Button>}
          />
        </main>
      </>
    );
  }

  const quarterOptions = quarters.map((q) => ({ id: q.id, label: q.label }));

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<NewObjectiveButton quarters={quarterOptions} defaultQuarterId={currentQuarter.id} />}
        />

        <QuarterSummary quarter={currentQuarter} />

        <div className="grid lg:grid-cols-2 gap-4">
          {currentQuarter.objectives.map((o) => (
            <ObjectiveCard key={o.id} objective={o} />
          ))}
        </div>

        {quarters.length > 1 && (
          <div className="pt-2">
            <p className="text-xs font-medium text-muted-foreground mb-3">{t("previousQuarters")}</p>
            <div className="grid lg:grid-cols-2 gap-4">
              {quarters.slice(1).flatMap((q) => q.objectives.map((o) => <ObjectiveCard key={o.id} objective={o} />))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
