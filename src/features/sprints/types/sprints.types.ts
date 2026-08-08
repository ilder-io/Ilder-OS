import type { SprintStatus, TaskStatus } from "@/types";

export interface SprintTaskDTO {
  id: string;
  title: string;
  status: TaskStatus;
  order: number;
}

export interface SprintMetricDTO {
  label: string;
  target: string;
  actual: string | null;
}

export interface SprintDTO {
  id: string;
  name: string;
  goal: string;
  hypothesis: string;
  status: SprintStatus;
  startsAt: string;
  endsAt: string;
  quarterId: string | null;
  tasks: SprintTaskDTO[];
  metrics: SprintMetricDTO[];
  results: string | null;
  learnings: string | null;
  actionItems: { title: string; done: boolean }[];
}
