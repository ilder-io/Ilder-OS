import { cn } from "@/lib/utils";

const PILLAR_CLASSES = ["bg-pillar-1", "bg-pillar-2", "bg-pillar-3", "bg-pillar-4", "bg-pillar-5"];

/** Deterministic color assignment by pillar name so the same pillar always
 *  renders the same dot color across tables, charts, and filters. */
export function PillarDot({ name, className }: { name: string; className?: string }) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const colorClass = PILLAR_CLASSES[hash % PILLAR_CLASSES.length];
  return <span className={cn("inline-block h-2 w-2 rounded-full shrink-0", colorClass, className)} />;
}
