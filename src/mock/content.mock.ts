import { seededRandom, clamp } from "@/lib/utils";
import type { ContentStatus, Platform } from "@/types";

export interface MockContentItem {
  id: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  pillar: string;
  series: string | null;
  hook: string;
  cta: string;
  durationSecs: number;
  publishedAt: string; // ISO
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    followersGenerated: number;
    watchTimeMinutes: number;
    retentionPct: number;
    profileVisits: number;
    conversionRatePct: number;
  };
}

export const PILLARS = [
  "Coding Tutorials",
  "Build in Public",
  "Career Advice",
  "Tech Reviews",
  "Storytime",
] as const;

export const SERIES_LIST = [
  "Ship It Weekly",
  "Git Deep Dives",
  "Founder Diaries",
  "Framework Face-off",
  null,
  null,
] as const;

const TITLES: Record<(typeof PILLARS)[number], string[]> = {
  "Coding Tutorials": [
    "5 Git commands that saved my career",
    "Why your React state is a mess (and how to fix it)",
    "I refactored this API in 10 minutes",
    "TypeScript generics, finally explained simply",
    "The Postgres index mistake everyone makes",
    "Build a rate limiter from scratch",
  ],
  "Build in Public": [
    "Day 42 building my SaaS — first paying customer",
    "I rebuilt my dashboard in a weekend",
    "How I priced my first product (and got it wrong)",
    "$0 to $1,200 MRR — the real numbers",
    "What breaks when 1,000 users show up",
  ],
  "Career Advice": [
    "Nobody tells you this before your first tech job",
    "How I actually prepare for system design interviews",
    "The resume mistake costing you interviews",
    "3 years as a senior engineer — what changed",
    "Should you take the manager track?",
  ],
  "Tech Reviews": [
    "I tried every AI coding assistant so you don't have to",
    "This $200 keyboard changed how I code",
    "Cursor vs Copilot — a week-long test",
    "The most overrated dev tool of the year",
  ],
  Storytime: [
    "The bug that took down production at 2am",
    "I got rejected 47 times before my first offer",
    "Quitting my job to build full-time — one year later",
    "The worst code review I ever received",
  ],
};

const PLATFORMS: Platform[] = [
  "YOUTUBE",
  "YOUTUBE_SHORTS",
  "TIKTOK",
  "INSTAGRAM_REEL",
  "X",
  "LINKEDIN",
  "NEWSLETTER",
];

const STATUS_WEIGHTS: [ContentStatus, number][] = [
  ["PUBLISHED", 60],
  ["SCHEDULED", 10],
  ["EDITING", 10],
  ["FILMING", 6],
  ["SCRIPTING", 8],
  ["IDEA", 6],
];

function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)] as T;
}

function pickWeighted(rand: () => number): ContentStatus {
  const total = STATUS_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [status, w] of STATUS_WEIGHTS) {
    if (r < w) return status;
    r -= w;
  }
  return "PUBLISHED";
}

function generateContentItems(count: number): MockContentItem[] {
  const items: MockContentItem[] = [];
  const now = new Date("2026-08-07T00:00:00Z");

  for (let i = 0; i < count; i++) {
    const seed = `content-${i}`;
    const rand = seededRandom(seed);
    const pillar = pick(rand, PILLARS);
    const title = pick(rand, TITLES[pillar]);
    const platform = pick(rand, PLATFORMS);
    const status = pickWeighted(rand);
    const series = pick(rand, SERIES_LIST);
    const daysAgo = Math.floor(rand() * 120);
    const publishedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Give "Git" / "Coding Tutorials" content a systematic retention/quality
    // bump so the AI Insights engine has a real, discoverable signal to
    // surface (see features/ai-insights/engine/rules.ts).
    const isGitContent = title.toLowerCase().includes("git");
    const isStorytelling = pillar === "Storytime" || pillar === "Build in Public";
    const isTech = pillar === "Tech Reviews" || pillar === "Coding Tutorials";

    const baseViews = Math.floor(2000 + rand() * 180000);
    const retentionBase = 38 + rand() * 30;
    const retentionPct = clamp(retentionBase + (isGitContent ? 12 : 0), 20, 95);
    const followerConvBase = 0.4 + rand() * 2.2;
    const followersGenerated = Math.floor(
      baseViews * (followerConvBase / 100) * (isStorytelling ? 1.18 : 1)
    );
    const saves = Math.floor(baseViews * (0.005 + rand() * 0.03) * (isTech ? 2.4 : 1));
    const profileVisits = Math.floor(baseViews * (0.01 + rand() * 0.05));
    const conversionRatePct = clamp((followersGenerated / Math.max(profileVisits, 1)) * 100, 0, 100);

    items.push({
      id: seed,
      title,
      platform,
      status,
      pillar,
      series,
      hook: `What if ${title.split(" ").slice(0, 4).join(" ").toLowerCase()}...`,
      cta: pick(rand, ["Follow for more", "Full breakdown in comments", "Link in bio", "Subscribe for part 2"]),
      durationSecs: Math.floor(20 + rand() * 900),
      publishedAt: publishedAt.toISOString(),
      metrics: {
        views: baseViews,
        likes: Math.floor(baseViews * (0.03 + rand() * 0.09)),
        comments: Math.floor(baseViews * (0.002 + rand() * 0.01)),
        shares: Math.floor(baseViews * (0.001 + rand() * 0.015)),
        saves,
        followersGenerated,
        watchTimeMinutes: Math.floor((baseViews * retentionPct) / 100 / 12),
        retentionPct,
        profileVisits,
        conversionRatePct,
      },
    });
  }

  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export const MOCK_CONTENT_ITEMS = generateContentItems(48);

export function getContentItem(id: string) {
  return MOCK_CONTENT_ITEMS.find((c) => c.id === id) ?? null;
}
