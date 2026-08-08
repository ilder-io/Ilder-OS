import { getTranslations } from "next-intl/server";
import { RadialProgress } from "@/components/charts/radial-progress";
import { Card } from "@/components/ui/card";
import { withProgress, type QuarterDTO } from "@/features/okrs/types/okrs.types";

export async function QuarterSummary({ quarter }: { quarter: QuarterDTO }) {
  const t = await getTranslations("okrs");
  const allKRs = quarter.objectives.flatMap((o) => o.keyResults);
  const avgProgress = allKRs.length
    ? allKRs.reduce((s, kr) => s + withProgress(kr).progress, 0) / allKRs.length
    : 0;
  const onTrack = quarter.objectives.filter((o) => o.status === "ON_TRACK" || o.status === "COMPLETED").length;

  return (
    <Card className="p-5 flex items-center gap-5">
      <RadialProgress value={avgProgress} size={64} />
      <div>
        <p className="text-sm font-medium text-foreground">{quarter.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{quarter.theme}</p>
        <p className="text-2xs text-muted-foreground mt-1 font-mono">
          {t("summary", { onTrack, total: quarter.objectives.length, keyResults: allKRs.length })}
        </p>
      </div>
    </Card>
  );
}
