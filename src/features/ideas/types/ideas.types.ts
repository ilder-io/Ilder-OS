import type { IdeaStatus } from "@/types";

export interface IdeaDTO {
  id: string;
  title: string;
  notes: string;
  status: IdeaStatus;
  impact: number;
  effort: number;
}
