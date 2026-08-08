import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { knowledgeBaseService } from "@/features/knowledge-base/api/knowledge-base.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { formatDate } from "@/lib/utils";
import { Plus, FileText } from "lucide-react";

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
          actions={<Button size="sm"><Plus className="h-4 w-4" />{t("newDoc")}</Button>}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <Card key={doc.id} className="p-4 space-y-2">
              <div className="flex items-start gap-2.5">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.excerpt}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-1.5">
                  {doc.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
                <span className="text-2xs text-muted-foreground font-mono">{formatDate(doc.updatedAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
