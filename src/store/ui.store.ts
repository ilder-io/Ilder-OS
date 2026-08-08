import { create } from "zustand";

interface UIStoreState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

/** App-wide chrome state, distinct from any feature's own Zustand store
 *  (e.g. `features/content/store/content.store.ts`). Kept separate so a
 *  feature's filter/view state never leaks into global chrome, and vice
 *  versa. Not yet wired into <Sidebar /> — collapsing is a v1.1 candidate,
 *  see ROADMAP.md. */
export const useUIStore = create<UIStoreState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
