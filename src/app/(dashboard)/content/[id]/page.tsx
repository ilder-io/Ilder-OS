import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { ContentDetail } from "@/features/content/components/content-detail";
import { ContentActions } from "@/features/content/components/content-actions";
import { contentService } from "@/features/content/api/content.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export default async function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  const item = await contentService.getContentById(workspaceId, id);
  if (!item) notFound();
  const t = await getTranslations("content");

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 max-w-5xl">
        <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
          <Link href="/content"><ArrowLeft className="h-3.5 w-3.5" /> {t("backToContent")}</Link>
        </Button>
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold tracking-tight max-w-2xl">{item.title}</h2>
          <ContentActions item={item} />
        </div>
        <ContentDetail item={item} />
      </main>
    </>
  );
}
