export interface MockWeeklyReview {
  weekLabel: string;
  wins: string[];
  challenges: string[];
  focusNext: string[];
}

export interface MockMonthlyReview {
  monthLabel: string;
  summary: string;
  highlights: string[];
  lowlights: string[];
  nextFocus: string[];
}

export const MOCK_WEEKLY_REVIEWS: MockWeeklyReview[] = [
  {
    weekLabel: "Aug 4 – Aug 10, 2026",
    wins: ["Git rebase video crossed 40K views in 48h", "Newsletter open rate held above 45%"],
    challenges: ["Thumbnail turnaround slipped by 2 days", "Shorts repurposing still manual"],
    focusNext: ["Finish 'Undo anything in Git' script", "Batch 3 thumbnails ahead of filming"],
  },
  {
    weekLabel: "Jul 28 – Aug 3, 2026",
    wins: ["Founder Diaries relaunch beat follower target by 42%", "First $1K+ MRR week for template product"],
    challenges: ["X cross-posting cadence was inconsistent"],
    focusNext: ["Templatize the weekly build-in-public post", "Start Git series pre-production"],
  },
];

export const MOCK_MONTHLY_REVIEWS: MockMonthlyReview[] = [
  {
    monthLabel: "July 2026",
    summary: "Strongest follower growth month of the quarter, driven almost entirely by the Git and storytelling formats.",
    highlights: ["Crossed 60K total followers", "Newsletter funnel validated (412 signups from 10 videos)"],
    lowlights: ["Cohort course waitlist growth slower than planned", "Two weeks with no long-form upload"],
    nextFocus: ["Double down on Git series for August", "Set a hard weekly upload minimum"],
  },
];
