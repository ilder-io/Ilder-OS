import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { SprintCard } from "@/features/sprints/components/sprint-card";
import { NewSprintButton } from "@/features/sprints/components/new-sprint-button";
import { sprintsService } from "@/features/sprints/api/sprints.service";
import { okrsService } from "@/features/okrs/api/okrs.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export default async function SprintsPage() {
  const workspaceId = await getDemoWorkspaceId();
  const [sprints, quarters] = await Promise.all([
    sprintsService.listSprints(workspaceId),
    okrsService.listQuarters(workspaceId),
  ]);
  const t = await getTranslations("sprints");
  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<NewSprintButton quarters={quarters.map((q) => ({ id: q.id, label: q.label }))} />}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sprints.map((s) => (
            <SprintCard key={s.id} sprint={s} />
          ))}
        </div>
      </main>
    </>
  );
}
