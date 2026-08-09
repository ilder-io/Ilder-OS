import { getAdapter } from "@/features/integrations/adapters/registry";
import { integrationsService } from "@/features/integrations/api/integrations.service";
import { contentService } from "@/features/content/api/content.service";
import { analyticsService } from "@/features/analytics/api/analytics.service";

const MAX_CONTENT_PAGES = 5; // 5 * 20 = up to 100 most recent items per sync
const REFRESH_MARGIN_MS = 5 * 60 * 1000; // refresh a token proactively once it's this close to expiring

export interface SyncResult {
  created: number;
  updated: number;
  synced: number;
  /** Set when content synced fine but the account-stats call failed — most
   *  often a scope TikTok hasn't approved for this app yet (`user.info.stats`
   *  requires production review, unlike sandbox where every scope is
   *  auto-granted). Surfaced instead of thrown so a missing "nice to have"
   *  stat doesn't block the content sync that already succeeded. */
  statsError?: string;
}

/**
 * Platform-agnostic sync: refresh the token if it's near expiry, page
 * through content and upsert it, then record one account-stats snapshot
 * for today. Every platform runs through this same function — only the
 * adapter passed in changes.
 */
export async function syncPlatformConnection(workspaceId: string, slug: string): Promise<SyncResult> {
  const adapter = getAdapter(slug);
  if (!adapter) throw new Error(`Unknown platform "${slug}".`);

  const secrets = await integrationsService.getSecrets(workspaceId, adapter.platform);
  if (!secrets) throw new Error(`${adapter.platform} isn't connected for this workspace yet.`);

  let accessToken = secrets.accessToken;
  const expiringSoon = secrets.tokenExpiresAt !== null && secrets.tokenExpiresAt.getTime() - Date.now() < REFRESH_MARGIN_MS;
  if (expiringSoon) {
    if (!secrets.refreshToken) {
      throw new Error(`${adapter.platform}'s access token expired and there's no refresh token — reconnect it.`);
    }
    const refreshed = await adapter.refreshAccessToken(secrets.refreshToken);
    await integrationsService.saveConnection(workspaceId, adapter.platform, refreshed);
    accessToken = refreshed.accessToken;
  }

  let cursor: string | undefined;
  let hasMore = true;
  let page = 0;
  let created = 0;
  let updated = 0;

  while (hasMore && page < MAX_CONTENT_PAGES) {
    page += 1;
    const contentPage = await adapter.fetchContentPage(accessToken, cursor);
    for (const item of contentPage.items) {
      const { created: wasCreated } = await contentService.upsertFromSync(workspaceId, adapter.contentPlatform, item.externalId, {
        title: item.title,
        publishedAt: item.publishedAt,
        durationSecs: item.durationSecs,
        thumbnailUrl: item.thumbnailUrl,
        metrics: item.metrics,
      });
      if (wasCreated) created += 1;
      else updated += 1;
    }
    hasMore = contentPage.hasMore;
    cursor = contentPage.nextCursor;
  }

  let statsError: string | undefined;
  try {
    const stats = await adapter.fetchAccountStats(accessToken);
    await analyticsService.recordSnapshot(workspaceId, adapter.platform, stats);
  } catch (err) {
    statsError = err instanceof Error ? err.message : "Failed to fetch account stats.";
  }

  await integrationsService.markSynced(workspaceId, adapter.platform);
  return { created, updated, synced: created + updated, ...(statsError ? { statsError } : {}) };
}
