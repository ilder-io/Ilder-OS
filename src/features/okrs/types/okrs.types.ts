import type { OKRStatus } from "@/types";

export interface KeyResultDTO {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: OKRStatus;
}

export interface ObjectiveDTO {
  id: string;
  title: string;
  description: string;
  status: OKRStatus;
  keyResults: KeyResultDTO[];
}

export interface QuarterDTO {
  id: string;
  label: string; // "Q3 2026"
  theme: string;
  objectives: ObjectiveDTO[];
}

export function withProgress(kr: KeyResultDTO) {
  return { ...kr, progress: Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100)) };
}
