import type { OKRStatus } from "@/types";

export interface MockKeyResult {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  status: OKRStatus;
}

export interface MockObjective {
  id: string;
  title: string;
  description: string;
  status: OKRStatus;
  keyResults: MockKeyResult[];
}

export interface MockQuarter {
  id: string;
  label: string; // "Q3 2026"
  theme: string;
  objectives: MockObjective[];
}

function progress(kr: MockKeyResult) {
  return Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100));
}

export const MOCK_QUARTERS: MockQuarter[] = [
  {
    id: "q3-2026",
    label: "Q3 2026",
    theme: "Depth over breadth — fewer platforms, better retention",
    objectives: [
      {
        id: "obj-1",
        title: "Become the go-to channel for practical Git education",
        description: "Own the 'Git for working developers' niche across YouTube and Shorts.",
        status: "ON_TRACK",
        keyResults: [
          { id: "kr-1", title: "Publish 12 Git-focused videos", targetValue: 12, currentValue: 8, unit: "videos", status: "ON_TRACK" },
          { id: "kr-2", title: "Hit 55% avg retention on Git series", targetValue: 55, currentValue: 51, unit: "%", status: "ON_TRACK" },
          { id: "kr-3", title: "Grow Git series subs by 4,000", targetValue: 4000, currentValue: 2650, unit: "followers", status: "AT_RISK" },
        ],
      },
      {
        id: "obj-2",
        title: "Turn the audience into a sustainable product business",
        description: "Ship and validate the first paid product beyond content.",
        status: "AT_RISK",
        keyResults: [
          { id: "kr-4", title: "Launch cohort course waitlist", targetValue: 1000, currentValue: 640, unit: "signups", status: "AT_RISK" },
          { id: "kr-5", title: "Reach $2,000 MRR", targetValue: 2000, currentValue: 1180, unit: "$", status: "AT_RISK" },
          { id: "kr-6", title: "Ship 3 free lead-magnet templates", targetValue: 3, currentValue: 3, unit: "templates", status: "COMPLETED" },
        ],
      },
      {
        id: "obj-3",
        title: "Build a operating rhythm that doesn't burn out",
        description: "Sustainable systems: planning, review, and content batching.",
        status: "ON_TRACK",
        keyResults: [
          { id: "kr-7", title: "Complete weekly review 12/13 weeks", targetValue: 13, currentValue: 10, unit: "weeks", status: "ON_TRACK" },
          { id: "kr-8", title: "Batch-film 2 weeks of content ahead", targetValue: 2, currentValue: 1, unit: "weeks buffer", status: "AT_RISK" },
        ],
      },
    ],
  },
  {
    id: "q2-2026",
    label: "Q2 2026",
    theme: "Find the format that compounds",
    objectives: [
      {
        id: "obj-q2-1",
        title: "Diagnose why Shorts weren't converting to subscribers",
        description: "Run structured experiments across hooks, CTAs, and pacing.",
        status: "COMPLETED",
        keyResults: [
          { id: "kr-q2-1", title: "Run 6 hook A/B tests", targetValue: 6, currentValue: 6, unit: "tests", status: "COMPLETED" },
          { id: "kr-q2-2", title: "Improve Shorts CTR to 6%", targetValue: 6, currentValue: 6.4, unit: "%", status: "COMPLETED" },
        ],
      },
    ],
  },
];

export function withProgress(kr: MockKeyResult) {
  return { ...kr, progress: progress(kr) };
}
