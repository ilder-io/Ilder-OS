import type { IdeaStatus } from "@/types";

export interface MockIdea {
  id: string;
  title: string;
  notes: string;
  status: IdeaStatus;
  impact: number;
  effort: number;
}

export const MOCK_IDEAS: MockIdea[] = [
  { id: "idea-1", title: "Git rebase interactive playground (web tool)", notes: "Ties directly to the top-performing series.", status: "SHORTLISTED", impact: 5, effort: 4 },
  { id: "idea-2", title: "'Rate my code review' reaction series", notes: "Audience submits PRs, react + teach live.", status: "INBOX", impact: 3, effort: 2 },
  { id: "idea-3", title: "Second channel for pure long-form tutorials", notes: "Separate audience intent from Shorts.", status: "INBOX", impact: 4, effort: 5 },
  { id: "idea-4", title: "Turn top 10 videos into a written blog series", notes: "SEO + repurposing, low incremental effort.", status: "IN_PROGRESS", impact: 3, effort: 1 },
  { id: "idea-5", title: "Sponsor package for dev tools", notes: "3 inbound offers this month, need a rate card.", status: "SHORTLISTED", impact: 4, effort: 1 },
  { id: "idea-6", title: "Live-stream monthly 'ask me anything'", notes: "Tested informally, decent but not differentiated.", status: "DISCARDED", impact: 2, effort: 3 },
  { id: "idea-7", title: "Git Mastery Cohort — cohort #2", notes: "Wait for cohort #1 results before committing.", status: "INBOX", impact: 5, effort: 3 },
  { id: "idea-8", title: "Repurpose newsletter issues into X threads", notes: "Shipped as part of Sprint 13.", status: "SHIPPED", impact: 3, effort: 1 },
];
