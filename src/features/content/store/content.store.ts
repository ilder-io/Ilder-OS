import { create } from "zustand";
import { DEFAULT_CONTENT_FILTERS, type ContentFilters } from "@/features/content/types/content.types";

interface ContentStoreState {
  filters: ContentFilters;
  setFilter: <K extends keyof ContentFilters>(key: K, value: ContentFilters[K]) => void;
  resetFilters: () => void;
  view: "table" | "grid";
  setView: (view: "table" | "grid") => void;
}

/** UI-only state (filters, view mode) for the Content module. Server data
 *  lives in `features/content/hooks/use-content.ts`, never here — Zustand
 *  stores in this codebase hold interaction state, not fetched data. */
export const useContentStore = create<ContentStoreState>((set) => ({
  filters: DEFAULT_CONTENT_FILTERS,
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: DEFAULT_CONTENT_FILTERS }),
  view: "table",
  setView: (view) => set({ view }),
}));
