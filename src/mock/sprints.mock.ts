import type { SprintStatus, TaskStatus } from "@/types";

export interface MockSprintTask {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface MockSprintMetric {
  label: string;
  target: string;
  actual: string | null;
}

export interface MockSprint {
  id: string;
  name: string;
  goal: string;
  hypothesis: string;
  status: SprintStatus;
  startsAt: string;
  endsAt: string;
  tasks: MockSprintTask[];
  metrics: MockSprintMetric[];
  results: string | null;
  learnings: string | null;
  actionItems: { title: string; done: boolean }[];
}

export const MOCK_SPRINTS: MockSprint[] = [
  {
    id: "sprint-14",
    name: "Sprint 14 — Git series push",
    goal: "Publish 4 Git-focused videos and validate the retention hypothesis at scale.",
    hypothesis: "If we go deeper on Git (vs. broad 'coding tips'), retention and follower conversion both rise.",
    status: "ACTIVE",
    startsAt: "2026-08-04",
    endsAt: "2026-08-17",
    tasks: [
      { id: "t1", title: "Script 'Git rebase without fear'", status: "DONE" },
      { id: "t2", title: "Film 'Git rebase without fear'", status: "DONE" },
      { id: "t3", title: "Edit + thumbnail for rebase video", status: "IN_PROGRESS" },
      { id: "t4", title: "Script 'Undo anything in Git'", status: "TODO" },
      { id: "t5", title: "Repurpose long-form into 3 Shorts", status: "TODO" },
      { id: "t6", title: "Community post teasing the series", status: "BLOCKED" },
    ],
    metrics: [
      { label: "Videos published", target: "4", actual: "2" },
      { label: "Avg retention", target: "55%", actual: "53%" },
      { label: "New followers from series", target: "1,000", actual: "640" },
    ],
    results: null,
    learnings: null,
    actionItems: [
      { title: "Pre-write hooks before filming, not after", done: false },
      { title: "Get thumbnails approved same-day as edit", done: false },
    ],
  },
  {
    id: "sprint-13",
    name: "Sprint 13 — Build in Public reboot",
    goal: "Relaunch the Founder Diaries series with a tighter weekly cadence.",
    hypothesis: "A consistent weekly build-in-public post outperforms sporadic long-form updates for follower growth.",
    status: "COMPLETED",
    startsAt: "2026-07-21",
    endsAt: "2026-08-03",
    tasks: [
      { id: "t7", title: "Define weekly template (metric + lesson + ask)", status: "DONE" },
      { id: "t8", title: "Publish 2 Founder Diaries episodes", status: "DONE" },
      { id: "t9", title: "Cross-post to X and LinkedIn", status: "DONE" },
    ],
    metrics: [
      { label: "Episodes published", target: "2", actual: "2" },
      { label: "Followers generated", target: "500", actual: "710" },
      { label: "Comments per episode", target: "40", actual: "58" },
    ],
    results: "Beat the follower target by 42%. Cross-posting to X drove the majority of profile visits.",
    learnings:
      "Storytelling + a concrete number in the hook (MRR, users) consistently outperforms generic 'update' framing.",
    actionItems: [
      { title: "Make weekly Founder Diaries a standing series, not a campaign", done: true },
      { title: "Always lead the hook with a specific number", done: true },
    ],
  },
  {
    id: "sprint-12",
    name: "Sprint 12 — Newsletter foundation",
    goal: "Ship a working newsletter funnel from video CTA to first issue.",
    hypothesis: "Owned audience (email) reduces platform risk and improves product launch conversion.",
    status: "COMPLETED",
    startsAt: "2026-07-07",
    endsAt: "2026-07-20",
    tasks: [
      { id: "t10", title: "Set up landing page + ESP", status: "DONE" },
      { id: "t11", title: "Add CTA card to last 10 videos", status: "DONE" },
      { id: "t12", title: "Write + send issue #1", status: "DONE" },
    ],
    metrics: [
      { label: "Signups", target: "300", actual: "412" },
      { label: "Issue #1 open rate", target: "40%", actual: "47%" },
    ],
    results: "Funnel works. Video end-cards outperformed description-link CTAs 3:1.",
    learnings: "Put the newsletter CTA in the video itself, not just the description.",
    actionItems: [{ title: "Add end-card CTA to every future video", done: true }],
  },
];
