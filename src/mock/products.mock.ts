import type { ProductStatus } from "@/types";

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  priceLabel: string | null;
  mrr: number | null;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "prod-1",
    name: "Git Mastery Cohort",
    description: "4-week live cohort course teaching Git workflows for working developers.",
    status: "BUILDING",
    priceLabel: "$249",
    mrr: null,
  },
  {
    id: "prod-2",
    name: "Ship It Weekly (Newsletter)",
    description: "Weekly build-in-public newsletter with behind-the-scenes metrics and lessons.",
    status: "LIVE",
    priceLabel: "Free",
    mrr: null,
  },
  {
    id: "prod-3",
    name: "Component Library Starter",
    description: "Paid Notion + Figma template for creators tracking content ops.",
    status: "LIVE",
    priceLabel: "$39",
    mrr: 1180,
  },
  {
    id: "prod-4",
    name: "1:1 Career Coaching",
    description: "Limited monthly coaching slots for engineers navigating senior/staff transitions.",
    status: "CONCEPT",
    priceLabel: "$300/session",
    mrr: null,
  },
  {
    id: "prod-5",
    name: "Interview Prep Sprint (v1)",
    description: "Early cohort format for system design prep, retired after low completion rate.",
    status: "SUNSET",
    priceLabel: "$149",
    mrr: null,
  },
];
