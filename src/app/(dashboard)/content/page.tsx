import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { ContentWorkspace } from "@/features/content/components/content-workspace";
import { NewContentButton } from "@/features/content/components/new-content-button";
import { contentService } from "@/features/content/api/content.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export default async function ContentPage() {
  // Resolves the seeded demo workspace for now — once
  // requireWorkspaceContext() is wired to a live DB, this becomes
  // `const { workspace } = await requireWorkspaceContext()`.
  const workspaceId = await getDemoWorkspaceId();
  const t = await getTranslations("content");
  const [items, pillars] = await Promise.all([
    contentService.listContent(workspaceId),
    contentService.getPillars(workspaceId),
  ]);

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<NewContentButton />}
        />
        <ContentWorkspace items={items} pillars={pillars} />
      </main>
    </>
  );
}
