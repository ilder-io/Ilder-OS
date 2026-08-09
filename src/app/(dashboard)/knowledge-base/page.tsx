import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { knowledgeBaseService } from "@/features/knowledge-base/api/knowledge-base.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { NewKnowledgeDocButton } from "@/features/knowledge-base/components/new-knowledge-doc-button";
import { KnowledgeDocCard } from "@/features/knowledge-base/components/knowledge-doc-card";

export default async function KnowledgeBasePage() {
  const workspaceId = await getDemoWorkspaceId();
  const docs = await knowledgeBaseService.listDocs(workspaceId);
  const t = await getTranslations("knowledgeBase");
  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<NewKnowledgeDocButton />}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <KnowledgeDocCard key={doc.id} doc={doc} />
          ))}
        </div>
      </main>
    </>
  );
}
