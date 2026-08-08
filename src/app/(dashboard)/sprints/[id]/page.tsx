import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { SprintDetail } from "@/features/sprints/components/sprint-detail";
import { sprintsService } from "@/features/sprints/api/sprints.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export default async function SprintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  const sprint = await sprintsService.getSprintById(workspaceId, id);
  if (!sprint) notFound();
  const t = await getTranslations("sprints");

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 max-w-4xl">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
          <Link href="/sprints"><ArrowLeft className="h-3.5 w-3.5" /> {t("backToSprints")}</Link>
        </Button>
        <h2 className="text-xl font-semibold tracking-tight mb-6">{sprint.name}</h2>
        <SprintDetail sprint={sprint} />
      </main>
    </>
  );
}
