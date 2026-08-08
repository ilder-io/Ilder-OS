export interface MockKnowledgeDoc {
  id: string;
  title: string;
  tags: string[];
  excerpt: string;
  updatedAt: string;
}

export const MOCK_KNOWLEDGE_DOCS: MockKnowledgeDoc[] = [
  { id: "doc-1", title: "Content pillar definitions", tags: ["content", "strategy"], excerpt: "What counts as Coding Tutorials vs. Tech Reviews, and why the line matters for analytics.", updatedAt: "2026-07-28" },
  { id: "doc-2", title: "Thumbnail checklist", tags: ["content", "production"], excerpt: "Contrast, face, 3-word max text, mobile-size preview before export.", updatedAt: "2026-07-15" },
  { id: "doc-3", title: "Sprint retro template", tags: ["process"], excerpt: "Goal, hypothesis, what happened, what we're changing next sprint.", updatedAt: "2026-08-01" },
  { id: "doc-4", title: "Sponsorship rate card (internal)", tags: ["business"], excerpt: "Baseline CPM ranges by platform and placement, last updated after Q2 renegotiation.", updatedAt: "2026-06-20" },
  { id: "doc-5", title: "Brand voice guide", tags: ["brand"], excerpt: "Direct, specific, no hype language. Numbers over adjectives.", updatedAt: "2026-05-30" },
];
