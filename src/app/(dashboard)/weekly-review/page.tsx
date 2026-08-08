import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reviewsService } from "@/features/reviews/api/reviews.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { CheckCircle2, AlertTriangle, ArrowRight, Plus } from "lucide-react";

export default async function WeeklyReviewPage() {
  const workspaceId = await getDemoWorkspaceId();
  const reviews = await reviewsService.listWeeklyReviews(workspaceId);
  const t = await getTranslations("weeklyReview");
  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<Button size="sm"><Plus className="h-4 w-4" />{t("newReview")}</Button>}
        />

        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardHeader><CardTitle>{r.weekLabel}</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="flex items-center gap-1.5 text-2xs font-medium text-success mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t("wins")}
                  </p>
                  <ul className="space-y-1.5">
                    {r.wins.map((w) => <li key={w} className="text-sm text-foreground/90">{w}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-2xs font-medium text-warning mb-2">
                    <AlertTriangle className="h-3.5 w-3.5" /> {t("challenges")}
                  </p>
                  <ul className="space-y-1.5">
                    {r.challenges.map((c) => <li key={c} className="text-sm text-foreground/90">{c}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-2xs font-medium text-primary mb-2">
                    <ArrowRight className="h-3.5 w-3.5" /> {t("focusNext")}
                  </p>
                  <ul className="space-y-1.5">
                    {r.focusNext.map((f) => <li key={f} className="text-sm text-foreground/90">{f}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
