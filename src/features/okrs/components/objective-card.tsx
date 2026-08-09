import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OKRStatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { ObjectiveDeleteButton } from "@/features/okrs/components/objective-delete-button";
import { KeyResultDeleteButton } from "@/features/okrs/components/key-result-delete-button";
import { KeyResultProgressInput } from "@/features/okrs/components/key-result-progress-input";
import { withProgress, type ObjectiveDTO } from "@/features/okrs/types/okrs.types";

export async function ObjectiveCard({ objective }: { objective: ObjectiveDTO }) {
  const t = await getTranslations("okrs");
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground">{objective.title}</CardTitle>
          <CardDescription className="mt-1">{objective.description}</CardDescription>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <OKRStatusBadge status={objective.status} />
          <ObjectiveDeleteButton objectiveId={objective.id} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {objective.keyResults.map((kr) => {
          const { progress } = withProgress(kr);
          return (
            <div key={kr.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground/90">{kr.title}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <KeyResultProgressInput keyResultId={kr.id} currentValue={kr.currentValue} />
                  <span className="text-2xs font-mono text-muted-foreground">
                    {t("krProgressSuffix", { target: kr.targetValue.toLocaleString(), unit: kr.unit })}
                  </span>
                  <KeyResultDeleteButton keyResultId={kr.id} />
                </span>
              </div>
              <Progress value={progress} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
