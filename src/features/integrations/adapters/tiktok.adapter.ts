import type {
  PlatformAdapter,
  OAuthTokens,
  PlatformAccountStats,
  PlatformContentPage,
} from "@/features/integrations/adapters/platform-adapter.types";

const AUTHORIZE_URL = "https://www.tiktok.com/v2/auth/authorize/";
const TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const VIDEO_LIST_URL = "https://open.tiktokapis.com/v2/video/list/";
const USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";

const VIDEO_FIELDS =
  "id,title,video_description,duration,cover_image_url,create_time,like_count,comment_count,share_count,view_count";
const USER_FIELDS = "follower_count,following_count,likes_count,video_count";

/** user.info.stats grants follower_count/likes_count/video_count on top of
 *  the basic Login Kit scope — see the account this app is registered
 *  under in TikTok for Developers for confirmation it's been granted. */
const SCOPES = "user.info.basic,user.info.stats,video.list";

function env() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  if (!clientKey || !clientSecret || !redirectUri) return null;
  return { clientKey, clientSecret, redirectUri };
}

interface TikTokTokenResponse {
  access_token?: string;
  expires_in?: number;
  open_id?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}

function toOAuthTokens(data: TikTokTokenResponse): OAuthTokens {
  if (!data.access_token || !data.open_id) {
    throw new Error(data.error_description ?? "TikTok token exchange failed.");
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? null,
    tokenExpiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null,
    externalAccountId: data.open_id,
  };
}

async function requestTokens(body: URLSearchParams): Promise<OAuthTokens> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body,
  });
  const data = (await res.json()) as TikTokTokenResponse;
  if (!res.ok || data.error) throw new Error(data.error_description ?? "TikTok token request failed.");
  return toOAuthTokens(data);
}

interface TikTokVideo {
  id: string;
  title?: string;
  video_description?: string;
  duration?: number;
  cover_image_url?: string;
  create_time: number; // unix seconds
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  view_count?: number;
}

interface TikTokVideoListResponse {
  data?: { videos: TikTokVideo[]; cursor?: number; has_more?: boolean };
  error?: { code: string; message: string };
}

interface TikTokUserInfoResponse {
  data?: {
    user?: {
      follower_count?: number;
      following_count?: number;
      likes_count?: number;
      video_count?: number;
    };
  };
  error?: { code: string; message: string };
}

export const tiktokAdapter: PlatformAdapter = {
  slug: "tiktok",
  platform: "TIKTOK",
  contentPlatform: "TIKTOK",

  isConfigured() {
    return env() !== null;
  },

  buildAuthorizeUrl({ state, codeChallenge }) {
    const e = env();
    if (!e) throw new Error("TikTok isn't configured.");
    const url = new URL(AUTHORIZE_URL);
    url.searchParams.set("client_key", e.clientKey);
    url.searchParams.set("scope", SCOPES);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", e.redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");
    return url.toString();
  },

  async exchangeCodeForTokens({ code, codeVerifier }) {
    const e = env();
    if (!e) throw new Error("TikTok isn't configured.");
    return requestTokens(
      new URLSearchParams({
        client_key: e.clientKey,
        client_secret: e.clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: e.redirectUri,
        code_verifier: codeVerifier,
      })
    );
  },

  async refreshAccessToken(refreshToken) {
    const e = env();
    if (!e) throw new Error("TikTok isn't configured.");
    return requestTokens(
      new URLSearchParams({
        client_key: e.clientKey,
        client_secret: e.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      })
    );
  },

  async fetchAccountStats(accessToken): Promise<PlatformAccountStats> {
    const res = await fetch(`${USER_INFO_URL}?fields=${USER_FIELDS}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = (await res.json()) as TikTokUserInfoResponse;
    if (!res.ok || body.error?.code !== "ok" || !body.data?.user) {
      throw new Error(body.error?.message ?? "TikTok user info request failed.");
    }
    return {
      followers: body.data.user.follower_count ?? 0,
      totalLikes: body.data.user.likes_count ?? 0,
      // Lifetime view count isn't exposed by user/info — content-level
      // views (summed from synced videos) cover that instead.
      totalViews: 0,
      engagementPct: null,
    };
  },

  async fetchContentPage(accessToken, cursor): Promise<PlatformContentPage> {
    const res = await fetch(`${VIDEO_LIST_URL}?fields=${VIDEO_FIELDS}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ max_count: 20, ...(cursor ? { cursor: Number(cursor) } : {}) }),
    });
    const body = (await res.json()) as TikTokVideoListResponse;
    if (!res.ok || body.error?.code !== "ok" || !body.data) {
      throw new Error(body.error?.message ?? "TikTok video list request failed.");
    }
    return {
      items: body.data.videos.map((video) => ({
        externalId: video.id,
        title: video.title || video.video_description || "Untitled TikTok video",
        publishedAt: new Date(video.create_time * 1000),
        durationSecs: video.duration ?? null,
        thumbnailUrl: video.cover_image_url ?? null,
        metrics: {
          views: video.view_count ?? 0,
          likes: video.like_count ?? 0,
          comments: video.comment_count ?? 0,
          shares: video.share_count ?? 0,
        },
      })),
      hasMore: Boolean(body.data.has_more),
      nextCursor: body.data.cursor !== undefined ? String(body.data.cursor) : undefined,
    };
  },
};
