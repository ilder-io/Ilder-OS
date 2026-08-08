import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadialProgress } from "@/components/charts/radial-progress";
import { withProgress, type QuarterDTO } from "@/features/okrs/types/okrs.types";

export async function QuarterProgressWidget({ quarter }: { quarter: QuarterDTO }) {
  const t = await getTranslations("dashboard");
  const allKRs = quarter.objectives.flatMap((o) => o.keyResults);
  const avgProgress = allKRs.length ? allKRs.reduce((s, kr) => s + withProgress(kr).progress, 0) / allKRs.length : 0;

  return (
    <Card>
      <CardHeader><CardTitle>{t("quarterOkrsTitle", { label: quarter.label })}</CardTitle></CardHeader>
      <CardContent className="flex items-center gap-4">
        <RadialProgress value={avgProgress} size={64} />
        <div className="flex-1 space-y-1">
          {quarter.objectives.map((o) => (
            <p key={o.id} className="text-xs text-foreground/80 line-clamp-1">{o.title}</p>
          ))}
        </div>
      </CardContent>
      <CardContent className="pt-0">
        <Link href="/okrs" className="flex items-center gap-1 text-2xs text-primary hover:underline w-fit">
          {t("viewAllObjectives")} <ArrowRight className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
