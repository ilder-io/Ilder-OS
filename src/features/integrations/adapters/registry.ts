import type { PlatformAdapter } from "@/features/integrations/adapters/platform-adapter.types";
import { tiktokAdapter } from "@/features/integrations/adapters/tiktok.adapter";

/** Every implemented platform, in one place. Adding a new platform is
 *  "write an adapter, add it here" — the OAuth routes and sync
 *  orchestrator never change. */
const ADAPTERS: PlatformAdapter[] = [tiktokAdapter];

const bySlug = new Map(ADAPTERS.map((adapter) => [adapter.slug, adapter]));

export function getAdapter(slug: string): PlatformAdapter | undefined {
  return bySlug.get(slug.toLowerCase());
}
