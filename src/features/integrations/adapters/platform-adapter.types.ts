import type { ConnectionPlatform, Platform } from "@/types";

/** Field names match IntegrationsRepository.UpsertConnectionInput exactly
 *  so an adapter's result can be passed straight through without mapping. */
export interface OAuthTokens {
  accessToken: string;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  /** The platform's own user/account id — lets a re-connect detect "same
   *  account" vs "different account". */
  externalAccountId: string;
}

export interface PlatformAccountStats {
  followers: number;
  totalLikes: number;
  totalViews: number;
  engagementPct: number | null;
}

export interface PlatformContentEntry {
  externalId: string;
  title: string;
  publishedAt: Date;
  durationSecs: number | null;
  thumbnailUrl: string | null;
  metrics: { views: number; likes: number; comments: number; shares: number };
}

export interface PlatformContentPage {
  items: PlatformContentEntry[];
  hasMore: boolean;
  nextCursor?: string;
}

/**
 * One implementation per connected social platform. The OAuth routes
 * (src/app/api/integrations/[platform]/*) and the sync orchestrator
 * (platform-sync.service.ts) are written once against this interface —
 * adding a new platform means writing a new adapter, not new routes.
 */
export interface PlatformAdapter {
  /** URL segment this adapter answers to: /api/integrations/{slug}/*. */
  slug: string;
  platform: ConnectionPlatform;
  /** Which ContentItem.platform value this adapter's synced content maps
   *  to. A single connection can span more than one content Platform (e.g.
   *  Instagram content is Reels or Posts) — adapters that do decide this
   *  per item instead of returning a single fixed value here. */
  contentPlatform: Platform;

  isConfigured(): boolean;
  buildAuthorizeUrl(params: { state: string; codeChallenge: string }): string;
  exchangeCodeForTokens(params: { code: string; codeVerifier: string }): Promise<OAuthTokens>;
  refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;
  fetchAccountStats(accessToken: string): Promise<PlatformAccountStats>;
  fetchContentPage(accessToken: string, cursor?: string): Promise<PlatformContentPage>;
}
