import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { IdeaMatrix } from "@/features/ideas/components/idea-matrix";
import { IdeaBoard } from "@/features/ideas/components/idea-board";
import { NewIdeaButton } from "@/features/ideas/components/new-idea-button";
import { ideasService } from "@/features/ideas/api/ideas.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export default async function IdeasPage() {
  const workspaceId = await getDemoWorkspaceId();
  const ideas = await ideasService.listIdeas(workspaceId);
  const t = await getTranslations("ideas");
  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<NewIdeaButton />}
        />
        <IdeaMatrix ideas={ideas} />
        <IdeaBoard ideas={ideas} />
      </main>
    </>
  );
}
