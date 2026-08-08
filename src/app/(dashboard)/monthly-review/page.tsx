import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reviewsService } from "@/features/reviews/api/reviews.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { Plus, TrendingUp, TrendingDown, Target } from "lucide-react";

export default async function MonthlyReviewPage() {
  const workspaceId = await getDemoWorkspaceId();
  const reviews = await reviewsService.listMonthlyReviews(workspaceId);
  const t = await getTranslations("monthlyReview");
  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<Button size="sm"><Plus className="h-4 w-4" />{t("newReview")}</Button>}
        />

        {reviews.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle>{r.monthLabel}</CardTitle>
              <CardDescription>{r.summary}</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-2xs font-medium text-success mb-2">
                  <TrendingUp className="h-3.5 w-3.5" /> {t("highlights")}
                </p>
                <ul className="space-y-1.5">{r.highlights.map((h) => <li key={h} className="text-sm text-foreground/90">{h}</li>)}</ul>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-2xs font-medium text-destructive mb-2">
                  <TrendingDown className="h-3.5 w-3.5" /> {t("lowlights")}
                </p>
                <ul className="space-y-1.5">{r.lowlights.map((l) => <li key={l} className="text-sm text-foreground/90">{l}</li>)}</ul>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-2xs font-medium text-primary mb-2">
                  <Target className="h-3.5 w-3.5" /> {t("nextFocus")}
                </p>
                <ul className="space-y-1.5">{r.nextFocus.map((f) => <li key={f} className="text-sm text-foreground/90">{f}</li>)}</ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </>
  );
}
